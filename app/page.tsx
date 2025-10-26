'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testTelegram = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-telegram');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to test Telegram connection');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  const runScraper = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scrape');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to scrape car listings');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🚗 Car Data Telegram Bot
            </h1>
            <p className="text-lg text-gray-600">
              Automatically scrape car listings and post them to your Telegram channel
            </p>
          </div>

          <div className="space-y-6">
            {/* Configuration Status */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Configuration</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Bot Token:</span>{' '}
                  {process.env.NEXT_PUBLIC_BOT_CONFIGURED ? '✅ Configured' : '❌ Not configured'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Channel ID:</span>{' '}
                  {process.env.NEXT_PUBLIC_CHANNEL_CONFIGURED ? '✅ Configured' : '❌ Not configured'}
                </p>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testTelegram}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? '⏳ Testing...' : '🔍 Test Telegram Connection'}
              </button>

              <button
                onClick={runScraper}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? '⏳ Scraping...' : '🚀 Run Scraper Now'}
              </button>
            </div>

            {/* Results Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success</h3>
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {/* Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">ℹ️ How it Works</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>The bot scrapes car listings from multiple popular automotive websites</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>It formats the data into readable messages with prices, details, and links</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Messages are automatically posted to your configured Telegram channel</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>You can trigger manual updates or set up automated cron jobs</span>
                </li>
              </ul>
            </div>

            {/* Setup Instructions */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Setup Instructions</h2>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Create a Telegram bot using @BotFather and get your bot token</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Create a Telegram channel and add your bot as an administrator</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Set environment variables: TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>For automated updates, set up a cron job to call /api/cron endpoint</span>
                </li>
              </ol>
            </div>

            {/* API Endpoints */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🔌 API Endpoints</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-white px-3 py-1 rounded border border-gray-300">
                    GET /api/test-telegram
                  </code>
                  <span className="ml-2 text-gray-600">Test Telegram bot configuration</span>
                </div>
                <div>
                  <code className="bg-white px-3 py-1 rounded border border-gray-300">
                    GET /api/scrape
                  </code>
                  <span className="ml-2 text-gray-600">Manually trigger car scraping</span>
                </div>
                <div>
                  <code className="bg-white px-3 py-1 rounded border border-gray-300">
                    GET /api/cron
                  </code>
                  <span className="ml-2 text-gray-600">Automated cron job endpoint</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Built with Next.js, TypeScript, and Telegram Bot API</p>
        </footer>
      </div>
    </div>
  );
}
