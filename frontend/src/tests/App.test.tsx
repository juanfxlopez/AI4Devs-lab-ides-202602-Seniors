import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

test('renders Add candidate link on dashboard', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const linkElement = screen.getByRole('link', { name: /add candidate/i })
  expect(linkElement).toBeInTheDocument()
})
