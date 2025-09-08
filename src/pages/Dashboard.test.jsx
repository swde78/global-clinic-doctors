// src/pages/Dashboard.test.jsx
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('shows loading state initially', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Loading cases/i)).toBeInTheDocument();
});
