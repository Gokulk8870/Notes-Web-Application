const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(__dirname));

// Read notes safely
function readNotes() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Write notes safely
function writeNotes(notes) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// Initialize data.json if missing or empty
if (!fs.existsSync(DATA_FILE) || fs.readFileSync(DATA_FILE, "utf8").trim() === "") {
    writeNotes([]);
}

// GET all notes
app.get("/notes", (req, res) => {
    try {
        res.json(readNotes());
    } catch (err) {
        res.status(500).json({ error: "Failed to read notes" });
    }
});

// POST add a note
app.post("/notes", (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }
    try {
        const notes = readNotes();
        const note = { id: Date.now(), title, content };
        notes.push(note);
        writeNotes(notes);
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: "Failed to save note" });
    }
});

// DELETE a note by id
app.delete("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    try {
        const notes = readNotes().filter(n => n.id !== id);
        writeNotes(notes);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete note" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
