const updatedData = JSON.parse(localStorage.getItem("chosenMovie"));
const watchlistSection = document.getElementById("movies-list");
let watchListArr;

document.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    removeFromWatchList(e.target.dataset.id);
  }
});

if (updatedData) {
  watchListArr = updatedData;
}

function renderWatchlistHtml() {
  if (watchListArr.length > 0) {
    const watchlistHtml = watchListArr
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
                      <button class="remove-watchlist-btn" data-id="${movie.imdbID}">Remove From Watchlist</button>
                  </div>
              </div>
              <h6>${movie.Plot}</h6>
          </div>
      </div>
      <hr>
      `;
      })
      .join("");
    watchlistSection.innerHTML = watchlistHtml;
  } else {
    watchlistSection.innerHTML = `
    <div class="">
      <img src="images/empty.png" class="empty-image"/>
      <a href="index.html" target="_blank" class="add-movie-tag">Let's add some!</a>
    </div>
    `;
  }
}

function removeFromWatchList(id) {
  const filtered = watchListArr.filter((movie) => {
    return movie.imdbID !== id;
  });
  watchListArr = filtered;
  localStorage.setItem("chosenMovie", JSON.stringify(watchListArr));
  renderWatchlistHtml();
}

renderWatchlistHtml();
