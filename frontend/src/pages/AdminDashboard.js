import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentMovies, setRecentMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(API_URL + 'admin_dashboard.php');
            if (response.data.success) {
                setStats(response.data.stats);
                setRecentUsers(response.data.recent_users);
                setRecentMovies(response.data.recent_movies);
            }
        } catch (err) { console.error('Error fetching dashboard:', err); }
        finally { setLoading(false); }
    };

    if (loading) return (<div className="page-loader"><div className="loading-spinner"></div></div>);

    return (
        <div className="container py-5">
            <h2 className="mb-4">Admin Dashboard</h2>
            <div className="row mb-5">
                <div className="col-md-3">
                    <div className="glass-card p-4 text-center">
                        <h3 className="text-primary">{stats.total_users || 0}</h3>
                        <p className="text-secondary mb-0">Total Users</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-4 text-center">
                        <h3 className="text-primary">{stats.total_movies || 0}</h3>
                        <p className="text-secondary mb-0">Total Movies</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-4 text-center">
                        <h3 className="text-primary">{stats.total_reviews || 0}</h3>
                        <p className="text-secondary mb-0">Total Reviews</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-4 text-center">
                        <h3 className="text-primary">{(stats.total_views / 1000000).toFixed(1)}M</h3>
                        <p className="text-secondary mb-0">Total Views</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="glass-card p-4">
                        <h4 className="mb-4">Recent Users</h4>
                        {recentUsers.length === 0 ? <p className="text-secondary">No users yet</p> : (
                            <table className="table table-dark">
                                <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
                                <tbody>
                                    {recentUsers.map(user => (
                                        <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{new Date(user.created_at).toLocaleDateString()}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="glass-card p-4">
                        <h4 className="mb-4">Recent Movies</h4>
                        {recentMovies.length === 0 ? <p className="text-secondary">No movies yet</p> : (
                            <table className="table table-dark">
                                <thead><tr><th>Title</th><th>Genre</th><th>Rating</th></tr></thead>
                                <tbody>
                                    {recentMovies.map(movie => (
                                        <tr key={movie.id}><td>{movie.title}</td><td>{movie.genre}</td><td>{movie.rating}/10</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;