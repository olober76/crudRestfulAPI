const express = require("express");
const bodyParser = require("body-parser");
const Fuse = require("fuse.js");

const app = express();
app.use(bodyParser.json());

// Data in-memory
let items = [
  { id: 1, name: "Apple", description: "A red fruit" },
  { id: 2, name: "Orange", description: "A citrus fruit" },
  { id: 3, name: "Banana", description: "A yellow fruit" },
  { id: 4, name: "Pineapple", description: "A tropical fruit" },
  { id: 5, name: "Grapes", description: "Small round fruit often in bunches" },
  {
    id: 6,
    name: "Watermelon",
    description: "A large, green-skinned fruit with red flesh",
  },
  { id: 7, name: "Blueberry", description: "A small, blue berry" },
  {
    id: 8,
    name: "Strawberry",
    description: "A red berry with seeds on the outside",
  },
  {
    id: 9,
    name: "Mango",
    description: "A sweet tropical fruit with orange flesh",
  },
  {
    id: 10,
    name: "Papaya",
    description: "A tropical fruit with orange flesh and black seeds",
  },
  { id: 11, name: "Lemon", description: "A yellow, sour citrus fruit" },
  { id: 12, name: "Lime", description: "A small, green, sour citrus fruit" },
  {
    id: 13,
    name: "Peach",
    description: "A fuzzy-skinned fruit with a large pit",
  },
  {
    id: 14,
    name: "Plum",
    description: "A small, purple or red fruit with a pit",
  },
  {
    id: 15,
    name: "Kiwi",
    description: "A brown, fuzzy-skinned fruit with green flesh",
  },
  {
    id: 16,
    name: "Pomegranate",
    description: "A fruit with red seeds inside a tough outer skin",
  },
  {
    id: 17,
    name: "Coconut",
    description: "A large, brown, hard-shelled tropical fruit",
  },
  {
    id: 18,
    name: "Avocado",
    description: "A fruit with green flesh and a large pit",
  },
  {
    id: 19,
    name: "Cherry",
    description: "A small, red, sweet or tart fruit with a pit",
  },
  {
    id: 20,
    name: "Pear",
    description: "A green or yellow fruit with a soft flesh",
  },
];

// Fuzzy search options
const fuseOptions = {
  keys: ["name", "description"],
  threshold: 0.2, // Set the threshold for fuzzy search
};
const fuse = new Fuse(items, fuseOptions);

// CREATE
app.post("/items", (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// READ (All items)
app.get("/items", (req, res) => {
  res.json(items);
});

// READ (Single item by ID)
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id == req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// UPDATE
app.put("/items/:id", (req, res) => {
  const item = items.find((i) => i.id == req.params.id);
  if (item) {
    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// DELETE
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id == req.params.id);
  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: "Item deleted successfully" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Fuzzy Search
app.get("/search", (req, res) => {
  const query = req.query.q;
  const results = fuse.search(query).map((result) => result.item);
  res.json(results);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
