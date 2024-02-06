import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Services = () => {
  // Dummy data for categories and services (to be replaced with data from server)
  const [categories, setCategories] = useState([
    { id: 1, name: 'Haircuts' },
    { id: 2, name: 'Colors' },
    { id: 3, name: 'Styling' },
    { id: 4, name: 'Texturizing' },
    { id: 5, name: 'Treatments' },
    { id: 6, name: 'Extensions' },
    { id: 7, name: "Men's Grooming" },
    { id: 8, name: 'Others' }
  ]);

  // Dummy data for services (to be replaced with data from server)
  const [services, setServices] = useState([
    { id: 1, categoryId: 1, name: 'Haircut', availability: 1, duration: 30, desc: 'Classic haircut for men and women' },
    { id: 2, categoryId: 2, name: 'Balayage Color', availability: 1, duration: 120, desc: 'Hand-painted highlights for a natural look' },
    { id: 3, categoryId: 5, name: 'Keratin Treatment', availability: 1, duration: 90, desc: 'Smoothing treatment for frizz-free hair' },
    { id: 4, categoryId: 3, name: 'Updo Styling', availability: 0, duration: 60, desc: 'Elegant updo styling for special occasions' },
    { id: 5, categoryId: 5, name: 'Deep Conditioning', availability: 1, duration: 45, desc: 'Intensive moisture treatment for hair health' },
    { id: 6, categoryId: 2, name: 'Highlights & Lowlights', availability: 1, duration: 90, desc: 'Dimensional color for a vibrant look' },
    { id: 7, categoryId: 3, name: 'Bridal Hair', availability: 1, duration: 120, desc: 'Customized bridal hair styling for the big day' },
    { id: 8, categoryId: 7, name: 'Beard Trim', availability: 0, duration: 15, desc: 'Precise trimming and shaping for men' },
    { id: 9, categoryId: 2, name: 'Root Touch-Up', availability: 1, duration: 60, desc: 'Color touch-up for roots to maintain consistency' },
    { id: 10, categoryId: 5, name: 'Scalp Massage', availability: 1, duration: 30, desc: 'Relaxing massage to promote scalp health' },
    { id: 11, categoryId: 2, name: 'Root Touch-Up', availability: 1, duration: 60, desc: 'Color touch-up for roots to maintain consistency' },
    { id: 12, categoryId: 2, name: 'Root Touch-Up', availability: 1, duration: 60, desc: 'Color touch-up for roots to maintain consistency' },
  ]);

  // State for active tab index
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle modal visibility

  // Effect to set default active tab index to 0
  useEffect(() => {
    // Set the first tab as active
    const firstTab = document.querySelector('.nav-link');
    firstTab.classList.add('active');

    // Set the first tab pane as active
    const firstTabPane = document.querySelector('.tab-pane');
    firstTabPane.classList.add('active', 'show');
  }, []);

  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height'>
      <h1 className="text-start mb-3">Services Management</h1>
      <button className="btn btn-primary mb-3 float-end" data-bs-toggle="modal" data-bs-target="#addServiceModal">Add New Service</button>
    
      <ul className="nav nav-tabs">
        {categories.map((category, index) => (
          <li className="nav-item" key={category.id}>
            <a
              className={`nav-link ${index === activeTab ? 'active' : ''}`}
              data-bs-toggle="tab"
              href={`#category-${category.id}`}
              onClick={() => setActiveTab(index)}
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {categories.map((category, index) => (
          <div
            className={`tab-pane fade ${index === activeTab ? 'active show' : ''}`}
            id={`category-${category.id}`}
            key={category.id}
          >
            {services.filter(service => service.categoryId === category.id).length === 0 ? (
              <p className="mt-5">No services available for this category in the salon.</p>
            ) : (
              <ul className="list-group mt-3">
                {services
                  .filter(service => service.categoryId === category.id)
                  .map(service => (
                    <li className={`list-group-item d-flex justify-content-between align-items-center p-3 ${service.availability?`bg-white`:`bg-light`}`} key={service.id}>
                      <div className='service-thumbnail'>
                        <img className='img-thumbnail rounded-circle' src='https://placekitten.com/100/100'></img>
                      </div>
                      <div className='service-info text-start flex-grow-1 ms-4'>
                        <strong className='fs-4'>{service.name}</strong> 
                        <span className={`badge ${service.availability?`bg-success`:`bg-danger`} border border-light rounded-circle p-2 ms-2 align-text-center`}> </span>
                        <p className='fs-6'>{service.desc}</p>
                      </div>
                      <div className='tooltips'>
                        <button className='btn btn-outline-secondary mx-2 rounded-circle' data-bs-toggle="modal" data-bs-placement="top" title="Edit" data-bs-target="#updateServiceModal"><span className="bi-pencil"></span></button>
                        <button className='btn btn-outline-secondary mx-2 rounded-circle' data-bs-toggle="modal" data-bs-placement="top" title="Delete" data-bs-target="#deleteServiceModal"><span className="bi-trash"></span></button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal for adding new service */}
      <div className={`modal fade`} id="addServiceModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addServiceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Service</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Form to add new service */}
              {/* Form inputs here */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Add Service</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for update existing service */}
      <div className={`modal fade`} id="updateServiceModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="updateServiceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Service</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Form to update service */}
              {/* Form inputs here */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
       {/* Modal for delete existing service */}
       <div className={`modal fade`} id="deleteServiceModal" tabIndex="-1" aria-labelledby="deleteServiceModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Service</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Form to confirm delete service */}
              {/* Form inputs here */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Confirm Delete</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Services;
