const express = require('express');
const path = require('path');
const fs = require('fs');
const { uuid } = require('uuidv4');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  res.json(notes);

});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add notes`);
  const newNote = req.body;
  newNote.id = uuid();

  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  const allNotes = [...notes, newNote];
  fs.writeFileSync('./db/db.json', JSON.stringify(allNotes));
  res.json(allNotes);

});

app.delete('/api/notes/:id', (req, res) => {
  const deletedNote = req.params.id;
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  const filteredNotes = notes.filter(note => note.id != deletedNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(filteredNotes));
  res.json(filteredNotes);
})

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
