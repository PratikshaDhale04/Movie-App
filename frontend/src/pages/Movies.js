import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import moviesData from '../data/moviesData';

const API_URL = 'http://localhost/cineverse-pro/backend/api/';

const Movies = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalMovies, setTotalMovies] = useState(0);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        genre: searchParams.get('genre') || 'All',
        year: searchParams.get('year') || '',
        sort: searchParams.get('sort') || 'rating'
    });

    const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Crime', 'Thriller', 'Horror', 'Animation'];
    const years = Array.from({ length: 30 }, (_, i) => 2024 - i);

    useEffect(() => { fetchMovies(); }, [filters]);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            let url = API_URL + 'fetch_movies.php?limit=100&sort=' + filters.sort;
            if (filters.search) url += '&search=' + encodeURIComponent(filters.search);
            if (filters.genre !== 'All') url += '&genre=' + encodeURIComponent(filters.genre);
            if (filters.year) url += '&year=' + filters.year;
            const response = await axios.get(url);
            if (response.data.success) { setMovies(response.data.movies); setTotalMovies(response.data.total); }
            else { fallbackToLocal(); }
        } catch (err) {
            console.error('API failed, using local data:', err);
            fallbackToLocal();
        }
    };

    const fallbackToLocal = () => {
        let filtered = [...moviesData];
        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(m => m.title.toLowerCase().includes(q));
        }
        if (filters.genre !== 'All') {
            filtered = filtered.filter(m => m.genre === filters.genre || m.category === filters.genre);
        }
        if (filters.year) {
            filtered = filtered.filter(m => String(m.year) === filters.year);
        }
        if (filters.sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        else if (filters.sort === 'popular') filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        else if (filters.sort === 'latest') filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setMovies(filtered);
        setTotalMovies(filtered.length);
        setLoading(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="movies-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="fw-bold mb-4"><i className="fas fa-film me-2" style={{ color: '#e50914' }}></i>Browse Movies</h1>
                    </div>
                </div>
                <div className="glass-card p-4 mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label text-secondary small">Search</label>
                            <input type="text" className="form-control form-control-custom" placeholder="Search by title, director, cast..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-secondary small">Genre</label>
                            <select className="form-select form-control-custom" value={filters.genre} onChange={(e) => handleFilterChange('genre', e.target.value)}>
                                {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label text-secondary small">Year</label>
                            <select className="form-select form-control-custom" value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
                                <option value="">All Years</option>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                        <div className="col-md-1">
                            <label className="form-label text-secondary small">Sort</label>
                            <select className="form-select form-control-custom" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                                <option value="rating">Rating</option>
                                <option value="popular">Popular</option>
                                <option value="latest">Latest</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mb-4"><p className="text-secondary">{loading ? 'Loading...' : totalMovies + ' movies found'}</p></div>
                {loading ? <div className="text-center py-5"><div className="loading-spinner mx-auto"></div></div> :
                 movies.length === 0 ? <div className="text-center py-5 glass-card"><i className="fas fa-film fa-5x mb-4" style={{ color: '#333' }}></i><h3 className="text-secondary">No movies found</h3></div> :
                 <div className="row g-4">
                    {movies.map(movie => <div key={movie.id} className="col-6 col-md-4 col-lg-3 col-xl-2"><MovieCard movie={movie} /></div>)}
                </div>}
            </div>
        </div>
    );
};

export default Movies;
