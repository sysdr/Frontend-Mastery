import React, { useState, useMemo } from 'react';

const DataTable = ({ columns, initialData, itemsPerPage: initialItemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // 1. Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortColumn) return initialData;

    const sortableData = [...initialData]; // Create a shallow copy to avoid mutating original data

    sortableData.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // Numeric or other comparable types
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
    return sortableData;
  }, [initialData, sortColumn, sortDirection]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc'); // Default to asc when changing column
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Build a compact list of page numbers + ellipsis for pagination (never overflow)
  const getPaginationItems = () => {
    const delta = 2; // pages to show on each side of current
    const range = [];
    const rangeWithDots = [];
    let l = null;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    range.forEach((i) => {
      if (l !== null && i - l > 1) rangeWithDots.push('ellipsis');
      rangeWithDots.push(i);
      l = i;
    });
    return rangeWithDots;
  };

  return (
    <div className="data-table-container p-4 bg-white text-slate-800 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-xl font-semibold mb-4 text-slate-800">Dynamic Data Table</h3>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm text-slate-600">Items per page:</label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-white border border-slate-300 rounded-md py-1.5 px-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[10, 20, 50, 100].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="py-3 px-4 border-b border-slate-200 bg-slate-50 text-left text-sm font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors text-slate-700"
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.header}
                  {col.sortable && sortColumn === col.key && (
                    <span className="ml-2">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  {columns.map((col) => (
                    <td key={`${row.id}-${col.key}`} className="py-2.5 px-4 border-b border-slate-100 text-sm text-slate-700">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Compact pagination: First, Prev, window of pages + ellipsis, Next, Last */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap justify-center items-center gap-1 sm:gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="First page"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="flex items-center gap-1 flex-wrap justify-center">
            {getPaginationItems().map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 select-none" aria-hidden>…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  className={`min-w-[2.25rem] px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item
                      ? 'bg-blue-600 text-white border border-blue-600'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-label={`Page ${item}`}
                  aria-current={currentPage === item ? 'page' : undefined}
                >
                  {item}
                </button>
              )
            )}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Next page"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Last page"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
