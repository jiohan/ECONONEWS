import { StockItem } from '../types';

// Mock Stock Data - extracted from geminiService.ts to keep sidebar functional
const MOCK_STOCKS: StockItem[] = [
    { symbol: 'BTC-USD', name: 'Bitcoin USD', price: '34,196', change: '-314.95', changePercent: '-0.91%', isPositive: false, data: [34500, 34400, 34200, 34300, 34100, 34196] },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: '216.52', change: '+4.44', changePercent: '+2.09%', isPositive: true, data: [210, 212, 211, 214, 215, 216.52] },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: '128.56', change: '+2.00', changePercent: '+1.58%', isPositive: true, data: [126, 126.5, 127, 128, 128.2, 128.56] },
    { symbol: 'AAPL', name: 'Apple Inc.', price: '173.44', change: '+0.44', changePercent: '+0.25%', isPositive: true, data: [173, 172.8, 173.1, 173.2, 173.4, 173.44] },
    { symbol: 'S&P 500', name: 'Standard & Poor\'s', price: '4,248', change: '+30.64', changePercent: '+0.73%', isPositive: true, data: [4210, 4220, 4215, 4235, 4240, 4248] },
    { symbol: 'GME', name: 'GameStop Corp.', price: '14.04', change: '+0.60', changePercent: '+4.46%', isPositive: true, data: [13.2, 13.5, 13.4, 13.8, 14.0, 14.04] },
];

export const fetchStocks = async (): Promise<StockItem[]> => {
    // Simulating delay
    return new Promise(resolve => setTimeout(() => resolve(MOCK_STOCKS), 500));
};
