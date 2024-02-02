import React from 'react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case "CONFIRMED":
      return <span className='badge rounded-pill text-bg-success status-pill'>Confirmed</span>;
    case "COMPLETED":
      return <span className='badge rounded-pill text-bg-secondary status-pill'>Completed</span>;
    case "CANCELLED":
      return <span className='badge rounded-pill text-bg-danger status-pill'>Cancelled</span>;
    case "IN PROGRESS":
      return <span className='badge rounded-pill text-bg-info status-pill'>In Progress</span>;
    case "PENDING":
      return <span className='badge rounded-pill text-bg-warning status-pill'>Pending</span>;
    default:
      return <span className='badge rounded-pill text-bg-light status-pill'>Unknown</span>;
  }
};

export default StatusBadge;
