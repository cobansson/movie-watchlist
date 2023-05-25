let moviesDataArr;
let chosenMoviesArr;
const moviesListSection = document.getElementById("movies-list");
const searchForm = document.getElementById("movie-search-form");

searchForm.addEventListener("submit", getMovieInfo);

document.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    addToWatchList(e.target.dataset.id);
  }
});

async function getMovieInfo(e) {
  const searchMovieInput = document.getElementById("search-movie-input");
  e.preventDefault();
  const IDUrl = `https://www.omdbapi.com/?s=${searchMovieInput.value}&apikey=ee3a6cb9`;
  const responseUrl = await fetch(IDUrl);
  const dataID = await responseUrl.json();
  if (
    dataID.Error == "Incorrect IMDb ID." ||
    dataID.Error == "Movie not found!"
  ) {
    moviesListSection.innerHTML = `<img src="images/unable.png" class="start-exploring-img" />`;
  } else {
    const imdbID = dataID.Search.map((movie) => {
      return movie.imdbID;
    });
    const moviesResponses = await Promise.all(
      imdbID.map((movieID) => {
        return fetch(`https://www.omdbapi.com/?i=${movieID}&apikey=ee3a6cb9`);
      })
    );
    const moviesDatas = await Promise.all(
      moviesResponses.map((data) => {
        return data.json();
      })
    );
    moviesDataArr = moviesDatas;
    renderMovieListHtml();
  }
  searchMovieInput.value = "";
}

function renderMovieListHtml() {
  const movieHtml = moviesDataArr
    .map((movie) => {
      return `
  <div class="movie-slot">
      <img src="${movie.Poster}" class="movie-img">
      <div class="movie-name-and-info-section">
          <div class="movie-name-section">
              <h4>${movie.Title}</h4>
              <img src="images/star-icon.png" class="star-img">
              <p>${movie.imdbRating}</p>
          </div>
          <div class="movie-info">
              <p>${movie.Runtime}</p>
              <p>${movie.Genre}</p>
              <div class="add-watchlist">
                  <button class="add-watchlist-btn" data-id="${movie.imdbID}">Add to Watchlist</button>
              </div>
          </div>
          <h6>${movie.Plot}</h6>
      </div>
  </div>
  <hr>
  `;
    })
    .join("");
  moviesListSection.innerHTML = movieHtml;
}

function addToWatchList(id) {
  const dataFromStorage = JSON.parse(localStorage.getItem("chosenMovie"));
  if (dataFromStorage) {
    chosenMoviesArr = dataFromStorage;
  } else {
    chosenMoviesArr = [];
  }

  const movieExists = chosenMoviesArr.some((movie) => movie.imdbID === id);

  if (!movieExists) {
    const selectedMovie = moviesDataArr.find((movie) => movie.imdbID === id);
    if (selectedMovie) {
      chosenMoviesArr.push(selectedMovie);
      localStorage.setItem("chosenMovie", JSON.stringify(chosenMoviesArr));
    }
  }
}
