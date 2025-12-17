
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { env } from './config/env';

async function migrate() {
    console.log('Running migrations...');
    const client = new Client({
        connectionString: env.DATABASE_URL,
        ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    try {
        await client.connect();

        // Read the migration file
        // Assuming dist structure mirrors src, but migrations is at root
        // compiled file is in dist/migrate.js
        // root is ../ from dist
        const migrationPath = path.join(__dirname, '..', 'migrations', '001_create_orders_table.sql');

        if (!fs.existsSync(migrationPath)) {
            // Fallback or explicit error if not found. 
            // In local dev (ts-node src/migrate.ts), __dirname is src/.
            // In prod (node dist/migrate.js), __dirname is dist/.
            // If local: src/../migrations -> migrations (correct)
            // If prod: dist/../migrations -> migrations (correct)
            console.error(`Migration file not found at ${migrationPath}`);
            process.exit(1);
        }

        const sql = fs.readFileSync(migrationPath, 'utf8');

        await client.query(sql);
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
