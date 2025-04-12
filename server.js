const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let timetable = [];

try {
  timetable = require("./timetable.json");
} catch (error) {
  console.log("Nincs timetable.json fájl, új indul.");
}

// GET: órák lekérése
app.get("/api/timetable", (req, res) => {
  res.json(timetable);
});

// POST: új óra hozzáadása
app.post("/api/timetable", (req, res) => {
  const newLesson = req.body;
  timetable.push(newLesson);
  fs.writeFileSync("timetable.json", JSON.stringify(timetable, null, 2));
  res.status(201).json(newLesson);
});

// PUT: óra módosítása
app.put("/api/timetable/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const updatedLesson = req.body;

  if (index >= 0 && index < timetable.length) {
    timetable[index] = updatedLesson;
    fs.writeFileSync("timetable.json", JSON.stringify(timetable, null, 2));
    res.json(updatedLesson);
  } else {
    res.status(404).send("Óra nem található.");
  }
});

// DELETE: óra törlése
app.delete("/api/timetable/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < timetable.length) {
    const removed = timetable.splice(index, 1);
    fs.writeFileSync("timetable.json", JSON.stringify(timetable, null, 2));
    res.json(removed[0]);
  } else {
    res.status(404).send("Nem található.");
  }
});

app.listen(PORT, () => {
  console.log(`API fut a http://localhost:${PORT} címen`);
});
