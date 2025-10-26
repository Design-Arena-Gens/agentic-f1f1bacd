# 🚗 Car Data Telegram Bot

An automated system that scrapes car listings from popular automotive websites and posts them to a Telegram channel.

## Features

- 🔍 Scrapes car listings from multiple sources (AutoTrader, Cars.com, CarGurus, KBB)
- 📢 Automatically posts formatted listings to Telegram channel
- ⏰ Supports automated scheduling via cron jobs
- 🎨 Beautiful web dashboard for manual triggers and monitoring

## Setup

### 1. Create Telegram Bot

1. Open Telegram and search for @BotFather
2. Send `/newbot` and follow the instructions
3. Save the bot token provided

### 2. Create Telegram Channel

1. Create a new Telegram channel
2. Add your bot as an administrator
3. Get your channel ID (use @username or numeric ID)

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=@your_channel_name_or_id
```

### 4. Install and Run

```bash
npm install
npm run dev
```

## Deployment

```bash
vercel deploy --prod
```

## Technologies

- Next.js 14, TypeScript, Tailwind CSS, Telegram Bot API
