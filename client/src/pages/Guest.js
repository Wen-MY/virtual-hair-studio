import React from 'react';
import Section from '../components/section';

const Guest = () => {
    return (
        <div>
            <Section
                background="#f8f9fa"
                title="Welcome to Virtual Hair Studio"
                paragraph="Discover the world of virtual hairstyles, appointments, and salons!"
            />

            <Section
                background="#e9ecef"
                title="Explore Salons"
                paragraph="Discover a variety of salons offering professional services for your hair needs."
            />

            <Section
                background="#dee2e6"
                title="Book Appointments"
                paragraph="Make appointments with your favorite stylists hassle-free."
            />

            <Section
                background="#ced4da"
                title="Virtual Hairstyle Try On"
                paragraph="Try on different hairstyles virtually to find your perfect look."
            />

            <Section
                background="#adb5bd"
                title="And More!"
                paragraph="Explore even more exciting features of Virtual Hair Studio."
            />
        </div>
    );
};

export default Guest;
