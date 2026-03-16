import { useState } from 'react'
import type { CandidateFormValues } from '../components/add-candidate-form/AddCandidateForm'
import { createCandidate } from '../api/candidates'

export function useAddCandidate() {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)

  const submit = async (values: CandidateFormValues) => {
    setGlobalError(null)
    setSuccessMessage(null)

    if (cvFile) {
      const isPdf = cvFile.type === 'application/pdf'
      const isDocx =
        cvFile.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      if (!isPdf && !isDocx) {
        setGlobalError('Only PDF and DOCX files are allowed for CV upload')
        return
      }

      const maxSize = 5 * 1024 * 1024
      if (cvFile.size > maxSize) {
        setGlobalError('CV file must be 5MB or smaller')
        return
      }
    }

    try {
      await createCandidate(values, cvFile)
      setSuccessMessage('Candidate was successfully added.')
    } catch (err: any) {
      if (err && err.type === 'validation' && err.errors) {
        setGlobalError('Please fix the highlighted errors and try again.')
        return
      }

      if (err && (err.type === 'conflict' || err.type === 'server')) {
        setGlobalError(err.message || 'Something went wrong. Please try again.')
        return
      }

      setGlobalError('Something went wrong. Please try again.')
    }
  }

  return {
    cvFile,
    setCvFile,
    globalError,
    successMessage,
    submit
  }
}

