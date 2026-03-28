import React from 'react';

const TableSkeleton = ({ rows = 6, columns = 4 }) => {
  return (
    <div className="grid gap-2.5" role="status" aria-label="Loading data">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <span
              key={colIndex}
              className="h-[34px] rounded-sm bg-[linear-gradient(90deg,var(--bg-tertiary),var(--bg-secondary),var(--bg-tertiary))] bg-[length:200px_100%] animate-table-shimmer"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
