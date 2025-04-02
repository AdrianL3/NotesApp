const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// @desc get all notes
// @route gET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    // get all notes from MongoDB
    const notes = await Note.find().lean();

    // check if notes exist
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }

    // add username to each note before sending respoonse
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec(); // find the user by id
        return { ...note, username: user.username }; // return the note with username
    }))

    res.json(notesWithUser); // send the notes with username
})

// @desc create new note
// @route POST /notes
// @access Private
const createNewNote  = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec(); // find a note with the same title

    if (duplicate) {
        // if found, return a conflict error
        return res.status(409).json({ message: `Duplicate note title: ${title}` });
    }

    // Create and store new note
    const note = await Note.create({ user, title, text });

    if (note) { //created success
        return res.status(201).json({ message: 'New note created' });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' }); // if note creation failed
    }
})

// @desc update a note
// @route Patch /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    // Allow renaming of the original note 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)
})

// @desc delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}