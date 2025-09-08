// src/App.test.jsx
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Routing', () => {
  test('renders Login component at root route', () => {
    render(<App />);

    // تحقق من عناصر صفحة تسجيل الدخول
    expect(screen.getByText(/Doctor Portal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('does not render Dashboard at root route', () => {
    render(<App />);
    const dashboardHeading = screen.queryByText(/Dashboard/i);
    expect(dashboardHeading).not.toBeInTheDocument();
  });
});
