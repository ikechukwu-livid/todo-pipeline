const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// MongoDB Schema
const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', TodoSchema);

// ROUTES

// 1. READ: Get all todos
app.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.render('index', { todos });
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});

// 2. CREATE: Add a new todo
app.post('/add', async (req, res) => {
  try {
    const newTodo = new Todo({ task: req.body.task });
    await newTodo.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error saving task");
  }
});

// 3. UPDATE: Toggle task completion status
app.post('/update/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.id || req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error updating task");
  }
});

// 4. DELETE: Remove a todo
app.post('/delete/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error deleting task");
  }
});

// Server Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Database connection failed:", err));
