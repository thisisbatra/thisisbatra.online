# Contact form email setup

## How it works

The React form posts to `/api/contact`. A Node.js Vercel Function uses the open-source Nodemailer library and Gmail SMTP over TLS. EmailJS is no longer used. Gmail and Vercel are hosted services; the email-sending application code uses open-source technology.

1. Nitin receives the visitor's name, address, subject, and message at `batranitin118@gmail.com`.
2. The visitor receives an automated acknowledgement: Nitin Batra will review the message and get back to them as soon as possible.
3. Replying to the enquiry replies to the visitor. Replying to the acknowledgement replies to Nitin.

Both sends are awaited before the function finishes. A successful response means Gmail accepted the notification for sending, not a guarantee of inbox placement. Check spam folders during the first live test. If only the acknowledgement fails, the enquiry still counts as successful and the visitor is told not to resubmit.

## Configure Vercel

In your existing project, go to **Settings > Environment Variables** and add these **server-side** variables for **Production**:

| Variable | Value |
| --- | --- |
| `SMTP_USER` | `batranitin118@gmail.com` |
| `SMTP_PASS` | A Google App Password for this Gmail account |
| `CONTACT_SITE_URL` | `https://thisisbatra.vercel.app` |

Do not use your normal Gmail password. Enable Google 2-Step Verification, then create an App Password at https://myaccount.google.com/apppasswords. Paste it directly into Vercel; do not commit or share it in chat. If copied with spaces, remove the display spaces. App Password availability depends on your account settings; see Google's help below.

Deploy the updated repository to the existing Vercel project and redeploy after adding/changing environment variables. The included `vercel.json` keeps `/api/contact` as an API function and supports the React app's nested routes. Do not deploy only the `build/` folder: Vercel also needs `api/`, `server/`, and `package.json` to create the function.

Production accepts requests only from the configured `CONTACT_SITE_URL` origin. For Preview deployments, use separate environment values for the preview origin and preferably a separate test sender; the production origin will intentionally reject submissions from another preview domain. Avoid exposing production mail credentials to untrusted preview branches.

### First real email check (after deployment)

Submit the live form with an email address you control. Confirm the notification in `batranitin118@gmail.com`, the acknowledgement in the submitted address, and both Reply-To addresses. Also check spam. No real mail is sent by the automated tests.

If the endpoint returns 503, check the three environment variables and redeploy. For a 502, inspect the Vercel function log for the mail error code (for example `EAUTH`); credentials and message text are not logged. Gmail can reject automated hosting connections or apply sending limits. If this occurs, use another SMTP provider through a reviewed transport change; do not weaken TLS or expose credentials to the browser.

## Local development

Requires Node.js 22 or later for the provided environment-file command.

1. Copy `.env.example` to `.env.local` and replace the App Password placeholder locally.
2. Keep `CONTACT_SITE_URL=http://localhost:3000` locally.
3. Run `npm run start:api` in one terminal.
4. Run `npm start` in another terminal and open `http://localhost:3000` (not another port or IP). Restart the React dev server after adding or changing `src/setupProxy.js`.

The custom development proxy in `src/setupProxy.js` preserves the browser Origin and forwards `/api/contact` to the local API at `127.0.0.1:3001`. A real local submission sends real mail. To inspect templates without SMTP, use the mocked tests instead.

## Checks

- `npm run test:api`: backend validation, email recipients/templates, notification/acknowledgement failure handling, and rate limiting with fake mail transport.
- `npm test -- --watchAll=false --runInBand`: UI/navigation tests and contact form behaviour with fake HTTP responses.
- `npm run build`: production frontend compilation.

## Abuse protection and limitations

The handler validates field lengths, rejects header injection and other origins, escapes HTML, includes a honeypot, and applies bounded in-memory IP/email throttling. Only the fixed owner address receives visitor-provided message content; the acknowledgement does not echo the submitted subject or message.

The in-memory rate limiter is **best effort per warm Vercel instance**, not a shared quota. Cold starts and multiple instances reset/split it. Before broadly promoting the form, add platform firewall/bot rules or replace it with a shared Redis-backed limiter for reliable distributed protection. The API has no durable outbox or exactly-once delivery: a network interruption after SMTP acceptance can make delivery uncertain. The UI avoids encouraging immediate repeat submissions. This is a small portfolio mail flow, not a bulk-mail service.

## References

- Nodemailer Gmail setup: https://nodemailer.com/guides/using-gmail
- Google App Passwords: https://support.google.com/mail/answer/185833
- Vercel SMTP support: https://vercel.com/kb/guide/serverless-functions-and-smtp
- Vercel Node.js runtime: https://vercel.com/docs/functions/runtimes/node-js
