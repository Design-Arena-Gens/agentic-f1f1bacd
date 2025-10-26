import { NextRequest, NextResponse } from 'next/server';
import { TelegramBot } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
      return NextResponse.json(
        {
          error: 'Missing configuration',
          details: 'TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID must be set in environment variables'
        },
        { status: 500 }
      );
    }

    const bot = new TelegramBot(botToken, channelId);
    const isConnected = await bot.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to Telegram API' },
        { status: 500 }
      );
    }

    // Send test message
    const testMessage = '🤖 Car Data Bot is now active!\n\nI will post the latest car deals from popular automotive websites.';
    const messageSent = await bot.sendMessage(testMessage);

    return NextResponse.json({
      success: true,
      connected: isConnected,
      messageSent: messageSent,
      channelId: channelId,
      message: 'Telegram bot is configured correctly'
    });
  } catch (error) {
    console.error('Telegram test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: String(error) },
      { status: 500 }
    );
  }
}
