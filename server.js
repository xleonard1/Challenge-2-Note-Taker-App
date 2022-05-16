const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json')

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//get request for index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for reviews html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//GET request to read json file
app.get('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} recieved to get notes`)
    console.info(`${req.method} request received to get reviews`);
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);

    const {title, text} = req.body;

    if(title, text) {
        const newNote = {
            title,
            text
        };
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                const parsedNotes = JSON.parse(data)
    
                parsedNotes.push(newNote)
    
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => 
                writeErr
                ? console.error(writeErr)
                : console.info('successfully updated notes')
                );
            };       
        });
    
        const response = {
            status: 'success',
            body: newNote,
        };
    
        console.log(response);
        res.status(201).json(response)
    } else {
        res.status(500).json('Error in posting note');
    } 
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);