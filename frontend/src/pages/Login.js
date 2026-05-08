import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(formData.email, formData.password);
        if (result.success) navigate(result.user.role === 'admin' ? '/admin' : '/');
        else setError(result.error);
        setLoading(false);
    };

    return (
        <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="glass-card p-5 scale-in">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold" style={{ color: '#e50914' }}><i className="fas fa-film me-2"></i>CineVerse Pro</h2>
                                <p className="text-secondary mt-2">Welcome back! Sign in to continue</p>
                            </div>
                            {error && <div className="alert alert-danger bg-transparent border-danger text-danger mb-4"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Email Address</label>
                                    <input type="email" name="email" className="form-control form-control-custom" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Password</label>
                                    <input type="password" name="password" className="form-control form-control-custom" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="remember" />
                                        <label className="form-check-label text-secondary" htmlFor="remember">Remember me</label>
                                    </div>
                                    <a href="#" className="text-decoration-none" style={{ color: '#e50914' }}>Forgot password?</a>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-3" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-sign-in-alt me-2"></i>}
                                    Sign In
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <p className="text-secondary">Don't have an account? <Link to="/register" style={{ color: '#e50914', fontWeight: '600' }}>Sign Up</Link></p>
                            </div>
                            <div className="mt-4 p-3 bg-dark rounded">
                                <small className="text-secondary"><strong>Demo Credentials:</strong><br />User: user@cineverse.com<br />Admin: admin@cineverse.com<br />Password: password</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
