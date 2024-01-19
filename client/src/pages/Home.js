// Home.js
import React, { useEffect, useState }  from 'react';
import SalonCard from '../components/salon-card';
const Home = () => {
  const [contentWidth, setContentWidth] = useState(0);
  useEffect(() => {
    const getContentWidth = () => {
      const contentElement = document.querySelector('.content');
      if (contentElement) {
        const widthInPixels = contentElement.offsetWidth;
        console.log('Width in pixels:', widthInPixels);
        setContentWidth(contentElement.offsetWidth);
      }
    };
    //initial call to get content width
    getContentWidth();

    //listen for window resize events to update the width if it changes
    window.addEventListener('resize', getContentWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', getContentWidth);
    };
  }, []);
    const calculateNumberOfCardsInRow = () => {
      return Math.floor(contentWidth / 240); // Assuming each card takes up 240px
    };

    const generateSalonCards = () => {
      const numberOfCardsInRow = calculateNumberOfCardsInRow();
      const cards = [];

      for (let i = 0; i < numberOfCardsInRow; i++) {
        cards.push(
          <SalonCard
            key={i}
            imageSrc="https://dummyimage.com/400X300/000/fff.png&text=++++image++++"
            cardText="Some quick example text to build on the card title and make up the bulk of the card's content"
            cardTitle={`Salon ${i + 1}`}
          />
        );
      }

      return cards;
    };
    return(
      <div id='home-page' className='home'>
        <div id='carousel-container' className='carousel slide w-100' data-bs-ride='carousel'>
        <div className="carousel-indicators ">
          <button type="button" data-bs-target="#carousel-container" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carousel-container" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carousel-container" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={`${process.env.PUBLIC_URL}/sample-image/sample-banner-1.jpg`} className="d-block w-100" alt="Carousel Slide 1"></img>
          </div>
          <div className="carousel-item">
            <img src={`${process.env.PUBLIC_URL}/sample-image/sample-banner-2.jpg`} className="d-block w-100" alt="Carousel Slide 2"></img>
          </div>
          <div className="carousel-item">
            <img src={`${process.env.PUBLIC_URL}/sample-image/sample-banner-3.jpg`} className="d-block w-100" alt="Carousel Slide 3"></img>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carousel-container" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carousel-container" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
        </div>
        <div className="row mt-4 card-wrapper">
          {generateSalonCards()}
        </div>   
        <div className="row mt-4 card-wrapper">
          {generateSalonCards()}
        </div>  
      </div>
    );
}
export default Home;
