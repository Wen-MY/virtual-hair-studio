import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonCard from '../../components/salon-card';
import config from '../../config';
const SalonExplore = () => {
    //------------------------------state-variable------------------------------//
    const [salons, setSalons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [limit, setLimit] = useState(16);
    const [searchKeywords, setSearchKeywords] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterService, setFilterService] = useState('');
    const [sortBy, setSortBy] = useState({
        option : '',
        direction : true
    });
    const [searching, setSearching] = useState(0);

    const navigate = useNavigate();

    //filter options
    const states = [
        'Johor',
        'Kedah',
        'Kelantan',
        'Melaka',
        'Negeri Sembilan',
        'Pahang',
        'Perak',
        'Perlis',
        'Pulau Pinang',
        'Sabah',
        'Sarawak',
        'Selangor',
        'Terengganu',
        'Kuala Lumpur',
        'Labuan',
        'Putrajaya'
    ];

    const [services, setServices] = useState(null);
    const sortOptions = ['Latest', 'Rating'];
    //------------------------------api-request------------------------------//
    useEffect(() => {
        fetchSalons();
        fetchAvailableServiceCategories();
    }, [currentPage, searching, filterService, filterState])

    const fetchSalons = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/salon/retrieve?search=${searchKeywords}&state=${filterState}&service=${filterService}&limit=${limit}&currentPage=${currentPage}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if (data.results) {
                setSalons(data.results);
                setTotalResults(data.totalResults);
                setTotalPages(Math.ceil(data.totalResults / limit));
            } else {
                setSalons([]);
                setTotalResults(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching salons data:', error);
            //setLoading(false);
        }
    }
    const fetchAvailableServiceCategories = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/service/categories`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.result) {
                setServices(data.result);
            }
        } catch (error) {
            console.error('Error fetching service categories data:', error);
        }
    }
    //------------------------------input-handling-method------------------------------//
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowClick = (id) => {
        navigate(`/salon/${id}`);
    };
    useEffect(() => {
        const sortSalons = () => {
            const sortedSalons = [...salons]; // Create a copy of the original array
            if (sortBy.option === 'Latest') {
                sortedSalons.sort((a, b) => {
                    if (sortBy.direction) {
                        return new Date(b.updated_at) - new Date(a.updated_at);
                    } else {
                        return new Date(a.updated_at) - new Date(b.updated_at);
                    }
                });
            } else if (sortBy.option === 'Rating') {
                sortedSalons.sort((a, b) => {
                    if (sortBy.direction) {
                        return b.average_rating - a.average_rating;
                    } else {
                        return a.average_rating - b.average_rating;
                    }
                });
            }
            setSalons(sortedSalons);
        };
        if(salons.length > 0)
            sortSalons();
    }, [sortBy]);
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
                            <select id="stateSelector" className="form-select" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                                <option value="">-- Select State --</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Services Selection (Radio Buttons) */}
                    {services &&
                        <div className="row mb-3">
                            <div className="col-12">
                                <label className="form-label fw-semibold">Select Service</label>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="serviceRadio" id={`serviceRadio-all`} value={''} checked={filterService === ''} onChange={() => setFilterService('')} />
                                    <label className="form-check-label" htmlFor={`serviceRadio-all`}>All</label>
                                </div>
                                {services.map((service) => (
                                    <div key={service.id} className="form-check">
                                        <input className="form-check-input" type="radio" name="serviceRadio" id={`serviceRadio-${service.id}`} value={service.id} checked={filterService === service.id} onChange={() => setFilterService(service.id)} />
                                        <label className="form-check-label" htmlFor={`serviceRadio-${service.id}`}>{service.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
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
                        <div className="border border-2 rounded-4 p-3 bg-white ">
                            <div className='d-flex justify-content-end'>
                                <label htmlFor="sortBySelector" className="col-sm-1 col-form-label">Sort By :</label>
                                <div className="col-sm-2">
                                    <select id="sortBySelector" className="form-select" value={sortBy.option} onChange={(e) => setSortBy({option: e.target.value,direction : true})}>
                                        <option value=''>-- Sort By --</option>
                                        {sortOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>  
                                </div>
                                <button className="btn btn-outline-secondary ms-2 d-flex align-items-center" onClick={() => setSortBy(prevOption => ({ ...prevOption, direction: !prevOption.direction }))}>{sortBy.direction?<i className="bi bi-arrow-down"></i>:<i className="bi bi-arrow-up"></i>}</button>
                            </div>
                        </div>
                    </div>
                    {/* Salon Listing Section */}
                    <div className="row">
                        <div className="col border border-2 rounded-4 p-5 bg-white min-height">
                            {(salons.length > 0 && totalResults > 0) ? (
                                <div className="row row-cols-1 row-cols-md-4 g-4">
                                    {salons.map((salon) => (
                                        <div className="col mb-4" key={salon.id} onClick={() => handleRowClick(salon.id)}>
                                            <SalonCard
                                                key={salon.id}
                                                imageSrc={salon.image_url ? salon.image_url : `https://picsum.photos/400/300?random=${salon.id}`}
                                                rating={salon.average_rating}
                                                cardTitle={salon.name}
                                            />
                                        </div>
                                    ))}
                                </div>)
                                : (
                                    <div className='min-height d-flex align-items-center justify-content-center'>
                                        <div className='border border-2 p-3 rounded-4 bg-light'>
                                            <h3>No Matched Salon found</h3>
                                        </div>
                                    </div>
                                )}
                            {/* Pagination Placeholder */}
                            <div className="row mt-5">
                                <div className="col-12 d-flex justify-content-end">
                                    <nav>
                                        <ul className="pagination justify-content-end">
                                            <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`} ><button className="page-link" onClick={() => currentPage > 1 ? handlePageChange(currentPage - 1) : null}>Previous</button></li>
                                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => currentPage < totalPages ? handlePageChange(currentPage + 1) : null}>Next</button></li>
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