export interface VocabTerm {
  id?: string;
  term: string;
  definition: string;
  explanation?: string; // Easy explanation
  category?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullSummary?: string;
  source: string;
  timeAgo: string;
  imageUrl: string;
  tags: string[];
  vocabulary?: VocabTerm[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface StockItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  data: number[];
}