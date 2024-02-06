// Profile.js
import React from 'react';

const Profile = () => {
  // Dummy Data
  const salonName = 'Elegance Salon';
  const salonImageMainSrc = 'https://placekitten.com/700/500'; 

  const salonInformation ={
    contact: '+603 8922-2332',
    businessHour: '10:30 a.m - 8.30 p.m. | Every Monday - Saturday',
    address: 'No 1, Jalan Sultan Azlan Shah, Butterworth',
    state: 'Penang',
  }
  
  const services = [
    { category: 'Haircut', services: ['Men Haircut', 'Women Haircut', 'Kids Haircut', 'Women Haircut', 'Kids Haircut', 'Women Haircut', 'Kids Haircut', 'Women Haircut', 'Kids Haircut'] },
    { category: 'Coloring', services: ['Highlights', 'Balayage', 'Root Touch-up'] },
    { category: 'Styling', services: ['Blowout', 'Updo', 'Curls'] },
  ];

  const hairstylists = [
    { name: 'John Doe', imageSrc: 'https://placekitten.com/100/100', rating: 4.5 },
    { name: 'Jane Smith', imageSrc: 'https://placekitten.com/100/100', rating: 4.8 },
    { name: 'Manager', imageSrc: 'https://placekitten.com/100/100', rating: 4.5 },
  ];

  const reviews = [
    { user: 'Customer 1', rating: 5, comment: 'Great salon! Excellent service.' },
    { user: 'Customer 2', rating: 4.5, comment: 'Love the hairstylists and atmosphere.' },
  ];

  return (
    <div className="container-fluid my-3 full-width">
      <div className="row">
        {/* Salon Name, Profile Picture, and Salon Name Section (Left Side) */}
        <div className="col-md-4 border border-2 rounded-4 p-3 bg-white">
          {/* Salon Name and Profile Picture */}
          <div className="row">
            <div className="col-12 p-3 pt-2">
              <img src={salonImageMainSrc} alt="Salon Profile Main" className="img-fluid rounded-4" />
            </div>
          </div>
          {/* Salon Name */}
          <div className="row text-start px-3 py-2 ">
            <div className="col">
              <h1>{salonName}</h1>
            </div>
          </div>
          {/* Salon Information */}
          <div className="row text-start p-3">
            <div className="col">
              <p>Contact: {salonInformation.contact}</p>
              <p>Business Hours: {salonInformation.businessHour}</p>
              <p>Address: {salonInformation.address}</p>
              <p>State: {salonInformation.state}</p>
            </div>
          </div>
           {/* Salon Button */}
          <div className="row mb-4 text-start p-3 pt-0 mx-3">
            <button type="button" className="btn btn-primary mb-3">Book Appointment</button>
            <button type="button" className="btn btn-secondary mb-3">Make Enquiry</button>
          </div>
        </div>
        

       {/*right side section*/}
      <div className="col-md-8 px-4">

      {/* Services Section */}
      <div className="row mb-3">
        <div className="col border border-2 rounded-4 bg-white p-5 pt-4">
        <h2 className='section-title text-start mb-4'>Services Provided</h2>
          <ul className="nav nav-tabs" id="services-tabs">
            {services.map((category, index) => (
              <li key={index} className="nav-item">
                <a
                  className={`nav-link ${index === 0 ? 'active' : ''}`}
                  id={`${category.category.toLowerCase()}-tab`}
                  data-bs-toggle="tab"
                  href={`#${category.category.toLowerCase()}`}
                  role="tab"
                  aria-controls={category.category.toLowerCase()}
                  aria-selected={index === 0 ? 'true' : 'false'}
                >
                  {category.category}
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-content">
            {services.map((category, index) => (
              <div
                key={index}
                className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                id={category.category.toLowerCase()}
                role="tabpanel"
                aria-labelledby={`${category.category.toLowerCase()}-tab`}
              >
                <ul className="list-group">
                  {category.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="list-group-item">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
                <div className="card mx-auto" style={{ width: '12rem' }}>
                  <img src={hairstylist.imageSrc} className="card-img-top" alt={hairstylist.name} />
                  <div className="card-body">
                    <h5 className="card-title">{hairstylist.name}</h5>
                    <p className="card-text">Rating: {hairstylist.rating} <i class="bi bi-star-fill"></i></p>
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
                <strong>{review.user}</strong> - Rating: {review.rating} <i class="bi bi-star-fill"></i>
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

export default Profile;
