import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task manager header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Task Manager/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders add task button', () => {
  render(<App />);
  const addButton = screen.getByText(/Add New Task/i);
  expect(addButton).toBeInTheDocument();
});

test('renders tasks section', () => {
  render(<App />);
  const tasksSection = screen.getByText(/Your Tasks/i);
  expect(tasksSection).toBeInTheDocument();
});
