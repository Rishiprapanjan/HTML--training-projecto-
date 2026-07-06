export function calculateStats(students) {
  const total = students.length
  const active = students.filter((student) => student.status === 'Active').length
  const average = total
    ? Math.round(students.reduce((sum, student) => sum + Number(student.grade || 0), 0) / total)
    : 0

  const topPerformer = students.reduce((best, student) => {
    if (!best) return student
    return Number(student.grade || 0) > Number(best.grade || 0) ? student : best
  }, null)

  return { total, active, average, topPerformer }
}

export function filterStudents(students, filters) {
  const search = (filters.search || '').trim().toLowerCase()
  const status = filters.status || 'All'
  const course = filters.course || 'All'

  return students.filter((student) => {
    const matchesSearch =
      !search ||
      [student.name, student.email, student.course]
        .join(' ')
        .toLowerCase()
        .includes(search)

    const matchesStatus = status === 'All' || student.status === status
    const matchesCourse = course === 'All' || student.course === course

    return matchesSearch && matchesStatus && matchesCourse
  })
}
