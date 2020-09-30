const mongoose = require('mongoose')
const { Schema } = mongoose;

const movieItemSchema = new Schema(
    {
        original_title: {
            type: String,
            required: true
        },
        poster_path: {
            type: String,
            required: true
        },
        release_date: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            requitred: true
        },
        genres: {
            type: Array,
            required: true
        },
        overview: {
            type: String,
            required: true
        },
        vote_average: {
            type: Number,
            required: true
        },
        popularity: {
            type: Number,
            required: true
        }
    
    }, { timestamps: true });

const MovieItem = mongoose.model('magicMoviedb', movieItemSchema)

module.exports = MovieItem