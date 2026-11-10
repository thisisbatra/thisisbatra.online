import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Contact from './Contact';

const originalFetch = global.fetch;
beforeEach(() => { global.fetch = jest.fn(); });
afterEach(() => { global.fetch = originalFetch; });

function fillForm() {
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'A collaboration' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Let us discuss a project.' } });
}

test('posts the form to the server and shows the acknowledgement result', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true, acknowledgementSent: true }) });
  render(<Contact />);
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(await screen.findByText(/Please check your inbox or spam folder/)).toBeInTheDocument();
  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toBe('/api/contact');
  expect(JSON.parse(options.body)).toEqual({ name: 'Jane Doe', email: 'jane@example.com', subject: 'A collaboration', message: 'Let us discuss a project.', website: '' });
  expect(screen.getByLabelText('Your name')).toHaveValue('');
});

test('prevents duplicate submissions while mail is being sent', async () => {
  let finish;
  global.fetch.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  render(<Contact />);
  fillForm();
  const button = screen.getByRole('button', { name: 'Send message' });
  fireEvent.click(button);
  expect(screen.getByRole('button', { name: /Sending/ })).toBeDisabled();
  fireEvent.submit(button.closest('form'));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  finish({ ok: true, json: async () => ({ ok: true, acknowledgementSent: true }) });
  await screen.findByText(/Please check your inbox or spam folder/);
});

test('preserves entered text when the server reports an error', async () => {
  global.fetch.mockResolvedValue({ ok: false, json: async () => ({ error: 'Please try again later.' }) });
  render(<Contact />);
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(await screen.findByText('Please try again later.')).toBeInTheDocument();
  expect(screen.getByLabelText('Message')).toHaveValue('Let us discuss a project.');
  expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
});

test('does not request a retry when only the auto-reply failed', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true, acknowledgementSent: false }) });
  render(<Contact />);
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(await screen.findByText(/There is no need to submit again/)).toBeInTheDocument();
});

test('shows a direct email fallback when the network fails', async () => {
  global.fetch.mockRejectedValue(new Error('Network unavailable'));
  render(<Contact />);
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('We could not confirm delivery'));
  expect(screen.getByRole('link', { name: 'batranitin118@gmail.com' })).toHaveAttribute('href', 'mailto:batranitin118@gmail.com');
});
