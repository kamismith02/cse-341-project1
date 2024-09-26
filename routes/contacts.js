const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await client.db().collection('contacts').find({}).toArray();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).send('Error fetching contacts');
  }
});

// GET a single contact by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const contact = await client.db().collection('contacts').findOne({ _id: ObjectId(id) });
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).send('Contact not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching contact');
  }
});

module.exports = router;