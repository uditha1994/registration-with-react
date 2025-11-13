import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    //handle user logout
    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to login', error);
        }
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    WORK:MANGO</Link>

                <div className="nav-menu">
                    {currentUser ? (
                        //show user menu when logged in
                        <div className="nav-user">
                            <span className="nav-username">
                                Hello, {currentUser.displayName || currentUser.email}
                            </span>
                            <Link to="/dashboard" className="nav-link">
                                Dashboard</Link>
                            <button className="nav-logout"
                                onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        //show auth links when not logged in
                        <div className="nav-auth">
                            <Link to='/login' className="nav-link">Login</Link>
                            <Link to='/register' className="nav-link nav-register">Register</Link>
                            <Link to='/company' className="nav-link nav-register">Company</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}