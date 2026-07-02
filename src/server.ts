import "dotenv/config";
import app from "./app.js";

const server = app;
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
