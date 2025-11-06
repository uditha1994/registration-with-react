import { useAuth, AuthProvider } from './context/AuthContext'
import './App.css'
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard'
import CompanyRegistration from './components/Auth/CompanyRegistration';

//protected route component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />
}

//public route component - redirect if logged in
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />
}

//Home page component
function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Registration</h1>
        <p>Modern registration and authentication system</p>
        {!currentUser && (
          <div className="hero-buttons">
            <a href="/register" className='btn btn-primary'>
              Get Started</a>
            <a href="/login" className='btn btn-secondary'>
              Sign In</a>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            {/* public routes */}
            <Route path='/' element={<Home />} />
            <Route path='/login' element={
              <PublicRoute><Login /></PublicRoute>
            } />
            <Route path='/register' element={
              <PublicRoute><Register /></PublicRoute>
            } />
            <Route path='/company' element={
              <PublicRoute><CompanyRegistration /></PublicRoute>
            } />
            {/* private route */}
            <Route path='/dashboard' element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path='*' element={<Navigate to='/' />} />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
