import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { useData } from '../context/DataContext';
import type { BOMRow, RawTreeRow } from '../context/DataContext';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './UploadPage.module.css';

const UploadPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addBomUpload, setTreeData, transformRawToTree } = useData();
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Anticipate edge case: Wrong file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Unsupported file type. Please upload a standard CSV file.');
      return;
    }

    setIsUploading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || [];

        // Problem 1 headers
        const bomHeaders = [
          'Item Code', 'Material', 'Quantity', 'Estimated Rate',
          'Supplier 1 (Rate)', 'Supplier 2 (Rate)', 'Supplier 3 (Rate)', 'Supplier 4 (Rate)', 'Supplier 5 (Rate)'
        ];

        // Problem 2 headers (Hierarchical Structure)
        const treeHeaders = [
          'Category', 'Sub Category 1', 'Sub Category 2', 'Item Code', 'Description', 'Quantity', 'Rate'
        ];

        const isBom = bomHeaders.every(h => headers.includes(h));
        const isTree = treeHeaders.every(h => headers.includes(h));

        if (isBom) {
          const data = results.data as BOMRow[];
          addBomUpload(file, data);
          setTimeout(() => navigate('/table'), 500); // Slight delay for UX feedback
        } else if (isTree) {
          // Type-safe transformation
          const data = results.data as RawTreeRow[];
          const transformedTree = transformRawToTree(data);
          setTreeData(transformedTree);
          setTimeout(() => navigate('/tree'), 500);
        } else {
          setError(`Invalid CSV structure. The uploaded file does not match the BOM or Tree Table templates.`);
          setIsUploading(false);
        }
      },
      error: (err: Error) => {
        setError(`Parse Error: ${err.message}`);
        setIsUploading(false);
      }
    });
  };

  return (
    <div className={`${styles.pageContainer} fade-in`}>
      <div className={styles.pageHeader}>
        <h1>Upload Procurement Data</h1>
        <p>Analyze supplier heatmaps or hierarchical item structures with a single CSV upload.</p>
      </div>

      <div className={styles.uploadSection}>
        <label className={styles.dropzone}>
          <input type="file" accept=".csv" onChange={handleFileUpload} disabled={isUploading} />
          <div className={styles.dropzoneContent}>
            <div className={styles.iconWrapper}>
              {isUploading ? <CheckCircle2 className={styles.spinning} /> : <Upload size={48} />}
            </div>
            <h3>{isUploading ? 'Validating & Processing...' : 'Click to select or drag CSV'}</h3>
            <p>
              Supports BOM and Hierarchical Tree formats.
              <a href="/sample_bom.csv" download className={styles.sampleLink} onClick={e => e.stopPropagation()}>
                Download Template
              </a>
            </p>
          </div>
        </label>

        {error && (
          <div className={`${styles.alert} ${styles.alertError} animate-shake`}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.formatGuide}>
          <div className={styles.card}>
            <h3><FileText size={20} /> Supported Schema Formats</h3>
            <p>The application detects your data structure based on the following headers:</p>

            <div className={styles.sampleViz}>
              <div className={styles.sampleRow}>
                <strong>BOM Heatmap:</strong>
                <span>Item Code, Material, Quantity, Estimated Rate, Supplier 1-5 (Rate)</span>
              </div>
              <div className={styles.sampleRow}>
                <strong>Tree Table:</strong>
                <span>Category, Sub Category 1, Sub Category 2, Item Code, Description, Quantity, Rate</span>
              </div>
            </div>

            <ul style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <li><strong>Auto-Cleanup:</strong> Empty rows are skipped and data types are automatically normalized.</li>
              <li><strong>Validation:</strong> Files missing mandatory headers will receive helpful formatting tips.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
