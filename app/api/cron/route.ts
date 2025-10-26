import { NextRequest, NextResponse } from 'next/server';
import carScrapers from '@/lib/scrapers/carScrapers';
import { TelegramBot } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

// This endpoint can be called by external cron services like Vercel Cron or cron-job.org
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional: Protect the endpoint with a secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    console.log('Starting scheduled car scraping...');

    // Get latest car deals
    const listings = await carScrapers.getTopDeals(5);

    if (listings.length === 0) {
      console.log('No listings found');
      return NextResponse.json({
        success: false,
        message: 'No listings found'
      });
    }

    // Send to Telegram
    const bot = new TelegramBot(botToken, channelId);

    // Send header message
    const headerMessage = `📢 *Latest Car Deals Update*\n\n${new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\nFound ${listings.length} new deals:`;

    await bot.sendMessage(headerMessage);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sentCount = await bot.sendCarListings(listings);

    console.log(`Successfully sent ${sentCount}/${listings.length} listings`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      listingsFound: listings.length,
      listingsSent: sentCount
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    );
  }
}
