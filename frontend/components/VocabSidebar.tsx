import React, { useState } from 'react';
import { VocabTerm } from '../types';

interface VocabSidebarProps {
  items: VocabTerm[];
  isLoading: boolean;
}

const VocabSidebar: React.FC<VocabSidebarProps> = ({ items, isLoading }) => {
  // Track open state by item ID. null means all closed.
  const [openItemId, setOpenItemId] = useState<string | null>(items.length > 0 ? items[0].id : null);

  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <div className="glass-card-light rounded-lg p-6 flex-grow flex flex-col gap-6 h-fit sticky top-8">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 text-[22px] font-bold tracking-[-0.015em]">Key Vocabulary</h2>
        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0891b2]"></div>}
      </div>
      
      <div className="flex flex-col gap-4">
        {items.map((term, index) => (
          <React.Fragment key={term.id}>
            <div className="group">
              <div 
                className="flex justify-between items-center cursor-pointer py-1"
                onClick={() => toggleItem(term.id)}
              >
                <h3 className={`font-semibold text-lg transition-colors ${openItemId === term.id ? 'text-[#0891b2]' : 'text-gray-900'}`}>
                  {term.term}
                </h3>
                <span className={`material-symbols-outlined text-gray-500 transition-transform duration-300 ${openItemId === term.id ? 'rotate-180 text-[#0891b2]' : ''}`}>
                  expand_more
                </span>
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openItemId === term.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 text-sm pt-2 pb-2 leading-relaxed">
                  {term.definition}
                </p>
              </div>
            </div>
            {/* Divider, but don't show after last item */}
            {index < items.length - 1 && (
              <div className="w-full h-px bg-gray-200"></div>
            )}
          </React.Fragment>
        ))}
        
        {items.length === 0 && !isLoading && (
            <p className="text-gray-400 text-sm italic">Search for news to see related vocabulary.</p>
        )}
      </div>
    </div>
  );
};

export default VocabSidebar;