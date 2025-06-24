'use client';

import { useState } from 'react';
import { Entry, Section, ComputedSection } from '@/lib/types';

interface TreeNodeProps {
  node: Entry | ComputedSection;
  onUpdate: (path: number[], field: 'sum' | 'note' | 'name', value: string | number) => void;
  path: number[];
  level?: number;
}

function isEntry(node: Entry | ComputedSection): node is Entry {
  return 'sum' in node && 'note' in node && !('children' in node);
}

// Icon mapping function
function getNodeIcon(name: string): string {
  const iconMap: { [key: string]: string } = {
    // Root level
    'Annual Report': '📊',
    
    // Main categories
    'Sales': '💰',
    'Marketing': '📢',
    'R&D': '🔬',
    'Operations': '⚙️',
    
    // Sales subcategories
    'Q1 Sales': '📈',
    'Q2 Sales': '📈',
    'Q3 Sales': '📈',
    'Q4 Sales': '📈',
    
    // Marketing subcategories
    'Digital Campaigns': '💻',
    'Event Sponsorships': '🎪',
    
    // R&D subcategories
    'New Product Development': '🛠️',
    'Innovation Lab': '🧪',
    
    // Operations subcategories
    'HR': '👥',
    'Logistics': '🚚',
    'Customer Support': '🎧',
    
    // HR subcategories
    'HR tool': '💼',
  };
  
  return iconMap[name] || '📋'; // Default icon if not found
}

export function TreeNode({ node, onUpdate, path, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(node.name);
  
  const marginLeft = level > 0 ? `${Math.min(level * 12, 48)}px` : '0px'; // Limit nesting on mobile
  const borderClass = level > 0 ? 'border-l-2 pl-2 sm:pl-4' : '';
  const nodeIcon = getNodeIcon(node.name);

  const handleNameDoubleClick = () => {
    setIsEditingName(true);
    setEditingName(node.name);
  };

  const handleNameSave = () => {
    if (editingName.trim() !== node.name) {
      onUpdate(path, 'name', editingName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditingName(node.name);
      setIsEditingName(false);
    }
  };

  if (isEntry(node)) {
    return (
      <div className={`${borderClass} py-1.5 sm:py-2 animate-slideIn`} 
           style={{ 
             marginLeft,
             borderLeftColor: level > 0 ? 'var(--color-gray-300)' : undefined
           }}>
        <div className="rounded-lg shadow-md border p-3 sm:p-4 transition-all duration-400 hover:shadow-xl"
             style={{ 
               backgroundColor: 'var(--color-background)',
               borderColor: 'var(--color-gray-300)',
               color: 'var(--color-foreground)',
               transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
             }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0 transition-transform duration-300">
              {nodeIcon}
            </span>
            {isEditingName ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                className="font-semibold w-full px-2 py-1 border-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer animate-pulse-subtle text-sm sm:text-base"
                style={{
                  borderColor: 'var(--color-blue-400)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                autoFocus
              />
            ) : (
              <h3 
                className="font-semibold cursor-pointer transition-all duration-300 hover:opacity-80 hover:transform text-sm sm:text-base md:text-lg"
                onDoubleClick={handleNameDoubleClick}
                title="Double-click to edit name"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {node.name}
              </h3>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200" style={{ color: 'var(--color-gray-600)' }}>
                Sum
              </label>
              <input
                type="number"
                className="w-full px-2.5 sm:px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg text-sm sm:text-base"
                style={{
                  borderColor: 'var(--color-gray-300)',
                  backgroundColor: 'var(--color-gray-50)',
                  color: 'var(--color-foreground)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                defaultValue={node.sum}
                onBlur={(e) => onUpdate(path, 'sum', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 transition-colors duration-200" style={{ color: 'var(--color-gray-600)' }}>
                Note
              </label>
              <input
                type="text"
                className="w-full px-2.5 sm:px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg text-sm sm:text-base"
                style={{
                  borderColor: 'var(--color-gray-300)',
                  backgroundColor: 'var(--color-gray-50)',
                  color: 'var(--color-foreground)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
    <div className={`${borderClass} py-1.5 sm:py-2 animate-slideIn`} 
         style={{ 
           marginLeft,
           borderLeftColor: level > 0 ? 'var(--color-gray-300)' : undefined
         }}>
      <div className={`rounded-lg shadow-md transition-all duration-500 hover:shadow-2xl ${
          isRootLevel ? 'p-4 sm:p-6 border' : 'p-3 sm:p-4 border-2'
        }`}
           style={{ 
             background: isRootLevel 
               ? 'linear-gradient(135deg, var(--color-gray-50), var(--color-gray-100))' 
               : 'linear-gradient(to right, var(--color-gray-100), var(--color-gray-50))',
             borderColor: isRootLevel ? 'var(--color-gray-400)' : 'var(--color-gray-300)',
             boxShadow: isRootLevel 
               ? '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
               : undefined,
             transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease-out'
           }}>
        <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-400 shadow-md cursor-pointer animate-bounce-subtle ${
                isRootLevel ? 'w-8 h-8 sm:w-10 sm:h-10 hover:shadow-lg' : 'w-6 h-6 sm:w-7 sm:h-7 hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-200)',
                color: isRootLevel ? 'var(--color-background)' : 'var(--color-gray-600)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease-out'
              }}
            >
              <span className={`transform transition-all duration-500 font-bold ${isExpanded ? 'rotate-90' : 'rotate-0'} ${
                isRootLevel ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'
              }`}
              style={{
                transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
              }}>
                ▶
              </span>
            </button>
            
            <span className={`flex-shrink-0 transition-transform duration-300 ${
              isRootLevel ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl md:text-2xl'
            }`}>
              {nodeIcon}
            </span>
            
            {isEditingName ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                className={`font-bold px-2 py-1 border-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer animate-pulse-subtle flex-1 min-w-0 ${
                  isRootLevel ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'
                }`}
                style={{
                  borderColor: 'var(--color-blue-400)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                autoFocus
              />
            ) : (
              <h2 
                className={`font-bold cursor-pointer transition-all duration-300 hover:opacity-80 hover:transform flex-1 min-w-0 truncate ${
                  isRootLevel ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'
                }`}
                style={{ 
                  color: 'var(--color-foreground)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onDoubleClick={handleNameDoubleClick}
                title="Double-click to edit name"
              >
                {section.name}
              </h2>
            )}
          </div>
          
          <div className={`rounded-full shadow-md transition-all duration-400 hover:shadow-xl animate-float flex-shrink-0 ${
              isRootLevel ? 'px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border-2 sm:border-3' : 'px-2 sm:px-3 md:px-4 py-1 sm:py-2 border'
            }`}
               style={{ 
                 backgroundColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-200)',
                 borderColor: isRootLevel ? 'var(--color-foreground)' : 'var(--color-gray-300)',
                 color: isRootLevel ? 'var(--color-background)' : 'var(--color-gray-700)',
                 transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.2s ease-out'
               }}>
            <span className={`font-bold ${isRootLevel ? 'text-sm sm:text-lg md:text-xl' : 'text-xs sm:text-sm'}`}>
              <span className="hidden sm:inline">Total: </span>{section.computedSum.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className={`overflow-hidden transition-all duration-700 ${
          isExpanded 
            ? 'max-h-[3000px] opacity-100 transform translate-y-0' 
            : 'max-h-0 opacity-0 transform -translate-y-4'
        }`}
        style={{
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <div className={`space-y-2 sm:space-y-3 ${isRootLevel ? 'mt-4 sm:mt-6' : 'mt-3 sm:mt-4'}`}>
            {section.children.map((child, index) => (
              <div
                key={`${child.name}-${index}`}
                className={`transition-all duration-600 ease-spring ${
                  isExpanded 
                    ? 'transform translate-y-0 opacity-100 scale-100' 
                    : 'transform translate-y-6 opacity-0 scale-95'
                }`}
                style={{
                  transitionDelay: isExpanded ? `${index * 80 + 100}ms` : '0ms',
                  transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${isExpanded ? `${index * 80 + 100}ms` : '0ms'}`
                }}
              >
                <TreeNode
                  node={child}
                  onUpdate={onUpdate}
                  path={[...path, index]}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}