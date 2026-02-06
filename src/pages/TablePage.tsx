import React from 'react';
import { useData } from '../context/DataContext';
import { useTable } from '../hooks/useTable';
import { COLUMN_WIDTHS, SUPPLIER_COLUMNS, BOM_COLUMNS } from '../constants/tableConstants';
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  Lock,
  Unlock,
  FileText,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { getHeatmapColor, getPercentageColor } from '../utils/tableUtils';
import styles from './TablePage.module.css';

const TablePage: React.FC = () => {
  const { currentBomData, bomUploads, setCurrentBomData } = useData();

  const {
    data: sortedData,
    sortConfig,
    requestSort,
    hiddenColumns,
    toggleColumn,
    searchTerm,
    setSearchTerm,
    frozenUntil,
    handleFreeze,
    visibleColumns
  } = useTable(currentBomData, BOM_COLUMNS);

  const calculateLeftOffset = (col: string) => {
    const visible = BOM_COLUMNS.filter(c => !hiddenColumns.includes(c));
    const idx = visible.indexOf(col);

    let offset = 0;
    for (let i = 0; i < idx; i++) {
      const colName = visible[i];
      if (colName === 'Item Code') offset += COLUMN_WIDTHS.ITEM_CODE;
      else if (colName === 'Material') offset += COLUMN_WIDTHS.MATERIAL;
      else if (colName === 'Quantity') offset += COLUMN_WIDTHS.QUANTITY;
      else if (colName === 'Estimated Rate') offset += COLUMN_WIDTHS.ESTIMATED_RATE;
      else offset += COLUMN_WIDTHS.SUPPLIER;
    }
    return `${offset}px`;
  };

  const handleExport = () => {
    const headers = visibleColumns.join(',');
    const rows = sortedData.map(row =>
      visibleColumns.map(col => row[col]).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bom_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentBomData.length === 0 && bomUploads.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={`${styles.emptyCard} fade-in`}>
          <Filter size={48} color="var(--text-muted)" />
          <h2>No Data Uploaded</h2>
          <p>Please upload a CSV file on the Upload page to see the analysis.</p>
          <a href="/" className={`${styles.btn} ${styles.btnPrimary}`}>Go to Upload</a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainerFull} fade-in`}>
      <div className={styles.headerActions}>
        <div>
          <h1>BOM Analysis Heatmap</h1>
          <p>Compare supplier rates and analyze market differences.</p>
        </div>
        <div className={styles.btnGroup}>
          {bomUploads.length > 0 && (
            <div className={styles.dropdown}>
              <button className={`${styles.btn} ${styles.btnSecondary} ${styles.flexCenter}`}>
                <FileText size={18} /> History ({bomUploads.length}) <ChevronDown size={14} />
              </button>
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownTitle}>Recent Uploads</div>
                {bomUploads.slice(0, 5).map(upload => (
                  <div
                    key={upload.id}
                    className={`${styles.dropdownItem} ${styles.historyItem} ${currentBomData === upload.data ? styles.active : ''}`}
                    onClick={() => setCurrentBomData(upload.data)}
                  >
                    <div className={styles.historyInfo}>
                      <span className={styles.fileName}>{upload.fileName}</span>
                      <span className={styles.fileMeta}>{upload.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.dropdown}>
            <button className={`${styles.btn} ${styles.btnSecondary} ${styles.flexCenter}`}>
              <Eye size={18} /> Columns <ChevronDown size={14} />
            </button>
            <div className={styles.dropdownMenu}>
              {BOM_COLUMNS.map(col => (
                <label key={col} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={!hiddenColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.flexCenter}`} onClick={handleExport}>
            <Download size={18} /> Export Results
          </button>
        </div>
      </div>

      <div className={`${styles.toolbar} card`}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search items, materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={`${styles.dot} ${styles.min}`}></span> Min Rate</div>
          <div className={styles.legendItem}><span className={`${styles.dot} ${styles.max}`}></span> Max Rate</div>
        </div>
      </div>

      <div className={`${styles.tableWrapper} card`}>
        <table className={styles.bomTable}>
          <thead>
            <tr>
              {visibleColumns.map((col) => {
                const isFrozen = BOM_COLUMNS.indexOf(col) <= frozenUntil;
                const leftOffset = isFrozen ? calculateLeftOffset(col) : 'auto';

                return (
                  <th
                    key={col}
                    className={isFrozen ? styles.frozen : ''}
                    style={{ left: leftOffset }}
                  >
                    <div className={styles.thContent}>
                      <div className={styles.thLabel} onClick={() => requestSort(col)}>
                        {col}
                        <ArrowUpDown
                          size={14}
                          className={`${styles.sortIcon} ${sortConfig?.key === col ? styles.active : ''}`}
                        />
                      </div>
                      <button
                        className={`${styles.freezeBtn} ${isFrozen ? styles.active : ''}`}
                        title={isFrozen ? "Unfreeze" : "Freeze columns up to here"}
                        onClick={() => handleFreeze(col)}
                      >
                        {isFrozen ? <Lock size={12} /> : <Unlock size={12} />}
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIdx) => {
              const supplierRates = SUPPLIER_COLUMNS
                .filter(col => !hiddenColumns.includes(col))
                .map(col => Number(row[col]))
                .filter(val => !isNaN(val));

              const minRate = Math.min(...supplierRates);
              const maxRate = Math.max(...supplierRates);
              const estRate = Number(row['Estimated Rate']);

              return (
                <tr key={rowIdx}>
                  {visibleColumns.map((col) => {
                    const value = row[col];
                    const isSupplierCol = SUPPLIER_COLUMNS.includes(col);
                    const isFrozen = BOM_COLUMNS.indexOf(col) <= frozenUntil;
                    const leftOffset = isFrozen ? calculateLeftOffset(col) : 'auto';

                    let cellStyle: React.CSSProperties = {};
                    let percentageDiff: string | null = null;
                    let pDiffValue = 0;

                    if (isSupplierCol) {
                      const numVal = Number(value);
                      cellStyle.backgroundColor = getHeatmapColor(numVal, minRate, maxRate);

                      if (estRate && estRate !== 0) {
                        pDiffValue = ((numVal - estRate) / estRate) * 100;
                        percentageDiff = pDiffValue.toFixed(1) + '%';
                      }
                    }

                    if (isFrozen) {
                      cellStyle.left = leftOffset;
                      cellStyle.position = 'sticky';
                      cellStyle.zIndex = 10;
                    }

                    return (
                      <td
                        key={col}
                        className={isFrozen ? styles.frozen : ''}
                        style={cellStyle}
                      >
                        <div className={styles.cellData}>
                          <span className={styles.mainVal}>
                            {typeof value === 'number' && isSupplierCol ? value.toLocaleString() : value}
                          </span>
                          {percentageDiff && (
                            <span className={styles.diffVal} style={{ color: getPercentageColor(pDiffValue) }}>
                              {pDiffValue > 0 ? '+' : ''}{percentageDiff}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePage;
