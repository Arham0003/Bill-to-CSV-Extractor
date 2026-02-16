# Vercel AI Gateway Setup Instructions

## Prerequisites
1. Vercel account with AI Gateway enabled
2. API key from Vercel AI Gateway

## Setup Steps

### 1. Get Your Vercel AI Gateway API Key
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to AI Gateway → API Keys
3. Create a new API key or use an existing one
4. Copy the API key

### 2. Configure Environment Variables

#### For Local Development:
Update your `.env` file:
```
VITE_VERCEL_AI_GATEWAY_API_KEY=your_actual_api_key_here
```

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - Name: `VITE_VERCEL_AI_GATEWAY_API_KEY`
   - Value: Your actual Vercel AI Gateway API key
   - Environment: Production, Preview, Development

### 3. Update vercel.json (Already done)
The `vercel.json` file has been configured to use the environment variable.

### 4. Deploy to Vercel
```bash
npm run build
vercel --prod
```

## How It Works
- The application now uses Vercel AI Gateway instead of direct Google Gemini API
- Vercel AI Gateway provides access to multiple AI models through a unified API
- Currently configured to use GPT-4o-mini model
- All API calls are routed through Vercel's infrastructure for better reliability and monitoring

## Troubleshooting
1. **API Key Not Found**: Make sure the environment variable is properly set
2. **CORS Issues**: Vercel AI Gateway handles CORS automatically
3. **Rate Limiting**: Check your Vercel plan limits for AI Gateway usage

## Security Notes
- Never commit actual API keys to version control
- Always use environment variables for sensitive data
- The `.env` file is already in `.gitignore` for security