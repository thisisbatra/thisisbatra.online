import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

test('background shows primary technologies per role and navigates to education', () => {
  window.history.replaceState({}, '', '/background');
  render(<App />);
  const navigation = screen.getByRole('navigation', { name: 'Background sections' });
  expect(within(navigation).getByRole('link', { name: /experience/i })).toHaveAttribute('aria-current', 'page');
  const experience = screen.getByRole('region', { name: 'Professional experience' });
  const companies = within(experience).getAllByRole('article');
  expect(companies[0]).toHaveTextContent('Advanced GRC');
  expect(companies[0]).toHaveTextContent('Current role');
  expect(companies[1]).toHaveTextContent('SecWebXperts');
  expect(within(navigation).queryByRole('link', { name: /skills/i })).not.toBeInTheDocument();
  expect(within(companies[0]).getAllByRole('listitem').map(item => item.textContent)).toEqual(['ASP.NET Core', 'Vue.js', 'SQL Server']);
  expect(within(companies[1]).getAllByRole('listitem').map(item => item.textContent)).toEqual(['ASP.NET Core', 'Angular', 'MySQL']);

  fireEvent.click(within(navigation).getByRole('link', { name: /education/i }));
  expect(screen.getByRole('heading', { name: 'Master of Computer Applications' })).toBeInTheDocument();
  expect(within(navigation).getByRole('link', { name: /education/i })).toHaveAttribute('aria-current', 'page');
});

test.each(['achievements', 'skills'])('old %s links open the experience timeline', async (path) => {
  window.history.replaceState({}, '', `/background/${path}`);
  render(<App />);
  expect(await screen.findByRole('region', { name: 'Professional experience' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/background');
});
