const express = require('express');
const router = express.Router();

/**
 * Get all games
 */
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /games'
    });
});

/**
 * Create a game
 */
router.post('/', (req, res, next) => {
    const game = {
        teamSize: req.body.teamSize,
        spotsLeft: req.body.spotsLeft,
        date: req.body.date,
        startTime: req.body.startTime,
        duration: req.body.duration,
        pitchType: req.body.pitchType,
        venueType: req.body.venueType,
        payingGame: req.body.payingGame,
        entryPrice: req.body.entryPrice,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    }
    res.status(201).json({
        message: 'Handling POST request to /games',
        createdGame: game
    });
});

/**
 * Retrieve a game
 */
router.get('/:gameID', (req, res, next) => {
    const id = req.params.gameID;
    if (id === 'special') {
        res.status(200).json({
            message: 'Getting the game with' + id,
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        })
    }
});

/**
 * Update a game
 */
router.patch('/:gameID', (req, res, next) => {
    const id = req.params.gameID;
    res.status(200).json({
        message: 'Updated game'
    });
});

/**
 * Delete a game
 */
router.delete('/:gameID', (req, res, next) => {
    const id = req.params.gameID;
    res.status(200).json({
        message: 'Deleting the game'
    });
});


module.exports = router;