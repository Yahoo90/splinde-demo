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
  
  const marginLeft = level > 0 ? `${level * 16}px` : '0px';
  const borderClass = level > 0 ? 'border-l-2 pl-4' : '';

  if (isEntry(node)) {
    return (
      <div className={`${borderClass} py-2`} 
           style={{ 
             marginLeft,
             borderLeftColor: level > 0 ? 'var(--color-gray-300)' : undefined
           }}>
        <div className="rounded-lg shadow-md border p-4 hover:shadow-lg transition-all duration-200"
             style={{ 
               backgroundColor: 'var(--color-background)',
               borderColor: 'var(--color-gray-300)',
               color: 'var(--color-foreground)'
             }}>
          <h3 className="font-semibold mb-3">{node.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>
                Sum
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                style={{
                  borderColor: 'var(--color-gray-300)',
                  backgroundColor: 'var(--color-gray-50)',
                  color: 'var(--color-foreground)'
                }}
                defaultValue={node.sum}
                onBlur={(e) => onUpdate(path, 'sum', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>
                Note
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                style={{
                  borderColor: 'var(--color-gray-300)',
                  backgroundColor: 'var(--color-gray-50)',
                  color: 'var(--color-foreground)'
                }}
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
  const isRootLevel = level === 0;
  
  return (
    <div className={`${borderClass} py-2`} 
         style={{ 
           marginLeft,
           borderLeftColor: level > 0 ? 'var(--color-gray-300)' : undefined
         }}>
      <div className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${
          isRootLevel ? 'p-6 border-4' : 'p-4 border-2'
        }`}
           style={{ 
             background: isRootLevel 
               ? 'linear-gradient(135deg, var(--color-gray-50), var(--color-gray-100))' 
               : 'linear-gradient(to right, var(--color-gray-100), var(--color-gray-50))',
             borderColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-300)',
             boxShadow: isRootLevel 
               ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
               : undefined
           }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex-shrink-0 flex items-center justify-center rounded-full hover:opacity-80 transition-all duration-200 shadow-md cursor-pointer ${
                isRootLevel ? 'w-10 h-10 hover:scale-105' : 'w-7 h-7'
              }`}
              style={{ 
                backgroundColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-200)',
                color: isRootLevel ? 'var(--color-background)' : 'var(--color-gray-600)'
              }}
            >
              <span className={`transform transition-transform font-bold ${isExpanded ? 'rotate-90' : ''} ${
                isRootLevel ? 'text-lg' : 'text-sm'
              }`}>
                ▶
              </span>
            </button>
            <h2 className={`font-bold ${isRootLevel ? 'text-2xl' : 'text-lg'}`} 
                style={{ color: 'var(--color-foreground)' }}>
              {section.name}
            </h2>
          </div>
          
          <div className={`rounded-full shadow-md transition-all duration-200 hover:scale-105 ${
              isRootLevel ? 'px-8 py-4 border-3' : 'px-4 py-2 border'
            }`}
               style={{ 
                 backgroundColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-200)',
                 borderColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-300)',
                 color: isRootLevel ? 'var(--color-background)' : 'var(--color-gray-700)'
               }}>
            <span className={`font-bold ${isRootLevel ? 'text-xl' : 'text-sm'}`}>
              Total: {section.computedSum.toFixed(2)}
            </span>
          </div>
        </div>
        
        {isExpanded && (
          <div className={`space-y-3 ${isRootLevel ? 'mt-6' : 'mt-4'}`}>
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