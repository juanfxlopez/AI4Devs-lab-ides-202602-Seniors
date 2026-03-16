import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  createCandidate,
  getEducationSuggestions,
  getExperienceSuggestions
} from '../../api/candidates'
import './AddCandidateForm.css'

function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

export interface EducationEntry {
  institution?: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
}

export interface WorkExperienceEntry {
  company?: string
  role?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface CandidateFormValues {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  education: EducationEntry[]
  workExperience: WorkExperienceEntry[]
}

const defaultEducation: EducationEntry = {}
const defaultExperience: WorkExperienceEntry = {}

export function AddCandidateForm() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CandidateFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      education: [defaultEducation],
      workExperience: [defaultExperience]
    }
  })

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [eduSuggestions, setEduSuggestions] = useState<string[]>([])
  const [expSuggestions, setExpSuggestions] = useState<string[]>([])
  const [activeEduIndex, setActiveEduIndex] = useState<number | null>(null)
  const [activeExpIndex, setActiveExpIndex] = useState<number | null>(null)

  const {
    fields: educationFields,
    append: appendEducation
  } = useFieldArray({
    control,
    name: 'education'
  })

  const {
    fields: experienceFields,
    append: appendExperience
  } = useFieldArray({
    control,
    name: 'workExperience'
  })

  const debouncedLoadEduSuggestions = React.useMemo(
    () =>
      debounce(async (value: string) => {
        try {
          const suggestions = await getEducationSuggestions(value)
          setEduSuggestions(suggestions)
        } catch {
          setEduSuggestions([])
        }
      }, 300),
    []
  )

  const debouncedLoadExpSuggestions = React.useMemo(
    () =>
      debounce(async (value: string) => {
        try {
          const suggestions = await getExperienceSuggestions(value)
          setExpSuggestions(suggestions)
        } catch {
          setExpSuggestions([])
        }
      }, 300),
    []
  )

  const onSubmit = async (values: CandidateFormValues) => {
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

  const handleEducationBlur = (value: string, index: number) => {
    if (!value) return
    setActiveEduIndex(index)
    debouncedLoadEduSuggestions(value)
  }

  const handleExperienceBlur = (value: string, index: number) => {
    if (!value) return
    setActiveExpIndex(index)
    debouncedLoadExpSuggestions(value)
  }

  return (
    <form className='AddCandidateForm' onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset>
        <legend>Personal information</legend>

        <label>
          First name*
          <input
            {...register('firstName', { required: 'First name is required' })}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
          {errors.firstName && (
            <span className='AddCandidateForm-error'>
              {errors.firstName.message}
            </span>
          )}
        </label>

        <label>
          Last name*
          <input
            {...register('lastName', { required: 'Last name is required' })}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
          {errors.lastName && (
            <span className='AddCandidateForm-error'>
              {errors.lastName.message}
            </span>
          )}
        </label>

        <label>
          Email*
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email format is invalid'
              }
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <span className='AddCandidateForm-error'>
              {errors.email.message}
            </span>
          )}
        </label>

        <label>
          Phone
          <input {...register('phone')} />
        </label>

        <label>
          Address
          <input {...register('address')} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Education</legend>
        {educationFields.map((field, index) => (
          <div key={field.id} className='AddCandidateForm-block'>
            <label>
              Institution
              <input
                {...register(`education.${index}.institution` as const)}
                onBlur={event =>
                  handleEducationBlur(event.target.value || '', index)
                }
              />
            </label>
            <label>
              Degree
              <input
                {...register(`education.${index}.degree` as const)}
                onBlur={event =>
                  handleEducationBlur(event.target.value || '', index)
                }
              />
            </label>
            <label>
              Field
              <input
                {...register(`education.${index}.field` as const)}
                onBlur={event =>
                  handleEducationBlur(event.target.value || '', index)
                }
              />
            </label>
            <label>
              Start date
              <input
                type='date'
                {...register(`education.${index}.startDate` as const)}
              />
            </label>
            <label>
              End date
              <input
                type='date'
                {...register(`education.${index}.endDate` as const)}
              />
            </label>
          </div>
        ))}
        <button
          type='button'
          className='AddCandidateForm-secondary'
          onClick={() => appendEducation(defaultEducation)}
        >
          Add education
        </button>
        {eduSuggestions.length > 0 && activeEduIndex !== null && (
          <div className='AddCandidateForm-suggestions'>
            <span>Education suggestions:</span>
            <ul>
              {eduSuggestions.map(suggestion => (
                <li key={suggestion}>
                  <button
                    type='button'
                    onClick={() => {
                      setValue(
                        `education.${activeEduIndex}.institution`,
                        suggestion,
                        { shouldDirty: true, shouldTouch: true }
                      )
                    }}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>Work experience</legend>
        {experienceFields.map((field, index) => (
          <div key={field.id} className='AddCandidateForm-block'>
            <label>
              Company
              <input
                {...register(`workExperience.${index}.company` as const)}
                onBlur={event =>
                  handleExperienceBlur(event.target.value || '', index)
                }
              />
            </label>
            <label>
              Role
              <input
                {...register(`workExperience.${index}.role` as const)}
                onBlur={event =>
                  handleExperienceBlur(event.target.value || '', index)
                }
              />
            </label>
            <label>
              Start date
              <input
                type='date'
                {...register(`workExperience.${index}.startDate` as const)}
              />
            </label>
            <label>
              End date
              <input
                type='date'
                {...register(`workExperience.${index}.endDate` as const)}
              />
            </label>
            <label>
              Description
              <textarea
                {...register(
                  `workExperience.${index}.description` as const
                )}
              />
            </label>
          </div>
        ))}
        <button
          type='button'
          className='AddCandidateForm-secondary'
          onClick={() => appendExperience(defaultExperience)}
        >
          Add work experience
        </button>
        {expSuggestions.length > 0 && activeExpIndex !== null && (
          <div className='AddCandidateForm-suggestions'>
            <span>Experience suggestions:</span>
            <ul>
              {expSuggestions.map(suggestion => (
                <li key={suggestion}>
                  <button
                    type='button'
                    onClick={() => {
                      setValue(
                        `workExperience.${activeExpIndex}.company`,
                        suggestion,
                        { shouldDirty: true, shouldTouch: true }
                      )
                    }}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>CV</legend>
        <label>
          CV (PDF or DOCX, max 5MB)
          <input
            type='file'
            accept='.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            onChange={event => {
              const file = event.target.files && event.target.files[0]
              setCvFile(file || null)
            }}
          />
        </label>
      </fieldset>

      {globalError && (
        <div className='AddCandidateForm-error AddCandidateForm-error--global'>
          {globalError}
        </div>
      )}

      {successMessage && (
        <div className='AddCandidateForm-success'>{successMessage}</div>
      )}

      <button
        type='submit'
        className='AddCandidateForm-submit'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting…' : 'Add candidate'}
      </button>
    </form>
  )
}

