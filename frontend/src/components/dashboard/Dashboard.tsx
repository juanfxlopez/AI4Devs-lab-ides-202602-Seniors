import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Dashboard.module.css'

export function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <section className={styles.card}>
        <h1 className={styles.title}>LTI - Talent Tracking System</h1>
        <p className={styles.subtitle}>Recruiter dashboard</p>
        <Link
          to='/candidates/new'
          className={styles.primaryLink}
          aria-label='Add candidate'
        >
          Add candidate
        </Link>
      </section>
    </main>
  )
}

