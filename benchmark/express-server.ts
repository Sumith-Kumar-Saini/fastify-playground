import express from 'express';
import type { Server } from 'http';

const buildApp = async (PORT: number = 3000): Promise<Server> => {
  const app = express();
  app.disable('x-powered-by');

  app.get('/test', (req, res) => res.send('Hello from Express!'));

  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, (err) => {
      if (err) {
        console.error('Express server failed to start:', err);
        reject(err);
      } else {
        console.log(`Express server listening on port ${PORT}`);
        resolve(server);
      }
    });
  });
};

export default buildApp;
