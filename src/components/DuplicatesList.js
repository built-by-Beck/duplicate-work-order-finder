import React, { useState } from 'react';

const DuplicatesList = ({ duplicates }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (duplicates.length === 0) {
    return (
      <div className="no-duplicates">
        <h2>No Duplicates Found</h2>
        <p>No duplicate work orders were detected with the current threshold.</p>
      </div>
    );
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="duplicates-list">
      <h2>Potential Duplicates Found ({duplicates.length})</h2>
      <div className="duplicates-items">
        {duplicates.map((duplicate, index) => (
          <div key={index} className="duplicate-item">
            <div
              className="duplicate-header"
              onClick={() => toggleExpand(index)}
            >
              <div className="duplicate-info">
                <span className="duplicate-number">#{index + 1}</span>
                <div className="duplicate-files">
                  <span className="file-name">{duplicate.order1.fileName}</span>
                  <span className="separator">↔</span>
                  <span className="file-name">{duplicate.order2.fileName}</span>
                </div>
              </div>
              <div className="duplicate-scores">
                <div className="score-badge" title="Overall Match Score">
                  {duplicate.score}%
                </div>
                <div className="score-detail" title="Location Match Score">
                  Loc: {duplicate.locationScore}%
                </div>
                <div className="score-detail" title="Text Similarity Score">
                  Text: {duplicate.fuzzyScore}%
                </div>
              </div>
              <button className="expand-btn">
                {expandedIndex === index ? '−' : '+'}
              </button>
            </div>
            {expandedIndex === index && (
              <div className="duplicate-content">
                <div className="duplicate-comparison">
                  <div className="comparison-column">
                    <h4>Work Order 1: {duplicate.order1.fileName}</h4>
                    <div className="text-content">{duplicate.order1.text}</div>
                  </div>
                  <div className="comparison-column">
                    <h4>Work Order 2: {duplicate.order2.fileName}</h4>
                    <div className="text-content">{duplicate.order2.text}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuplicatesList;
