import autocannon, { printResult } from 'autocannon';
import expressServer from './express-server';
import fastifyServer from './fastify-server';

async function runTest(name: string, port: number) {
  console.log(`\nRunning Autocannon test for ${name} on port ${port}...`);
  const result = await autocannon({
    url: `http://localhost:${port}/test`,
    connections: 100,
    duration: 10,
    pipelining: 10,
  });

  console.log(`--- ${name} Results ---`);
  console.log(printResult(result));
}

async function main() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await runTest('Express.js', 3000);
  await runTest('Fastify', 3001);

  expressServer.close(() => console.log('Express server closed.'));
  await fastifyServer.close();
  console.log('Fastify server closed.');
}

main().catch(console.error);
