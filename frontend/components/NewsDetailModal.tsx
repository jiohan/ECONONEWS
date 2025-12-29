import React from 'react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
    item: NewsItem | null;
    onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">

                {/* Header Image & Close Button */}
                <div className="relative h-64 md:h-80 w-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url("${item.imageUrl}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-3 py-1 bg-[#0891b2] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3 shadow-lg shadow-[#0891b2]/40">
                            AI Analysis
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight shadow-black drop-shadow-md">
                            {item.title}
                        </h2>
                        <div className="flex gap-4 mt-3 text-white/80 text-sm font-medium">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{item.timeAgo}</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8 flex flex-col gap-8">

                    {/* Full Summary */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#0891b2]">smart_toy</span>
                            AI Summary
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed text-gray-700 dark:text-gray-300 text-base whitespace-pre-line">
                            {item.fullSummary || item.summary}
                        </div>
                    </div>

                    {/* Vocabulary Section */}
                    {item.vocabulary && item.vocabulary.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#0891b2]">menu_book</span>
                                Key Terms
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {item.vocabulary.map((vocab, idx) => (
                                    <div key={idx} className="bg-[#0891b2]/5 border border-[#0891b2]/10 rounded-lg p-5 hover:bg-[#0891b2]/10 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-[#0891b2] text-lg">{vocab.term}</span>
                                            {vocab.category && <span className="text-[10px] uppercase bg-white dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded shadow-sm">{vocab.category}</span>}
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 mr-1">Def:</span>
                                            {vocab.definition}
                                        </p>
                                        {vocab.explanation && (
                                            <div className="text-sm bg-white dark:bg-black/20 p-3 rounded text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 italic">
                                                "{vocab.explanation}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsDetailModal;
