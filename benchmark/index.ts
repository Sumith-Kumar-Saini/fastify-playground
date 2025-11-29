import autocannon, { printResult } from 'autocannon';
import buildExpressApp from './express-server';
import buildFastifyApp from './fastify-server';

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
  try {
    const expressServer = await buildExpressApp(3000);
    const fastifyServer = await buildFastifyApp(3001);

    await runTest('Express.js', 3000);
    await runTest('Fastify', 3001);

    expressServer.close(() => console.log('Express server closed.'));
    await fastifyServer.close();
    console.log('Fastify server closed.');
  } catch (error) {
    console.error('Error during server setup or test:', error);
    process.exit(1);
  }
}

main().catch(console.error);
