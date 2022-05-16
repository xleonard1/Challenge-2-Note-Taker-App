const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const notes = require('./db/db.json')
const uuid = require('./helpers/uuid')
const PORT = 3001;


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html'))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/notes/:notes_id', (req,res) => {
    if (req.params.notes_id) {
        console.info(`${req.method} request received to get a single a note`);
        const notesId = req.params.notes_id;
        for (let i = 0; i < notes.length; i++) {
          const currentNote = notes[i];
          if (currentNote.notes_id === notesId) {
            res.json(currentNote);
            return;
          }
        }
        res.status(404).send('Note not found');
      } else {
        res.status(400).send('Note ID not provided');
      }
})

app.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add new Note`);

    const {title, text} = req.body

    if(title && text) {
      const newNote = {
          title,
          text,
          notes_id: uuid(),
      };
      fs.readFile('./db/db.json', 'utf8', (err,data) => {
        if(err) {
            console.error(err)
        } else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote)

            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
             writeErr
              ? console.error(writeErr)
              : console.info('successfully wrote new note') 
            );
        };
    });

    const response = {
        status: 'Success',
        body: newNote,
    };
    console.log(response);
    res.status(201).json(response)
    } else {
        res.status(500).json('Error in posting new Note')
    }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);