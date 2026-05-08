import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const MovieDetails = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [movie, setMovie] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => { fetchMovieDetails(); }, [id]);
    useEffect(() => { if (isAuthenticated && movie) checkWatchlist(); }, [isAuthenticated, movie]);

    const fetchMovieDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + 'fetch_single_movie.php?id=' + id);
            if (response.data.success) {
                setMovie(response.data.movie);
                setSimilarMovies(response.data.similar_movies);
                setReviews(response.data.reviews);
                setAverageRating(response.data.average_rating);
            }
        } catch (err) { console.error('Failed to fetch movie:', err); }
        finally { setLoading(false); }
    };

    const checkWatchlist = async () => {
        try {
            const response = await axios.get(API_URL + 'get_watchlist.php');
            if (response.data.success) setIsInWatchlist(response.data.watchlist.some(m => m.id === parseInt(id)));
        } catch (err) { console.error('Failed to check watchlist:', err); }
    };

    const handleAddToWatchlist = async () => {
        if (!isAuthenticated) { alert('Please login to add to watchlist'); return; }
        try {
            if (isInWatchlist) { await axios.post(API_URL + 'remove_watchlist.php', { movie_id: id }); setIsInWatchlist(false); }
            else { await axios.post(API_URL + 'add_watchlist.php', { movie_id: id }); setIsInWatchlist(true); }
        } catch (err) { console.error('Watchlist error:', err); }
    };

    const handleAddHistory = async () => {
        if (!isAuthenticated) return;
        try { await axios.post(API_URL + 'add_history.php', { movie_id: id }); } catch (err) { console.error('History error:', err); }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { alert('Please login to submit a review'); return; }
        try {
            await axios.post(API_URL + 'add_review.php', { movie_id: id, rating: reviewData.rating, comment: reviewData.comment });
            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: '' });
            fetchMovieDetails();
        } catch (err) { console.error('Review error:', err); }
    };

    if (loading) return (<div className="page-loader"><div className="loading-spinner"></div></div>);
    if (!movie) return (<div className="container py-5 text-center"><h2>Movie not found</h2><Link to="/movies" className="btn btn-primary mt-3">Browse Movies</Link></div>);

    return (
        <div className="movie-details-page">
            <div className="movie-details-banner">
                <img src={movie.poster || 'https://via.placeholder.com/1920x1080'} alt={movie.title} />
                <div className="gradient-overlay"></div>
            </div>
            <div className="container" style={{ position: 'relative', marginTop: '-400px', zIndex: 2 }}>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="mb-4">
                            <span className="badge-custom me-2">{movie.genre}</span>
                            <span className="badge bg-secondary me-2">{movie.year}</span>
                            {movie.duration && <span className="badge bg-secondary me-2">{movie.duration}</span>}
                        </div>
                        <h1 className="display-4 fw-bold mb-3">{movie.title}</h1>
                        <div className="d-flex align-items-center gap-4 mb-4">
                            <div className="rating-stars">
                                {[1,2,3,4,5,6,7,8,9,10].map(star => (
                                    <i key={star} className={star <= movie.rating ? "fas fa-star" : "far fa-star empty"} style={{ fontSize: '1.5rem', marginRight: '5px' }}></i>
                                ))}
                            </div>
                            <span className="h3 mb-0 text-warning">{movie.rating}/10</span>
                            <span className="text-secondary">({averageRating} avg)</span>
                            <span className="text-secondary"><i className="fas fa-eye me-1"></i>{(movie.views / 1000000).toFixed(1)}M views</span>
                        </div>
                        <div className="d-flex gap-3 mb-4">
                            <button className="btn btn-primary btn-lg" onClick={handleAddHistory}><i className="fas fa-play me-2"></i>Play Movie</button>
                            <button className={'btn btn-lg ' + (isInWatchlist ? 'btn-danger' : 'btn-secondary')} onClick={handleAddToWatchlist}>
                                <i className={'fas ' + (isInWatchlist ? 'fa-check' : 'fa-plus') + ' me-2'}></i>
                                {isInWatchlist ? 'In My List' : 'Add to My List'}
                            </button>
                            {movie.trailer && <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg"><i className="fas fa-play-circle me-2"></i>Watch Trailer</a>}
                        </div>
                        <p className="lead text-secondary mb-4">{movie.description}</p>
                        {movie.director && <p className="text-secondary mb-2"><strong>Director:</strong> {movie.director}</p>}
                        {movie.cast && <p className="text-secondary mb-2"><strong>Cast:</strong> {movie.cast}</p>}
                    </div>
                    <div className="col-lg-4">
                        <div className="glass-card p-4">
                            <h4 className="mb-4">Rate This Movie</h4>
                            {isAuthenticated ? (
                                showReviewForm ? (
                                    <form onSubmit={handleSubmitReview}>
                                        <div className="mb-3">
                                            <label className="form-label">Your Rating</label>
                                            <div className="rating-stars">
                                                {[1,2,3,4,5].map(star => (
                                                    <i key={star} className={star <= reviewData.rating ? "fas fa-star" : "far fa-star"} 
                                                       style={{ fontSize: '2rem', cursor: 'pointer', color: star <= reviewData.rating ? '#ffd700' : '#333', marginRight: '10px' }}
                                                       onClick={() => setReviewData({ ...reviewData, rating: star })}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Your Review</label>
                                            <textarea className="form-control form-control-custom" rows="4" placeholder="Share your thoughts..." value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">Submit Review</button>
                                    </form>
                                ) : (
                                    <button className="btn btn-secondary w-100" onClick={() => setShowReviewForm(true)}><i className="fas fa-star me-2"></i>Write a Review</button>
                                )
                            ) : (
                                <p className="text-secondary"><Link to="/login" style={{ color: '#e50914' }}>Sign in</Link> to rate and review</p>
                            )}
                        </div>
                    </div>
                </div>

                {reviews.length > 0 && (
                    <div className="mt-5">
                        <h3 className="mb-4">Reviews</h3>
                        {reviews.map(review => (
                            <div className="review-card" key={review.id}>
                                <div className="d-flex justify-content-between mb-2">
                                    <strong>{review.username}</strong>
                                    <span className="text-warning">{'★'.repeat(review.rating)}</span>
                                </div>
                                <p className="text-secondary mb-0">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {similarMovies.length > 0 && (
                    <div className="mt-5">
                        <h3 className="mb-4">Similar Movies</h3>
                        <div className="row">
                            {similarMovies.map(similar => (
                                <div className="col-md-3 mb-4" key={similar.id}>
                                    <Link to={'/movie/' + similar.id} className="glass-card p-3 d-block">
                                        <img src={similar.poster || 'https://via.placeholder.com/300x450'} alt={similar.title} className="w-100 mb-2" style={{ borderRadius: '8px' }} />
                                        <h6 className="text-white">{similar.title}</h6>
                                        <small className="text-secondary">{similar.rating}/10</small>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;