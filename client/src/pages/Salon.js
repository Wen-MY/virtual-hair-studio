// Salon.js
import React, { useState, useEffect } from 'react';
import config from '../config';
import Loader from '../components/loading-spinner';
import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound';

const Salon = () => {

  //------------------------------state-variable------------------------------//
  const [loading, setLoading] = useState(true);
  const { salonId } = useParams();
  const [salonInformation, setSalonInformation] = useState({
    id: null,
    name: '',
    contact_number: '',
    business_hour: '',
    address: '',
    state: '',
  })
  const [services, setServices] = useState([]);
  const [hairstylists, setHairstylists] = useState([]);
  const[reviews, setReviews] = useState([]);

  //------------------------------api-request------------------------------//
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const salonResponse = await fetch(config.serverUrl + `/salon/get/${salonId}`, {
          credentials: 'include'
        });

        const salonData = await salonResponse.json();
        if (salonResponse.ok) {
          setSalonInformation(salonData.result);
        } else {
          console.error('Failed to fetch salon information:', salonData.message);
          setLoading(false);
          return;
        }

        const servicesResponse = await fetch(config.serverUrl + `/service/all/${salonId}`, {
          credentials: 'include'
        });
        const servicesData = await servicesResponse.json();
        if (servicesResponse.ok) {
          setServices(servicesData.result);
        } else {
          console.error('Failed to fetch salon information:', servicesData.message);
        }

        const hairstylistsResponse = await fetch(config.serverUrl + `/hairstylist/get/${salonId}`, {
          credentials: 'include'
        });
        const hairstylistsData = await hairstylistsResponse.json();
        if (hairstylistsResponse.ok) {
          setHairstylists(hairstylistsData.result);
        } else {
          console.error('Failed to fetch salon information:', hairstylistsData.message);
        }

        const reviewsResponse = await fetch(config.serverUrl + `/review/retrieve?salonId=${salonId}&limit=2&offset=0`, {
          credentials: 'include',
        });
        const reviewsData = await reviewsResponse.json();
        if (reviewsResponse.ok) {
          setReviews(reviewsData.results);
        } else {
          console.error('Failed to fetch salon information:', reviewsData.message);
        }
        setLoading(false);

      } catch (error) {
        console.error('Error fetching salon data:', error);
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [salonId]);

  //------------------------------helper-formatter-method------------------------------//

  const formatBusinessHour = (businessHour) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayRange = businessHour.split('/')[0]; // Extract the day range part
    const timeRange = businessHour.split('/')[1]; // Extract the time range part

    // Convert day range to human-readable format
    const dayNumbers = dayRange.split('-').map(Number);
    const startDay = daysOfWeek[dayNumbers[0] - 1];
    const endDay = daysOfWeek[dayNumbers[1] - 1];
    const dayRangeFormatted = `${startDay} - ${endDay}`;

    // Convert time range to 12-hour format
    const startTime = timeRange.split('-')[0];
    const endTime = timeRange.split('-')[1];
    const startTimeFormatted = formatTime(startTime);
    const endTimeFormatted = formatTime(endTime);

    return `${startTimeFormatted} - ${endTimeFormatted} | ${dayRangeFormatted}`;
  }
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const meridiem = hours >= 12 ? 'p.m.' : 'a.m.';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
  };

  const formatContactNumber = (contact_number) => {
    // Remove any non-digit characters
    const cleanedNumber = contact_number.replace(/\D/g, '');

    // Check if the number starts with 0, if so remove it
    let formattedNumber = cleanedNumber.startsWith('0') ? cleanedNumber.slice(1) : (cleanedNumber.startsWith('0') ? cleanedNumber.slice(1) : cleanedNumber);

    // Add the country code
    formattedNumber = '+ ' + formattedNumber;

    // Add spaces for readability
    formattedNumber = formattedNumber.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');

    return formattedNumber;
  };
  if (loading) {
    return (
      <Loader />
    );
  }

  if(!salonInformation.id){
    return (
      <NotFound/>
    );
  }
  //------------------------------html------------------------------//
  return (
    <div className="container-fluid my-3 full-width">
      <div className="row">
        {/* Salon Name, Salon Picture, and Salon Name Section (Left Side) */}
        <div className="col-md-4 border border-2 rounded-4 p-3 bg-white">
          {/* Salon Name and Salon Picture */}
          <div className="row">
            <div className="col-12 p-3 pt-2">
              <img src={'https://picsum.photos/700/500'} alt="Salon Profile Main" className="img-fluid rounded-4" />
            </div>
          </div>
          {/* Salon Name */}
          <div className="row text-start px-3 py-2 ">
            <div className="col">
              <h1>{salonInformation.name}</h1>
            </div>
          </div>
          {/* Salon Information */}
          <div className="row text-start p-3">
            <div className="col">
              <p>Contact: {formatContactNumber(salonInformation.contact_number)}</p>
              <p>Business Hours: {formatBusinessHour(salonInformation.business_hour)}</p>
              <p>Address: {salonInformation.address}</p>
              <p>State: {salonInformation.state}</p>
            </div>
          </div>
          {/* Salon Button */}
          <div className="row mb-4 text-start p-3 pt-0 mx-3">
            <Link to="/appointment/create" state={{ salonInformation }} className="btn btn-primary mb-3 text-light">Book Appointment</Link>
            <button type="button" className="btn btn-secondary mb-3">Make Enquiry</button>
          </div>
        </div>


        {/*right side section*/}
        <div className="col-md-8 px-4">
          {/* Services Section */}
          <div className="row mb-3">
            <div className="col border border-2 rounded-4 p-5 bg-white pt-4">
              <h2 className='section-title text-start mb-4'>Services Provided</h2>
              <ul className="nav nav-tabs" id="services-tabs">
                {/* Since services is now an array of service objects, we need to group them by category */}
                {Array.from(new Set(services.map(service => service.category))).map((category, index) => {
                  // Sanitize category name to make it a valid selector
                  const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <li key={index} className="nav-item">
                      <a
                        className={`nav-link ${index === 0 ? 'active' : ''}`}
                        id={`${sanitizedCategory}-tab`}
                        data-bs-toggle="tab"
                        href={`#${sanitizedCategory}`}
                        role="tab"
                        aria-controls={sanitizedCategory}
                        aria-selected={index === 0 ? 'true' : 'false'}
                      >
                        {category}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="tab-content">
                {/* Render service items grouped by category */}
                {Array.from(new Set(services.map(service => service.category))).map((category, index) => {
                  // Sanitize category name to make it a valid selector
                  const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <div
                      key={index}
                      className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                      id={sanitizedCategory}
                      role="tabpanel"
                      aria-labelledby={`${sanitizedCategory}-tab`}
                    >
                      <ul className="list-group">
                        {/* Filter services based on category */}
                        {services.filter(service => service.category === category).map((service, serviceIndex) => (
                          <Link to="/appointment/create" state={{ salonInformation, service }} className="text-decoration-none">
                            <li key={serviceIndex} className="list-group-item text-start">
                              <p className='fs-4 fw-semibold mb-0'>{service.service_name}</p>
                              <p>{service.desc}</p>
                            </li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Hairstylists Section */}
          <div className="row mb-3">
            <div className="col border border-2 rounded-4 p-5 bg-white pt-4">
              <h2 className='section-title mb-5 text-start py-0'>Hairstylists Available</h2>
              <div className="row">
                {hairstylists.map((hairstylist, index) => (
                  <div key={index} className="col mb-3">
                    <div className="card mx-auto border-dark text-start" style={{ width: '12rem' }}>
                      <img src={'https://picsum.photos/120/100'} className="card-img-top" alt={hairstylist.name} />
                      <div className="card-body">
                        <h5 className="card-title">{hairstylist.name}</h5>
                        <p className='card-text mb-0'>{hairstylist.position || 'Unassigned'}</p>
                        <p className="card-text">{hairstylist.rating ? (
                          <span>
                            {hairstylist.rating.toFixed(1)} <i className="bi bi-star-fill"></i>
                          </span>
                        ) : (
                          "No ratings"
                        )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ratings and Comments Section */}
          <div className="row">
            <div className="col border border-2 rounded-4 p-5 bg-white pt-4">
              <h2 className='section-title text-start mb-5'>Customer Reviews</h2>
              <ul className="list-group">
                {reviews.map((review, index) => (
                  <li key={index} className="list-group-item text-start">
                    <strong>{review.username}</strong> - Rating: {review.rating} <i className="bi bi-star-fill"></i>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salon;
