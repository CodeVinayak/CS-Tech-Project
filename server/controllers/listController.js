const asyncHandler = require('express-async-handler');
const Agent = require('../models/Agent'); // Needed to fetch agents for distribution
const csv = require('csv-parser'); // To parse CSV files
const fs = require('fs'); // To read files
const path = require('path'); // To work with file paths
const XLSX = require('xlsx');
const ListItem = require('../models/ListItem'); // Import ListItem model
const DistributedList = require('../models/DistributedList'); // Import DistributedList model

// We'll need a model for the list items and distributed lists later
// const ListItem = require('../models/ListItem');
// const DistributedList = require('../models/DistributedList');

// Helper function for data validation
const validateListData = (data) => {
    const errors = [];
    if (!data || data.length === 0) {
        errors.push('No data found in file.');
        return errors;
    }

    data.forEach((item, index) => {
        const lineNumber = index + 1; // Assuming data starts from line 1 after headers
        if (!item.FirstName) {
            errors.push(`Row ${lineNumber}: Missing FirstName.`);
        }
        if (!item.Phone) {
            errors.push(`Row ${lineNumber}: Missing Phone.`);
        } else if (isNaN(item.Phone)) { // Basic check, more robust validation might be needed
             errors.push(`Row ${lineNumber}: Invalid Phone number format.`);
        }
        if (!item.Notes) {
            errors.push(`Row ${lineNumber}: Missing Notes.`);
        }
        // Add more specific validation rules if needed
    });

    return errors;
};

// Helper function for distributing items
const distributeListItems = (items, agents) => {
    if (!agents || agents.length === 0) {
        return { distributedLists: {}, error: 'No agents available for distribution.' };
    }

    const distributedLists = {};
    agents.forEach(agent => {
        distributedLists[agent._id] = [];
    });

    const itemsPerAgent = Math.floor(items.length / agents.length);
    let itemIndex = 0;

    // Distribute equally
    for (let i = 0; i < agents.length; i++) {
        const agentId = agents[i]._id;
        for (let j = 0; j < itemsPerAgent; j++) {
            if (itemIndex < items.length) {
                // Map incoming data keys to schema keys and add agent ID
                const listItemData = {
                    firstName: items[itemIndex].FirstName,
                    phone: items[itemIndex].Phone,
                    notes: items[itemIndex].Notes || '', // Handle optional notes
                    agent: agentId
                };
                distributedLists[agentId].push(listItemData);
                itemIndex++;
            }
        }
    }

    // Distribute remaining items sequentially
    while (itemIndex < items.length) {
        for (let i = 0; i < agents.length; i++) {
            if (itemIndex < items.length) {
                 // Map incoming data keys to schema keys and add agent ID
                const listItemData = {
                    firstName: items[itemIndex].FirstName,
                    phone: items[itemIndex].Phone,
                    notes: items[itemIndex].Notes || '', // Handle optional notes
                    agent: agents[i]._id
                };
                distributedLists[agents[i]._id].push(listItemData);
                itemIndex++;
            }
        }
    }

    return { distributedLists, error: null };
};

// @desc    Upload and distribute list from file
// @route   POST /api/lists/upload
// @access  Private (Admin only - requires auth middleware)
const uploadList = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const filePath = req.file.path; // Path to the temporarily uploaded file
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const results = []; // Array to store parsed data

    // Function to process the data after parsing
    const processAndDistribute = async (parsedData) => {
        const validationErrors = validateListData(parsedData);
        if (validationErrors.length > 0) {
            // Clean up the temporary file on validation error
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file after validation error:', err);
            });
            res.status(400);
            throw new Error(`Data validation failed: ${validationErrors.join('; ')}`);
        }

        let agents = [];
        try {
             agents = await Agent.find({});
             if (agents.length === 0) {
                // Clean up the temporary file if no agents are available
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting temporary file (no agents):', err);
                });
                res.status(400);
                throw new Error('No agents available to distribute the list.');
             }
        } catch (error) {
             // Clean up the temporary file on error fetching agents
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file after fetching agents error:', err);
            });
            res.status(500);
            throw new Error('Error fetching agents');
        }


        const { distributedLists, error: distributionError } = distributeListItems(parsedData, agents);

        if (distributionError) {
            // Clean up the temporary file on distribution error
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file after distribution error:', err);
            });
            res.status(400);
            throw new Error(`Distribution failed: ${distributionError}`);
        }

        // Save the distributed lists to the database
        try {
             const savedDistributedLists = await Promise.all(Object.keys(distributedLists).map(async agentId => {
                const listItemsData = distributedLists[agentId];
                if (listItemsData.length > 0) {
                    // Create ListItem documents
                    const createdListItems = await ListItem.insertMany(listItemsData);
                    const listItemIds = createdListItems.map(item => item._id);

                    // Create DistributedList document for the agent
                    const distributedList = new DistributedList({
                        agent: agentId,
                        listItems: listItemIds,
                    });
                    return distributedList.save();
                }
                return null; // Handle agents with no assigned items
            }));

             // Filter out nulls from agents with no assigned items
            const successfullySavedLists = savedDistributedLists.filter(list => list !== null);

            // Clean up the temporary file on success
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file after successful save:', err);
            });

            res.status(200).json({
                message: 'File uploaded, validated, distributed, and saved to database.',
                 // Optionally return a summary or confirmation
                summary: successfullySavedLists.map(list => ({
                    agent: list.agent,
                    itemCount: list.listItems.length,
                }))
            });

        } catch (error) {
            // Clean up the temporary file on save error
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file after save error:', err);
            });
            console.error('Error saving distributed lists:', error);
            res.status(500);
            throw new Error('Error saving distributed lists to database.');
        }
    };

    // Handle different file types
    if (fileExtension === '.csv') {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // File processing complete, now process and distribute
                console.log('CSV file processed. Number of records:', results.length);
                await processAndDistribute(results);
            })
            .on('error', (err) => {
                console.error('Error processing CSV file stream:', err);
                // Clean up the temporary file even on stream error
                 fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting temporary file after CSV stream error:', unlinkErr);
                });
                res.status(500);
                throw new Error('Error processing CSV file stream');
            });

    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonSheet = XLSX.utils.sheet_to_json(worksheet);

            console.log(`${fileExtension.toUpperCase()} file processed. Number of records:`, jsonSheet.length);

             // Clean up the temporary file after reading
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file after XLSX/XLS read:', err);
            });

            await processAndDistribute(jsonSheet);

        } catch (error) {
            console.error(`Error processing ${fileExtension.toUpperCase()} file:`, error);
             // Clean up the temporary file on error
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting temporary file after ${fileExtension.toUpperCase()} error:`, err);
            });
            res.status(500);
            throw new Error(`Error processing ${fileExtension.toUpperCase()} file`);
        }

    } else {
        console.error('Unsupported file type:', fileExtension);
         // Clean up the temporary file for unsupported types
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting temporary file for unsupported type:', err);
        });
        res.status(400);
        throw new Error('Unsupported file type');
    }
});

// @desc    Get all distributed lists
// @route   GET /api/lists/distributed
// @access  Private (Admin only - requires auth middleware)
const getDistributedLists = asyncHandler(async (req, res) => {
    // Fetch all distributed lists, populate agent and listItems for display
    try {
        const distributedLists = await DistributedList.find({})
            .populate('agent', 'name email') // Populate agent details
            .populate('listItems'); // Populate list item details

        res.status(200).json(distributedLists);

    } catch (error) {
        console.error('Error fetching distributed lists:', error);
        res.status(500);
        throw new Error('Error fetching distributed lists.');
    }
});

// @desc    Get total count of distributed lists
// @route   GET /api/lists/count/distributed
// @access  Private (Admin only - we'll add auth middleware later)
const getDistributedListCount = asyncHandler(async (req, res) => {
  const count = await DistributedList.countDocuments();
  res.json({ count });
});

// @desc    Get total count of list items
// @route   GET /api/lists/count/items
// @access  Private (Admin only - we'll add auth middleware later)
const getListItemCount = asyncHandler(async (req, res) => {
  const count = await ListItem.countDocuments();
  res.json({ count });
});

module.exports = {
    uploadList,
    getDistributedLists,
    getDistributedListCount,
    getListItemCount,
    // Add other exported functions if necessary
}; 