import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler, createMemoryLimiter } from './contact-handler.mjs';

const validBody = { name: 'Jane Doe', email: 'jane@example.com', subject: 'A collaboration', message: 'Let us discuss a project.', website: '' };
function setup({ sendMail = async () => ({ accepted: ['recipient@example.com'] }), config, limit } = {}) {
  const sent = [];
  const logs = [];
  const handler = createContactHandler({
    getConfig: () => config || { user: 'batranitin118@gmail.com', password: 'test-only-placeholder', siteUrl: 'https://thisisbatra.vercel.app' },
    getTransport: () => ({ sendMail: async mail => { sent.push(mail); return sendMail(mail, sent.length); } }),
    limit: limit || (() => true),
    log: (...args) => logs.push(args),
  });
  const invoke = async (body = validBody, overrides = {}) => {
    const req = { method: 'POST', headers: { origin: 'https://thisisbatra.vercel.app', 'content-type': 'application/json' }, body, socket: { remoteAddress: '127.0.0.1' }, ...overrides };
    const res = {
      code: 200, headers: {},
      setHeader(key, value) { this.headers[key] = value; },
      status(code) { this.code = code; return this; },
      json(data) { this.data = data; return this; },
    };
    await handler(req, res);
    return res;
  };
  return { invoke, sent, logs };
}

test('sends the owner notification first and then a visitor acknowledgement', async () => {
  const { invoke, sent } = setup();
  const res = await invoke();
  assert.equal(res.code, 200);
  assert.deepEqual(res.data, { ok: true, acknowledgementSent: true });
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to, 'batranitin118@gmail.com');
  assert.deepEqual(sent[0].replyTo, { name: 'Jane Doe', address: 'jane@example.com' });
  assert.match(sent[0].text, /Let us discuss a project/);
  assert.equal(sent[1].to, 'jane@example.com');
  assert.equal(sent[1].replyTo, 'batranitin118@gmail.com');
  assert.match(sent[1].text, /Nitin Batra will review it/);
  assert.equal(sent[1].headers['Auto-Submitted'], 'auto-replied');
});

test('escapes submitted content in HTML and does not echo the enquiry into the auto-reply', async () => {
  const { invoke, sent } = setup();
  await invoke({ ...validBody, name: '<b>Jane</b>', message: '<img src=x onerror=alert(1)>' });
  assert.match(sent[0].html, /&lt;img/);
  assert.doesNotMatch(sent[0].html, /<img src=x/);
  assert.match(sent[1].html, /&lt;b&gt;Jane/);
  assert.doesNotMatch(sent[1].html, /onerror/);
});

test('does not send an acknowledgement if the owner notification fails', async () => {
  const { invoke, sent, logs } = setup({ sendMail: async () => { throw Object.assign(new Error('provider detail'), { code: 'EAUTH' }); } });
  const res = await invoke();
  assert.equal(res.code, 502);
  assert.equal(sent.length, 1);
  assert.doesNotMatch(JSON.stringify(res.data), /provider detail|EAUTH/);
  assert.deepEqual(logs[0][1], { code: 'EAUTH' });
});

test('reports successful receipt if only acknowledgement sending fails', async () => {
  const { invoke, sent } = setup({ sendMail: async (_, count) => {
    if (count === 2) throw new Error('ack failed');
    return { accepted: ['owner@example.com'] };
  } });
  const res = await invoke();
  assert.equal(res.code, 200);
  assert.equal(sent.length, 2);
  assert.deepEqual(res.data, { ok: true, acknowledgementSent: false });
});

test('treats rejected SMTP recipients as unsuccessful', async () => {
  const { invoke, sent } = setup({ sendMail: async () => ({ accepted: [], rejected: ['owner@example.com'] }) });
  assert.equal((await invoke()).code, 502);
  assert.equal(sent.length, 1);
});

test('rejects missing, malformed, oversized and header-injection inputs before sending', async () => {
  const { invoke, sent } = setup();
  for (const body of [
    { ...validBody, name: ' ' },
    { ...validBody, email: 'invalid' },
    { ...validBody, email: 'Jane <jane@example.com>' },
    { ...validBody, subject: 'Hello\r\nBcc: other@example.com' },
    { ...validBody, message: 'x'.repeat(5001) },
    null,
    '{invalid json',
  ]) assert.equal((await invoke(body)).code, 400);
  assert.equal((await invoke('x'.repeat(17000))).code, 413);
  assert.equal(sent.length, 0);
});

test('does not send mail for honeypot submissions', async () => {
  const { invoke, sent } = setup();
  assert.equal((await invoke({ ...validBody, website: 'spam.example' })).code, 200);
  assert.equal(sent.length, 0);
});

test('rejects other origins, non-POST requests and non-JSON bodies', async () => {
  const { invoke, sent } = setup();
  assert.equal((await invoke(validBody, { method: 'GET' })).code, 405);
  assert.equal((await invoke(validBody, { headers: { origin: 'https://other.example', 'content-type': 'application/json' } })).code, 403);
  assert.equal((await invoke(validBody, { headers: { origin: 'https://thisisbatra.vercel.app', 'content-type': 'text/plain' } })).code, 415);
  assert.equal(sent.length, 0);
});

test('missing server credentials return a useful unavailable response', async () => {
  const { invoke, sent } = setup({ config: {} });
  assert.equal((await invoke()).code, 503);
  assert.equal(sent.length, 0);
});

test('rate-limited requests do not send either email', async () => {
  const { invoke, sent } = setup({ limit: () => false });
  const res = await invoke();
  assert.equal(res.code, 429);
  assert.equal(res.headers['Retry-After'], '3600');
  assert.equal(sent.length, 0);
});

test('memory limiter allows attempts again after its window expires', () => {
  let now = 1000;
  const limit = createMemoryLimiter(() => now);
  assert.equal(limit('ip', 2, 1000), true);
  assert.equal(limit('ip', 2, 1000), true);
  assert.equal(limit('ip', 2, 1000), false);
  now += 1001;
  assert.equal(limit('ip', 2, 1000), true);
});

test('reads a streamed HTTP JSON request as used by the local API', async () => {
  const { invoke, sent } = setup();
  const result = await invoke(undefined, {
    body: undefined,
    async *[Symbol.asyncIterator]() { yield Buffer.from(JSON.stringify(validBody)); },
  });
  assert.equal(result.code, 200);
  assert.equal(sent.length, 2);
});

test('loads the production API and composes both emails with real Nodemailer without sending', async () => {
  const { default: productionHandler } = await import('../api/contact.mjs');
  const { default: nodemailer } = await import('nodemailer');
  assert.equal(typeof productionHandler, 'function');
  const composer = nodemailer.createTransport({ jsonTransport: true });
  const composed = [];
  const { invoke } = setup({ sendMail: async mail => {
    const result = await composer.sendMail(mail);
    composed.push(JSON.parse(result.message));
    return { accepted: ['test@example.com'] };
  } });
  assert.equal((await invoke()).code, 200);
  assert.equal(composed.length, 2);
  assert.equal(composed[0].to[0].address, 'batranitin118@gmail.com');
  assert.equal(composed[1].to[0].address, 'jane@example.com');
});
