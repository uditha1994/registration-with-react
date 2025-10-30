import { Link, useNavigate } from "react-router-dom"
import './Navbar.css';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Registration</Link>

                <div className="nav-menu">

                </div>
            </div>
        </nav>
    )
}