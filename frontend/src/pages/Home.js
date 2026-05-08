import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';
import moviesData from '../data/moviesData';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const categoryConfig = {
    Trending: { icon: 'fa-fire', color: '#e50914' },
    'Top Rated': { icon: 'fa-trophy', color: '#ffd700' },
    Action: { icon: 'fa-bolt', color: '#ff6b6b' },
    'Sci-Fi': { icon: 'fa-rocket', color: '#4ecdc4' },
    Drama: { icon: 'fa-heart', color: '#ff69b4' },
    Comedy: { icon: 'fa-laugh-squint', color: '#f9ca24' },
    Crime: { icon: 'fa-gavel', color: '#a29bfe' },
    Thriller: { icon: 'fa-skull', color: '#6c5ce7' },
    Horror: { icon: 'fa-ghost', color: '#e17055' },
    Animation: { icon: 'fa-dragon', color: '#22c55e' },
};

const getCategoryStyle = (cat) => categoryConfig[cat] || { icon: 'fa-film', color: '#ffffff' };

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [movies, setMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroMovie, setHeroMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMovies();
        if (isAuthenticated) fetchRecommendations();
    }, [isAuthenticated]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get(API_URL + 'fetch_movies.php?limit=50');
            if (response.data.success) {
                const apiTitles = new Set((response.data.movies || []).map(m => m.title));
                const localOnly = moviesData.filter(m => !apiTitles.has(m.title));
                const allMovies = [...localOnly, ...(response.data.movies || [])];
                setMovies(allMovies);
                if (allMovies.length > 0) {
                    setHeroMovie(allMovies[Math.floor(Math.random() * Math.min(allMovies.length, 10))]);
                }
                setLoading(false);
                return;
            }
        } catch (err) { console.error('API fetch failed, using local data:', err); }
        setMovies(moviesData);
        if (moviesData.length > 0) {
            setHeroMovie(moviesData[Math.floor(Math.random() * Math.min(moviesData.length, 10))]);
        }
        setLoading(false);
    };

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get(API_URL + 'get_recommendations.php');
            if (response.data.success) setRecommendations(response.data.recommendations);
        } catch (err) { console.error('Failed to fetch recommendations:', err); }
    };

    const filteredMovies = useMemo(() => {
        if (!searchTerm.trim()) return movies;
        const q = searchTerm.toLowerCase();
        return movies.filter(m =>
            (m.title && m.title.toLowerCase().includes(q)) ||
            (m.genre && m.genre.toLowerCase().includes(q)) ||
            (m.category && m.category.toLowerCase().includes(q))
        );
    }, [movies, searchTerm]);

    const getSortCategory = (key) => {
        return [...filteredMovies].sort((a, b) => {
            if (key === 'trending') return (b.views || 0) - (a.views || 0);
            if (key === 'top_rated') return (b.rating || 0) - (a.rating || 0);
            if (key === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            return 0;
        });
    };

    const groupedByCategory = useMemo(() => {
        const map = {};
        filteredMovies.forEach(m => {
            const cat = m.category || m.genre || 'Other';
            if (!map[cat]) map[cat] = [];
            map[cat].push(m);
        });
        const order = ['Trending', 'Top Rated', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Crime', 'Thriller', 'Horror', 'Animation'];
        return Object.keys(map)
            .sort((a, b) => {
                const ia = order.indexOf(a);
                const ib = order.indexOf(b);
                return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
            })
            .reduce((acc, k) => { acc[k] = map[k]; return acc; }, {});
    }, [filteredMovies]);

    const sortCategories = [
        { key: 'trending', icon: 'fa-fire', color: '#e50914', label: 'Trending Now' },
        { key: 'top_rated', icon: 'fa-trophy', color: '#ffd700', label: 'Top Rated' },
        { key: 'newest', icon: 'fa-clock', color: '#00d4ff', label: 'Recently Added' },
    ];

    if (loading) return (<div className="page-loader"><div className="loading-spinner"></div></div>);

    return (
        <div className="home-page" style={{ paddingTop: '80px' }}>
            {heroMovie && (
                <div className="hero-banner">
                    <img src={heroMovie.poster || 'https://placehold.co/1920x1080/141414/e50914?text=CineVerse+Pro'} alt={heroMovie.title} />
                    <div className="gradient-overlay"></div>
                    <div className="content">
                        <span className="badge-custom mb-3">{heroMovie.genre}</span>
                        <h1>{heroMovie.title}</h1>
                        <p className="text-truncate" style={{ maxHeight: '100px' }}>{heroMovie.description}</p>
                        <div className="d-flex gap-3 mb-3">
                            <span className="text-warning"><i className="fas fa-star me-1"></i>{heroMovie.rating}/10</span>
                            <span className="text-secondary"><i className="fas fa-calendar me-1"></i>{heroMovie.year}</span>
                            <span className="text-secondary"><i className="fas fa-eye me-1"></i>{(heroMovie.views / 1000000).toFixed(1)}M views</span>
                        </div>
                        <div className="d-flex gap-3">
                            <Link to={'/movie/' + heroMovie.id} className="btn btn-primary btn-lg"><i className="fas fa-play me-2"></i>More Info</Link>
                            <a href={heroMovie.trailer} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg"><i className="fas fa-play-circle me-2"></i>Watch Trailer</a>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mt-5">
                <div className="row mb-4">
                    <div className="col-md-6 col-lg-4">
                        <div className="home-search-wrapper">
                            <i className="fas fa-search home-search-icon"></i>
                            <input
                                type="text"
                                className="home-search-input"
                                placeholder="Search movies by title, genre, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="home-search-clear" onClick={() => setSearchTerm('')}>
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {isAuthenticated && recommendations.length > 0 && (
                    <section className="mb-5">
                        <h2 className="mb-4" style={{ color: '#e50914' }}><i className="fas fa-magic me-2"></i>Recommended For You</h2>
                        <div className="movie-row">{recommendations.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div>
                    </section>
                )}

                {sortCategories.map(sc => {
                    const sorted = getSortCategory(sc.key);
                    if (sorted.length === 0) return null;
                    return (
                        <section className="mb-5" key={sc.key}>
                            <h2 className="mb-4"><i className={`fas ${sc.icon} me-2`} style={{ color: sc.color }}></i>{sc.label}</h2>
                            <div className="movie-row">{sorted.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div>
                        </section>
                    );
                })}

                {Object.entries(groupedByCategory).map(([category, categoryMovies]) => {
                    const cfg = getCategoryStyle(category);
                    return (
                        <section className="mb-5" key={category}>
                            <h2 className="mb-4"><i className={`fas ${cfg.icon} me-2`} style={{ color: cfg.color }}></i>{category} Movies</h2>
                            <div className="movie-row">{categoryMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div>
                        </section>
                    );
                })}

                {filteredMovies.length === 0 && (
                    <div className="text-center py-5">
                        <i className="fas fa-film fa-5x mb-4" style={{ color: '#333' }}></i>
                        <h3 className="text-secondary">No movies found matching "{searchTerm}"</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
