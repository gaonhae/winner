import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type AdapterConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

function parseDatabaseUrl(databaseUrl: string): AdapterConfig | null {
  try {
    const parsed = new URL(databaseUrl);
    const database = parsed.pathname.replace(/^\//, "");

    if (!parsed.hostname || !database) return null;

    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database,
    };
  } catch {
    return null;
  }
}

function getAdapterConfig(): AdapterConfig {
  const fromUrl =
    process.env.DATABASE_URL && parseDatabaseUrl(process.env.DATABASE_URL);
  if (fromUrl) return fromUrl;

  return {
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || "winner_user",
    password: process.env.DATABASE_PASSWORD || "winner_password",
    database: process.env.DATABASE_NAME || "winner",
  };
}

function createPrismaClient() {
  const config = getAdapterConfig();

  const adapter = new PrismaMariaDb({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 5,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
