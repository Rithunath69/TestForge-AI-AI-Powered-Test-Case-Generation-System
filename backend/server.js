import dotenv from "dotenv";
import http from "http";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

/*
🔥 VERY IMPORTANT FIXES
*/

server.keepAliveTimeout = 0;
server.headersTimeout = 0;
server.requestTimeout = 0;
server.timeout = 0;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});