const router = require('express').Router();
const { readFromFile, readAndAppend, writeToFile, readAndDelete } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid')
const notes = require('../db/db.json')

router.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});


router.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add new Note`);
    const newNote = req.body;
    newNote.id = uuid;

    readAndAppend(newNote, './db/db.json');
    res.json(newNote)

});

router.delete('/api/notes/:id', (req, res) => {
   readAndDelete(req.params.id, './db/db.json'); 
   res.json({ok: true })
})

module.exports = router; 