// Salon.js
import React, { useState, useEffect } from 'react';
import config from '../../config';
import Loader from '../../components/loading-spinner';
import { Link, useParams } from 'react-router-dom';
import { formatContactNumber, formatTime, formatBusinessHour } from '../../utils/salonInformationFormatter';
import NotFound from '../NotFound';

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
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewPage] = useState(1);

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

        const servicesResponse = await fetch(config.serverUrl + `/service/all/${salonId}?status=1`, {
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

        const reviewsResponse = await fetch(config.serverUrl + `/review/retrieve?salonId=${salonId}&limit=3&offset=${reviews.length}`, {
          credentials: 'include',
        });
        const reviewsData = await reviewsResponse.json();
        if (reviewsResponse.ok) {
          setReviews(reviewsData);
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
  useEffect(() => {
    const fetchReviews = async () => {
      console.log(reviewsPage);
      try {
        const reviewsResponse = await fetch(config.serverUrl + `/review/retrieve?salonId=${salonId}&limit=3&offset=${(reviewsPage - 1) * 3}`, {
          credentials: 'include',
        });
        const reviewsData = await reviewsResponse.json();
        if (reviewsResponse.ok) {
          setReviews(reviewsData);
        } else {
          console.error('Failed to fetch salon information:', reviewsData.message);
        }
        setLoading(false);

      } catch (error) {
        console.error('Error fetching salon data:', error);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [reviewsPage]);
  if (loading) {
    return (
      <Loader />
    );
  }

  if (!salonInformation.id) {
    return (
      <NotFound />
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
              <img src={salonInformation.image_url ? salonInformation.image_url : process.env.PUBLIC_URL + '/sample-image/default_salon.jpg'} alt="Salon Profile Main" className="img-fluid rounded-4" />
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
                {services && services.length > 0 && Array.from(new Set(services.map(service => service.category))).map((category, index) => {
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
                {services && services.length > 0 ? (Array.from(new Set(services.map(service => service.category))).map((category, index) => {
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
                })) : (
                  <li className="list-group-item text-center"><p className='fs-4 fw-semibold m-3 mt-5'>No Service Available</p></li>
                )}
              </div>
            </div>
          </div>
          {/* Hairstylists Section */}
          <div className="row mb-3">
            <div className="col border border-2 rounded-4 p-5 bg-white pt-4">
              <h2 className='section-title mb-5 text-start py-0'>Hairstylists Available</h2>
              <div className="row">
                {hairstylists.length ? (hairstylists.map((hairstylist, index) => (
                  <div key={index} className="col mb-3">
                    <div className="card mx-auto border-dark text-start" style={{ width: '12rem' }}>
                      <img src={hairstylist.image_url??`https://picsum.photos/120/100?random=${hairstylist.id}`} className="card-img-top" alt={hairstylist.name} />
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
                ))) : (
                  <div className="text-center"><p className='fs-4 fw-semibold m-3'>No Hairstylist Available</p></div>
                )}
              </div>
            </div>
          </div>

          {/* Ratings and Comments Section */}
          <div className="row">
            <div className="col border border-2 rounded-4 p-5 pb-1 bg-white pt-4">
              <h2 className='section-title text-start mb-3'>Customer Reviews</h2>
              {reviews.length > 0 ? (
              <div>
              <ul className="list-group">
                {reviews.results.map((review, index) => (
                  <li key={index} className="list-group-item text-start">
                    <strong>{review.username}</strong> - Rating: {review.rating} <i className="bi bi-star-fill"></i>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
              <nav className='mt-3'>
                <ul className="pagination justify-content-end ">
                  <li className={`page-item ${reviewsPage <= 1 ? 'disabled' : ''}`} ><button className="page-link" onClick={() => reviewsPage > 1 ? setReviewPage(reviewsPage - 1) : null}>Previous</button></li>
                  {Array.from({ length: Math.ceil(reviews.totalResults / 3) }, (_, index) => index + 1).map((page) => (
                    <li key={page} className={`page-item ${reviewsPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setReviewPage(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${reviewsPage >= reviews.totalResults / 3 ? 'disabled' : ''}`}><button className="page-link" onClick={() => reviewsPage < Math.ceil(reviews.totalResults / 3) ? setReviewPage(reviewsPage + 1) : null}>Next</button></li>
                </ul>
              </nav>
              </div>)
              :
              (
              <div className='my-3 fs-5 fw-semibold list-group'>
                <div className='list-group-item py-5'>
                  No rating in records
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salon;
