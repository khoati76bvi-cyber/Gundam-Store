import { defineConfig } from '@prisma/config'; // Sửa từ 'prisma' thành '@prisma/config'
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  migrations: {
    seed: 'npx dotenv -e .env -- npx ts-node --project tsconfig.seed.json ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});