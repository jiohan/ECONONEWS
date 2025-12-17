import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { NewsItem } from '../../types';

interface NewsResponse {
    success: boolean;
    data: NewsItem[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

export const useNews = (page = 1) => {
    return useQuery({
        queryKey: ['news', page],
        queryFn: async (): Promise<NewsItem[]> => {
            const { data } = await api.get<NewsResponse>(`/news?page=${page}`);
            // Map backend response to frontend NewsItem type if needed
            // The backend returns an array of news in `data.data`
            // We might need to map fields if they differ (e.g. date format, image)

            // Adaptation: Backend DB `terms` is JSON, frontend expects specific structure
            // Also Backend doesn't have `imageUrl` yet, so we might need a placeholder or update backend
            return data.data.map((item: any) => ({
                id: String(item.id),
                title: item.title,
                summary: item.summary,
                fullSummary: item.summary, // Backend might need full content
                source: item.sourceUrl || 'AI Summary',
                timeAgo: new Date(item.date).toLocaleDateString(),
                // Add random or placeholder image as backend doesn't support it yet
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjGUArigSIOcXoVjrk7PFT6acCJaXaHU_Bm2ixug_x-mxw4lSVgvGwCBjHRIR6r8x5r7jKL5HHQ5N08O0CMhF91E4T3-z5m2RyQgtIqhF5Qy-L9gvnKE3R3RvurfmRcqRiboijVCWCnaBvP-C3mOpV9_ZcpPdMKyJyfevjT2BldYzBL56OC4wVDekRlb8M8JTLqodB4SLkv9cV4Kh_ufb09pqWr33p86ioNDtqZNXCWo40doqEw1tdF3n79kUiu32NTxfEq4jS9L5T4',
                tags: ['Economy'],
                vocabulary: item.terms?.map((t: any) => ({
                    term: t.name,
                    definition: t.definition,
                    explanation: t.explanation,
                    category: '경제' // Default category
                })) || []
            }));
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    });
};
