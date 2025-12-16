# Order Execution Service

## Deploy to Railway

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Add Redis service: Click "Add Service" → "Redis"
   - Set environment variables:
     - `NODE_ENV=production`
     - `REDIS_URL` (automatically set by Railway Redis service)

3. **Test deployment:**
   ```bash
   curl -X POST https://your-app.railway.app/api/orders/execute \
     -H "Content-Type: application/json" \
     -d '{"fromToken":"SOL","toToken":"USDC","amount":100,"slippage":0.5}'
   ```

## Deploy to Render

1. **Push to GitHub** (same as above)

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect GitHub repo
   - Settings:
     - Build Command: `npm run build`
     - Start Command: `npm start`
   - Add Redis service: "New" → "Redis"
   - Environment variables:
     - `NODE_ENV=production`
     - `REDIS_URL` (from Redis service)

## Local Development

```bash
npm install
npm run dev
```