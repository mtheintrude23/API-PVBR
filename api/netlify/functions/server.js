const serverless = require("serverless-http");
const app = require("../../server.js"); // import file gốc

module.exports.handler = serverless(app);