import React, { useState } from 'react';

const IndexItem = ({ item, isHeading = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate indent level (max 4 levels deep)
  const indentClass = `ml-${Math.min(item.level * 4, 16)}`;
  
  if (isHeading) {
    return (
      <div className="pb-2 mb-4 border-b border-gray-200">
        <div className={`text-lg font-semibold text-gray-900 flex items-center justify-between ${
          item.level === 0 ? 'text-xl' : ''
        }`}>
          <div className="flex-1">
            {item.numbering && (
              <span className="text-gray-500 mr-2 font-mono">{item.numbering}</span>
            )}
            {item.mainText}
          </div>
          {item.pageNumber && (
            <span className="text-gray-600 ml-4 pl-4 font-mono">{item.pageNumber}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`py-1.5 ${indentClass} hover:bg-gray-50 rounded group transition-colors duration-150`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center min-w-0 flex-1">
          {item.numbering && (
            <span className="text-gray-500 font-mono whitespace-nowrap mr-3">
              {item.numbering}
            </span>
          )}
          <span className="text-gray-800">{item.mainText}</span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          <div className="hidden sm:block border-t border-dotted border-gray-300 w-12"></div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-600 whitespace-nowrap">{item.pageNumber}</span>
            {isHovered && item.confidence && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                {Math.round(item.confidence * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexItem;