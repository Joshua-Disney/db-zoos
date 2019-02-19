require("dotenv").config();

const server = require("./server.js");

// endpoints here

const port = process.env.PORT || 3300;
server.listen(port, () => {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
