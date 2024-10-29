module.exports = (mongoose) => {
    const Observation = mongoose.model(
        'Observation',
        mongoose.Schema({
            username: {
                type: String,
                required: true
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
                    required: true
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
            equipment: {
                equipment_type: {
                    type: String
                },
                make: {
                    type: String
                },
                model: {
                    type: String
                },
                serial_number: {
                    type: String
                }
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
        }),
        'observation'
    );

    return Observation;
};