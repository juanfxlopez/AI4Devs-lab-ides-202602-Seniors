import type { CandidateFormValues } from '../components/add-candidate-form/AddCandidateForm'

const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:3010'

export async function createCandidate(
  values: CandidateFormValues,
  cvFile: File | null
) {
  const formData = new FormData()

  formData.append('firstName', values.firstName)
  formData.append('lastName', values.lastName)
  formData.append('email', values.email)
  if (values.phone) formData.append('phone', values.phone)
  if (values.address) formData.append('address', values.address)

  formData.append('education', JSON.stringify(values.education))
  formData.append('workExperience', JSON.stringify(values.workExperience))

  if (cvFile) {
    formData.append('cvFile', cvFile)
  }

  const response = await fetch(`${API_BASE}/api/candidates`, {
    method: 'POST',
    body: formData
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    if (response.status === 400 && data && data.errors) {
      return Promise.reject({ type: 'validation', errors: data.errors })
    }

    if (response.status === 409 && data && data.message) {
      return Promise.reject({ type: 'conflict', message: data.message })
    }

    const message = data && data.message
      ? data.message
      : 'Something went wrong. Please try again.'

    return Promise.reject({ type: 'server', message })
  }

  return data
}

async function fetchSuggestions(path: string, q: string) {
  const url = new URL(`${API_BASE}${path}`)
  if (q) url.searchParams.set('q', q)

  const response = await fetch(url.toString())

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  if (!data || !Array.isArray(data.suggestions)) {
    return []
  }

  return data.suggestions as string[]
}

export function getEducationSuggestions(q: string) {
  return fetchSuggestions('/api/candidates/education/suggestions', q)
}

export function getExperienceSuggestions(q: string) {
  return fetchSuggestions('/api/candidates/experience/suggestions', q)
}

