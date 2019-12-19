let main = document.getElementById('main');

/*
tabClicked is a string with a value of 'TV Shows' or 'Movies'
    - this helps to identify the card in order to set the correct class.

name is a string with a value of 'name' or 'title'
    - this is to pull correct image as the ending is different for movies and TV shows.

item is the object with all the data
*/
function TabLink(tabClicked, name, item) {
    this.name = tabClicked,
    this.image = item.poster_path,
    this.headerImage = item.backdrop_path
    this.title = item[`original_${name}`],
    this.description = item.overview
}

TabLink.prototype.displayData = function() {
    // create new div
    let newDiv = document.createElement('div');
    // add class to new div
    newDiv.classList.add('card-container');

    // add class of 'tv' or 'movie depending on this.nam
    (this.name === 'Movies') ? newDiv.classList.add('movie') : newDiv.classList.add('tv');
    // hide all 'tv' cards to start so only 'movies' are showing
    (this.name === 'Movies') ? '' : newDiv.classList.add('hidden');

    // insert data into new div created
    newDiv.innerHTML = `
        <img src=https://image.tmdb.org/t/p/w500${this.image} alt=${this.title} />
        <h3>${this.title}</h3>
        <div class="hidden">
            <p>${this.description}</p>
        </div>`;

    //add new div to main selected on line 1
    main.appendChild(newDiv);
}

TabLink.prototype.displayHeader = function() {
    const header = document.querySelector('.header');
    const spans = document.querySelectorAll('span');
    let name = this.name;

    // randomly gets a number less then 20
    function randomNumber() {
        let num = Math.floor(Math.random() * 30)
        if(num < 20) {
            return num;
        } else {
            //if num is greater then 20 return 0 since api only has 20 items
            return 0;
        }
    }

    // select the correct name to input into the url
    function filter() {
        if(name === "TV Shows") {
            return 'tv';
        } else {
            return 'movie'
        }
    }


    fetch(`https://api.themoviedb.org/3/discover/${filter()}?sort_by=popularity.desc&api_key=28bcb8df3f4aae9a5610c4c7c1373262`)
        .then(res => res.json())
        .then(function(data) {
            //set background to random image using the random number function
            header.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${data.results[randomNumber()].backdrop_path}')`;
            //sets span input to dynamically change depending on opened tab.
            spans.forEach(span => span.innerText = name);
        })
}

// declared outside of function to be used in clickHandler.
let tvShows = [];
function fetchTvShows() {
    fetch('https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=28bcb8df3f4aae9a5610c4c7c1373262')
        .then(res => res.json())
        .then(res => {
            // declared outside of forEach to be used to call displayHeader()
            let tvShow;
            res.results.forEach(item => {
                // setting the variable tvShow to the new TabLink for each item.
                tvShow = new TabLink('TV Shows', 'name', item);
                // push each item to the empty array variable tvShows.
                tvShows.push(tvShow);
                //call displayData() to render data.
                tvShow.displayData();
            })

            //call displayData() to render header.
            tvShow.displayHeader();
        })
        .catch(err => console.log(err.message));
}

// declared outside of function to be used in clickHandler.
let movies = [];
function fetchMovies() {
    fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=28bcb8df3f4aae9a5610c4c7c1373262')
        .then(res => res.json())
        .then(res => {
            // declared outside of forEach to be used to call displayHeader()
            let movie;
            res.results.forEach(item => {
                // setting the variable movies to the new TabLink for each item.
                movie = new TabLink('Movies', 'title', item);
                // push each item to the empty array variable movies.
                movies.push(movie);
                //call displayData() to render data.
                movie.displayData();
            })

            //call displayHeader() to render header.
            movie.displayHeader();
        })
        .catch(err => console.log(err.message));
}

function toggleDescription(e) {
    // adds class of 'card-description' to the div around the paragraph to toggle.
    e.currentTarget.lastChild.classList.toggle('card-description')
}


function clickHandler(e) {
    // add or remove class of hidden to display correct cards
    if(e.target.innerText === 'Top Movies') {
        cardContainer.forEach(card => {
            (card.classList.contains('movie')) ? card.classList.remove('hidden') : card.classList.add('hidden');
        })
        //call display header to randomly select new image and change span tag inner text.
        movies[0].displayHeader();
    } else {
        cardContainer.forEach(card => {
            (card.classList.contains('tv')) ? card.classList.remove('hidden') : card.classList.add('hidden');
        })
        //call display header to randomly select new image and change span tag inner text.
        tvShows[0].displayHeader();
    }
}

let cardContainer;
// wrapped in setTimeout to wait until data is fetched to insure that 'card-container' items have rendered.
setTimeout(() => {

cardContainer = document.querySelectorAll('.card-container');
cardContainer.forEach(card => {
    card.addEventListener('mouseenter', toggleDescription)
    card.addEventListener('mouseleave', toggleDescription)
    })

}, 500);

// add a click handler to each li for movie or tv.
let links = document.querySelectorAll('.tab-link')
                    .forEach(link => 
                        link.innerText === 'Top Movies' 
                        ? link.addEventListener('click', clickHandler)
                        : link.addEventListener('click', clickHandler)
                    ); 

// used setTimeout to insure fetch movies is rendered last to always show movies on load.
setTimeout(() => {
    fetchTvShows();

    setTimeout(() => {
        fetchMovies();
    }, 10);

}, 10);


