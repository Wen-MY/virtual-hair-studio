import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto"; // Import Chart.js library
import CalendarDay from "../components/calendar-day";
import SalonCard from "../components/salon-card";

const SalonDashboard = () => {
    // Define state variables for dummy data
    const [appointmentsOverTimeData, setAppointmentsOverTimeData] = useState([]);
    const [appointmentStatusData, setAppointmentStatusData] = useState([]);
    const [upcomingCustomer, setUpcomingCustomer] = useState(null);
    const salonInfo = {
        name: "Example Salon",
        address: "123 Main Street",
        city: "Cityville",
        state: "State",
        zipcode: "12345",
        phoneNumber: "123-456-7890",
        email: "info@example.com",
        website: "www.example.com",
        overallRating: 4.5 // Example overall rating out of 5
    };

    // Function to generate dummy data for appointments over time
    const generateAppointmentsOverTimeData = () => {
        // Generate dummy data here (e.g., for the last 7 days)
        return [20, 25, 40, 35, 20 , 50];
    };

    // Function to generate dummy data for appointment status
    const generateAppointmentStatusData = () => {
        // Generate dummy data here (e.g., for confirmed, canceled, rescheduled)
        return [20, 5, 3];
    };

    // Function to generate dummy data for upcoming customer
    const generateUpcomingCustomer = () => {
        // Generate dummy data here (e.g., name, appointment time, service)
        return {
            name: "John Doe",
            appointmentTime: "12:00 PM",
            service: "Haircut"
        };
    };

    useEffect(() => {
        // Generate dummy data when the component mounts
        setAppointmentsOverTimeData(generateAppointmentsOverTimeData());
        setAppointmentStatusData(generateAppointmentStatusData());
        setUpcomingCustomer(generateUpcomingCustomer());
    }, []);

    useEffect(() => {
        // Render Chart.js for appointments over time data
        const appointmentsOverTimeChart = new Chart(document.getElementById("appointmentsOverTimeChart"), {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                datasets: [
                    {
                        label: "Last Week Appointments",
                        data: appointmentsOverTimeData,
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false, // Do not maintain aspect ratio
            },
        });

        // Render Chart.js for appointment status data
        const appointmentStatusChart = new Chart(document.getElementById("appointmentStatusChart"), {
            type: "pie",
            data: {
                labels: ["Confirmed", "Canceled", "Pending"],
                datasets: [
                    {
                        data: appointmentStatusData,
                        backgroundColor: [
                            'rgb(40, 167, 69)', // Bootstrap success color for confirmed
                            'rgb(220, 53, 69)', // Bootstrap danger color for canceled
                            'rgb(255, 193, 7)', // Bootstrap warning color for pending
                        ],
                    },
                ],
            },
        });

        // Render Chart.js for customer satisfaction data (dummy)
        const customerSatisfactionChart = new Chart(document.getElementById("customerSatisfactionChart"), {
            type: "bar",
            data: {
                labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
                datasets: [
                    {
                        label: "Customer Satisfaction",
                        data: [5, 10, 20, 30, 25], // Dummy data for customer satisfaction ratings
                        backgroundColor: "rgb(54, 162, 235)", // Bootstrap primary color
                        borderColor: "rgb(54, 162, 235)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                indexAxis: "y",
                maintainAspectRatio: false, // Do not maintain aspect ratio
            },
        });

        // Render Chart.js for service popularity data (dummy)
        const servicePopularityChart = new Chart(document.getElementById("servicePopularityChart"), {
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
        });

        // Render Chart.js for appointment distribution throughout the day (dummy)
        const appointmentDistributionChart = new Chart(document.getElementById("appointmentDistributionChart"), {
            type: "line",
            data: {
                labels: ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"],
                datasets: [
                    {
                        label: "Appointments Distribution",
                        data: [10, 20, 30, 40, 50, 45, 40, 35, 30], // Dummy data for appointment distribution
                        fill: false,
                        borderColor: "rgb(255, 159, 64)", // Bootstrap warning color
                        tension: 0.1,
                    },
                ],
            },
        });

        // Cleanup function to destroy the charts when the component unmounts
        return () => {
            appointmentsOverTimeChart.destroy();
            appointmentStatusChart.destroy();
            customerSatisfactionChart.destroy();
            servicePopularityChart.destroy();
            appointmentDistributionChart.destroy();
        };
    }, [appointmentsOverTimeData, appointmentStatusData]);

    return (
        <div className="container-fluid my-3 full-width">
            <div className="row mb-3">
                <div className="col-md-8">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100 text-start px-5">
                        <h2 className="mb-4">{salonInfo.name}</h2>
                        <p><strong>Address:</strong> {salonInfo.address}, {salonInfo.city}, {salonInfo.state} {salonInfo.zipcode}</p>
                        <p><strong>Phone:</strong> {salonInfo.phoneNumber}</p>
                        <p><strong>Email:</strong> {salonInfo.email}</p>
                        <p><strong>Website:</strong> {salonInfo.website}</p>
                        <p><strong>Overall Rating:</strong> {salonInfo.overallRating} <span className="bi bi-star"></span></p>
                    </div>
                </div>
                <div className="col-md-2">
                    <SalonCard
                        imageSrc="https://picsum.photos/400/300"
                        cardText={`Upcoming Appointment: ${upcomingCustomer ? upcomingCustomer.appointmentTime : ''}`}
                        cardTitle={upcomingCustomer ? upcomingCustomer.name : 'No Upcoming Appointment'}
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
                        <canvas id="appointmentStatusChart"></canvas> {/* Render appointment status chart */}
                    </div>
                </div>
                <div className="col-4">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="appointmentsOverTimeChart" ></canvas> {/* Render appointments over time chart */}
                    </div>
                </div>
                <div className="col-5">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="customerSatisfactionChart"></canvas> {/* Render customer satisfaction chart */}
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-6">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="servicePopularityChart"></canvas> {/* Render service popularity chart */}
                    </div>
                </div>
                <div className="col-6">
                    <div className="border border-2 rounded-4 p-3 bg-white h-100">
                        <canvas id="appointmentDistributionChart"></canvas> {/* Render appointment distribution chart */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalonDashboard;
