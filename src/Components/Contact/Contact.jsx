import React, { useRef, useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const submitting = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('');
  const onSubmitForm = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = {
      name: fields.get('userName'),
      email: fields.get('userEmail'),
      subject: fields.get('subject'),
      message: fields.get('message'),
      website: fields.get('website'),
    };
    submitting.current = true;
    setIsSending(true);
    setStatus('Sending your message…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setStatus(result?.error || 'Your message could not be sent. Please email batranitin118@gmail.com directly.');
        return;
      }
      form.reset();
      setStatus(result.acknowledgementSent
        ? 'Thank you! Your message has been sent to Nitin. Please check your inbox or spam folder for an acknowledgement.'
        : 'Your message has been sent to Nitin, but the acknowledgement email could not be sent. There is no need to submit again.');
    } catch {
      setStatus('We could not confirm delivery. Please avoid submitting again immediately; you can contact batranitin118@gmail.com directly.');
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
      setIsSending(false);
    }
  };
  return (
    <section className={styles.contact}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Get in touch</p>
        <h1>Have an idea worth <em>building?</em></h1>
        <p>Tell me a little about the problem, the opportunity, or simply say hello. I’ll get back to you as soon as I can.</p>
        <span className={styles.note}>Usually best for: projects, collaboration, and thoughtful conversations.</span>
      </div>
      <form className={styles.form} onSubmit={onSubmitForm} aria-busy={isSending}>
        <label>Your name<input required type='text' name='userName' autoComplete='name' maxLength={100} placeholder='Jane Doe' disabled={isSending} /></label>
        <label>Email address<input required type='email' name='userEmail' autoComplete='email' maxLength={254} placeholder='jane@example.com' disabled={isSending} /></label>
        <label>Subject<input required type='text' name='subject' maxLength={150} placeholder='Project idea' disabled={isSending} /></label>
        <label>Message<textarea required name='message' maxLength={5000} placeholder='Tell me what you have in mind…' rows='5' disabled={isSending} /></label>
        <div className={styles.honeypot} aria-hidden='true'><label>Leave this field empty<input type='text' name='website' tabIndex={-1} autoComplete='off' /></label></div>
        <p className={styles.emailNote}>You’ll receive an acknowledgement by email. Or reach me at <a href='mailto:batranitin118@gmail.com'>batranitin118@gmail.com</a>.</p>
        <button type='submit' disabled={isSending}>{isSending ? 'Sending…' : 'Send message'} <span aria-hidden='true'>↗</span></button>
        <p className={styles.status} role='status' aria-live='polite'>{status}</p>
      </form>
    </section>
  );
};

export default Contact;
