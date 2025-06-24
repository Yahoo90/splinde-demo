'use client';

import { useState, useEffect } from 'react';
import { Section, ComputedSection, Entry } from '@/lib/types';
import { TreeNode } from './tree-node';

interface SplindeTreeProps {
  initialData: Section;
}

function computeSum(node: Entry | Section): number {
  if ('sum' in node) {
    // This is an Entry
    return node.sum;
  }
  
  // This is a Section
  return node.children.reduce((total, child) => total + computeSum(child), 0);
}

function addComputedSums(node: Entry | Section): Entry | ComputedSection {
  if ('sum' in node && 'note' in node && !('children' in node)) {
    // This is an Entry
    return node;
  }
  
  // This is a Section
  const section = node as Section;
  const computedChildren = section.children.map(child => addComputedSums(child));
  const computedSum = computedChildren.reduce((total, child) => {
    if ('sum' in child) {
      return total + child.sum;
    }
    return total + (child as ComputedSection).computedSum;
  }, 0);
  
  return {
    name: section.name,
    children: computedChildren,
    computedSum
  } as ComputedSection;
}

function updateNodeInTree(
  node: Entry | ComputedSection,
  path: number[],
  field: 'sum' | 'note',
  value: string | number
): Entry | ComputedSection {
  if (path.length === 0) {
    // Update this node
    if ('sum' in node && 'note' in node && !('children' in node)) {
      return { ...node, [field]: value };
    }
    return node;
  }
  
  // Navigate deeper
  if ('children' in node) {
    const [nextIndex, ...remainingPath] = path;
    const updatedChildren = node.children.map((child, index) => {
      if (index === nextIndex) {
        return updateNodeInTree(child, remainingPath, field, value);
      }
      return child;
    });
    
    return { ...node, children: updatedChildren };
  }
  
  return node;
}

export function SplindeTree({ initialData }: SplindeTreeProps) {
  const [data, setData] = useState<ComputedSection>(() => 
    addComputedSums(initialData) as ComputedSection
  );

  const handleUpdate = (path: number[], field: 'sum' | 'note', value: string | number) => {
    setData(prevData => {
      const updated = updateNodeInTree(prevData, path, field, value);
      return addComputedSums(updated) as ComputedSection;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          SPLINDE Demo
        </h1>
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 inline-block border border-green-200 dark:border-green-700 shadow-lg dark:shadow-gray-900/25">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
            Grand Total
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {data.computedSum.toFixed(2)}
          </p>
        </div>
      </div>
      
      <TreeNode 
        node={data}
        onUpdate={handleUpdate}
        path={[]}
        level={0}
      />
    </div>
  );
}