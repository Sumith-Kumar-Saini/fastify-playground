import express from 'express';
import type { Server } from 'http';

const app = express();
const port = 3000;

app.get('/test', (req, res) => {
  res.send('Hello from Express!');
});

const server: Server = app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

export default server;
