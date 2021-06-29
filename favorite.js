const BASE_URL = "https://movie-list.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/v1//movies/";
const POSTER_URL = BASE_URL + "posters/";
const MOVIES_PER_PAGE = 12;

const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-submit");
const inputForm = document.querySelector("#inlineFormInputGroupUsername");

function renderMovieList(dataArr) {
  let rawHTML = "";
  dataArr.forEach((element) => {
    rawHTML += `
         <div class="card col-sm-3 mb-3 card-item" style="width: 18rem">
            <img
              src="${POSTER_URL + element["image"]}"
              class="card-img-top"
              alt="movie-img"
            />
            <div class="card-body">
              <h5 class="card-title">${element["title"]}</h5>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id = '${element["id"]}'
                >
                  More
                </button>
                <button class="btn btn-danger btn-delete-favorite" data-id = '${element["id"]
      }'>X</button>
              </div>
            </div>
          </div>
    `;
    dataPanel.innerHTML = rawHTML;
  });
}

function getMovieInformation(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalRealseDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then(function (response) {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalImage.src = POSTER_URL + data.image;
    modalRealseDate.innerText = "Realse Date: " + data.release_date;
    modalDescription.innerText = data.description;
  });
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getMoviesListByPages(page) {
  // const data = matchedMovies.length ? matchedMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function deleteMovieFromFavorite(id) {
  const removedMovieIndex = JSON.stringify(
    movies.findIndex((movie) => movie.id === id)
  );
  const page = Math.ceil(Number(removedMovieIndex) / MOVIES_PER_PAGE)
  movies.splice(removedMovieIndex, 1);
  localStorage.setItem("favoriteMovies", movies);
  renderMovieList(getMoviesListByPages(page));
  renderPaginator(movies.length);
}

dataPanel.addEventListener("click", function openMoviedescription(event) {
  if (event.target.matches(".btn-show-movie")) {
    getMovieInformation(Number(event.target.dataset["id"]));
  } else if (event.target.matches(".btn-delete-favorite")) {
    deleteMovieFromFavorite(Number(event.target.dataset["id"]));
  }
});

paginator.addEventListener(
  "click",
  function renderPagebyclickedPaginator(event) {
    if (event.target.tagName !== "A") return;
    const page = Number(event.target.dataset.page);
    renderMovieList(getMoviesListByPages(page));
  }
);

renderMovieList(getMoviesListByPages(1));
renderPaginator(movies.length);