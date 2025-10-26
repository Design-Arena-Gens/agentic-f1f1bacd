import { CarListing } from '../scrapers/carScrapers';

export class TelegramBot {
  private botToken: string;
  private channelId: string;
  private baseUrl: string;

  constructor(botToken: string, channelId: string) {
    this.botToken = botToken;
    this.channelId = channelId;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  formatCarMessage(listing: CarListing): string {
    let message = `🚗 *${listing.title}*\n\n`;
    message += `💰 Price: *${listing.price}*\n`;

    if (listing.year) message += `📅 Year: ${listing.year}\n`;
    if (listing.mileage) message += `🛣️ Mileage: ${listing.mileage}\n`;
    if (listing.location) message += `📍 Location: ${listing.location}\n`;
    if (listing.description) message += `\n${listing.description}\n`;

    message += `\n🔗 [View Listing](${listing.url})\n`;
    message += `📊 Source: ${listing.source}`;

    return message;
  }

  async sendMessage(text: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.channelId,
          text: text,
          parse_mode: 'Markdown',
          disable_web_page_preview: false,
        }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
      return false;
    }
  }

  async sendCarListing(listing: CarListing): Promise<boolean> {
    const message = this.formatCarMessage(listing);
    return await this.sendMessage(message);
  }

  async sendCarListings(listings: CarListing[]): Promise<number> {
    let successCount = 0;

    for (const listing of listings) {
      const success = await this.sendCarListing(listing);
      if (success) {
        successCount++;
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return successCount;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      return false;
    }
  }
}
