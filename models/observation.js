const mongoose = require('mongoose')

const ObservationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    observation: {
        type: String,
        required: true
    },
    object_type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    equipment: {
        type: String,
    },
    duration: {
        type: String,
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Observation', ObservationSchema)