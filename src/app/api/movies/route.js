import connectMongo from "../../../libs/dbConnect";
import Movie from "../../../models/movie";

export async function POST(req) {
  await connectMongo();
  const id = new URL(req.url).searchParams.get("id");
  const filmData = await req.json();

  if (id) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(id, filmData, {
        new: true,
        runValidators: true,
      });
      return new Response(JSON.stringify(updatedMovie), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: "error" }), {
        status: 500,
      });
    }
  } else {
    try {
      const savedMovie = await Movie.create(filmData);
      return new Response(JSON.stringify(savedMovie), { status: 200 });
    } catch (error) {
      console.error("Error creating movie:", error.message);
      return new Response(JSON.stringify({ message: "error" }), {
        status: 500,
      });
    }
  }
}

export async function GET(req) {
  await connectMongo();
  
  // Extract the user info (e.g., from a cookie, header, or query param)
  const userName = req.headers.get("clientName"); // Adjust based on how you send the logged-in user's name
  if (!userName) {
    return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
  }

  try {
    // Fetch movies associated with the logged-in user
    const movies = await Movie.find({ userName: userName });
    return new Response(JSON.stringify(movies), { status: 200 });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return new Response(JSON.stringify({ message: "Error fetching movies" }), { status: 500 });
  }
}
// DELETE handler
export async function DELETE(req) {
    await connectMongo();
    const id = new URL(req.url).searchParams.get("id");
  
    if (!id) {
      return new Response(JSON.stringify({ message: "Movie ID is required" }), {
        status: 400,
      });
    }
  
    try {
      await Movie.findByIdAndDelete(id);
      return new Response(JSON.stringify({ message: "Movie deleted successfully" }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error deleting movie:", error);
      return new Response(JSON.stringify({ message: "error" }), { status: 500 });
    }
  }
