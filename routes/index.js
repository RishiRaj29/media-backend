const express = require('express');
const { login } = require('../helpers/Login');
const authMiddleware = require('../middleware/authMiddleware');
const State = require('../models/stateModel');
const adminMiddleware = require('../middleware/adminMiddleware');
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


module.exports = router