// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Contact Schema
// const contactSchema = new mongoose.Schema({
//   name: String,
//   phoneNumber: String,
//   callMeBotApiKey: String,
//   roomType: { type: String, enum: ['single', 'double', 'triple'], required: true },
//   roomNumber: { type: String, required: true },
// });
// const Contact = mongoose.model('Contact', contactSchema);

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Server is running' });
// });

// // Get available room numbers
// app.get('/api/available-rooms/:roomType', async (req, res) => {
//   try {
//     const { roomType } = req.params;
//     if (!['single', 'double', 'triple'].includes(roomType)) {
//       return res.status(400).json({ error: 'Invalid room type' });
//     }
//     const capacity = { single: 1, double: 2, triple: 3 }[roomType];
//     // Predefined room numbers (101-110)
//     const allRoomNumbers = Array.from({ length: 10 }, (_, i) => (101 + i).toString());
//     const contacts = await Contact.find({ roomType });
//     // Count occupants per room number
//     const roomOccupancy = {};
//     contacts.forEach(contact => {
//       roomOccupancy[contact.roomNumber] = (roomOccupancy[contact.roomNumber] || 0) + 1;
//     });
//     // Find available rooms
//     const availableRooms = allRoomNumbers.filter(roomNumber => 
//       (roomOccupancy[roomNumber] || 0) < capacity
//     );
//     res.json(availableRooms);
//   } catch (err) {
//     console.error('Error fetching available rooms:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all contacts
// app.get('/api/contacts', async (req, res) => {
//   try {
//     console.log('Fetching contacts...');
//     const contacts = await Contact.find();
//     res.json(contacts);
//   } catch (err) {
//     console.error('Error fetching contacts:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add contact
// app.post('/api/contacts', async (req, res) => {
//   try {
//     const { name, phoneNumber, callMeBotApiKey, roomType, roomNumber } = req.body;
//     console.log('Adding contact:', { name, phoneNumber, callMeBotApiKey, roomType, roomNumber });
//     // Validate room availability
//     const capacity = { single: 1, double: 2, triple: 3 }[roomType];
//     const occupants = await Contact.countDocuments({ roomType, roomNumber });
//     if (occupants >= capacity) {
//       return res.status(400).json({ error: `Room ${roomNumber} is full for ${roomType} type` });
//     }
//     const contact = new Contact({ name, phoneNumber, callMeBotApiKey, roomType, roomNumber });
//     await contact.save();
//     res.status(201).json(contact);
//   } catch (err) {
//     console.error('Error adding contact:', err);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete contact
// app.delete('/api/contacts/:id', async (req, res) => {
//   try {
//     console.log('Deleting contact:', req.params.id);
//     await Contact.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Contact deleted' });
//   } catch (err) {
//     console.error('Error deleting contact:', err);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Bulk delete contacts
// app.post('/api/contacts/bulk-delete', async (req, res) => {
//   try {
//     const { ids } = req.body;
//     console.log('Bulk deleting contacts:', ids);
//     await Contact.deleteMany({ _id: { $in: ids } });
//     res.json({ message: 'Contacts deleted successfully' });
//   } catch (err) {
//     console.error('Error bulk deleting contacts:', err);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Send WhatsApp message
// app.post('/api/send-whatsapp', async (req, res) => {
//   try {
//     const { phoneNumber, message, callMeBotApiKey } = req.body;
//     console.log('Sending WhatsApp message to:', phoneNumber);
//     const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(message)}&apikey=${callMeBotApiKey}`;
//     const response = await axios.get(url);
//     res.json({ message: 'WhatsApp message sent successfully', data: response.data });
//   } catch (err) {
//     console.error('Error sending WhatsApp message:', err);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Bulk send WhatsApp messages
// app.post('/api/bulk-send-whatsapp', async (req, res) => {
//   try {
//     const { contacts, message } = req.body;
//     console.log('Bulk sending WhatsApp messages to:', contacts.map(c => c.phoneNumber));
//     const results = [];
//     for (const contact of contacts) {
//       const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(contact.phoneNumber)}&text=${encodeURIComponent(message)}&apikey=${contact.callMeBotApiKey}`;
//       try {
//         const response = await axios.get(url);
//         results.push({ phoneNumber: contact.phoneNumber, status: 'success', data: response.data });
//       } catch (err) {
//         results.push({ phoneNumber: contact.phoneNumber, status: 'failed', error: err.message });
//       }
//     }
//     res.json({ message: 'Bulk WhatsApp messages processed', results });
//   } catch (err) {
//     console.error('Error bulk sending WhatsApp messages:', err);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Mock WhatsApp
// app.post('/api/mock-whatsapp', (req, res) => {
//   const { phoneNumber, message } = req.body;
//   console.log(`Mock WhatsApp message sent to ${phoneNumber}: ${message}`);
//   res.json({ message: 'Mock WhatsApp message sent successfully' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));













const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  callMeBotApiKey: String,
  roomType: { type: String, enum: ['single', 'double', 'triple'], required: true },
  roomNumber: { type: String, required: true },
  lastMessageSent: { type: Date, default: null },
});
const Contact = mongoose.model('Contact', contactSchema);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Get available room numbers
app.get('/api/available-rooms/:roomType', async (req, res) => {
  try {
    const { roomType } = req.params;
    if (!['single', 'double', 'triple'].includes(roomType)) {
      return res.status(400).json({ error: 'Invalid room type' });
    }
    const capacity = { single: 1, double: 2, triple: 3 }[roomType];
    const allRoomNumbers = Array.from({ length: 10 }, (_, i) => (101 + i).toString());
    const contacts = await Contact.find({ roomType });
    const roomOccupancy = {};
    allRoomNumbers.forEach(room => { roomOccupancy[room] = 0; });
    contacts.forEach(contact => {
      roomOccupancy[contact.roomNumber] = (roomOccupancy[contact.roomNumber] || 0) + 1;
    });
    const availableRooms = allRoomNumbers.filter(roomNumber => 
      roomOccupancy[roomNumber] < capacity
    );
    console.log(`Available rooms for ${roomType}:`, availableRooms);
    res.json(availableRooms);
  } catch (err) {
    console.error('Error fetching available rooms:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    console.log('Fetching contacts...');
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, phoneNumber, callMeBotApiKey, roomType, roomNumber } = req.body;
    console.log('Adding contact:', { name, phoneNumber, callMeBotApiKey, roomType, roomNumber });
    const capacity = { single: 1, double: 2, triple: 3 }[roomType];
    const occupants = await Contact.countDocuments({ roomType, roomNumber });
    if (occupants >= capacity) {
      return res.status(400).json({ error: `Room ${roomNumber} is full for ${roomType} type` });
    }
    const contact = new Contact({ name, phoneNumber, callMeBotApiKey, roomType, roomNumber });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error('Error adding contact:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    console.log('Deleting contact:', req.params.id);
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(400).json({ error: err.message });
  }
});

// Bulk delete contacts
app.post('/api/contacts/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    console.log('Bulk deleting contacts:', ids);
    await Contact.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Contacts deleted successfully' });
  } catch (err) {
    console.error('Error bulk deleting contacts:', err);
    res.status(400).json({ error: err.message });
  }
});

// Send WhatsApp message
app.post('/api/send-whatsapp', async (req, res) => {
  try {
    const { phoneNumber, message, callMeBotApiKey } = req.body;
    console.log('Checking message eligibility for:', phoneNumber);
    const contact = await Contact.findOne({ phoneNumber });
    if (!contact) {
      return res.status(404).json({ error: `Contact with phone number ${phoneNumber} not found` });
    }
    if (!contact.roomType || !contact.roomNumber) {
      return res.status(400).json({ error: `Contact ${phoneNumber} is missing required fields: roomType or roomNumber` });
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (contact.lastMessageSent && contact.lastMessageSent > thirtyDaysAgo) {
      return res.status(400).json({ 
        error: `Cannot send message to ${phoneNumber}. Last message sent on ${contact.lastMessageSent.toISOString().split('T')[0]}. Wait until ${new Date(contact.lastMessageSent.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}.` 
      });
    }
    console.log('Sending WhatsApp message to:', phoneNumber);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(message)}&apikey=${callMeBotApiKey}`;
    const response = await axios.get(url);
    // Update only lastMessageSent
    await Contact.updateOne(
      { phoneNumber },
      { $set: { lastMessageSent: new Date() } }
    );
    res.json({ message: 'WhatsApp message sent successfully', data: response.data });
  } catch (err) {
    console.error('Error sending WhatsApp message:', err);
    res.status(400).json({ error: err.message });
  }
});

// Bulk send WhatsApp messages
app.post('/api/bulk-send-whatsapp', async (req, res) => {
  try {
    const { contacts, message } = req.body;
    console.log('Bulk sending WhatsApp messages to:', contacts.map(c => c.phoneNumber));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const results = [];
    const ineligible = [];
    for (const contactData of contacts) {
      const contact = await Contact.findOne({ phoneNumber: contactData.phoneNumber });
      if (!contact) {
        results.push({ phoneNumber: contactData.phoneNumber, status: 'failed', error: 'Contact not found' });
        continue;
      }
      if (!contact.roomType || !contact.roomNumber) {
        ineligible.push({
          phoneNumber: contactData.phoneNumber,
          error: 'Missing required fields: roomType or roomNumber',
        });
        continue;
      }
      if (contact.lastMessageSent && contact.lastMessageSent > thirtyDaysAgo) {
        ineligible.push({
          phoneNumber: contactData.phoneNumber,
          lastSent: contact.lastMessageSent.toISOString().split('T')[0],
          nextAvailable: new Date(contact.lastMessageSent.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        continue;
      }
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(contactData.phoneNumber)}&text=${encodeURIComponent(message)}&apikey=${contactData.callMeBotApiKey}`;
      try {
        const response = await axios.get(url);
        // Update only lastMessageSent
        await Contact.updateOne(
          { phoneNumber: contactData.phoneNumber },
          { $set: { lastMessageSent: new Date() } }
        );
        results.push({ phoneNumber: contactData.phoneNumber, status: 'success', data: response.data });
      } catch (err) {
        results.push({ phoneNumber: contactData.phoneNumber, status: 'failed', error: err.message });
      }
    }
    res.json({ message: 'Bulk WhatsApp messages processed', results, ineligible });
  } catch (err) {
    console.error('Error bulk sending WhatsApp messages:', err);
    res.status(400).json({ error: err.message });
  }
});

// Mock WhatsApp
app.post('/api/mock-whatsapp', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    console.log('Checking mock message eligibility for:', phoneNumber);
    const contact = await Contact.findOne({ phoneNumber });
    if (!contact) {
      return res.status(404).json({ error: `Contact with phone number ${phoneNumber} not found` });
    }
    if (!contact.roomType || !contact.roomNumber) {
      return res.status(400).json({ error: `Contact ${phoneNumber} is missing required fields: roomType or roomNumber` });
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (contact.lastMessageSent && contact.lastMessageSent > thirtyDaysAgo) {
      return res.status(400).json({ 
        error: `Cannot send mock message to ${phoneNumber}. Last message sent on ${contact.lastMessageSent.toISOString().split('T')[0]}. Wait until ${new Date(contact.lastMessageSent.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}.` 
      });
    }
    console.log(`Mock WhatsApp message sent to ${phoneNumber}: ${message}`);
    // Update only lastMessageSent
    await Contact.updateOne(
      { phoneNumber },
      { $set: { lastMessageSent: new Date() } }
    );
    res.json({ message: 'Mock WhatsApp message sent successfully' });
  } catch (err) {
    console.error('Error sending mock WhatsApp message:', err);
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
