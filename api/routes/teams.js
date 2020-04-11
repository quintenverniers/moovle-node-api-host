const express = require('express');
const router = express.Router();

/**
 * Get all games
 */
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /teams'
    });
});

/**
 * Create a game
 */
router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST request to /teams'
    });
});

/**
 * Retrieve a game
 */
router.get('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    if (id === 'special') {
        res.status(201).json({
            message: 'Getting the team with' + id,
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
router.patch('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    res.status(200).json({
        message: 'Updated team'
    });
});

/**
 * Delete a game
 */
router.delete('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    res.status(200).json({
        message: 'Deleting the team'
    });
});


module.exports = router;