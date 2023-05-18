const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/routes-guard')
const moviesApiHandler = require('../services/moviesByName-api.service')
const Movie = require('../models/Movie.model');
const List = require('../models/List.model')

const capitalize = require('../utils/capitalize');

router.get("/search", (req, res, next) => {
    res.render('movies/movies-search')
})

router.post("/search", (req, res, next) => {

    const { title } = req.body

    moviesApiHandler
        .findMovieByName(title)
        .then(({ data }) => {
            let movies = data.results.filter(movie=> !movie.genre_ids.includes(16))
            res.render('movies/movies-list', { movies, title })
        })
        .catch(err => next(err)) 
})

router.all("/:id", (req, res, next) => {
    const { id } = req.params
    const { API_KEY_MAPS: mapsKey } = process.env

    const owner = req.session.currentUser?._id

    Movie
    .findOne({movie_ID:{$eq: id}})
    .populate('markers')
    .then(response => {
        console.log("----------------POPULATED MOVIE--------------", response)
        if(response) {
            List.find({ owner })
            .then(listResponse => {
                res.render('movies/movies-detail', { movieData: response, mapsKey, moviesList: listResponse })
            })
        }
        if(!response){
            moviesApiHandler
            .findMovieByID(id)
            .then(({ data }) => {   
                const {title, genres, overview, poster_path, release_date, markers, id: movie_ID} = data
                Movie
                .create({title, genres, overview, poster_path, release_date, markers, movie_ID})
                .populate('markers')
                .then(movieResponse =>{

                    List.find({ owner })
                        res.render('movies/movies-detail', { movieData: movieResponse, mapsKey })
                    })
                .catch( err => next(err) )
            })
            .catch(err => next(err))
        }
    })
    .catch(err=>next(err))
})

module.exports = router