import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/movies?search=' + encodeURIComponent(searchQuery));
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className={`navbar navbar-expand-lg navbar-dark navbar-custom fixed-top ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-film me-2"></i>CineVerse Pro
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link nav-link-custom" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link nav-link-custom" to="/movies">Movies</Link></li>
                        {isAuthenticated && <li className="nav-item"><Link className="nav-link nav-link-custom" to="/watchlist">My List</Link></li>}
                        {user?.role === 'admin' && <li className="nav-item"><Link className="nav-link nav-link-custom" to="/admin">Admin</Link></li>}
                    </ul>
                    <form className="d-flex align-items-center" onSubmit={handleSearch}>
                        <input type="text" className="search-input" placeholder="Search movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        {isAuthenticated ? (
                            <div className="dropdown profile-dropdown ms-3">
                                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i className="fas fa-user-circle me-2"></i>{user?.name?.split(' ')[0]}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/profile"><i className="fas fa-user me-2"></i>Profile</Link></li>
                                    <li><Link className="dropdown-item" to="/watchlist"><i className="fas fa-list me-2"></i>My List</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <div className="ms-3 d-flex gap-2">
                                <Link to="/login" className="btn btn-login">Sign In</Link>
                                <Link to="/register" className="btn btn-signup">Sign Up</Link>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
