import React from 'react';

const ThresholdSlider = ({ threshold, onChange }) => {
  return (
    <div className="threshold-slider">
      <label htmlFor="threshold">
        Match Threshold: <strong>{threshold}%</strong>
      </label>
      <input
        id="threshold"
        type="range"
        min="50"
        max="100"
        value={threshold}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      <div className="threshold-labels">
        <span>More Results (50%)</span>
        <span>Exact Match (100%)</span>
      </div>
    </div>
  );
};

export default ThresholdSlider;
