require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoapp';

// prepare for mongoose v7 default changes and avoid strictQuery warnings
mongoose.set('strictQuery', false);

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    app.get('/api/todos', async (req, res) => {
      try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post('/api/todos', async (req, res) => {
      try {
        const { title, text, date, time, priority } = req.body;
        if (!title) return res.status(400).json({ error: 'title required' });
        const todo = new Todo({
          title,
          text: text || '',
          date: date ? new Date(date) : undefined,
          time: time || undefined,
          priority: priority || 'medium'
        });
        await todo.save();
        res.status(201).json(todo);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.put('/api/todos/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
        if (!todo) return res.status(404).json({ error: 'not found' });
        res.json(todo);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.delete('/api/todos/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    console.error('Starting fallback in-memory API so frontend can work without MongoDB.');

    // Fallback: simple in-memory store for development when Mongo isn't available
    const inMemory = { todos: [] };
    const genId = () => String(Date.now() + Math.floor(Math.random() * 1000));

    app.get('/api/todos', (req, res) => {
      res.json(inMemory.todos.slice().reverse());
    });

    app.post('/api/todos', (req, res) => {
      const { title, text, date, time, priority } = req.body;
      if (!title) return res.status(400).json({ error: 'title required' });
      const todo = {
        _id: genId(),
        title,
        text: text || '',
        date: date || null,
        time: time || null,
        priority: priority || 'medium',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemory.todos.push(todo);
      res.status(201).json(todo);
    });

    app.put('/api/todos/:id', (req, res) => {
      const { id } = req.params;
      const idx = inMemory.todos.findIndex(t => t._id === id);
      if (idx === -1) return res.status(404).json({ error: 'not found' });
      const updates = req.body;
      inMemory.todos[idx] = { ...inMemory.todos[idx], ...updates, updatedAt: new Date() };
      res.json(inMemory.todos[idx]);
    });

    app.delete('/api/todos/:id', (req, res) => {
      const { id } = req.params;
      inMemory.todos = inMemory.todos.filter(t => t._id !== id);
      res.json({ success: true });
    });

    app.listen(PORT, () => console.log(`Server listening on ${PORT} (in-memory fallback)`));
  }
}

start();

// keep module exports available for testing if needed
module.exports = app;

// end
// previous route definitions moved into start()
