import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface BOMRow {
  'Item Code': string;
  'Material': string;
  'Quantity': number;
  'Estimated Rate': number;
  'Supplier 1 (Rate)': number;
  'Supplier 2 (Rate)': number;
  'Supplier 3 (Rate)': number;
  'Supplier 4 (Rate)': number;
  'Supplier 5 (Rate)': number;
  [key: string]: string | number;
}

export interface TreeItem {
  id: string;
  name: string;
  type: 'category' | 'subcategory' | 'item';
  description?: string;
  quantity?: number;
  rate?: number;
  children?: TreeItem[];
}

export interface RawTreeRow {
  Category: string;
  'Sub Category 1': string;
  'Sub Category 2': string;
  'Item Code': string;
  Description: string;
  Quantity: number;
  Rate: number;
}

export interface BOMUpload {
  id: string;
  fileName: string;
  timestamp: string;
  data: BOMRow[];
}

interface DataContextType {
  bomUploads: BOMUpload[];
  setBomUploads: (uploads: BOMUpload[]) => void;
  addBomUpload: (file: File, data: BOMRow[]) => void;
  currentBomData: BOMRow[];
  setCurrentBomData: (data: BOMRow[]) => void;
  treeData: TreeItem[];
  setTreeData: (data: TreeItem[]) => void;
  transformRawToTree: (rows: RawTreeRow[]) => TreeItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bomUploads, setBomUploads] = useState<BOMUpload[]>([]);
  const [currentBomData, setCurrentBomData] = useState<BOMRow[]>([]);
  const [treeData, setTreeData] = useState<TreeItem[]>([]);

  const addBomUpload = (file: File, data: BOMRow[]) => {
    const newUpload: BOMUpload = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      timestamp: new Date().toLocaleString(),
      data: data,
    };
    setBomUploads(prev => [newUpload, ...prev]);
    setCurrentBomData(data); // Set as current view
  };

  const transformRawToTree = (rows: RawTreeRow[]): TreeItem[] => {
    // ... existing implementation
    const root: TreeItem[] = [];
    const categoryMap = new Map<string, TreeItem>();

    rows.forEach((row, index) => {
      const catName = row.Category;
      const sub1Name = row['Sub Category 1'];
      const sub2Name = row['Sub Category 2'];

      let cat = categoryMap.get(catName);
      if (!cat) {
        cat = { id: `cat-${catName}-${index}`, name: catName, type: 'category', children: [] };
        categoryMap.set(catName, cat);
        root.push(cat);
      }

      let sub1 = cat.children?.find(c => c.name === sub1Name);
      if (!sub1) {
        sub1 = { id: `sub1-${sub1Name}-${index}`, name: sub1Name, type: 'subcategory', children: [] };
        cat.children?.push(sub1);
      }

      let sub2 = sub1.children?.find(c => c.name === sub2Name);
      if (!sub2) {
        sub2 = { id: `sub2-${sub2Name}-${index}`, name: sub2Name, type: 'subcategory', children: [] };
        sub1.children?.push(sub2);
      }

      sub2.children?.push({
        id: row['Item Code'],
        name: row['Item Code'],
        type: 'item',
        description: row.Description,
        quantity: row.Quantity,
        rate: row.Rate
      });
    });

    return root;
  };

  return (
    <DataContext.Provider value={{
      bomUploads,
      setBomUploads,
      addBomUpload,
      currentBomData,
      setCurrentBomData,
      treeData,
      setTreeData,
      transformRawToTree
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
