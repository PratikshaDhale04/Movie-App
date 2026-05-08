import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const Profile = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [historyRes, reviewsRes] = await Promise.all([
                axios.get(API_URL + 'get_history.php'),
                axios.get(API_URL + 'get_reviews.php')
            ]);
            if (historyRes.data.success) setHistory(historyRes.data.history);
            if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews);
        } catch (err) { console.error('Error fetching data:', err); }
        finally { setLoading(false); }
    };

    if (loading) return (<div className="page-loader"><div className="loading-spinner"></div></div>);

    return (
        <div className="container py-5">
            <div className="glass-card p-4 mb-4">
                <div className="d-flex align-items-center">
                    <div className="profile-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginRight: '20px' }}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2>{user?.username}</h2>
                        <p className="text-secondary mb-0">{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <h4 className="mb-4">Watch History</h4>
                    {history.length === 0 ? <p className="text-secondary">No watch history yet</p> : (
                        <div className="row">
                            {history.map(movie => (
                                <div className="col-md-6 mb-3" key={movie.id}>
                                    <Link to={'/movie/' + movie.id} className="glass-card p-3 d-flex text-decoration-none">
                                        <img src={movie.poster || 'https://via.placeholder.com/100x150'} alt={movie.title} style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }} />
                                        <div><h6 className="text-white mb-1">{movie.title}</h6><small className="text-secondary">{movie.watched_at}</small></div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-lg-4">
                    <h4 className="mb-4">My Reviews</h4>
                    {reviews.length === 0 ? <p className="text-secondary">No reviews yet</p> : reviews.map(review => (
                        <div className="review-card" key={review.id}>
                            <div className="d-flex justify-content-between mb-2">
                                <Link to={'/movie/' + review.movie_id} className="text-white">{review.movie_title}</Link>
                                <span className="text-warning">{'★'.repeat(review.rating)}</span>
                            </div>
                            <p className="text-secondary mb-0">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;