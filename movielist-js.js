const BASE_URL = "https://movie-list.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/v1//movies/";
const POSTER_URL = BASE_URL + "posters/";
const movies = [];
let matchedMovies = [];
const MOVIES_PER_PAGE = 12;

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-submit");
const inputForm = document.querySelector("#inlineFormInputGroupUsername");
const paginator = document.querySelector("#paginator");

function renderMovieListInViewStyleApps(dataArr) {
  let rawHTML = "";
  dataArr.forEach((element) => {
    rawHTML += `
         <div class="card col-sm-3 mb-3 card-item" style="width: 18rem" id="apps">
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
                <button class="btn btn-info btn-add-favorite" data-id = '${element["id"]
      }'>+</button>
              </div>
            </div>
          </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderMovieListInViewStyleList(dataArr) {
  let rawHTML = "";
  dataArr.forEach((element) => {
    rawHTML += `
    <div class='d-flex flex-row justify-content-between align-items-center' id="list">
      <h5 class="list-title">${element["title"]}</h5>
      <div>
        <button
          class="btn btn-primary btn-show-movie"
          data-bs-toggle="modal"
          data-bs-target="#movie-modal"
          data-id = '${element["id"]}'
        >
        More
        </button>
        <button class="btn btn-info btn-add-favorite" data-id = '${element["id"]}'>+</button>
      </div>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
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

function addMovieToFavorite(id) {
  const movie = movies.find((movie) => movie.id === id);
  const favoriteMovieList =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  if (favoriteMovieList.some((movie) => movie.id === id)) {
    return alert("This movie is already in favorite list.");
  }
  favoriteMovieList.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovieList));
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
  const data = matchedMovies.length ? matchedMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPageByAppsOrList(page) {
  if (dataPanel.querySelector("#apps")) {
    renderMovieListInViewStyleApps(getMoviesListByPages(page));
  } else if (dataPanel.querySelector("#list")) {
    renderMovieListInViewStyleList(getMoviesListByPages(page));
  }
}

axios
  .get(INDEX_URL)
  .then(function (response) {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieListInViewStyleApps(getMoviesListByPages(1));
  })
  .catch(function (error) {
    console.log(error);
  });

dataPanel.addEventListener("click", function openMoviedescription(event) {
  if (event.target.matches(".btn-show-movie")) {
    getMovieInformation(Number(event.target.dataset["id"]));
  } else if (event.target.matches(".btn-add-favorite")) {
    addMovieToFavorite(Number(event.target.dataset["id"]));
  }
});

searchForm.addEventListener("submit", function onSearchinfMovie(event) {
  const searchInput = event.target.querySelector("input");
  const keyword = searchInput.value.trim().toLowerCase();

  event.preventDefault();
  matchedMovies = []; //搜尋清單
  matchedMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  if (matchedMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }
  renderPaginator(matchedMovies.length);
  renderPageByAppsOrList(1);
});

searchForm.addEventListener("click", function movielistViewStyleChange(event) {
  const id = event.target.id;
  const page =
    Math.ceil(
      matchedMovies.findIndex(
        (element) =>
          element.id ===
          Number(
            dataPanel.querySelector("div button.btn-show-movie").dataset.id
          )
      ) / MOVIES_PER_PAGE
    ) + 1; //using first movie per page to calculage page number
  if (id === "view-style-apps") {
    renderMovieListInViewStyleApps(getMoviesListByPages(page));
  } else if (id === "view-style-list") {
    renderMovieListInViewStyleList(getMoviesListByPages(page));
  }
});

paginator.addEventListener(
  "click",
  function renderPagebyclickedPaginator(event) {
    if (event.target.tagName !== "A") return;
    const page = Number(event.target.dataset.page);
    renderPageByAppsOrList(page);
  }
);
