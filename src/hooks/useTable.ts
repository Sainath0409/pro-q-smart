import { useState, useMemo } from 'react';

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export const useTable = <T extends Record<string, any>>(initialData: T[], columns: string[]) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [frozenUntil, setFrozenUntil] = useState<number>(-1);

    const visibleColumns = useMemo(() =>
        columns.filter(col => !hiddenColumns.includes(col)),
        [columns, hiddenColumns]);

    const filteredAndSortedData = useMemo(() => {
        let items = [...initialData];

        // Search Filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            items = items.filter(row =>
                Object.values(row).some(val =>
                    String(val).toLowerCase().includes(lowerSearch)
                )
            );
        }

        // Sorting
        if (sortConfig) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }

                const aStr = String(aValue).toLowerCase();
                const bStr = String(bValue).toLowerCase();

                if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return items;
    }, [initialData, searchTerm, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleColumn = (col: string) => {
        setHiddenColumns(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        );
    };

    const handleFreeze = (colName: string) => {
        const colIndex = columns.indexOf(colName);
        setFrozenUntil(prev => (prev === colIndex ? -1 : colIndex));
    };

    return {
        data: filteredAndSortedData,
        sortConfig,
        requestSort,
        hiddenColumns,
        toggleColumn,
        searchTerm,
        setSearchTerm,
        frozenUntil,
        handleFreeze,
        visibleColumns
    };
};
