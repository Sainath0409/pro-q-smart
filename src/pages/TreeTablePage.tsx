import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { sampleTreeData } from '../data/treeData';
import type { TreeItem } from '../context/DataContext';
import { ChevronRight, ChevronDown, Package, Folder, FolderOpen, Tag } from 'lucide-react';
import { calculateTotalQuantity, calculateAverageRate } from '../utils/treeUtils';

import styles from './TreeTablePage.module.css';

interface TreeRowProps {
  item: TreeItem;
  level: number;
}

const TreeRow: React.FC<TreeRowProps> = React.memo(({ item, level }) => {
  const [isOpen, setIsOpen] = useState(level < 1); // Expand first level by default
  const hasChildren = item.children && item.children.length > 0;

  // Memoize aggregations to prevent unnecessary recalculations during tree traversals
  const totalQty = useMemo(() => calculateTotalQuantity(item), [item]);
  const avgRate = useMemo(() => calculateAverageRate(item), [item]);

  return (
    <>
      <tr className={`${styles.treeRow} ${styles[`type${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`]} ${level === 0 ? styles.root : ''}`}>
        <td style={{ paddingLeft: `${level * 32 + 16}px` }}>
          <div className={styles.flexCenterGap}>
            {hasChildren ? (
              <button
                className={styles.expandBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
              >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <div style={{ width: 24 }} />
            )}

            <div className={`${styles.iconBox} ${styles[item.type]}`}>
              {item.type === 'category' ? (isOpen ? <FolderOpen size={16} /> : <Folder size={16} />) :
                item.type === 'subcategory' ? <Tag size={16} /> :
                  <Package size={16} />}
            </div>

            <div className={styles.nameWrapper}>
              <span className={styles.rowName}>{item.name}</span>
              {item.id && item.id.includes('-') && <span className={styles.rowId}>{item.id}</span>}
            </div>
          </div>
        </td>
        <td>
          <span className={styles.rowDesc}>{item.description || '-'}</span>
        </td>
        <td className={styles.textRight}>
          <span className={`${styles.badge} ${item.type === 'item' ? '' : styles.aggregate}`}>
            {totalQty.toLocaleString()}
          </span>
        </td>
        <td className={styles.textRight}>
          <span className={styles.rowRate}>
            {avgRate > 0 ? `$${avgRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
            {item.type !== 'item' && avgRate > 0 && <span className={styles.avgLabel}>avg</span>}
          </span>
        </td>
      </tr>
      {hasChildren && isOpen && (
        item.children!.map(child => (
          <TreeRow key={child.id} item={child} level={level + 1} />
        ))
      )}
    </>
  );
});

const TreeTablePage: React.FC = () => {
  const { treeData } = useData();
  const displayData = treeData.length > 0 ? treeData : sampleTreeData;

  return (
    <div className="page-container fade-in">
      <div className={styles.pageHeader}>
        <h1>Hierarchical Tree Table</h1>
        <p>Advanced visualization for category-based item structures.</p>
      </div>

      <div className="table-wrapper card">
        <table className={styles.treeTable}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Category / Item Name</th>
              <th>Description</th>
              <th className={styles.textRight}>Quantity</th>
              <th className={styles.textRight}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map(item => (
              <TreeRow key={item.id} item={item} level={0} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreeTablePage;
