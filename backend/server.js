require('dotenv').config();
const express = require('express');
const cors = require('cors');

const path = require('path');
const Event = require('./models/event');

const app = express();
const connectDb = require("./config/db")
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // tracker.js + demo pages
const PORT = process.env.PORT || 3000;

// 1) Event receive karke store karo
app.post('/api/events', async (req, res) => {
  try {
    const { session_id, type, page_url, timestamp } = req.body;
    if (!session_id || !type || !page_url || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (type === 'click' && (req.body.x == null || req.body.y == null)) {
      return res.status(400).json({ error: 'Click needs x and y' });
    }
    await Event.create(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2) Sessions list + event count
app.get('/api/sessions', async (req, res) => {
  const sessions = await Event.aggregate([
    { $group: {
        _id: '$session_id',
        total_events: { $sum: 1 },
        first_seen: { $min: '$timestamp' },
        last_seen: { $max: '$timestamp' },
    }},
    { $sort: { last_seen: -1 } },
  ]);
  res.json(sessions);
});

// 3) Ek session ke saare events (time order me = user journey)
app.get('/api/sessions/:id/events', async (req, res) => {
  const events = await Event.find({ session_id: req.params.id }).sort({ timestamp: 1 });
  res.json(events);
});

// 4a) Dropdown ke liye: kin pages ka data hai
app.get('/api/pages', async (req, res) => {
  res.json(await Event.distinct('page_url'));
});

// 4b) Heatmap: ek page ke saare clicks
app.get('/api/heatmap', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query required' });
  const clicks = await Event.find({ page_url: url, type: 'click' })
    .select('x y page_width page_height -_id');
  res.json(clicks);
});  

     // Heatmap: ek page ke clicks. session_id optional hai (de do to sirf us session ke clicks)
// app.get('/api/heatmap', async (req, res) => {
//   const { url, session_id } = req.query;
//   if (!url) return res.status(400).json({ error: 'url query required' });

//   const filter = { page_url: url, type: 'click' };
//   if (session_id) filter.session_id = session_id;

//   const clicks = await Event.find(filter)
//     .select('x y page_width page_height -_id');
//   res.json(clicks);
// });

app.listen(PORT,()=>{ 
    connectDb();
    console.log(`server is started listening at port ${PORT}`);
})