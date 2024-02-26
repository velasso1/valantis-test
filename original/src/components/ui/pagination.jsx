import React, { useState } from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PaginationComponent = () => {
  const [page, setPage] = useState(1);

  const { quantity, status } = useSelector((state) => state.dataSlice);

  return (
    <div className="pagination-wrapper">
      <Pagination
        disabled={status}
        variant="outlined"
        shape="rounded"
        count={Math.ceil(quantity / 50) || 1}
        page={page}
        onChange={(_, num) => setPage(num)}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/valantis-test/page/${item.page}/from/${
              item.page === 1 ? 0 : item.page * 50 - 50
            }`}
            {...item}
          />
        )}
      />
    </div>
  );
};

export default PaginationComponent;
