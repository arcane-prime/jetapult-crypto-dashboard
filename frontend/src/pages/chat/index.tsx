import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCryptoSearch } from '../../hooks/use-crypto-search';
import type { CryptoSummary, CryptoTrendResponse, SearchResponse } from '../../types/crypto';
import { PriceResponse } from './components/price-response';
import { TrendResponse } from './components/trend-response';

interface Message {
  id: string;
  query: string;
  response: SearchResponse;
  isLoading: boolean;
  error: string | null;
  showDetails: boolean;
}

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { search, response, isLoading, error } = useCryptoSearch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (response !== null || error !== null) {
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage && lastMessage.isLoading) {
          lastMessage.response = response;
          lastMessage.error = error;
          lastMessage.isLoading = false;
        }
        return updated;
      });
    }
  }, [response, error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }

    const queryText = query.trim();
    setQuery('');

    // Add user message and loading state
    const newMessage: Message = {
      id: Date.now().toString(),
      query: queryText,
      response: null,
      isLoading: true,
      error: null,
      showDetails: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Search
    await search(queryText);
  };

  const isPriceResponse = (data: SearchResponse): data is CryptoSummary => {
    return data !== null && 'current_price' in data;
  };

  const isTrendResponse = (data: SearchResponse): data is CryptoTrendResponse => {
    return data !== null && 'prices' in data;
  };

  const getChatAnswer = (response: SearchResponse): string => {
    if (!response) {
      return "I couldn't find any information for that query. Please try rephrasing your question.";
    }

    if (isPriceResponse(response)) {
      const changeText =
        response.price_change_percentage_24h >= 0 ? 'increased' : 'decreased';
      return `This is the current price information for ${response.name} (${response.symbol.toUpperCase()}). The current price is $${response.current_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}. Over the last 24 hours, the price has ${changeText} by ${Math.abs(response.price_change_percentage_24h).toFixed(2)}%. ${response.name} is currently ranked #${response.market_cap_rank} by market capitalization.`;
    }

    if (isTrendResponse(response)) {
      const daysCount = response.prices.length;
      const cryptoName = response.id.charAt(0).toUpperCase() + response.id.slice(1);
      const latestPrice = response.prices[response.prices.length - 1];
      const earliestPrice = response.prices[0];
      const priceChange =
        latestPrice && earliestPrice ? latestPrice.value - earliestPrice.value : null;
      const priceChangePercent =
        priceChange && earliestPrice ? (priceChange / earliestPrice.value) * 100 : null;

      if (priceChangePercent !== null) {
        const trendText = priceChangePercent >= 0 ? 'increased' : 'decreased';
        return `This is the ${daysCount}-day trend data for ${cryptoName}. Over the last ${daysCount} days, the price has ${trendText} by ${Math.abs(priceChangePercent).toFixed(2)}%, from $${earliestPrice.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} to $${latestPrice.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`;
      }

      return `This is the ${daysCount}-day trend data for ${cryptoName}, showing historical price and market cap information.`;
    }

    return 'Here is the information you requested.';
  };

  const toggleDetails = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, showDetails: !msg.showDetails } : msg
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8 text-white">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-gray-700 bg-gray-900/60 p-6 shadow-xl backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold">Crypto Assistant</h1>
            <p className="mt-1 text-sm text-gray-400">Ask questions about cryptocurrencies</p>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            ← Back
          </Link>
        </header>

        {/* Chat Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/60 shadow-xl backdrop-blur">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-gray-400">Start a conversation</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Try asking: "What is the price of Bitcoin?" or "Show me the 7-day trend of
                    Ethereum"
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-none border border-indigo-500/30 bg-indigo-500/20 px-4 py-3">
                        <p className="text-sm text-indigo-100">{message.query}</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-gray-700 bg-gray-800/50 px-4 py-3">
                        {message.isLoading && (
                          <p className="text-sm text-gray-400">Searching...</p>
                        )}

                        {message.error && (
                          <p className="text-sm text-rose-400">
                            Error: {message.error}. Please try again.
                          </p>
                        )}

                        {!message.isLoading && !message.error && message.response === null && (
                          <p className="text-sm text-gray-400">
                            No results found. Try rephrasing your question.
                          </p>
                        )}

                        {!message.isLoading &&
                          !message.error &&
                          message.response !== null && (
                            <div className="space-y-4">
                              {/* Chat Answer */}
                              <p className="text-sm leading-relaxed text-gray-200">
                                {getChatAnswer(message.response)}
                              </p>

                              {/* Show Details Toggle */}
                              {!message.showDetails && (
                                <div className="flex items-center gap-3">
                                  <p className="text-xs text-gray-400">Would you like to see more details?</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => toggleDetails(message.id)}
                                      className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMessages((prev) =>
                                          prev.map((msg) =>
                                            msg.id === message.id ? { ...msg, showDetails: false } : msg
                                          )
                                        );
                                      }}
                                      className="rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-gray-700"
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Detailed Response */}
                              {message.showDetails && (
                                <div className="mt-4 border-t border-gray-700 pt-4">
                                  {isPriceResponse(message.response) && (
                                    <PriceResponse data={message.response} />
                                  )}
                                  {isTrendResponse(message.response) && (
                                    <TrendResponse data={message.response} />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about cryptocurrencies..."
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

