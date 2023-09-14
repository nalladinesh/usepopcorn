import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { type } from "@testing-library/user-event/dist/type";

/*
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
*/

const average = (arr) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

const KEY = "f55f1e7e";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [movieData, setMovieData] = useState({});
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function() {
  //   const getWatched = localStorage.getItem('watched')
  //   return JSON.parse(getWatched)
  // });

  const [watched, setWatched] = useState(() =>
    JSON.parse(localStorage.getItem("watched"))
  );

  
  // const tempQuery = 'joker'
  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=joker
  // `)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);
  //`http://www.omdbapi.com/?s=${query}&apikey=${KEY}`
  //

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();

          if (!res.ok) throw new Error("Something went wrong fetching movies");

          if (data.Response === "False")
            throw new Error("Failed to fetch movie");

          setMovies(data.Search);

          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  function handleAddWatched(data) {
    setWatched((movie) => [...movie, data]);
  }

  function handleRemoveWatched(imdbID) {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== imdbID));
  }

  function handleDisplayMovieDetails(id) {
    async function getMovieDetails() {
      setIsMovieLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}
      `);
      const data = await res.json();

      setMovieData(data);
      setIsMovieLoading(false);
    }
    setSelectedId((currId) => (currId === id ? null : id));
    getMovieDetails();
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onDisplayMovieDetails={handleDisplayMovieDetails}
            />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {/* {selectedId && !isMovieLoading && } */}
          {selectedId ? (
            !isMovieLoading ? (
              <MovieDetails
                movieData={movieData}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <Loader />
            )
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading....</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.key === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onDisplayMovieDetails }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onDisplayMovieDetails={onDisplayMovieDetails}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onDisplayMovieDetails }) {
  return (
    <li onClick={onDisplayMovieDetails.bind(null, movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ movieData, onCloseMovie, onAddWatched, watched }) {
  const [userRating, setUserRating] = useState("");
  const {
    Title: title,
    Poster: poster,
    Actors: actors,
    Plot: plot,
    imdbID,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Director: director,
    Genre: genre,
  } = movieData;

  const countRef = useRef(0)

  useEffect(function() {
    userRating && countRef.current++
  }, [userRating])

  const isWatched = watched.map((movie) => movie.imdbID).includes(imdbID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === imdbID
  )?.userRating;

  function handleAdd() {
    const watchedMovie = {
      imdbID,
      imdbRating: Number(imdbRating),
      userRating,
      title,
      runtime: Number(runtime.split(" ").at(0)),
      poster,
      countRef
    };

    onAddWatched(watchedMovie);

    onCloseMovie();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function closeOnEsc(e) {
        if (e.key === "Escape") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", closeOnEsc);

      return function () {
        document.removeEventListener("keydown", closeOnEsc);
      };
    },
    [onCloseMovie]
  );

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating maxRating={10} onMovieRating={setUserRating} />
              {userRating && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p>
              You rated this movie {watchedUserRating} <span>⭐</span>{" "}
            </p>
          )}
        </div>
        <p>
          <em>{plot} </em>
        </p>
        <p>Starring {actors} </p>
        <p>Directed by {director} </p>
      </section>
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  const rating = {
    imdbRating: avgImdbRating,
    userRating: avgUserRating,
    runtime: avgRuntime,
  };

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <RatingNRuntime>{rating}</RatingNRuntime>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onRemoveWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onRemoveWatched }) {
  const { poster, title, imdbID } = movie;

  return (
    <li>
      <button
        className="btn-delete"
        onClick={onRemoveWatched.bind(null, imdbID)}
      >
        x
      </button>
      <img src={poster} alt={`${title} poster`} />
      <h3>{title}</h3>
      <RatingNRuntime movie={movie}>{movie}</RatingNRuntime>
    </li>
  );
}

function RatingNRuntime({ children }) {
  const { imdbRating, userRating, runtime } = children;

  return (
    <div>
      <p>
        <span>⭐️</span>
        <span>{Number(imdbRating).toFixed(1)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{Number(userRating).toFixed(1)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{Number(runtime).toFixed(1)} min</span>
      </p>
    </div>
  );
}
