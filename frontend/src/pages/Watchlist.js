import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchWatchlist(); }, []);

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(API_URL + 'get_watchlist.php');
            if (response.data.success) setWatchlist(response.data.watchlist);
        } catch (err) { console.error('Error fetching watchlist:', err); }
        finally { setLoading(false); }
    };

    const handleRemove = async (movieId) => {
        try {
            await axios.post(API_URL + 'remove_watchlist.php', { movie_id: movieId });
            setWatchlist(watchlist.filter(m => m.id !== movieId));
        } catch (err) { console.error('Error removing from watchlist:', err); }
    };

    if (loading) return (<div className="page-loader"><div className="loading-spinner"></div></div>);

    return (
        <div className="container py-5">
            <h2 className="mb-4">My Watchlist</h2>
            {watchlist.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-secondary mb-4">Your watchlist is empty</p>
                    <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
                </div>
            ) : (
                <div className="row">
                    {watchlist.map(movie => (
                        <div className="col-md-3 mb-4" key={movie.id}>
                            <div className="glass-card p-3">
                                <Link to={'/movie/' + movie.id}>
                                    <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title} className="w-100 mb-3" style={{ borderRadius: '8px' }} />
                                </Link>
                                <h5 className="text-white mb-2">{movie.title}</h5>
                                <button className="btn btn-danger btn-sm w-100" onClick={() => handleRemove(movie.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;