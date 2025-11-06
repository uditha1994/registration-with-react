import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { validateURL } from '../../utils/helpers';
import { INDUSTRIES } from '../../utils/constants';
import './AuthForm.css';

export default function CompanyRegistration() {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        website: '',
        industry: '',
        companySize: '',
        location: '',
        description: '',
        logo: '',
        contactPhone: '',
        contactPerson: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { sigupCompany } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        //validations
        if (formData.password !== formData.confirmPassword) {
            return setError('Password do not match');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        if (formData.website && !validateURL(formData.website)) {
            return setError('Please enter a valid website URL');
        }

        if (formData.logo && !validateURL(formData.logo)) {
            return setError('Please enter a valid logo URL');
        }

        try {
            setError('');
            setLoading(true);

            const companyData = {
                companyName: formData.companyName,
                website: formData.website,
                industry: formData.industry,
                companySize: formData.companySize,
                location: formData.location,
                description: formData.description,
                logo: formData.logo,
                contactPhone: formData.contactPhone,
                contactPerson: formData.contactPerson
            }

            await sigupCompany(formData.email, formData.password, companyData);
            navigate('/dashboard');

        } catch (error) {
            console.error('Failed to create Company Account', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card large">
                <h2>Register Your Company</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your company name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Company Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter company email"
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
                            placeholder="Confirm Password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="website">Company Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            required
                            placeholder="https://yourcompany.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="industry">Industry</label>
                        <select
                            name="industry"
                            id="industry"
                            value={formData.industry}
                            onChange={handleChange}
                        >
                            <option value="">Select industry</option>
                            {INDUSTRIES.map(industry => (
                                <option value={industry} key={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="companySize">Company Size</label>
                        <select
                            name="companySize"
                            id="companySize"
                            value={formData.companySize}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Size</option>
                            <option value="1-10">1-10 eemployees</option>
                            <option value="11-50">11-50 eemployees</option>
                            <option value="51-150">51-150 eemployees</option>
                            <option value="151-500">152-500 eemployees</option>
                            <option value="580-1000">580-1000 employee</option>
                            <option value="1000+">1000+ employees</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Company Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="City, State, Country"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Company Description</label>
                        <textarea
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            placeholder="Brief description about company"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactPerson">Contact Person</label>
                        <textarea
                            type="text"
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            required
                            placeholder="Contact person name here"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactPhone">Contact Phone</label>
                        <textarea
                            type="tel"
                            id="contactPhone"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            required
                            placeholder="Contact phone number"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading ? 'Creating Company Account...' : 'Register Company'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to='/login'>Sign In</Link>
                </p>
                <p className="auth-link">
                    Looking for a job? <Link to='/register'>Register as Job Seeker</Link>
                </p>
            </div>
        </div>
    )

}