import React, { useState } from 'react';

const BackArrowPagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageVisited, setLastPageVisited] = useState(null);

  const handlePaginationBack = () => {
    if (lastPageVisited !== null) {
      setCurrentPage(lastPageVisited);
    }
  };

  const handlePageChange = (pageNumber) => {
    setLastPageVisited(currentPage);
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);

  return (
    <div>
      {currentPage !== 1 && <button onClick={handlePaginationBack}>&lt;</button>}
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((pageNumber) => (
        <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
      ))}
    </div>
  );
};

export default BackArrowPagination;