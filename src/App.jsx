import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingState from './components/LoadingState'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import Internships from './pages/Internships'
import InternshipDetails from './pages/InternshipDetails'
import Placements from './pages/Placements'
import PlacementDetails from './pages/PlacementDetails'
import Companies from './pages/Companies'
import CompanyDetails from './pages/CompanyDetails'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Dashboards are loaded on demand; most visitors only see the public pages.
const Notifications = lazy(() => import('./pages/Notifications'))
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const StudentProfile = lazy(() => import('./pages/student/Profile'))
const StudentResume = lazy(() => import('./pages/student/Resume'))
const StudentSaved = lazy(() => import('./pages/student/Saved'))
const StudentApplications = lazy(() => import('./pages/student/Applications'))
const RecruiterDashboard = lazy(() => import('./pages/recruiter/Dashboard'))
const RecruiterOpportunities = lazy(() => import('./pages/recruiter/Opportunities'))
const OpportunityForm = lazy(() => import('./pages/recruiter/OpportunityForm'))
const RecruiterApplicants = lazy(() => import('./pages/recruiter/Applicants'))
const CompanyProfile = lazy(() => import('./pages/recruiter/CompanyProfile'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))

const guard = (roles, element) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
const STUDENT = ['student']
const RECRUITER = ['recruiter']
const EDITORS = ['recruiter', 'admin']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/placements/:id" element={<PlacementDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notifications" element={guard(null, <Notifications />)} />

            <Route path="/student/dashboard" element={guard(STUDENT, <StudentDashboard />)} />
            <Route path="/student/profile" element={guard(STUDENT, <StudentProfile />)} />
            <Route path="/student/resume" element={guard(STUDENT, <StudentResume />)} />
            <Route path="/student/saved" element={guard(STUDENT, <StudentSaved />)} />
            <Route path="/student/applications" element={guard(STUDENT, <StudentApplications />)} />

            <Route path="/recruiter/dashboard" element={guard(RECRUITER, <RecruiterDashboard />)} />
            <Route path="/recruiter/company" element={guard(RECRUITER, <CompanyProfile />)} />
            <Route path="/recruiter/applicants" element={guard(RECRUITER, <RecruiterApplicants />)} />
            {['job', 'internship'].map((type) => {
              const base = `/recruiter/${type}s`
              return [
                <Route
                  key={base}
                  path={base}
                  element={guard(RECRUITER, <RecruiterOpportunities key={type} type={type} />)}
                />,
                <Route
                  key={`${base}/new`}
                  path={`${base}/new`}
                  element={guard(RECRUITER, <OpportunityForm key={`new-${type}`} type={type} />)}
                />,
                <Route
                  key={`${base}/edit`}
                  path={`${base}/:id/edit`}
                  element={guard(EDITORS, <OpportunityForm key={`edit-${type}`} type={type} />)}
                />,
              ]
            })}

            <Route path="/admin/dashboard" element={guard(['admin'], <AdminDashboard />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
