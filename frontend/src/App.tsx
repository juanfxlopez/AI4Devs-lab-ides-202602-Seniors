import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { AddCandidateForm } from './components/add-candidate-form/AddCandidateForm'

function Dashboard() {
  return (
    <main className='App'>
      <header className='App-header'>
        <h1>LTI - Talent Tracking System</h1>
        <p>Recruiter dashboard</p>
        <Link
          to='/candidates/new'
          className='App-link'
          aria-label='Add candidate'
        >
          Add candidate
        </Link>
      </header>
    </main>
  )
}

function AddCandidatePage() {
  return (
    <main className='App'>
      <header className='App-header'>
        <h1>Add candidate</h1>
        <AddCandidateForm />
        <Link to='/' className='App-link'>
          Back to dashboard
        </Link>
      </header>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/candidates/new' element={<AddCandidatePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
