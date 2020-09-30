const express = require('express')
const mongoose = require('mongoose');
const MovieItem = require('./models/movieItem.js');
const fetch = require('node-fetch');
let query = ""
var moviesArr = []
var newItem



const app = express()
const port = 3001
require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect(process.env.uridb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log("databse connected")
        app.listen(process.env.PORT || port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    })
    .catch(err => console.log(err))

app.set('view engine', 'ejs')
app.use(express.static('public'))

let page = 1

app.get('/', (req, res) => {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.apiKey}&page=${page} `)
        .then(res => res.json())
        .then(json => {
            data = json.results;
            res.status(200).render('index', { movies: data})
        })
        .catch(err => console.log(err))
})

app.get('/details/:id', (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.apiKey}&language=en-US`)
        .then(res => res.json())
        .then(json => {
            data = json;
            res.status(200).render('details', { details: data })
        })
        .catch(err => console.log(err))
})

app.get('/details/:id/add', (req, res) => {
    console.log('add ' + req.params.id)
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.apiKey}&language=en-US`)
        .then(res => res.json())
        .then(json => {
            data = json;
            newItem = new MovieItem({
                poster_path: data.poster_path,
                original_title: data.original_title,
                overview: data.overview,
                release_date: data.release_date,
                genres: data.genres,
                id: data.id,
                vote_average: data.vote_average,
                popularity: data.popularity
            })
            newItem.save()
            res.status(200).redirect('/myShows')
    })
    .catch(err => console.log(err))
})

app.get('/myShows', (req, res) => {
    MovieItem.find()
        .then(result => {
            res.status(200).render('myShows', { movies: result })
        })
        .catch(err => console.log(err))
})

app.get('/detailsDb/:id', (req, res) => {
    MovieItem.findById(req.params.id)
        .then(result => {
            console.log(result.genres)
            res.status(200).render('detailsDb', { details: result })
        })
        .catch(err => console.log(err))
})

app.get('/details/:id/delete', (req, res) => {
    console.log(`delete ` + req.params.id)
       MovieItem.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(200).redirect('/myShows')
        })
        .catch(err => console.log(err))
})

app.post('/search', (req, res) => {
    query = req.body.search
    console.log(query)
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.apiKey}&language=en-US&query=${query}&page=1&include_adult=false`)
        .then(res => res.json())
        .then(json => {
            data = json.results;
            console.log(data)
            res.status(200).render('search', { movies: data})
        })
        .catch(err => console.log(err))
})
