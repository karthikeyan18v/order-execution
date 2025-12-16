CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL,
  dex TEXT,
  execution_price NUMERIC,
  tx_hash TEXT,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
