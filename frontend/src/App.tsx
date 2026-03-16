import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { AddCandidateForm } from './components/add-candidate-form/AddCandidateForm'
import { Dashboard } from './components/dashboard/Dashboard'

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
