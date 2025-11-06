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
            
        </div>
    )

}