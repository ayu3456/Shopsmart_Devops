const { Pool } = require("pg");

let pool;

function shouldUseSsl() {
  const mode = String(
    process.env.PGSSLMODE ||
      process.env.DB_SSLMODE ||
      process.env.DATABASE_SSLMODE ||
      "",
  ).toLowerCase();

  if (["require", "verify-ca", "verify-full"].includes(mode)) return true;
  if (mode === "disable") return false;
  return /sslmode=(require|verify-ca|verify-full)/i.test(
    process.env.DATABASE_URL || "",
  );
}

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const config = {
      connectionString: process.env.DATABASE_URL,
      max: 8,
      idleTimeoutMillis: 20_000,
    };

    if (shouldUseSsl()) {
      config.ssl = { rejectUnauthorized: false };
    }

    pool = new Pool(config);
  }
  return pool;
}

module.exports = { getPool };
