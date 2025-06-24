'use client';

import { useState } from 'react';
import { Entry, Section, ComputedSection } from '@/lib/types';

interface TreeNodeProps {
  node: Entry | ComputedSection;
  onUpdate: (path: number[], field: 'sum' | 'note', value: string | number) => void;
  path: number[];
  level?: number;
}

function isEntry(node: Entry | ComputedSection): node is Entry {
  return 'sum' in node && 'note' in node && !('children' in node);
}

export function TreeNode({ node, onUpdate, path, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const indentClass = level > 0 ? `ml-${level * 4}` : '';
  const borderClass = level > 0 ? 'border-l-2 border-gray-200 dark:border-gray-600 pl-4' : '';

  if (isEntry(node)) {
    return (
      <div className={`${indentClass} ${borderClass} py-2`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-gray-900/25 transition-shadow">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{node.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sum
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                defaultValue={node.sum}
                onBlur={(e) => onUpdate(path, 'sum', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                defaultValue={node.note}
                onBlur={(e) => onUpdate(path, 'note', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This is a ComputedSection
  const section = node as ComputedSection;
  
  return (
    <div className={`${indentClass} ${borderClass} py-2`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 p-4 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/25 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-gray-600 hover:bg-blue-200 dark:hover:bg-gray-500 transition-colors"
            >
              <span className={`transform transition-transform text-blue-600 dark:text-blue-300 text-xs ${isExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.name}</h2>
          </div>
          
          <div className="bg-blue-100 dark:bg-gray-600 px-3 py-1 rounded-full border border-blue-200 dark:border-gray-500">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total: {section.computedSum.toFixed(2)}
            </span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="space-y-2">
            {section.children.map((child, index) => (
              <TreeNode
                key={`${child.name}-${index}`}
                node={child}
                onUpdate={onUpdate}
                path={[...path, index]}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}