require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));

// endpoints here

// Get all zoos
server.get("/api/zoos", async (req, res) => {
  try {
    const zoos = await db("zoos");
    res.status(200).json(zoos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "Failed to retrieve zoo data"
    });
  }
});

// Get zoo by id
server.get("/api/zoos/:id", async (req, res) => {
  try {
    const zoo = await db("zoos")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(zoo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "Failed to retrieve zoo data"
    });
  }
});

// Create new zoo
server.post("/api/zoos", async (req, res) => {
  try {
    const [id] = await db("zoos").insert(req.body);
    const zoo = await db("zoos")
      .where({ id })
      .first();
    res.status(201).json({
      zoo,
      message: "Successfully created zoo data"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "Failed to create zoo data"
    });
  }
});

// Update existing zoo
server.put("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id })
      .update(req.body);
    if (count > 0) {
      const zoo = await db("zoos")
        .where({ id: req.params.id })
        .first();
      res.status(200).json({
        zoo,
        message: "Successfully updated zoo data"
      });
    } else {
      res.status(404).json({
        message: "No zoo by this id in database"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "Failed to update zoo data"
    });
  }
});

// Delete existing zoo
server.delete("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id })
      .del();
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({
        message: "No zoo by this id in database"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "Failed to delete zoo data"
    });
  }
});

const port = process.env.PORT || 3300;
server.listen(port, () => {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
