require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./model/Todo');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get('/', async (req, res) => {
    try {
        const data = await Todo.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

app.post("/add", async (req, res) => {
    try {
        const { name, description } = req.body;
        const data = await Todo.create({ name, description });
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
    }
});

app.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Todo.findByIdAndUpdate(id, { complete: true }, { new: true });
        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(400).send("Update Failed");
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Todo.findByIdAndDelete(id);
        res.json(deleted);
    } catch (error) {
        console.log(error);
        res.status(400).send("Delete Failed");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
