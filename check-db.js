const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

async function checkOrders() {
  try {
    // Get all order keys
    const keys = await redis.keys('order:*');
    console.log(`Found ${keys.length} orders in database:`);
    
    for (const key of keys) {
      const orderData = await redis.get(key);
      const order = JSON.parse(orderData);
      console.log('\n📦 Order:', key);
      console.log(JSON.stringify(order, null, 2));
    }
    
    // Check idempotency keys
    const idempotencyKeys = await redis.keys('idempotency:*');
    console.log(`\n🔑 Found ${idempotencyKeys.length} idempotency keys:`);
    
    for (const key of idempotencyKeys) {
      const orderId = await redis.get(key);
      console.log(`${key} -> ${orderId}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    redis.disconnect();
  }
}

checkOrders();