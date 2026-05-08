import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <h5><i className="fas fa-film me-2"></i>CineVerse Pro</h5>
                        <p className="text-secondary mt-3">Your ultimate destination for streaming the best movies and TV shows.</p>
                        <div className="social-links mt-4">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h5>Browse</h5>
                        <Link to="/movies">All Movies</Link>
                        <Link to="/movies?category=trending">Trending</Link>
                        <Link to="/movies?category=top_rated">Top Rated</Link>
                        <Link to="/movies?category=newest">New Releases</Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h5>Genres</h5>
                        <Link to="/movies?genre=Action">Action</Link>
                        <Link to="/movies?genre=Drama">Drama</Link>
                        <Link to="/movies?genre=Sci-Fi">Sci-Fi</Link>
                        <Link to="/movies?genre=Comedy">Comedy</Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h5>Account</h5>
                        <Link to="/profile">Profile</Link>
                        <Link to="/watchlist">My List</Link>
                        <Link to="/login">Sign In</Link>
                        <Link to="/register">Sign Up</Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h5>Support</h5>
                        <a href="#">Help Center</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Contact Us</a>
                    </div>
                </div>
                <hr className="bg-secondary my-4" />
                <div className="text-center text-secondary">
                    <p>&copy; 2024 CineVerse Pro. All rights reserved. Made with for movie lovers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
