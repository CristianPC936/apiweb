const apiKey = '3e50390d693a9fc21120477366de4763'; 
let selectedGenres = '';
let totalPages = 1;


const genreSelect = document.getElementById('genreSelect');
const movieList = document.getElementById('movieList');
const toggleLanguageButton = document.getElementById('toggleLanguage');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
let currentLanguage = 'en';
let currentPage = 1;

async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${currentLanguage}&api_key=${apiKey}`);
        const data = await response.json();

        genreSelect.innerHTML = '';

        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });

        const label = document.querySelector('label[for="genreSelect"]');
        label.textContent = currentLanguage === 'en' ? 'Select a genre:' : 'Selecciona un género:';
    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }
}

async function fetchMovies(page = 1) {
    try {
        const url = `https://api.themoviedb.org/3/movie/popular?language=${currentLanguage}&api_key=${apiKey}&page=${page}&with_genres=${selectedGenres}`;
        const response = await fetch(url);
        const data = await response.json();

        movieList.innerHTML = '';

        const movies = data.results.slice(0, 10);
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
                <h2>${movie.title}</h2>
                <p>${movie.overview}</p>
            `;
            movieList.appendChild(card);
        });

        currentPage = page;
        totalPages = data.total_pages;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    } catch (error) {
        console.error('Error al cargar películas populares:', error);
    }
}

genreSelect.addEventListener('change', () => {
    selectedGenres = genreSelect.value;
    fetchMovies();
});

toggleLanguageButton.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    fetchGenres(); 
    fetchMovies();
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchMovies(currentPage - 1);
    }
});

nextPageButton.addEventListener('click', () => {
    fetchMovies(currentPage + 1);
});

fetchGenres();
fetchMovies();
