import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const MovieCard = ({ movie, onWatchlistChange }) => {
    const { isAuthenticated } = useAuth();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleAddToWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) { alert('Please login to add to watchlist'); return; }
        try {
            if (isInWatchlist) {
                await axios.post(API_URL + 'remove_watchlist.php', { movie_id: movie.id });
                setIsInWatchlist(false);
            } else {
                await axios.post(API_URL + 'add_watchlist.php', { movie_id: movie.id });
                setIsInWatchlist(true);
            }
            if (onWatchlistChange) onWatchlistChange();
        } catch (err) { console.error('Watchlist error:', err); }
    };

    const handlePlay = (e) => { e.preventDefault(); e.stopPropagation(); window.open(movie.trailer, '_blank'); };

    return (
        <div className="movie-card" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <Link to={'/movie/' + movie.id}>
                <img src={movie.poster || 'https://placehold.co/400x600/1a1a1a/666666?text=No+Poster'} alt={movie.title} onError={(e) => { e.target.src = 'https://placehold.co/400x600/1a1a1a/666666?text=No+Poster'; }} />
                <div className="overlay">
                    <h5>{movie.title}</h5>
                    <div className="rating"><i className="fas fa-star text-warning me-1"></i>{movie.rating}/10</div>
                    <p className="small text-secondary mb-2">{movie.genre} - {movie.year}</p>
                    <div className="actions">
                        <button onClick={handlePlay} title="Play Trailer"><i className="fas fa-play"></i></button>
                        <button onClick={handleAddToWatchlist} title={isInWatchlist ? "Remove from List" : "Add to List"} style={{ color: isInWatchlist ? '#e50914' : 'white' }}>
                            <i className={isInWatchlist ? "fas fa-check" : "fas fa-plus"}></i>
                        </button>
                        <button title="More Info"><i className="fas fa-info-circle"></i></button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;
