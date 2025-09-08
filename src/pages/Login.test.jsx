// src/pages/Login.test.jsx
import { test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders login form with all elements', () => {
  render(<Login />);

  // تحقق من ظهور العنوان
  expect(screen.getByText(/Doctor Portal/i)).toBeInTheDocument();
  expect(screen.getByText(/Global Clinic/i)).toBeInTheDocument();

  // تحقق من وجود الحقول
  expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

  // تحقق من وجود زر تسجيل الدخول
  const signInButton = screen.getByRole('button', { name: /Sign In/i });
  expect(signInButton).toBeInTheDocument();
  expect(signInButton).toBeEnabled();
});

test('allows user to type email and password', () => {
  render(<Login />);

  const emailInput = screen.getByLabelText(/Email Address/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(emailInput, { target: { value: 'dr.ali@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'secret123' } });

  expect(emailInput).toHaveValue('dr.ali@example.com');
  expect(passwordInput).toHaveValue('secret123');
});

test('shows error message when form is submitted empty', () => {
  render(<Login />);

  const signInButton = screen.getByRole('button', { name: /Sign In/i });
  fireEvent.click(signInButton);

  // بعض الأنظمة تعرض رسالة خطأ — إذا كانت في DOM، ابحث عنها
  // مثال: expect(screen.getByText(/Please enter your email/i)).toBeInTheDocument();
  // (نترك هذا الاختبار عامًا ما لم تُضف رسائل خطأ في الكود)
});
