import type { TreeItem } from '../context/DataContext';

/**
 * Recursively calculates the total quantity for a tree item.
 */
export const calculateTotalQuantity = (item: TreeItem): number => {
    if (item.type === 'item') return item.quantity || 0;
    return (item.children || []).reduce((sum, child) => sum + calculateTotalQuantity(child), 0);
};

/**
 * Recursively calculates the average rate for a tree item.
 */
export const calculateAverageRate = (item: TreeItem): number => {
    if (item.type === 'item') return item.rate || 0;
    const children = item.children || [];
    if (children.length === 0) return 0;

    // Use a simple average of child rates for categories
    const sum = children.reduce((acc, child) => acc + calculateAverageRate(child), 0);
    return sum / children.length;
};
