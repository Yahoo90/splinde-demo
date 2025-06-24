'use client';

import { useState } from 'react';
import { Section, ComputedSection, Entry, NodeAction } from '@/lib/types';
import { TreeNode } from './tree-node';
import { useNotifications } from './notification-provider';

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
  field: 'sum' | 'note' | 'name',
  value: string | number
): Entry | ComputedSection {
  if (path.length === 0) {
    // Update this node
    return { ...node, [field]: value };
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

function addNodeToTree(
  node: Entry | ComputedSection,
  path: number[],
  nodeType: 'entry' | 'section'
): Entry | ComputedSection {
  if (path.length === 0) {
    // Add to this node (must be a section)
    if ('children' in node) {
      const newChild = nodeType === 'entry' 
        ? { name: 'New Entry', note: '', sum: 0 } as Entry
        : { name: 'New Section', children: [] } as Section;
      
      return {
        ...node,
        children: [...node.children, newChild]
      } as ComputedSection;
    }
    return node;
  }
  
  // Navigate deeper
  if ('children' in node) {
    const [nextIndex, ...remainingPath] = path;
    const updatedChildren = node.children.map((child, index) => {
      if (index === nextIndex) {
        return addNodeToTree(child, remainingPath, nodeType);
      }
      return child;
    });
    
    return { ...node, children: updatedChildren } as ComputedSection;
  }
  
  return node;
}

function removeNodeFromTree(
  node: Entry | ComputedSection,
  path: number[]
): Entry | ComputedSection | null {
  if (path.length === 0) {
    // Remove this node
    return null;
  }
  
  // Navigate deeper
  if ('children' in node) {
    const [nextIndex, ...remainingPath] = path;
    
    if (remainingPath.length === 0) {
      // Remove child at nextIndex
      const updatedChildren = node.children.filter((_, index) => index !== nextIndex);
      return { ...node, children: updatedChildren } as ComputedSection;
    } else {
      // Continue navigating
      const updatedChildren = node.children.map((child, index) => {
        if (index === nextIndex) {
          const result = removeNodeFromTree(child, remainingPath);
          return result;
        }
        return child;
      }).filter((child): child is Entry | ComputedSection => child !== null);
      
      return { ...node, children: updatedChildren } as ComputedSection;
    }
  }
  
  return node;
}

export function SplindeTree({ initialData }: SplindeTreeProps) {
  const [data, setData] = useState<ComputedSection>(() => 
    addComputedSums(initialData) as ComputedSection
  );
  const { addNotification } = useNotifications();

  const getNodeName = (node: Entry | ComputedSection, path: number[]): string => {
    if (path.length === 0) return node.name;
    
    // Navigate to the node to get its name
    let current: Entry | ComputedSection = node;
    for (const index of path) {
      if ('children' in current) {
        current = current.children[index];
      }
    }
    return current.name;
  };

  const handleAction = (action: NodeAction) => {
    let shouldShowNotification = false;
    let notificationMessage = '';
    let notificationType: 'success' | 'info' = 'info';
    let nodeName = '';

    // Get node name before removal if needed
    if (action.type === 'remove-node') {
      nodeName = getNodeName(data, action.path);
    }

    setData(prevData => {
      let updated: Entry | ComputedSection | null = prevData;
      
      switch (action.type) {
        case 'update':
          updated = updateNodeInTree(prevData, action.path, action.field, action.value);
          break;
        case 'add-entry':
          updated = addNodeToTree(prevData, action.path, 'entry');
          shouldShowNotification = true;
          notificationMessage = 'New entry added successfully! 📝';
          notificationType = 'success';
          break;
        case 'add-section':
          updated = addNodeToTree(prevData, action.path, 'section');
          shouldShowNotification = true;
          notificationMessage = 'New section created successfully! 📁';
          notificationType = 'success';
          break;
        case 'remove-node':
          updated = removeNodeFromTree(prevData, action.path);
          if (updated !== null) {
            shouldShowNotification = true;
            notificationMessage = `"${nodeName}" has been removed 🗑️`;
            notificationType = 'info';
          }
          break;
      }
      
      if (updated === null) {
        // If root is removed, return original data
        return prevData;
      }
      
      return addComputedSums(updated) as ComputedSection;
    });

    // Show notification after state update is complete
    if (shouldShowNotification) {
      setTimeout(() => {
        addNotification(notificationMessage, notificationType);
      }, 0);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl px-12 pt-6 font-bold mb-2 sm:mb-4" style={{ color: 'var(--color-foreground)' }}>
          SPLINDE Demo
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl" style={{ color: 'var(--color-foreground)' }}>by Jan
        </p>
      </div>
      
      <TreeNode 
        node={data}
        onAction={handleAction}
        path={[]}
        level={0}
      />
    </div>
  );
}