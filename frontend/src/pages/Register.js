import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) navigate('/');
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
                                <p className="text-secondary mt-2">Create your account and start watching</p>
                            </div>
                            {error && <div className="alert alert-danger bg-transparent border-danger text-danger mb-4"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Full Name</label>
                                    <input type="text" name="name" className="form-control form-control-custom" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Email Address</label>
                                    <input type="email" name="email" className="form-control form-control-custom" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Password</label>
                                    <input type="password" name="password" className="form-control form-control-custom" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Confirm Password</label>
                                    <input type="password" name="confirmPassword" className="form-control form-control-custom" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
                                </div>
                                <div className="form-check mb-4">
                                    <input type="checkbox" className="form-check-input" id="terms" required />
                                    <label className="form-check-label text-secondary" htmlFor="terms">I agree to the <a href="#" style={{ color: '#e50914' }}>Terms of Service</a></label>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-3" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-user-plus me-2"></i>}
                                    Create Account
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <p className="text-secondary">Already have an account? <Link to="/login" style={{ color: '#e50914', fontWeight: '600' }}>Sign In</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
