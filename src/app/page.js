"use client";

import { useState, useEffect } from "react";
import MovieForm from "@/components/MovieForm";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("collection");
  const [showForm, setShowForm] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [sortOption, setSortOption] = useState("movieName"); // Sorting criteria
  const [sortDirection, setSortDirection] = useState("ascending"); // Sorting direction (ascending/descending)

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("/api/movies");
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Sorting function based on selected option and direction
  const sortMovies = (movies, option, direction) => {
    return movies.sort((a, b) => {
      let comparison = 0;

      if (option === "userScore") {
        comparison = b.user?.userScore - a.user?.userScore; // Sort by user score
      } else if (option === "watchDate") {
        comparison = new Date(b.user?.watchDate) - new Date(a.user?.watchDate); // Sort by watch date
      } else if (option === "releaseDate") {
        comparison = new Date(b.releaseDate) - new Date(a.releaseDate); // Sort by release date
      } else if (option === "movieName") {
        comparison = a.movieName.localeCompare(b.movieName); // Sort by movie name
      } else if (option === "directorName") {
        comparison = a.directorName.localeCompare(b.directorName); // Sort by director name
      }

      // If sorting in descending order, flip the comparison result
      return direction === "ascending" ? comparison : -comparison;
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddMovie = async (newMovie) => {
    const params = currentMovie ? { id: currentMovie._id } : null;

    try {
      await axios({
        method: "post",
        url: "/api/movies",
        data: newMovie,
        params,
      });
      setShowForm(false);
      setCurrentMovie(null);
      fetchMovies();
    } catch (error) {
      console.error("Error adding/editing movie:", error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`/api/movies?id=${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const renderStars = (score) => {
    const userScore = score ? parseInt(score, 10) : 0;
    return (
      <div className="star-rating">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
          <FaStar
            key={star}
            size={52}
            className={star <= userScore ? "star selected" : "star"}
            style={{ pointerEvents: "none" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <button
          className={`nav-button ${activeTab === "collection" ? "active" : ""}`}
          onClick={() => handleTabClick("collection")}
        >
          Collection
        </button>
        <button
          className={`nav-button ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => handleTabClick("wishlist")}
        >
          Wishlist
        </button>
      </nav>

      {/* Sorting Dropdown */}
      {activeTab === "collection" ? (
      <div className="sort">
        <div className="sort-options">
          <label htmlFor="sortBy" className="sortBy">Sort By:</label>
          <select
            id="sortBy"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="movieName">Movie Name</option>
            <option value="directorName">Director Name</option>
            <option value="releaseDate">Release Date</option>
            <option value="watchDate">Watch Date</option>
            <option value="userScore">User Score</option>
          </select>
        </div>
        </div>
        ) : (

          <div className="sort">
          <div className="sort-options">
            <label htmlFor="sortBy" className="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="movieName">Movie Name</option>
              <option value="directorName">Director Name</option>
              <option value="releaseDate">Release Date</option>
            </select>
          </div>
          </div>
        )}

        
        {/* Sorting Direction Dropdown */}
        <div className="sort">
        <div className="sort-direction">
          <label htmlFor="sortDirection" className="sortBy">Direction:</label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === "collection" ? (
          <div>
            <h1>Collection</h1>
            {sortMovies(
              movies.filter((movie) => movie.watched),
              sortOption,
              sortDirection
            ).map((movie) => (
              <div key={movie._id} className="movie-card">
                {movie.imageLink && (
                  <img
                    src={movie.imageLink}
                    alt={movie.movieName}
                    className="movie-image"
                  />
                )}
                <div className="movie-info">
                  {movie.user && renderStars(movie.user.userScore)}
                  <div className="container display: flex mt-3">
                    <div className="movie-header">
                      <h2 className="mb-5" >
                        {movie.movieName}
                      </h2>
                      <p className="mt-3" >
                        {movie.directorName}
                      </p>
                    </div>
                    <div className="movie-details">
                      <p>
                        Release Date:{" "}
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </p>
                      {movie.user && (
                        <p>
                          Watch Date:{" "}
                          {new Date(
                            movie.user.watchDate || ""
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="movie-card-actions">
                  <button
                    className="edit-movie-button"
                    onClick={() => {
                      setCurrentMovie(movie);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit size={window.innerWidth <= 768 ? 50 :30} />
                  </button>
                  <button
                    className="delete-movie-button"
                    onClick={() => handleDeleteMovie(movie._id)}
                  >
                    <FaTrash size={window.innerWidth <= 768 ? 50 :30} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>Wishlist</h1>
            {sortMovies(
              movies.filter((movie) => !movie.watched),
              sortOption,
              sortDirection
            ).map((movie) => (
              <div key={movie._id} className="movie-card">
                {movie.imageLink && (
                  <img
                    src={movie.imageLink}
                    alt={movie.movieName}
                    className="movie-image"
                  />
                )}
                <div className="movie-info">
                  <div className="container display: flex mt-3">
                    <div className="movie-header-wish">
                      <h2 className="mb-5">
                        {movie.movieName}
                      </h2>
                      <p
                        className="mt-5"
                        
                      >
                        {movie.directorName}
                      </p>
                    </div>
                    <div className="movie-details-wish">
                      <p>
                        Release Date:{" "}
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="movie-card-actions">
                  <button
                    className="edit-movie-button"
                    onClick={() => {
                      setCurrentMovie(movie);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit size={window.innerWidth <= 768 ? 50 :30} />
                  </button>
                  <button
                    className="delete-movie-button"
                    onClick={() => handleDeleteMovie(movie._id)}
                  >
                    <FaTrash size={window.innerWidth <= 768 ? 50 :30} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Movie Button */}
      <button
        className="add-movie-button"
        onClick={() => {
          setCurrentMovie(null);
          setShowForm(true);
        }}
      >
        +
      </button>

      {/* Movie Form Modal */}
      {showForm && (
        <MovieForm
          watched={activeTab === "collection"}
          onSubmit={handleAddMovie}
          onClose={() => {
            setShowForm(false);
            setCurrentMovie(null);
          }}
          movie={currentMovie}
        />
      )}
    </div>
  );
}
