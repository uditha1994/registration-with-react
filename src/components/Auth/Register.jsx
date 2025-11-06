import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import './AuthForm.css';

export default function Register() {
    //Form state management
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        industry: '',
        experience: '',
        skills: '',
        rwsume: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //get auth function and navigation
    const { signup } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        //basic form validation
        if (formData.password !== formData.confirmPassword) {
            return setError('password do not match');
        }

        if (formData.password.length < 6) {
            return setError('Passwor must be at least 6 characters');
        }

        try {
            setError('');
            setLoading(true);

            //create a new user
            await signup(formData.email,
                formData.password, formData.displayName);

            //redirect to dashboard
            navigate('/dashboard');

        } catch (error) {
            setError('Failed to register user:' + error.message);
        }
        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="displayName">Full Name</label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'};
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to='/login'>Sign In</Link>
                </p>
            </div>
        </div>
    )
}