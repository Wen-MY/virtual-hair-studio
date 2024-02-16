import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'

const SalonManagement = () => {
  // Dummy data for categories and services (to be replaced with data from server)
  const [categories, setCategories] = useState([
    { value: 1, label: 'Haircuts' },
    { value: 2, label: 'Colors' },
    { value: 3, label: 'Styling' },
    { value: 4, label: 'Texturizing' },
    { value: 5, label: 'Treatments' },
    { value: 6, label: 'Extensions' },
    { value: 7, label: "Men's Grooming" },
    { value: 8, label: 'Others' }
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

  //Dummy data for hairstylist selection
  const [hairstylists, setHairstylists] = useState([
    { value: 1, label: 'David Heng Tiek Tet' },
    { value: 2, label: 'Tiffany Chew Sien Meh' },
    { value: 3, label: 'Thanuja Mudukasan' },
    { value: 4, label: 'Pang Dou Jia' },
  ]);

  const [hairstylistList, setHairstylistList] = useState([
    { id: 1, name: 'David Heng Tiek Tet', title: 'Senior Hairstylist', rating: 5 },
    { id: 2, name: 'Tiffany Chew Sien Meh', title: 'Master', rating: 4.7 },
    { id: 3, name: 'Thanuja Mudukasan', title: 'Junior Hairstylist', rating: 4.5 },
    { id: 4, name: 'Pang Dou Jia', title: 'Senior Hairstylist', rating: 4 },
  ]);
  // State for active tab index
  const [activeTab, setActiveTab] = useState(0);
  const [newFormData, setNewFormData] = useState({
    serviceName: '',
    categoryId: '',
    duration: null,
    hairstylists: [],
    desc: '',
  });

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
  //----------add service form change handling----------
  const handleNewFormInputChange = (e) => {
    setNewFormData({
      ...newFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleMultiSelectChange = (selectedOptions) => {
    setNewFormData({
      ...newFormData,
      hairstylists: selectedOptions,
    });
  };
  const handleServiceAvailability = (id) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === id ? { ...service, availability: !service.availability } : service
      )
    );
  };

  return (
    <div className="container-fluid my-3 full-width">
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <h1 className="text-start mb-3">Services Management</h1>
        <button className="btn btn-primary mb-3 float-end" data-bs-toggle="modal" data-bs-target="#addServiceModal">Add New Service</button>

        <ul className="nav nav-tabs">
          {categories.map((category, index) => (
            <li className="nav-item" key={category.value}>
              <a
                className={`nav-link ${index === activeTab ? 'active' : ''}`}
                data-bs-toggle="tab"
                href={`#category-${category.value}`}
                onClick={() => setActiveTab(index)}
              >
                {category.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {categories.map((category, index) => (
            <div
              className={`tab-pane fade ${index === activeTab ? 'active show' : ''}`}
              id={`category-${category.value}`}
              key={category.value}
            >
              {services.filter(service => service.categoryId === category.value).length === 0 ? (
                <p className="mt-5">No services available for this category in the salon.</p>
              ) : (
                <ul className="list-group mt-3">
                  {services
                    .filter(service => service.categoryId === category.value)
                    .map(service => (
                      <li className={`list-group-item d-flex justify-content-between align-items-center p-3 ${service.availability ? `bg-white` : `bg-light`}`} key={service.id}>
                        <div className='service-thumbnail'>
                          <img className='img-thumbnail rounded-circle' src='https://placekitten.com/100/100'></img>
                        </div>
                        <div className='service-info text-start flex-grow-1 ms-4'>
                          <strong className='fs-4'>{service.name}</strong>
                          <span className={`badge ${service.availability ? `bg-success` : `bg-danger`} border border-light rounded-circle p-2 ms-2 align-text-center`}> </span>
                          <p className='fs-6'>{service.desc}</p>
                        </div>
                        <div className='tooltips row switch-container'>
                          {/* pending 
                        <button className='btn btn-outline-secondary mx-2 rounded-circle' data-bs-toggle="modal" data-bs-placement="top" title="Edit" data-bs-target="#updateServiceModal"><span className="bi-pencil"></span></button>
                        */}
                          <div class="col-auto">
                            <button className='btn btn-outline-danger rounded-circle' data-bs-toggle="modal" data-bs-placement="top" title="Delete" data-bs-target="#deleteServiceModal"><span className="bi-trash"></span></button>
                          </div>
                          <div class="col-auto form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" checked={service.availability} onChange={() => handleServiceAvailability(service.id)} />
                          </div>
                        </div>

                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='border border-2 rounded-4 p-4 ps-5 bg-white min-height mb-4'>
        <h1 className="text-start mb-4">Hairstylist Management</h1>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {hairstylistList.map(hairstylist => (
            <div className="col" key={hairstylist.id}>
              <div className="card">
                <div className="card-body text-start">
                  <div className='service-thumbnail float-start mx-4'>
                    <img className='img-thumbnail rounded-circle' src='https://placekitten.com/100/100'></img>
                  </div>
                  <h5 className="card-title fw-bold mt-3">{hairstylist.name}</h5>
                  <p className="card-text mb-0">{hairstylist.title}</p>
                  <p className="card-text"><span className='bi bi-star-fill me-2'></span>{hairstylist.rating}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Placeholder card for adding a new hairstylist */}
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className='service-thumbnail float-start mx-4'>
                  <img className='img-thumbnail rounded-circle' src='https://placekitten.com/100/100'></img>
                </div>
                <h5 className="card-title fw-bold mt-3 placeholder-glow"><span className='placeholder col-6'></span></h5>
                <button className="btn btn-link"  data-bs-toggle="modal" data-bs-target="#addHairstylistModal">+ Add New Hairstylist</button>
              </div>
            </div>
          </div>
        </div>
      </div>
        
        {/* Modal for adding new service */}
        <div className={`modal fade`} id="addServiceModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addServiceModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title px-2 fw-bold">New Service</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form className="w-100 text-start px-3">
                  <div className="mb-3">
                    <label htmlFor="serviceName" className='form-label fw-semibold'>Service Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceName"
                      value={newFormData.serviceName}
                      onChange={handleNewFormInputChange}
                      id="serviceName"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className='form-label fw-semibold'>Service Category</label>
                    <Select
                      options={categories}
                      name='category'
                      placeholder='Category' />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="duration" className='form-label fw-semibold'>Service Duration</label>
                    <div className='row g-0'>
                      <div className='col-auto'>
                        <input
                          type="number"
                          className="form-control"
                          name="duration"
                          value={newFormData.duration}
                          onChange={handleNewFormInputChange}
                          id="duration"
                        />
                      </div>
                      <div className='col-auto'><span className='input-group-text'>minutes</span></div>

                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hairstylist" className='form-label fw-semibold'>Hairstylist Scope</label>
                    <Select
                      options={hairstylists}
                      name='hairstylist'
                      value={newFormData.hairstylists}
                      isMulti
                      placeholder="Hairstylist"
                      onChange={handleMultiSelectChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="desc" className='form-label fw-semibold'>Description</label>
                    <textarea
                      className="form-control p-3"
                      name="desc"
                      value={newFormData.desc}
                      onChange={handleNewFormInputChange}
                      id="desc"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Add Service</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for update existing service
      <div className={`modal fade`} id="updateServiceModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="updateServiceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fw-bold">Update Service</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            //update form here
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      */}
        {/* Modal for delete existing service */}
        <div className={`modal fade`} id="deleteServiceModal" tabIndex="-1" aria-labelledby="deleteServiceModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title fw-bold">Delete Service</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>The service <strong>deleted</strong> will not able to recover.<br></br> Please confirm that you really want to delete this service.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Confirm Delete</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        {/* Modal for add hairstylist */}
        <div className="modal fade" id="addHairstylistModal" tabIndex="-1" aria-labelledby="addHairstylistModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addHairstylistModalLabel">Add Hairstylist</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
              {/*form to add new hairstylist */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SalonManagement;
