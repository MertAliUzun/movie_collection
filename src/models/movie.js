import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  watchDate: { type: Date, required: false },
  userScore: { type: String, required: false },
});

const MovieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  directorName: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  watched: { type: Boolean, required: true },
  user: { type: UserSchema, required: false },
  imageLink: { type: String, required: false }, // Yeni alan: Film görseli
});

const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export default Movie;
