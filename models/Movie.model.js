const { Schema, model } = require('mongoose');

const movieSchema = new Schema(
    {
        title: { 
            type: String, 
            required: true
        },
        genres: { 
            type: [{
                id: Number,
                name: String,
            }],
            required: false
        },
        overview: { 
            type: String, 
            required: true
        },
        poster_path: { 
            type: String,
            required: true
        },
        release_date: {
            type: Date,
            required: true
        },
        markers: [{
            type: Schema.Types.ObjectId,
            ref: 'Marker'
        }],
        movie_ID: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Movie = model('Movie', movieSchema);

module.exports = Movie