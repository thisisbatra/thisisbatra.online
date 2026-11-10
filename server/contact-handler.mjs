import { createHash } from 'node:crypto';

const RECIPIENT = 'batranitin118@gmail.com';
const MAX_BODY_BYTES = 16 * 1024;
const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

// Best-effort protection per warm function instance; use a platform firewall
// or shared rate limiter for a public/high-traffic deployment.
export function createMemoryLimiter(now = Date.now) {
  const attempts = new Map();
  return (key, limit, windowMs) => {
    const time = now();
    for (const [storedKey, value] of attempts) {
      if (value.resetAt <= time) attempts.delete(storedKey);
    }
    if (!attempts.has(key)) {
      if (attempts.size >= 5000) return false;
      attempts.set(key, { count: 0, resetAt: time + windowMs });
    }
    const record = attempts.get(key);
    if (record.count >= limit) return false;
    record.count += 1;
    return true;
  };
}

async function readBody(req) {
  let body = req.body;
  if (body === undefined) {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
      chunks.push(bytes);
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
    body = JSON.parse(body);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('INVALID_BODY');
  if (Buffer.byteLength(JSON.stringify(body)) > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
  return body;
}

function clean(value, max, multiline = false) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || text.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text)) return null;
  if (!multiline && /[\r\n]/.test(text)) return null;
  return text;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function emailLayout(title, body) {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f3f6fa;font-family:Arial,sans-serif;color:#172234"><div style="max-width:580px;margin:32px auto;padding:32px;background:#fff;border-top:4px solid #25795c;border-radius:8px"><p style="font-size:13px;color:#25795c;font-weight:bold">NITIN BATRA</p><h1 style="font-size:24px;line-height:1.3">${title}</h1>${body}<hr style="border:0;border-top:1px solid #e0e5eb;margin-top:28px"><p style="font-size:12px;color:#64748b">Sent from Nitin Batra's portfolio contact form.</p></div></body></html>`;
}

function wasAccepted(result) {
  return Array.isArray(result?.accepted) && result.accepted.length > 0;
}

export function createContactHandler({ getTransport, getConfig, limit = createMemoryLimiter(), log = console.error }) {
  return async function contact(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Please submit the contact form to send a message.' });
    }
    const config = getConfig();
    if (!config.user || !config.password || !config.siteUrl) {
      return res.status(503).json({ error: 'The contact form is temporarily unavailable. Please email batranitin118@gmail.com directly.' });
    }
    let allowedOrigin;
    try { allowedOrigin = new URL(config.siteUrl).origin; } catch {
      return res.status(503).json({ error: 'The contact form is temporarily unavailable. Please email batranitin118@gmail.com directly.' });
    }
    if (req.headers.origin !== allowedOrigin) {
      return res.status(403).json({ error: 'Please send your message from the website contact form.' });
    }
    if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      return res.status(415).json({ error: 'Please submit the contact form as JSON.' });
    }
    let body;
    try { body = await readBody(req); } catch (error) {
      return res.status(error.message === 'BODY_TOO_LARGE' ? 413 : 400).json({ error: 'Please check your message and try again.' });
    }
    // The invisible website field should remain empty for real visitors.
    if (body.website) return res.status(200).json({ ok: true, acknowledgementSent: true });
    const name = clean(body.name, 100);
    const email = clean(body.email, 254);
    const subject = clean(body.subject, 150);
    const message = clean(body.message, 5000, true);
    if (!name || !email || !emailPattern.test(email) || !subject || !message) {
      return res.status(400).json({ error: 'Please enter a valid name, email, subject, and message within the allowed lengths.' });
    }
    const ip = req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const hash = value => createHash('sha256').update(String(value)).digest('hex');
    if (!limit(`ip:${hash(ip)}`, 5, 15 * 60 * 1000) || !limit(`email:${hash(email.toLowerCase())}`, 3, 60 * 60 * 1000)) {
      res.setHeader('Retry-After', '3600');
      return res.status(429).json({ error: 'You have sent several messages recently. Please try again later or email me directly.' });
    }
    const from = { name: 'Nitin Batra', address: config.user };
    let transport;
    try {
      transport = getTransport(config);
      const notification = await transport.sendMail({
        from,
        to: RECIPIENT,
        replyTo: { name, address: email },
        subject: `Portfolio enquiry: ${subject}`,
        text: `Someone is trying to connect with you through your portfolio.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nReply to this email to respond directly to the visitor.`,
        html: emailLayout('A new connection request', `<p>Someone is trying to connect with you through your portfolio.</p><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Subject:</strong> ${escapeHtml(subject)}</p><div style="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7">${escapeHtml(message)}</div><p style="color:#64748b;font-size:13px">Reply to this email to respond directly to the visitor.</p>`),
      });
      if (!wasAccepted(notification)) throw new Error('RECIPIENT_REJECTED');
    } catch (error) {
      log('Contact notification failed', { code: error.code || 'MAIL_SEND_FAILED' });
      return res.status(502).json({ error: 'Your message could not be sent. Please try again later or email batranitin118@gmail.com directly.' });
    }
    // Never ask visitors to resubmit an enquiry that was already accepted.
    try {
      const acknowledgement = await transport.sendMail({
        from,
        to: email,
        replyTo: RECIPIENT,
        subject: 'Thank you for reaching out | Nitin Batra',
        text: `Hello ${name},\n\nThank you for getting in touch. Your message has been received, and Nitin Batra will review it and get back to you as soon as possible.\n\nIf you would like to add anything, simply reply to this email.\n\nBest regards,\nNitin Batra\n\nThis is an automated acknowledgement from the portfolio contact form. If you did not submit a message, you can disregard this email.`,
        html: emailLayout('Thank you for reaching out', `<p>Hello ${escapeHtml(name)},</p><p style="line-height:1.7">Thank you for getting in touch. Your message has been received, and Nitin Batra will review it and get back to you as soon as possible.</p><p style="line-height:1.7">If you would like to add anything, simply reply to this email.</p><p>Best regards,<br><strong>Nitin Batra</strong></p><p style="font-size:12px;color:#64748b">This is an automated acknowledgement. If you did not submit a message, you can disregard this email.</p>`),
        headers: { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All' },
      });
      if (!wasAccepted(acknowledgement)) throw new Error('ACKNOWLEDGEMENT_REJECTED');
      return res.status(200).json({ ok: true, acknowledgementSent: true });
    } catch (error) {
      log('Contact acknowledgement failed', { code: error.code || 'MAIL_SEND_FAILED' });
      return res.status(200).json({ ok: true, acknowledgementSent: false });
    }
  };
}
