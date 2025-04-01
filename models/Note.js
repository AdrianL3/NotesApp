const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema(
        {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing
            required: true, 
            ref: 'User' // Reference to the User model
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false 
        }
    },
    {
        timestamps: true // Automatically manage createdAt and updatedAt fields
    }
);

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket', // Field to increment
    id: 'ticketNums',
    start_seq: 500
});

module.exports = mongoose.model('Note', noteSchema);