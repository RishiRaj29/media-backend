const express = require('express');
const { login } = require('../helpers/Login');
const authMiddleware = require('../middleware/authMiddleware');
const State = require('../models/stateModel');
const adminMiddleware = require('../middleware/adminMiddleware');
const City = require('../models/cityModel');
const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
    res.send({ 'message': 'Hello World!' })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { user, token } = await login(email, password);

        res.json({ user, token });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/create-state', adminMiddleware, async (req, res) => {

    const { state_name } = req.body;

    try {
        const newState = new State({
            state_name
        });

        const state = await newState.save();
        res.json(state);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

});


router.get('/states', authMiddleware, async (req, res) => {

    try {
        const states = await State.find();

        res.json(states);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/create-city', async (req, res) => {
    const { city_name, state } = req.body;

    try {
        const newCity = new City({
            city_name,
            state
        });

        const city = await newCity.save();
        res.json(city);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }

});

router.get('/cities', async (req, res) => {
    try {
        const stateName = req.query.state_name
        
        const cities = await City.find().populate({
            path: 'state',
            match: { state_name: stateName }
        });

        const filteredCities = cities.filter(city => city.state);

        res.json(filteredCities);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router