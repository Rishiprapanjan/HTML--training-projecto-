import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { calculateStats, filterStudents } from './studentUtils'

const storageKey = 'student-database-v1'

const initialForm = {
  name: '',
  email: '',
  course: '',
  grade: '',
  status: 'Active',
  phone: '',
  address: '',
  joinDate: '',
}

const initialStudents = [
  {
    id: 1,
    name: 'Aisha Khan',
    email: 'aisha@email.com',
    course: 'Computer Science',
    grade: 93,
    status: 'Active',
    phone: '+92 300 111 2222',
    address: 'Lahore',
    joinDate: '2024-01-14',
  },
  {
    id: 2,
    name: 'Omar Hassan',
    email: 'omar@email.com',
    course: 'Business Administration',
    grade: 88,
    status: 'Probation',
    phone: '+92 321 333 4444',
    address: 'Karachi',
    joinDate: '2024-02-10',
  },
  {
    id: 3,
    name: 'Sara Iqbal',
    email: 'sara@email.com',
    course: 'Data Science',
    grade: 95,
    status: 'Active',
    phone: '+92 333 555 6666',
    address: 'Islamabad',
    joinDate: '2023-11-20',
  },
]

function App() {
  const [students, setStudents] = useState(() => {
    if (typeof window === 'undefined') {
      return initialStudents
    }

    const saved = window.localStorage.getItem(storageKey)
    if (!saved) {
      return initialStudents
    }

    try {
      return JSON.parse(saved)
    } catch {
      return initialStudents
    }
  })

  const [form, setForm] = useState(initialForm)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(students))
    }
  }, [students])

  const stats = useMemo(() => calculateStats(students), [students])
  const availableCourses = useMemo(
    () => [...new Set(students.map((student) => student.course).filter(Boolean))].sort(),
    [students]
  )

  const filteredStudents = useMemo(
    () => filterStudents(students, { search, status: statusFilter, course: courseFilter }),
    [students, search, statusFilter, courseFilter]
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim().toLowerCase()
    const trimmedCourse = form.course.trim()
    const gradeValue = Number(form.grade)

    if (!trimmedName || !trimmedEmail || !trimmedCourse || Number.isNaN(gradeValue)) {
      window.alert('Please complete all required fields with a valid grade.')
      return
    }

    if (gradeValue < 0 || gradeValue > 100) {
      window.alert('Grade must be between 0 and 100.')
      return
    }

    const studentPayload = {
      ...form,
      name: trimmedName,
      email: trimmedEmail,
      course: trimmedCourse,
      grade: gradeValue,
      phone: form.phone.trim(),
      address: form.address.trim(),
      joinDate: form.joinDate || new Date().toISOString().slice(0, 10),
    }

    if (editingId) {
      setStudents((current) =>
        current.map((student) => (student.id === editingId ? { ...student, ...studentPayload } : student))
      )
    } else {
      setStudents((current) => [{ ...studentPayload, id: crypto.randomUUID?.() ?? Date.now() }, ...current])
    }

    resetForm()
  }

  const startEdit = (student) => {
    setEditingId(student.id)
    setForm({ ...student, grade: String(student.grade) })
  }

  const deleteStudent = (id) => {
    setStudents((current) => current.filter((student) => student.id !== id))
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Advanced Student Database</p>
          <h1>Manage admissions, records, and performance in one elegant dashboard.</h1>
          <p className="hero-copy">
            Keep every student profile organized with live insights, smart search, and quick updates for modern institutions.
          </p>
        </div>
        <div className="hero-metrics">
          <div className="metric-pill">
            <strong>{stats.total}</strong>
            <span>Total Students</span>
          </div>
          <div className="metric-pill">
            <strong>{stats.average}%</strong>
            <span>Average Grade</span>
          </div>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Students Enrolled</p>
          <h2>{stats.total}</h2>
        </article>
        <article className="stat-card">
          <p className="stat-label">Active Learners</p>
          <h2>{stats.active}</h2>
        </article>
        <article className="stat-card">
          <p className="stat-label">Average Performance</p>
          <h2>{stats.average}%</h2>
        </article>
        <article className="stat-card">
          <p className="stat-label">Top Performer</p>
          <h2>{stats.topPerformer ? stats.topPerformer.name : '—'}</h2>
        </article>
      </section>

      <main className="dashboard-grid">
        <section className="panel form-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Student Form</p>
              <h3>{editingId ? 'Update Student Profile' : 'Add New Student'}</h3>
            </div>
          </div>

          <form className="student-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                Full Name
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
              </label>
              <label>
                Email Address
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@email.com" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                Course
                <input type="text" name="course" value={form.course} onChange={handleChange} placeholder="e.g. Data Science" />
              </label>
              <label>
                Grade
                <input type="number" name="grade" value={form.grade} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Probation">Probation</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label>
                Phone
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
              </label>
            </div>

            <label>
              Address
              <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Residential address" />
            </label>

            <label>
              Join Date
              <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} />
            </label>

            <div className="form-actions">
              <button className="primary-btn" type="submit">
                {editingId ? 'Save Changes' : 'Add Student'}
              </button>
              <button className="ghost-btn" type="button" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Student Records</p>
              <h3>Database Overview</h3>
            </div>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span>🔎</span>
              <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, or course" />
            </label>

            <div className="filter-group">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="Graduated">Graduated</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
                <option value="All">All Courses</option>
                {availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="student-list">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <article key={student.id} className="student-card">
                  <div className="student-main">
                    <div className="student-title-row">
                      <h4>{student.name}</h4>
                      <span className={`status-pill ${student.status.toLowerCase()}`}>{student.status}</span>
                    </div>
                    <p>{student.email}</p>
                    <div className="student-details">
                      <span>{student.course}</span>
                      <span>Grade: {student.grade}%</span>
                      <span>Joined: {student.joinDate || '—'}</span>
                    </div>
                  </div>
                  <div className="student-actions">
                    <button className="ghost-btn" type="button" onClick={() => startEdit(student)}>
                      Edit
                    </button>
                    <button className="danger-btn" type="button" onClick={() => deleteStudent(student.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h4>No matching student records</h4>
                <p>Try another search or add a new student profile.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
