import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { formatDate,formatTime } from '../../utils/datetimeFormatter';
import config from '../../config';
import StatusBadge from '../../components/status-pill';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '../../styles/dateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [limit, setLimit] = useState(10);
  //default one week before today and one week after today
  const [dateRange, setDateRange] = useState([new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]);
  const [searching, setSearching] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      let url =`${config.serverUrl}/appointment/retrieve?status=${statusFilter}&searchTerm=${searchTerm}&limit=${limit}&currentPage=${currentPage}`;
      if(dateRange && dateRange[0] && dateRange[1]){
        url += `&range=${dateRange[0]}_${dateRange[1]}`
      }
      const response = await fetch(url,{
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
  
      if (data.results) {
        setAppointments(data.results);
        setTotalResults(data.totalResults);
        setTotalPages(Math.ceil(data.totalResults / limit));
      }
      else{
        setAppointments([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    };
    // Fetch appointments data from the API if initial result is empty
      fetchData();
  }, [currentPage, searching]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (id) => {
    navigate(`/appointments/detail`, { state: { id } });
  };
  return (
    <div className="container mt-4 full-width">

      <div className="mb-3 row g-3 border border-2 rounded-3 bg-white p-2">
        <div className="col-md-4 ">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by salon or service"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='col-md-3'>
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
        <div className='col-md-3'>
          <DateRangePicker className="dateRange form-control mb-2" onChange={setDateRange} value={dateRange}/>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={()=> setSearching(!searching)}>Search</button>
        </div>
      </div>
      <div className='border border-2 rounded-4 bg-white p-3 row mb-4'>
      <table className="table table-hover">

        <thead>
          <tr>
            <th>{appointments[0]?.name ? 'Salon' : 'Customer'}</th>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length > 0 ?(
          appointments.map((appointment) => (
            <tr 
              key={appointment.id}
              onClick={() => handleRowClick(appointment.id)}
            >
              <td className="col-md-2 text-center align-middle p-4">{appointment.name? appointment.name :appointment.customer_first_name? `${appointment.customer_first_name} ${appointment.customer_last_name}`:appointment.customer_username}</td>
              <td className="col-md-2 text-center align-middle p-4">{appointment.service_name}</td>
              <td className="col-md-2 text-center align-middle p-4">{formatDate(appointment.booking_datetime)}</td>
              <td className="col-md-2 text-center align-middle p-4">{formatTime(appointment.booking_datetime)}</td>
              <td className="col-md-2 text-center align-middle p-4"><StatusBadge status={appointment.status}/></td>
            </tr>
          ))
        ):(
          <tr><td colSpan={5}>No Result</td></tr>
              
        )

        }
        </tbody>
      </table>
      </div>
      {/*
      <p>Total Results: {totalResults}</p>
          */}
      <nav>
        <ul className="pagination justify-content-end">
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
