import React, { useState, useEffect } from "react";
import config from "../../config";
import Chart from "chart.js/auto"; // Import Chart.js library
import CalendarDay from "../../components/calendar-day";
import SalonCard from "../../components/salon-card";
import {
    formatContactNumber,
    formatBusinessHour,
} from "../../utils/salonInformationFormatter";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalonDashboard = () => {
    const [salonId, setSalonId] = useState(null);
    const [appointmentsOverTimeData, setAppointmentsOverTimeData] = useState([]);
    const [appointmentStatusData, setAppointmentStatusData] = useState([]);
    const [upcomingCustomer, setUpcomingCustomer] = useState({
        name: "No Upcoming Customer",
        appointmentTime: null,
        service: null,
    });
    const [salonInfo, setSalonInfo] = useState({
        name: "Example Salon",
        address: "",
        state: "",
        phoneNumber: "",
        businessHour: "1-6/10:30-18:30",
        image_url: null,
    });
    const states = [
      'Johor',
      'Kedah',
      'Kelantan',
      'Melaka',
      'Negeri Sembilan',
      'Pahang',
      'Perak',
      'Perlis',
      'Penang',
      'Sabah',
      'Sarawak',
      'Selangor',
      'Terengganu',
      'Kuala Lumpur',
      'Labuan',
      'Putrajaya'
    ];
    const [customerRating, setCustomerRating] = useState([0, 0, 0, 0, 0]);
    const [isEditing, setIsEditing] = useState(false);
    const [salonImageFile, setSalonImageFile] = useState(null);
    //------------------------------handling method------------------------------//
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        // Add logic to save the updated salon information (newSalonInfo)
        updateSalonData();
        updateSalonImage();
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        // Add logic to cancel the edit
        fetchSalonData();
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        // Handle file upload logic here
        setSalonImageFile(file);
        setSalonInfo({ ...salonInfo, image_url: URL.createObjectURL(file)});
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSalonInfo((prevSalonInfo) => ({
            ...prevSalonInfo,
            [name]: value,
        }));
    };

    const handleBusinessDayChange = (e) => {
        const { name, value } = e.target;
        let newBusinessHour = salonInfo.businessHour;
        if (name === 'startDay') {
            newBusinessHour = value + newBusinessHour.substring(1);
        } else {
            newBusinessHour = newBusinessHour.substring(0, 2) + value + newBusinessHour.substring(3);
        }

        console.log(newBusinessHour);
        setSalonInfo((prevSalonInfo) => ({
            ...prevSalonInfo,
            businessHour: newBusinessHour
        }));
    };
    const handleBusinessTimeChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        let newBusinessHour = salonInfo.businessHour;
        console.log(newBusinessHour);
        if (name === 'startTime') {
            newBusinessHour = newBusinessHour.substring(0, 4) + value + newBusinessHour.substring(9);
        } else {
            newBusinessHour = newBusinessHour.substring(0, 10) + value;
        }
        console.log(newBusinessHour);
        setSalonInfo((prevSalonInfo) => ({
            ...prevSalonInfo,
            businessHour: newBusinessHour
        }));
    };
    const handleOptionSelectChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        setSalonInfo((prevSalonInfo) => ({
            ...prevSalonInfo,
            state: value
        }));
      }; 

    //------------------------------useEffect update state------------------------------//

    useEffect(() => {
        if (salonId) {
            fetchAppointmentsOverTimeData();
            fetchAppointmentStatusData();
            fetchUpcomingCustomer();
            fetchSalonData();
            fetchAllCustomerRating();
        } else {
            fetchCurrentSalonId();
        }
    }, [salonId]);

    useEffect(() => {
        // Render Chart.js for appointments over time data
        const appointmentsOverTimeChart = new Chart(
            document.getElementById("appointmentsOverTimeChart"),
            {
                type: "line",
                data: {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                    datasets: [
                        {
                            label: "",
                            data: appointmentsOverTimeData,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Appointment Completed Last Week",
                            padding: {
                                top: 10,
                                bottom: 15,
                            },
                            font: {
                                size: 16,
                                weight: "bold",
                            },
                        },
                        legend: {
                            display: false, // Disable legend
                        },
                    },
                    maintainAspectRatio: false, // Do not maintain aspect ratio
                    scales: {
                        y: {
                            beginAtZero: true, // Start y-axis from 0
                            precision: 0, // Display integer values without decimals
                        },
                    },
                },
            }
        );

        // Render Chart.js for appointment status data
        const appointmentStatusChart = new Chart(
            document.getElementById("appointmentStatusChart"),
            {
                type: "pie",
                data: {
                    labels: ["Confirmed", "Canceled", "Pending"],
                    datasets: [
                        {
                            data: appointmentStatusData,
                            backgroundColor: [
                                "rgb(40, 167, 69)", // Bootstrap success color for confirmed
                                "rgb(220, 53, 69)", // Bootstrap danger color for canceled
                                "rgb(255, 193, 7)", // Bootstrap warning color for pending
                            ],
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Active Appointment Chart",
                            padding: {
                                top: 10,
                                bottom: 15,
                            },
                            font: {
                                size: 16,
                                weight: "bold",
                            },
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            }
        );

        // Render Chart.js for customer satisfaction data (dummy)
        const customerSatisfactionChart = new Chart(
            document.getElementById("customerSatisfactionChart"),
            {
                type: "bar",
                data: {
                    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
                    datasets: [
                        {
                            label: "Customer Satisfaction",
                            data: customerRating,
                            backgroundColor: "rgb(54, 162, 235)",
                            borderColor: "rgb(54, 162, 235)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "All Customer Rating",
                            padding: {
                                top: 10,
                                bottom: 15,
                            },
                            font: {
                                size: 16,
                                weight: "bold",
                            },
                        },
                        legend: {
                            display: false, // Disable legend
                        },
                    },
                    indexAxis: "y",
                    maintainAspectRatio: false, // Do not maintain aspect ratio
                    x: {
                        beginAtZero: true, // Start y-axis from 0
                        ticks: {
                            stepSize: calculateStepSize(customerRating),
                        }, // Display integer values without decimals
                    },
                },
            }
        );
        function calculateStepSize(data) {
            const sum = data.reduce((acc, val) => acc + val, 0);
            const average = sum / data.length;

            // Determine a suitable step size based on the average
            // You can adjust this logic based on your requirements
            if (average <= 10) {
                return 1; // For small averages, set step size to 1
            } else if (average <= 50) {
                return 5; // For medium averages, set step size to 5
            } else {
                return 10; // For large averages, set step size to 10 or adjust as needed
            }
        }
        // Render Chart.js for service popularity data (dummy)
        const servicePopularityChart = new Chart(
            document.getElementById("servicePopularityChart"),
            {
                type: "bar",
                data: {
                    labels: ["Haircut", "Manicure", "Pedicure", "Massage", "Facial"],
                    datasets: [
                        {
                            label: "Service Popularity",
                            data: [50, 30, 25, 20, 15], // Dummy data for service popularity
                            backgroundColor: "rgb(255, 99, 132)", // Bootstrap secondary color
                            borderColor: "rgb(255, 99, 132)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    indexAxis: "y",
                },
            }
        );

        // Render Chart.js for appointment distribution throughout the day (dummy)
        const appointmentDistributionChart = new Chart(
            document.getElementById("appointmentDistributionChart"),
            {
                type: "line",
                data: {
                    labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ],
                    datasets: [
                        {
                            label: "Appointments Distribution",
                            data: [10, 20, 30, 40, 50, 45, 40, 35, 30, 0, 0, 0], // Dummy data for appointment distribution
                            fill: false,
                            borderColor: "rgb(255, 159, 64)", // Bootstrap warning color
                            tension: 0.1,
                        },
                    ],
                },
            }
        );

        // Cleanup function to destroy the charts when the component unmounts
        return () => {
            appointmentsOverTimeChart.destroy();
            appointmentStatusChart.destroy();
            customerSatisfactionChart.destroy();
            servicePopularityChart.destroy();
            appointmentDistributionChart.destroy();
        };
    }, [appointmentsOverTimeData, appointmentStatusData]);
    //------------------------------api-request------------------------------//
    const fetchCurrentSalonId = async () => {
        try {
            // Fetch salon ID
            const salonIdRes = await fetch(config.serverUrl + "/salon/id", {
                credentials: "include",
            });
            const salonIdJson = await salonIdRes.json();
            setSalonId(salonIdJson.result.id);
        } catch (error) {
            console.error("Error fetching salon i:", error);
        }
    };
    // Function to generate dummy data for appointments over time
    const fetchAppointmentsOverTimeData = async () => {
        try {
            // Calculate the date range for last week (Monday to Friday)
            const today = new Date();
            const lastWeekStartDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - today.getDay() - 6
            );
            const lastWeekEndDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - today.getDay() - 2
            );

            // Format the dates as required by the backend API
            const lastWeekStartDateFormatted = formatDate(lastWeekStartDate);
            const lastWeekEndDateFormatted = formatDate(lastWeekEndDate);

            // Make a GET request to the backend API to retrieve appointments within the last week range
            const response = await fetch(
                `${config.serverUrl}/appointment/retrieve?status=completed&range=${lastWeekStartDateFormatted}_${lastWeekEndDateFormatted}`,
                {
                    credentials: "include",
                }
            );
            const appointmentsCount = [0, 0, 0, 0, 0];
            // Check if the response is successful (status code 200)
            if (response.ok) {
                // Parse the JSON response
                const responseData = await response.json();

                // Extract the data from the response
                const appointments = responseData.results;

                // Calculate the total appointments for each day (Monday to Friday)
                // Initialize with zeros for Monday to Friday
                if (responseData.totalResults > 0) {
                    appointments.forEach((appointment) => {
                        const appointmentDate = new Date(appointment.booking_datetime);
                        const dayOfWeek = appointmentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

                        // Increment the count for the corresponding day (Monday to Friday)
                        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                            appointmentsCount[dayOfWeek - 1]++;
                        }
                    });
                }
            } else {
                console.error(
                    "Failed to fetch appointments over time data:",
                    response.statusText
                );
            }
            setAppointmentsOverTimeData(appointmentsCount);
        } catch (error) {
            console.error("Error fetching appointments over time data:", error);
            setAppointmentsOverTimeData([0, 0, 0, 0, 0]); // Return empty array in case of any error
        }
    };

    // Function to generate dummy data for appointment status
    const fetchAppointmentStatusData = async () => {
        try {
            // Make HTTP GET request to the '/getActive' endpoint
            const response = await fetch(
                config.serverUrl + "/appointment/getActive",
                {
                    credentials: "include",
                }
            );

            // Check if the response is successful (status code 200)
            if (response.ok) {
                // Parse the JSON response
                const appointmentData = await response.json();

                // Generate dummy data for confirmed, canceled, and pending appointments
                // Count the number of appointments with each status
                let confirmedCount = 0;
                let canceledCount = 0;
                let pendingCount = 0;

                appointmentData.forEach((appointment) => {
                    // Check the status of each appointment and increment the corresponding count
                    switch (appointment.status) {
                        case "CONFIRMED":
                            confirmedCount++;
                            break;
                        case "CANCELLED":
                            canceledCount++;
                            break;
                        case "PENDING":
                            pendingCount++;
                            break;
                        default:
                            // Handle other status values if needed
                            break;
                    }
                });

                // Set the appointment status data to state
                setAppointmentStatusData([confirmedCount, canceledCount, pendingCount]);
            } else {
                console.error(
                    "Failed to fetch appointment status data:",
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error fetching appointment status data:", error);
        }
    };
    // Function to fetch upcoming customer data
    const fetchUpcomingCustomer = async () => {
        try {
            const upcomingCustomerRes = await fetch(
                config.serverUrl + `/appointment/getNext`,
                {
                    credentials: "include",
                }
            );

            if (upcomingCustomerRes.ok) {
                const upcomingCustomerData = await upcomingCustomerRes.json();
                if (upcomingCustomerData[0]) {
                    // Check if data exists
                    const { username, first_name, last_name } = upcomingCustomerData[1];
                    const { booking_time, service_name } = upcomingCustomerData[0];
                    const customerName =
                        first_name && last_name ? `${first_name} ${last_name}` : username;
                    setUpcomingCustomer({
                        name: customerName,
                        appointmentTime: booking_time,
                        service: service_name,
                    });
                } else {
                    // No upcoming appointment found
                    setUpcomingCustomer({
                        name: "No Upcoming Customer",
                        appointmentTime: null,
                        service: null,
                    });
                }
            } else {
                console.error(
                    "Error fetching upcoming customer data:",
                    upcomingCustomerRes.statusText
                );
            }
        } catch (error) {
            console.error("Error fetching upcoming customer data:", error);
        }
    };
    const fetchSalonData = async () => {
        try {
            // Fetch salon details using salon ID
            const salonResponse = await fetch(
                config.serverUrl + `/salon/get/${salonId}`,
                {
                    credentials: "include",
                }
            );

            const salonData = await salonResponse.json();
            if (salonResponse.ok) {
                // Set salon information to state
                setSalonInfo((prevState) => ({
                    ...prevState,
                    name: salonData.result.name || prevState.name,
                    address: salonData.result.address || prevState.address,
                    state: salonData.result.state || prevState.state,
                    phoneNumber: salonData.result.contact_number || prevState.phoneNumber,
                    businessHour: salonData.result.business_hour || prevState.businessHour,
                    image_url : salonData.result.image_url || prevState.image_url
                }));
            } else {
                console.error("Failed to fetch salon information:", salonData.message);
            }
        } catch (error) {
            console.error("Error fetching salon data:", error);
        }
    };
    const fetchAllCustomerRating = async () => {
        try {
            const response = await fetch(
                `${config.serverUrl}/review/retrieve?salonId=${salonId}`,
                {
                    credentials: "include",
                }
            );
            if (response.ok) {
                const { results } = await response.json();
                // Extract ratings from results
                const ratings = results.map((review) => review.rating);
                // Count occurrences of each rating
                const customerRating = [0, 0, 0, 0, 0];
                ratings.forEach((rating) => {
                    customerRating[rating - 1]++;
                });
                setCustomerRating(customerRating);
            } else {
                console.error("Failed to fetch customer ratings:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching customer ratings:", error);
        }
    };
    const updateSalonData = async () => {
        try {
            // Fetch salon details using salon ID
            const updateResponse = await fetch(
                config.serverUrl + `/salon/update/${salonId}`,
                {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: salonInfo.name,
                        address: salonInfo.address,
                        state: salonInfo.state,
                        contact_number: salonInfo.phoneNumber,
                        business_hour: salonInfo.businessHour,
                    }),
                }
            );

            const salonData = await updateResponse.json();
            if (updateResponse.ok) {
                fetchSalonData();
                console.log("Success to update salon information")
                toast.success('Salon information update successfully', { autoClose: 3000 });
            } else {
                console.error("Failed to update salon information:", salonData.message);
                toast.warning(salonData.message, { autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error fetching salon data:", error);
        }
    }
    const updateSalonImage = async () => {
        try {
            if (salonImageFile) {
                // Upload new profile picture
                const formData = new FormData();
                formData.append('salonImage', salonImageFile);

                const response = await fetch(`${config.serverUrl}/salon/update-salon-image`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Salon image updated successfully:', data.message);
                    toast.success('Salon image updated successfully', { autoClose: 3000 });
                } else {
                    console.error('Error updating salon image:', data.message);
                    toast.warning(data.message, { autoClose: 3000 });
                }
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            toast.error(error.message, { autoClose: 3000 });
        }
    };
    //------------------------------utils------------------------------//
    // Function to format date as YYYY-MM-DD (required by the backend API)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    return (
        <div className="container-fluid my-3 full-width">
            <ToastContainer
                position='top-center'
            />
            <div className="row mb-3">
                <div className="col-md-8">
                    {/* Salon Info Section */}
                    <div className="border border-2 rounded-4 p-3 bg-white h-100 text-start px-5">
                        <div className="row mt-1">
                            <div className="col-md-7">
                                <form className="w-100">
                                    <div className="row mb-2">
                                        <label
                                            htmlFor="name"
                                            className="col-md-4 col-form-label fw-bold"
                                        >
                                            Salon Name
                                        </label>
                                        <div className="col-md-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={salonInfo.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <label
                                            htmlFor="address"
                                            className="col-md-4 col-form-label fw-bold"
                                        >
                                            Address
                                        </label>
                                        <div className="col-md-8">
                                            <textarea
                                                className="form-control"
                                                id="address"
                                                name="address"
                                                value={salonInfo.address}
                                                style={{ resize: "none", height: '12px' }}
                                                disabled={!isEditing}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <label
                                            htmlFor="state"
                                            className="col-md-4 col-form-label fw-bold"
                                        >
                                            State
                                        </label>
                                        <div className="col-md-8">
                                            <select className="form-select" value={salonInfo.state} name='state' onChange={handleOptionSelectChange} disabled={!isEditing}>
                                            <option value="">Select a state</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state} >
                                                {state}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <label
                                            htmlFor="phone"
                                            className="col-md-4 col-form-label fw-bold"
                                        >
                                            Phone
                                        </label>
                                        <div className="col-md-8">
                                            <input
                                                type={isEditing ? "number" : "text"}
                                                className="form-control"
                                                id="phone"
                                                name="phoneNumber"
                                                value={
                                                    isEditing
                                                        ? salonInfo.phoneNumber
                                                        : formatContactNumber(salonInfo.phoneNumber)
                                                }
                                                disabled={!isEditing}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <label
                                            htmlFor="businessHour"
                                            className="col-md-4 col-form-label fw-bold"
                                        >
                                            Business Hour
                                        </label>
                                        <div className="col-md-8">
                                            {!isEditing ? (
                                                <div>
                                                    <input type="text" className="form-control mb-2" id="businessHour" name="businessHour" value={formatBusinessHour(salonInfo.businessHour).split('|')[1]} disabled={!isEditing} onChange={handleChange} />
                                                    <input type="text" className="form-control" id="businessHour" name="businessHour" value={formatBusinessHour(salonInfo.businessHour).split('|')[0]} disabled={!isEditing} onChange={handleChange} />
                                                </div>
                                            ) : (
                                                <div className="row">
                                                    <div className="input-group mb-2">
                                                        <select className="form-select" defaultValue={(salonInfo.businessHour.split('/')[0]).split('-')[0]} name='startDay' onChange={handleBusinessDayChange}>
                                                            <option value={1}>Mon</option>
                                                            <option value={2}>Tue</option>
                                                            <option value={3}>Wed</option>
                                                            <option value={4}>Thu</option>
                                                            <option value={5}>Fri</option>
                                                            <option value={6}>Sat</option>
                                                            <option value={7}>Sun</option>
                                                        </select>
                                                        <label className="input-group-text">To</label>
                                                        <select className="form-select" defaultValue={(salonInfo.businessHour.split('/')[0]).split('-')[1]} name='endDay' onChange={handleBusinessDayChange}>
                                                            <option value={1}>Mon</option>
                                                            <option value={2}>Tue</option>
                                                            <option value={3}>Wed</option>
                                                            <option value={4}>Thu</option>
                                                            <option value={5}>Fri</option>
                                                            <option value={6}>Sat</option>
                                                            <option value={7}>Sun</option>
                                                        </select>
                                                    </div>
                                                    <div className="input-group">
                                                        <input type="time" className="form-control" value={(salonInfo.businessHour.split('/')[1]).split('-')[0]} onChange={handleBusinessTimeChange} name="startTime" />
                                                        <label className="input-group-text">To</label>
                                                        <input type="time" className="form-control" value={(salonInfo.businessHour.split('/')[1]).split('-')[1]} onChange={handleBusinessTimeChange} name="endTime" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    className="btn btn-primary me-2"
                                                    onClick={handleSaveClick}
                                                    type="button"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={handleCancelClick}
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleEditClick}
                                                type="button"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                            {/* Image Section */}
                            <div className="col-md-5">
                                {/* Hidden file input */}
                                <div className="d-flex justify-content-center">
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        className="d-none"
                                        onChange={handleImageUpload}
                                        disabled={!isEditing}
                                    />
                                    {/* Clickable image */}
                                    <label htmlFor="imageUpload" className="cursor-pointer">
                                        <img
                                            src={salonInfo.image_url?salonInfo.image_url:process.env.PUBLIC_URL + '/sample-image/default_salon.jpg'}
                                            alt="Salon"
                                            className="img-fluid rounded-5"
                                            style={{width:400,height:285}}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <SalonCard
                        imageSrc="https://picsum.photos/400/300"
                        cardText={`Upcoming Appointment: ${upcomingCustomer
                            ? (upcomingCustomer.appointmentTime?upcomingCustomer.appointmentTime:"00:00") +
                            "\nAppointment Service: " +
                            (upcomingCustomer.service?upcomingCustomer.service:'')
                            : ""
                            } `}
                        cardTitle={
                            upcomingCustomer
                                ? `${upcomingCustomer.name}`
                                : "No Upcoming Appointment"
                        }
                        rating={-1}
                    />
                </div>
                <div className="col-md-2">
                    <CalendarDay today />
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="appointmentStatusChart"></canvas>{" "}
                        {/* Render appointment status chart */}
                    </div>
                </div>
                <div className="col-4">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="appointmentsOverTimeChart"></canvas>{" "}
                        {/* Render appointments over time chart */}
                    </div>
                </div>
                <div className="col-5">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="customerSatisfactionChart"></canvas>{" "}
                        {/* Render customer satisfaction chart */}
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-6">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="servicePopularityChart"></canvas>{" "}
                        {/* Render service popularity chart */}
                    </div>
                </div>
                <div className="col-6">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="appointmentDistributionChart"></canvas>{" "}
                        {/* Render appointment distribution chart */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalonDashboard;
