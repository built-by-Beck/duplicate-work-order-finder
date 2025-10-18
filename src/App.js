import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import WorkOrderList from './components/WorkOrderList';
import DuplicatesList from './components/DuplicatesList';
import ThresholdSlider from './components/ThresholdSlider';
import { parseFile } from './utils/fileParser';
import { findDuplicates } from './utils/duplicateFinder';
import './App.css';

function App() {
  const [workOrders, setWorkOrders] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(70);

  // Find duplicates whenever work orders or threshold changes
  useEffect(() => {
    if (workOrders.length >= 2) {
      const foundDuplicates = findDuplicates(workOrders, threshold);
      setDuplicates(foundDuplicates);
    } else {
      setDuplicates([]);
    }
  }, [workOrders, threshold]);

  const handleFilesUpload = async (files) => {
    setLoading(true);
    setError(null);

    try {
      const parsedOrders = [];

      for (const file of files) {
        try {
          const text = await parseFile(file);
          parsedOrders.push({
            fileName: file.name,
            text: text.trim(),
          });
        } catch (err) {
          console.error(`Error parsing ${file.name}:`, err);
          setError(`Failed to parse ${file.name}: ${err.message}`);
        }
      }

      setWorkOrders([...workOrders, ...parsedOrders]);
    } catch (err) {
      setError(`Error processing files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWorkOrder = (index) => {
    const newWorkOrders = workOrders.filter((_, i) => i !== index);
    setWorkOrders(newWorkOrders);
  };

  const handleClearAll = () => {
    setWorkOrders([]);
    setDuplicates([]);
    setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Duplicate Work Order Finder</h1>
        <p className="subtitle">
          Upload work order files to find potential duplicates using intelligent text matching
        </p>
      </header>

      <main className="app-main">
        <FileUpload onFilesUpload={handleFilesUpload} loading={loading} />

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {workOrders.length > 0 && (
          <div className="controls">
            <ThresholdSlider threshold={threshold} onChange={setThreshold} />
            <button className="clear-btn" onClick={handleClearAll}>
              Clear All
            </button>
          </div>
        )}

        <WorkOrderList
          workOrders={workOrders}
          onRemove={handleRemoveWorkOrder}
        />

        {workOrders.length >= 2 && (
          <DuplicatesList duplicates={duplicates} />
        )}

        {workOrders.length === 1 && (
          <div className="info-message">
            Upload at least one more work order to find duplicates.
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Supports PDF, Word (DOC/DOCX), Excel (XLS/XLSX), CSV, TXT, and HTML files
        </p>
      </footer>
    </div>
  );
}

export default App;
