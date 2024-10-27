module.exports = (mongoose) => {
    const observationSchema = mongoose.Schema({
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
        time_zone: {
            type: String,
        },
        location: {
            country: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            city: {
                type: String,
            },
            coordinates: {
                latitude: {
                    type: Number
                },
                longitude: {
                    type: Number
                },
            },
        },
        telescope: {
            make: {
                type: String
            },
            serial_number: {
                type: String
            },
        },
        weather_conditions: {
            type: String,
        },
        visibility_conditions: {
            type: String,
        },
        duration: {
            type: String,
        },
        notes: {
            type: String
        }
    });

    return mongoose.model('observation', observationSchema);
};