const mongoose = require('mongoose');

const ListItemSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    phone: {
        type: String, // Storing as string to handle potential formatting (e.g., country codes, dashes)
        required: true,
    },
    notes: {
        type: String,
    },
    // We might add a field later to link this item back to the original uploaded list if needed
    // originalList: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'UploadedList', // Assuming we might have an UploadedList model
    // },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const ListItem = mongoose.model('ListItem', ListItemSchema);

module.exports = ListItem; 