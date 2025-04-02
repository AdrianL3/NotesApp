const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.route('/')
    // get = read in CRUD
    .get(notesController.getAllNotes)
    // post = create in CRUD
    .post(notesController.createNewNote)
    // patch = update in CRUD
    .patch(notesController.updateNote)
    // delete = delete in CRUD
    .delete(notesController.deleteNote);

module.exports = router;