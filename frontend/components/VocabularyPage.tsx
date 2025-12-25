import React, { useState } from 'react';
import { VocabTerm } from '../types';

interface VocabularyPageProps {
    terms: VocabTerm[];
    isLoading: boolean;
}

const VocabularyPage: React.FC<VocabularyPageProps> = ({ terms, isLoading }) => {
    const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

    const toggleTerm = (term: string) => {
        const newExpanded = new Set(expandedTerms);
        if (newExpanded.has(term)) {
            newExpanded.delete(term);
        } else {
            newExpanded.add(term);
        }
        setExpandedTerms(newExpanded);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass-card-light p-6 rounded-lg animate-pulse min-h-[100px]">
                        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (terms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 glass-card-light rounded-xl">
                <span className="material-symbols-outlined text-4xl mb-4 text-gray-400">menu_book</span>
                <p className="text-lg font-medium">No vocabulary terms found yet.</p>
                <p className="text-sm">Read more news to discover economic terms!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-gray-900 text-[22px] font-bold tracking-[-0.015em]">
                    Economic Vocabulary
                </h2>
                <p className="text-gray-600">
                    Click on a card to view the detailed definition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terms.map((term, index) => {
                    const isExpanded = expandedTerms.has(term.term);
                    return (
                        <div
                            key={`${term.id}-${index}`}
                            onClick={() => toggleTerm(term.term)}
                            className={`glass-card-light p-5 rounded-xl border border-transparent hover:border-[#0891b2]/30 transition-all cursor-pointer group ${isExpanded ? 'ring-2 ring-[#0891b2]/10 bg-white' : 'hover:bg-white/60'}`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-[#0891b2]' : 'text-gray-800'}`}>
                                    {term.term}
                                </h3>
                                <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#0891b2]' : ''}`}>
                                    <span className="material-symbols-outlined">expand_more</span>
                                </div>
                            </div>

                            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="flex flex-col gap-3 pt-2 border-t border-dashed border-gray-200">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Definition</p>
                                            <p className="text-gray-700 text-sm leading-relaxed">{term.definition}</p>
                                        </div>
                                        {term.explanation && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Context</p>
                                                <p className="text-gray-600 text-sm italic leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    "{term.explanation}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VocabularyPage;

