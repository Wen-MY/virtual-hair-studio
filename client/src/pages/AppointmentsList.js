import React, { useState, useEffect } from 'react';
import config from '../config';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [limit, setLimit] = useState(10);
  const [searching, setSearching] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${config.serverUrl}/appointment/retrieve?status=${statusFilter}&searchTerm=${searchTerm}&limit=${limit}&currentPage=${currentPage}`,{
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
  
      if (data.results) {
        setAppointments(data.results);
        setTotalResults(data.totalResults);
        setTotalPages(Math.ceil(data.totalResults / limit));
      }
    };
    // Fetch appointments data from the API if initial result is empty
      fetchData();
  }, [currentPage, searching]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function formatDate(dateString) {
    let date = new Date(dateString);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();;
    return day + "-" + month + "-" + year;
  }
  function formatTime(dateString){
    let date = new Date(dateString);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    return hours + ":" + minutes;
  }
  function statusPillElement(status){
    switch(status){
      case "CONFIRMED":
        return <span className='badge rounded-pill text-bg-success'>Confirmed</span>
      case "COMPLETED":
        return <span className='badge rounded-pill text-bg-secondary'>Completed</span>
      case "CANCELLED":
        return <span className='badge rounded-pill text-bg-danger'>Cancelled</span>
      case "IN PROGRESS":
        return <span className='badge rounded-pill text-bg-info'>In Progress</span>
      case "PENDING":
        return <span className='badge rounded-pill text-bg-warning'>Pending</span>
      default:
        return <span className='badge rounded-pill text-bg-light'>Unknown</span>
    }
  }
  return (
    <div className="container mt-4" style={{width : '150vh'}}>

      <div className="mb-3 row g-3">
        <div className='col-md-6'>
          <select
            className="form-select mb-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className='col-md-6'>
          <select
            className="form-select mb-2"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by salon or service"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={()=> setSearching(!searching)}>Search</button>
        </div>
      </div>

      <table className="table table-hover">

        <thead>
          <tr>
            <th>Salon</th>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="col-md-2 text-center align-middle"><i className='bi bi-person-circle user-icon mx-3 text-center align-middle'></i>{appointment.salon_name}</td>
              <td className="col-md-2 text-center align-middle">{appointment.service_name}</td>
              <td className="col-md-2 text-center align-middle">{formatDate(appointment.booking_datetime)}</td>
              <td className="col-md-2 text-center align-middle">{formatTime(appointment.booking_datetime)}</td>
              <td className="col-md-2 text-center align-middle">{statusPillElement(appointment.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*
      <p>Total Results: {totalResults}</p>
          */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`} ><button className="page-link" onClick={() => currentPage > 1 ? handlePageChange(currentPage-1):null}>Previous</button></li>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => currentPage < totalPages ? handlePageChange(currentPage+1):null}>Next</button></li>
        </ul>
      </nav>
    </div>
  );
};

export default AppointmentsList;
