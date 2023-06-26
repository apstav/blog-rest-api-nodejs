// imports
const app = require("./index");

require("dotenv").config();
require("./utils/mongodb.util");

// constants
const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}...`);
});
