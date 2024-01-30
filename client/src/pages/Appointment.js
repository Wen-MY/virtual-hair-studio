import React, { useState, useEffect } from 'react';
import config from '../config';

const Appointment = () => {
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
  return (
    <div className="container mt-4">
      <h2>Appointments List</h2>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by salon or service"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
        
        <select
          className="form-select mb-2"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
        <button className="btn btn-primary" onClick={()=> setSearching(!searching)}>Search</button>
      </div>

      <table className="table">
        {/* not using header*/
        <thead>
          <tr>
            <th>Salon</th>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        /**/}
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.salon_name}</td>
              <td>{appointment.service_name}</td>
              <td>{formatDate(appointment.booking_datetime)}</td>
              <td>{formatTime(appointment.booking_datetime)}</td>
              <td>{appointment.status}</td>
              <td>{appointment.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Total Results: {totalResults}</p>

      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Appointment;
