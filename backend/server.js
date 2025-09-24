require("dotenv").config();
const initSocketServer = require("./src/sockets/socket.server");
const app = require("./src/app");
const httpserver = require("http").createServer(app);
const connectDb = require("./src/db/db");

connectDb();
initSocketServer(httpserver);
httpserver.listen(3000, () => {
  console.log('"server is running on port 3000"');
});
