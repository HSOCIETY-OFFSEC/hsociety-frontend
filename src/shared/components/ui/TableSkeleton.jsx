import React from 'react';
import './TableSkeleton.css';

const TableSkeleton = ({ rows = 6, columns = 4 }) => {
  return (
    <div className="table-skeleton" role="status" aria-label="Loading data">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="table-skeleton-row">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <span key={colIndex} className="table-skeleton-cell" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
