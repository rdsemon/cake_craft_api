import "dotenv/config";
import app from "./app";

const server = app;

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
