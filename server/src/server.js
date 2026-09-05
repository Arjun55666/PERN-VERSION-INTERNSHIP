import { app } from './app.js';
import { prisma } from './database/prisma.js';

const port = Number(process.env.PORT) || 5050;
const server = app.listen(port, () => console.log(`API listening on http://localhost:${port}`));

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
