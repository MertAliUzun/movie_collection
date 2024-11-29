import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

export default function MovieForm({ watched, onSubmit, onClose, movie }) {
  const [movieName, setMovieName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [watchDate, setWatchDate] = useState("");
  const [userScore, setUserScore] = useState(0); // Star rating state
  const [hoveredStar, setHoveredStar] = useState(null); // Track hovered star
  const [imageLink, setImageLink] = useState(null); // Store the image URL
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [searchTerm, setSearchTerm] = useState(""); // Movie search term
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [searchTimeout, setSearchTimeout] = useState(null); // Timeout for API call
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize form fields if editing an existing movie
  useEffect(() => {
    if (movie) {
      setMovieName(movie.movieName || "");
      setDirectorName(movie.directorName || "");
      setReleaseDate(movie.releaseDate ? movie.releaseDate.split("T")[0] : "");
      setWatchDate(
        movie.user?.watchDate ? movie.user.watchDate.split("T")[0] : ""
      );
      setUserScore(
        movie.user?.userScore ? parseInt(movie.user.userScore, 10) : 0
      );
      setImageLink(movie.imageLink || "");
    }
  }, [movie]);

  const handleStarClick = (score) => {
    setUserScore(score);
  };

  const handleStarHover = (score) => {
    setHoveredStar(score);
  };

  const handleStarLeave = () => {
    setHoveredStar(null);
  };

  // Function to handle image upload to Cloudinary with progress
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; // Get the first file
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "movies"); // Replace with your Cloudinary upload preset

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dper5kp88/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentage);
            }
          },
        }
      );

      if (res.data.secure_url) {
        setImageLink(res.data.secure_url);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const movieData = {
      movieName,
      directorName,
      releaseDate,
      watched,
      imageLink,
      ...(watched && {
        user: {
          watchDate: watchDate || undefined,
          userScore: userScore ? String(userScore) : undefined,
        },
      }),
    };

    onSubmit(movieData);
    resetForm();
  };

  const resetForm = () => {
    setMovieName("");
    setDirectorName("");
    setReleaseDate("");
    setWatchDate("");
    setUserScore(0);
    setImageLink(null);
    setUploadProgress(0);
    setSearchTerm("");
    setSearchResults([]);
    setIsModalOpen(false);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    if (value.length >= 2) {
      setSearchTimeout(
        setTimeout(() => {
          fetchMovieSuggestions(value);
        }, 2000)
      );
    } else {
      setSearchResults([]);
    }
  };

  const fetchMovieSuggestions = async (query) => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?s=${query}&type=movie&apikey=80523389`
      ); // Replace `your_api_key` with your actual OMDB API key

      if (res.data.Search) {
        setSearchResults(res.data.Search);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching movie suggestions:", error);
      setSearchResults([]);
    }
  };

  const handleMovieSelect = async (movie) => {
    setSearchTerm(movie.Title);
    setSearchResults([]);
    setIsModalOpen(false); // Close the modal when a movie is selected

    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=80523389`
      ); // Replace `your_api_key` with your actual OMDB API key

      if (res.data) {
        setMovieName(res.data.Title || "");
        setDirectorName(res.data.Director || "");
        setReleaseDate(
          res.data.Released
            ? new Date(res.data.Released).toISOString().split("T")[0]
            : ""
        );
        setImageLink(res.data.Poster || "");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <div className="form-overlay">
      <form className="movie-form" onSubmit={handleSubmit}>
        <h2>
          {movie
            ? "Edit Movie"
            : watched
            ? "Add to Collection"
            : "Add to Wishlist"}
        </h2>

        <label>
          <span>Search Movie</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInput}
            placeholder="Search for a movie..."
            onFocus={() => setIsModalOpen(true)} // Open modal when input is focused
          />
        </label>

        {/* Modal Popup for Search Results */}
        {isModalOpen && searchResults.length > 0 && (
          <div className="search-modal">
            <ul className="dropdown-menu">
              {searchResults.map((result) => (
                <li
                  key={result.imdbID}
                  onClick={() => handleMovieSelect(result)}
                >
                  {result.Title} ({result.Year})
                </li>
              ))}
            </ul>
          </div>
        )}

        <label>
          <span>Movie Name</span>
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Enter movie name"
            required
          />
        </label>

        <label>
          <span>Director Name</span>
          <input
            type="text"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            placeholder="Enter director name"
            required
          />
        </label>

        <label>
          <span>Release Date</span>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </label>

        {watched && (
          <>
            <label>
              <span>Watch Date</span>
              <input
                type="date"
                value={watchDate}
                onChange={(e) => setWatchDate(e.target.value)}
              />
            </label>

            <label>
              <span>User Score</span>
              <div className="star-rating">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    className={
                      star <= (hoveredStar ?? userScore)
                        ? "star selected"
                        : "star"
                    }
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  />
                ))}
              </div>
            </label>
          </>
        )}

        <label>
          <span>Upload Movie Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadProgress > 0 && uploadProgress < 100}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <span>Uploading... {uploadProgress}%</span>
              <progress value={uploadProgress} max="100" />
            </div>
          )}
          {imageLink && (
            <div>
              <span>Uploaded Image: </span>
              <img
                src={imageLink}
                alt="Movie poster"
                width={100}
                height={500}
                className="center-image"
              />
            </div>
          )}
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!movie && uploadProgress < 100}>
            {movie ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
