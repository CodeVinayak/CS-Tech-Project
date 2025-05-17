const mongoose = require('mongoose');

const DistributedListSchema = mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agent', // Reference to the Agent model
    },
    listItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListItem', // Reference to the ListItem model
        },
    ],
    // We might add a field later to indicate the original upload or distribution batch
    // uploadBatch: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'UploadBatch', // Assuming we might have an UploadBatch model
    // },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const DistributedList = mongoose.model('DistributedList', DistributedListSchema);

module.exports = DistributedList; 