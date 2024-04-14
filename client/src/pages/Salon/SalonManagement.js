import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../../components/loading-spinner';
import config from '../../config';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'

const SalonManagement = () => {
  const [loading, setLoading] = useState(true);
  const [salonId, setSalonId] = useState(null);
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
  const [categories, setCategories] = useState([]);
  // State for active tab index
  const [activeTab, setActiveTab] = useState(0);
  const [newServiceFormData, setNewServiceFormData] = useState({
    serviceName: '',
    categoryId: '',
    duration: null,
    hairstylists: [],
    desc: '',
  });


  const [newHairstylistFormData, setNewHairstylistFormData] = useState({
    name: '',
    position: '',
    image: null
  });
  //updating services
  const [selectedService, setSelectedService] = useState(null);

  //----------------api-request-----------------------//
  useEffect(() => {
    const fetchSalonId = async () => {
      try {
        const salonIdResponse = await fetch(config.serverUrl + `/salon/id`, {
          credentials: 'include'
        })
        const salonIdData = await salonIdResponse.json();
        if (salonIdResponse.ok) {
          setSalonId(salonIdData.result.id);
        }
        else {
          return;
        }
      } catch (error) {
        console.error('Error fetching salon data:', error);
        setLoading(false);
      }
    }
    fetchSalonId();
  }, []);
  useEffect(() => {

    if (salonId)
      fetchSalonData();
  }, [salonId]);
  // Effect to set default active tab index to 0
  useEffect(() => {
    if (categories.length > 0) {
      // Set the first tab as active
      const firstTab = document.querySelector('.nav-link');
      firstTab.classList.add('active');

      // Set the first tab pane as active
      const firstTabPane = document.querySelector('.tab-pane');
      firstTabPane.classList.add('active', 'show');
    }
  }, [loading]);
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

      const categoriesResponse = await fetch(config.serverUrl + `/service/categories`, {
        credentials: 'include'
      });
      const categoriesData = await categoriesResponse.json();
      if (categoriesResponse.ok) {
        const mappedCategories = categoriesData.result.map(category => ({
          value: category.id,
          label: category.name
        }));
        setCategories(mappedCategories);
      } else {
        console.error('Failed to fetch salon information:', categoriesData.message);
      }

      const servicesResponse = await fetch(config.serverUrl + `/service/all/${salonId}`, {
        credentials: 'include'
      });
      const servicesData = await servicesResponse.json();
      if (servicesResponse.ok) {
        const servicesWithParsedHairstylists = servicesData.result.map(service => ({
          ...service,
          hairstylists: service.hairstylists.split(",").map(id => parseInt(id))
        }));

        // Now, set the transformed services data to the state
        setServices(servicesWithParsedHairstylists);
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
      setLoading(false);

    } catch (error) {
      console.error('Error fetching salon data:', error);
      setLoading(false);
    }
  };
  const updateSelectedService = async (service) => {
    //
    const serviceToUpdate = service ? service : selectedService;
    try {
      // Fetch salon details using salon ID
      const updateResponse = await fetch(
        config.serverUrl + `/service/update/${serviceToUpdate?.id}`,
        {
          method: 'PUT',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            serviceToUpdate
          ),
        }
      );

      const updateData = await updateResponse.json();
      if (updateResponse.ok) {
        fetchSalonData();
        console.log("Success to update salon information")
        toast.success(updateData.message, { autoClose: 3000 });
      } else {
        console.error("Failed to update salon information:", updateData.message);
        toast.warning(updateData.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
    setSelectedService(null);
  }
  const addNewService = async () => {
    //
    const serviceToAdd = newServiceFormData;
    console.log(serviceToAdd);
    try {
      // Fetch salon details using salon ID
      const createResponse = await fetch(
        config.serverUrl + `/service/add/${salonId}`,
        {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            serviceToAdd
          ),
        }
      );

      const createData = await createResponse.json();
      if (createResponse.ok) {
        fetchSalonData();
        console.log("Success to update salon information")
        toast.success(createData.message, { autoClose: 3000 });
      } else {
        console.error("Failed to update salon information:", createData.message);
        toast.warning(createData.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
    clearNewServiceForm();
  }
  const deleteSelectedService = async (service) => {
    //
    const serviceToDelete = service ? service : selectedService;
    try {
      // Fetch salon details using salon ID
      const deleteResponse = await fetch(
        config.serverUrl + `/service/delete/${serviceToDelete?.id}`,
        {
          method: 'DELETE',
          credentials: "include",
        }
      );

      const deleteData = await deleteResponse.json();
      if (deleteResponse.ok) {
        fetchSalonData();
        console.log("Success to delete salon information")
        toast.success(deleteData.message, { autoClose: 3000 });
      } else {
        console.error("Failed to delete salon information:", deleteData.message);
        toast.warning(deleteData.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
    setSelectedService(null);
  }
  const addNewHairstylist = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newHairstylistFormData.name);
      formData.append('position', newHairstylistFormData.position);
      formData.append('image', newHairstylistFormData.image);
      // Fetch salon details using salon ID
      console.log(newHairstylistFormData.name);
      console.log(newHairstylistFormData.position);
      const createResponse = await fetch(
        config.serverUrl + `/hairstylist/add/${salonId}`,
        {
          method: 'POST',
          credentials: "include",
          body: formData,
        }
      );

      const createData = await createResponse.json();
      if (createResponse.ok) {
        fetchSalonData();
        console.log("Success to update salon information")
        toast.success(createData.message, { autoClose: 3000 });
      } else {
        console.error("Failed to update salon information:", createData.message);
        toast.warning(createData.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
    clearNewHairstylistForm();
  }
  //----------------------------------------- add service form change handling ----------
  const handleNewServiceFormInputChange = (e) => {
    setNewServiceFormData({
      ...newServiceFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleNewServiceFormSelectChange = (selectedOption) => {
    setNewServiceFormData({
      ...newServiceFormData,
      categoryId: selectedOption.value,
    });
  };
  const handleNewServiceMultiSelectChange = (selectedOptions) => {
    setNewServiceFormData({
      ...newServiceFormData,
      hairstylists: selectedOptions.map(selectedOption => selectedOption.value),
    });
    //console.log(newServiceFormData.hairstylists);
  };
  const clearNewServiceForm = () => {
    setNewServiceFormData({
      serviceName: '',
      categoryId: '',
      duration: '',
      hairstylists: [],
      desc: '',
    }) //clear new form data
  }
  //----------------------------------------- update service form change handling ----------
  const handleSelectedServiceFormInputChange = (e) => {
    setSelectedService({
      ...selectedService,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectedServiceMultiSelectChange = (selectedOptions) => {
    setSelectedService({
      ...selectedService,
      hairstylists: selectedOptions.map(selectedOption => selectedOption.value),
    });
    //console.log(newServiceFormData.hairstylists);
  };
  const handleServiceAvailability = async (id) => {
    /* Update services locally
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === id ? { ...service, availability: !service.availability } : service
      )
    );
    */
    //set selected service to this service id and update it availability
    const selected = services.find(service => service.id === id);
    // Toggle the availability of the selected service
    const updatedSelectedService = { ...selected, availability: selected.availability === 1 ? 0 : 1 };
    //console.log(updatedSelectedService);

    updateSelectedService(updatedSelectedService);
  };

  //----------------------------------------- add hairstylist form change handling ----------

  const handleNewHairstylistInputChange = (e) => {
    setNewHairstylistFormData({
      ...newHairstylistFormData,
      [e.target.name]: e.target.value,
    });
  };
  const clearNewHairstylistForm = () => {
    setNewHairstylistFormData({
      name: '',
      position: '',
      image: null
    }) //clear new form data
  }
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    // Handle file upload logic here
    setNewHairstylistFormData(prevFormData => ({
      ...prevFormData,
      image: file
    }));
  };
  if (loading) {
    return (
      <Loader />
    );
  }
  return (
    <div className="container-fluid my-3 full-width">
      <ToastContainer
        position='top-center'
      />
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
              {services.filter(service => service.category_id === category.value).length === 0 ? (
                <p className="mt-5">No services available for this category in the salon.</p>
              ) : (
                <ul className="list-group mt-3">
                  {services
                    .filter(service => service.category_id === category.value)
                    .map(service => (
                      <li className={`list-group-item d-flex justify-content-between align-items-center p-4 ${service.availability ? `bg-white` : `bg-light`}`} key={service.id}>
                        {/*
                        <div className='service-thumbnail'>
                          <img className='img-thumbnail rounded-circle' src='https://picsum.photos/100/100'></img>
                        </div>
                      */}
                        <div className='service-info text-start flex-grow-1 ms-4'>
                          <strong className='fs-4'>{service.service_name}</strong>
                          <span className={`badge ${service.availability ? `bg-success` : `bg-danger`} border border-light rounded-circle p-2 ms-2 align-text-center`}> </span>
                          <p className='fs-6'>{service.desc}</p>
                        </div>
                        <div className='tooltips row switch-container'>
                          <div className="col-auto">
                            <button className='btn btn-outline-secondary mx-2 rounded-circle' data-bs-toggle="modal" data-bs-placement="top" title="Edit" data-bs-target="#updateServiceModal" onClick={() => setSelectedService(service)}><span className="bi-pencil"></span></button>
                            <button className='btn btn-outline-danger rounded-circle' data-bs-toggle="modal" data-bs-placement="top" title="Delete" data-bs-target="#deleteServiceModal" onClick={() => setSelectedService(service)}><span className="bi-trash"></span></button>
                          </div>
                          <div className="col-auto form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" checked={service.availability} onChange={() => handleServiceAvailability(service.id)} />
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
          {hairstylists.map(hairstylist => (
            <div className="col" key={hairstylist.id}>
              <div className="card">
                <div className="card-body text-start">
                  <div className='service-thumbnail float-start mx-4'>
                    <img className='img-thumbnail rounded-circle image-square-medium' src={hairstylist.image_url?hairstylist.image_url:`https://picsum.photos/100/100?random=${hairstylist.id}`}></img>
                  </div>
                  <h5 className="card-title fw-bold mt-3">{hairstylist.name}</h5>
                  <p className="card-text mb-0">{hairstylist.position ? hairstylist.position : 'Unassigned'}</p>
                  <p className="card-text">{hairstylist.rating ? (
                    <span>
                      {hairstylist.rating.toFixed(1)} <i className="bi bi-star-fill"></i>
                    </span>
                  ) : (
                    "No ratings"
                  )}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Placeholder card for adding a new hairstylist */}
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className='service-thumbnail float-start mx-4'>
                  <img className='img-thumbnail rounded-circle' src='https://picsum.photos/100/100'></img>
                </div>
                <h5 className="card-title fw-bold mt-3 placeholder-glow"><span className='placeholder col-6'></span></h5>
                <button className="btn btn-link" data-bs-toggle="modal" data-bs-target="#addHairstylistModal">+ Add New Hairstylist</button>
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
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => clearNewServiceForm()}></button>
            </div>
            <div className="modal-body">
              <form className="w-100 text-start px-3">
                <div className="mb-3">
                  <label htmlFor="serviceName" className='form-label fw-semibold'>Service Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serviceName"
                    value={newServiceFormData.serviceName}
                    onChange={handleNewServiceFormInputChange}
                    id="serviceName"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className='form-label fw-semibold'>Service Category</label>
                  <Select
                    options={categories}
                    name='categoryId'
                    placeholder='Category'
                    onChange={handleNewServiceFormSelectChange}
                  />

                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className='form-label fw-semibold'>Service Duration</label>
                  <div className='row g-0'>
                    <div className='col-auto'>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={newServiceFormData.duration}
                        onChange={handleNewServiceFormInputChange}
                        id="duration"
                      />
                    </div>
                    <div className='col-auto'><span className='input-group-text'>minutes</span></div>

                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="hairstylist" className='form-label fw-semibold'>Hairstylist Scope</label>
                  <Select
                    options={hairstylists.map(hairstylist => ({
                      value: hairstylist.id,
                      label: hairstylist.name
                    }))}
                    name='hairstylist'
                    value={newServiceFormData?.hairstylists.map(id => ({ value: id, label: hairstylists.find(hairstylist => hairstylist.id === id)?.name || "" }))}
                    isMulti
                    placeholder="Hairstylist"
                    onChange={handleNewServiceMultiSelectChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="desc" className='form-label fw-semibold'>Description</label>
                  <textarea
                    className="form-control p-3"
                    name="desc"
                    value={newServiceFormData.desc}
                    onChange={handleNewServiceFormInputChange}
                    id="desc"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addNewService()}>Add Service</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => clearNewServiceForm()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for update existing service */}
      <div className={`modal fade`} id="updateServiceModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="updateServiceModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fw-bold">Update Service</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedService(null)}></button>
            </div>
            <div className="modal-body">
              <form className="w-100 text-start px-3">
                <div className="mb-3">
                  <label htmlFor="serviceName" className='form-label fw-semibold'>Service Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serviceName"
                    value={selectedService?.service_name}
                    id="serviceName"
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className='form-label fw-semibold'>Service Category</label>
                  <Select
                    options={categories}
                    name='category'
                    placeholder='Category'
                    value={categories.find(category => category.value === selectedService?.category_id)}
                    isDisabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className='form-label fw-semibold'>Service Duration</label>
                  <div className='row g-0'>
                    <div className='col-auto'>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={selectedService?.duration}
                        onChange={handleSelectedServiceFormInputChange}
                        id="duration"
                      />
                    </div>
                    <div className='col-auto'><span className='input-group-text'>minutes</span></div>

                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="hairstylist" className='form-label fw-semibold'>Hairstylist Scope</label>
                  <Select
                    options={hairstylists.map(hairstylist => ({
                      value: hairstylist.id,
                      label: hairstylist.name
                    }))}
                    value={selectedService?.hairstylists.map(id => ({ value: id, label: hairstylists.find(hairstylist => hairstylist.id === id)?.name || "" }))}
                    name='hairstylist'
                    isMulti
                    placeholder="Hairstylist"
                    onChange={handleSelectedServiceMultiSelectChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="desc" className='form-label fw-semibold'>Description</label>
                  <textarea
                    className="form-control p-3"
                    name="desc"
                    value={selectedService?.desc}
                    onChange={handleNewServiceFormInputChange}
                    id="desc"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => updateSelectedService()}>Save Changes</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setSelectedService(null)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for delete existing service */}
      <div className={`modal fade`} id="deleteServiceModal" tabIndex="-1" aria-labelledby="deleteServiceModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fw-bold">Delete Service</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedService(null)}></button>
            </div>
            <div className="modal-body">
              <p>The service <strong>deleted</strong> will not able to recover.<br></br> Please confirm that you really want to delete this service.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteSelectedService()}>Confirm Delete</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setSelectedService(null)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for add hairstylist */}
      <div className="modal fade" id="addHairstylistModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addHairstylistModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addHairstylistModalLabel">Add Hairstylist</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => clearNewHairstylistForm()}></button>
            </div>
            <div className="modal-body">
              <form className="w-100 text-start px-3">
                <div className="mb-3">
                  {/* Hidden file input */}
                  <div className="d-flex justify-content-center">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      className="d-none"
                      onChange={handleImageUpload}
                    />
                    {/* Clickable image */}
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <img
                        src={newHairstylistFormData.image ? URL.createObjectURL(newHairstylistFormData.image) : process.env.PUBLIC_URL + '/sample-image/person_thumbnail.png'}
                        alt="Salon"
                        className="img rounded-circle image-square-large"
                        required
                      />
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="hairstylistName" className='form-label fw-semibold'>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newHairstylistFormData.name}
                    onChange={handleNewHairstylistInputChange}
                    id="hairstylistName"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="position" className='form-label fw-semibold'>Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="position"
                    value={newHairstylistFormData.position}
                    onChange={handleNewHairstylistInputChange}
                    id="position"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addNewHairstylist()}>Add</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => clearNewHairstylistForm()}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonManagement;
