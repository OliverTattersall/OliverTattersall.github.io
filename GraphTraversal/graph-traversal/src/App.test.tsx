import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the visualizer heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /graph traversal visualizer/i })).toBeInTheDocument();
});
