import { NextRequest, NextResponse } from 'next/server';
import carScrapers from '@/lib/scrapers/carScrapers';
import { TelegramBot } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    // Get car listings from all sources
    const listings = await carScrapers.getTopDeals(10);

    if (listings.length === 0) {
      return NextResponse.json(
        { error: 'No listings found' },
        { status: 404 }
      );
    }

    // Send to Telegram
    const bot = new TelegramBot(botToken, channelId);
    const sentCount = await bot.sendCarListings(listings);

    return NextResponse.json({
      success: true,
      listingsFound: listings.length,
      listingsSent: sentCount,
      listings: listings.map(l => ({
        title: l.title,
        price: l.price,
        source: l.source
      }))
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Scraping failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
