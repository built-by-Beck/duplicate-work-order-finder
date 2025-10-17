import React from 'react';

const WorkOrderList = ({ workOrders, onRemove }) => {
  if (workOrders.length === 0) {
    return null;
  }

  return (
    <div className="work-order-list">
      <h2>Uploaded Work Orders ({workOrders.length})</h2>
      <div className="work-order-items">
        {workOrders.map((order, index) => (
          <div key={index} className="work-order-item">
            <div className="work-order-header">
              <span className="work-order-name">{order.fileName}</span>
              <button
                className="remove-btn"
                onClick={() => onRemove(index)}
                title="Remove"
              >
                ×
              </button>
            </div>
            <div className="work-order-preview">
              {order.text.substring(0, 200)}
              {order.text.length > 200 && '...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkOrderList;
