import React, { useState, useEffect } from 'react';
import SalonCard from '../components/salon-card';
import config from '../config';
const SalonExplore = () => {
    //------------------------------state-variable------------------------------//
    const [selectedState, setSelectedState] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [sortBy, setSortBy] = useState('');
    const states = ['Malaysia', 'Singapore', 'Indonesia']; // Placeholder for states
    const services = ['Haircut', 'Coloring', 'Styling', 'Texturizing', 'Treatments', 'Extensions', "Men's Grooming", 'Others']; // Placeholder for services
    const sortOptions = ['Latest', 'Rating', 'Price']; // Placeholder for sort options
    const salonList = Array.from({ length: 16 }, (_, i) => i + 1); // Placeholder for salon list (16 items)
    //------------------------------api-request------------------------------//
    //------------------------------helper-formatter-method------------------------------//
    //------------------------------html------------------------------//
    return (
        <div className="container-fluid my-3 full-width">
            <div className="row">
                {/*Filter Section (Left Side) */}
                <div className="col-md-2 border border-2 rounded-4 p-3 bg-white text-start">
                    {/* State Selector */}
                    <div className="row mb-3">
                        <div className="col-12">
                            <h3>Filter By</h3>
                            <label htmlFor="stateSelector" className="form-label fw-semibold">Select State</label>
                            <select id="stateSelector" className="form-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                                <option value="">-- Select State --</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Services Selection (Radio Buttons) */}
                    <div className="row mb-3">
                        <div className="col-12">
                            <label className="form-label fw-semibold">Select Service</label>
                            {services.map((service, index) => (
                                <div key={index} className="form-check">
                                    <input className="form-check-input" type="radio" name="serviceRadio" id={`serviceRadio${index}`} value={service} checked={selectedService === service} onChange={() => setSelectedService(service)} />
                                    <label className="form-check-label" htmlFor={`serviceRadio${index}`}>{service}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className="row">
                        <div className="col-12">
                            {/* Placeholder for pagination */}
                        </div>
                    </div>
                </div>


                {/*right side section*/}
                <div className="col-md-10 px-4">
                    {/* Sorting Section */}
                    <div className="row mb-3">
                        <div className="col border border-2 rounded-4 p-3 bg-white">
                            <div className='float-end'>
                                <label htmlFor="sortBySelector" className="col-sm-5 col-form-label">Sort By :</label>
                                <select id="sortBySelector" className="col-form-select col-sm-7" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="">-- Sort By --</option>
                                    {sortOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Salon Listing Section */}
                    <div className="row">
                        <div className="col border border-2 rounded-4 p-5 bg-white min-height">
                            <div className="row row-cols-1 row-cols-md-4 g-4">
                                {salonList.map((salon, index) => (
                                    <div className="col mb-4" key={index}>
                                    <SalonCard
                                        key={index}
                                        imageSrc="https://dummyimage.com/400X300/000/fff.png&text=++++image++++"
                                        cardText="Some quick example text to build on the card title and make up the bulk of the card's content"
                                        cardTitle={`Salon ${index + 1}`}
                                    />
                                    </div>
                                ))}
                            </div>
                            {/* Pagination Placeholder */}
                            <div className="row mt-5">
                                <div className="col-12 d-flex justify-content-end">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Previous">
                                                    <span aria-hidden="true">Prev</span>
                                                </a>
                                            </li>
                                            <li className="page-item"><a className="page-link active" href="#">1</a></li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next">
                                                    <span aria-hidden="true">Next</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalonExplore;