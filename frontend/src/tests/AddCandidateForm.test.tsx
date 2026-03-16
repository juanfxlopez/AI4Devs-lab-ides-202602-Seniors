import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddCandidateForm } from '../components/add-candidate-form/AddCandidateForm'

jest.mock('../api/candidates', () => ({
  createCandidate: jest.fn(),
  getEducationSuggestions: jest.fn().mockResolvedValue([]),
  getExperienceSuggestions: jest.fn().mockResolvedValue([])
}))

const { createCandidate } = jest.requireMock('../api/candidates')

describe('AddCandidateForm', () => {
  beforeEach(() => {
    ;(createCandidate as jest.Mock).mockReset()
  })

  test('renders required fields and submit button', () => {
    render(<AddCandidateForm />)

    expect(screen.getByLabelText(/first name\*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name\*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email\*/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add candidate/i })).toBeInTheDocument()
  })

  test('shows success message on successful submit', async () => {
    ;(createCandidate as jest.Mock).mockResolvedValueOnce({})

    render(<AddCandidateForm />)

    fireEvent.change(screen.getByLabelText(/first name\*/i), {
      target: { value: 'Test' }
    })
    fireEvent.change(screen.getByLabelText(/last name\*/i), {
      target: { value: 'User' }
    })
    fireEvent.change(screen.getByLabelText(/email\*/i), {
      target: { value: 'test@example.com' }
    })

    fireEvent.click(screen.getByRole('button', { name: /add candidate/i }))

    await waitFor(() =>
      expect(
        screen.getByText(/candidate was successfully added/i)
      ).toBeInTheDocument()
    )
  })

  test('shows validation error message for invalid email', async () => {
    render(<AddCandidateForm />)

    fireEvent.change(screen.getByLabelText(/first name\*/i), {
      target: { value: 'Test' }
    })
    fireEvent.change(screen.getByLabelText(/last name\*/i), {
      target: { value: 'User' }
    })
    fireEvent.change(screen.getByLabelText(/email\*/i), {
      target: { value: 'not-an-email' }
    })

    fireEvent.click(screen.getByRole('button', { name: /add candidate/i }))

    await waitFor(() =>
      expect(
        screen.getByText(/email format is invalid/i)
      ).toBeInTheDocument()
    )
  })
})

