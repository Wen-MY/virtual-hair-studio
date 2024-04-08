// Home.js
import React, { useEffect, useState }  from 'react';
import {useNavigate} from 'react-router-dom';
import SalonCard from '../components/salon-card';
import config from '../config';
const Home = () => {
  const [contentWidth, setContentWidth] = useState(0);
  const [salons,setSalons] = useState([]);
  const maxSalonCard = 10;
  const navigate = useNavigate();
  useEffect(() => {
    const getContentWidth = () => {
      const contentElement = document.querySelector('.content');
      if (contentElement) {
        const widthInPixels = contentElement.offsetWidth;
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
      return Math.floor(contentWidth / 260); // Assuming each card takes up 260px , may take fixed amount
    };

    const generateSalonCards = () => {
      const numberOfCardsInRow = calculateNumberOfCardsInRow();
      let cards = [];
      
      //API request here to obtain random salon profile
      for (let i = 0; i < Math.min(salons.length, numberOfCardsInRow, 10); i++) {
        const salon = salons[i];
        cards.push(
          <div className="col mb-4" key={salon.id} onClick={() => handleRowClick(salon.id)}>
            <SalonCard
              key={salon.id}
              imageSrc={salon.image_url ? salon.image_url : `https://picsum.photos/400/300?random=${salon.id}`}
              rating={salon.average_rating}
              cardTitle={salon.name}
            />
          </div>
        );
      }
    
      return cards;
    };
    
    const fetchSalons = async () => {
      try{
      const response = await fetch(`${config.serverUrl}/salon/retrieve?&limit=${maxSalonCard}&currentPage=${1}`,{
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
    
        if (data.results) {
          setSalons(data.results);
        }else{
          setSalons([]);
        }
      }catch (error) {
          console.error('Error fetching salons data:', error);
          //setLoading(false);
      }
  }
  const handleRowClick = (id) => {
    navigate(`/salon/${id}`);
  };
  useEffect(()=>{
    fetchSalons();
  },[])
    return(
      <div className='home'>
        <div id='carousel-container' className='carousel slide mx-auto' data-bs-ride='true'> {
          //width 100 disable since auto resize problem (may fix later)
        }
        <div className="carousel-indicators ">
          <button type="button" data-bs-target="#carousel-container" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carousel-container" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carousel-container" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active " data-bs-interval="2000">
            <img src={`${process.env.PUBLIC_URL}/sample-image/sample-banner-1.jpg`} className="d-block w-100" alt="Carousel Slide 1"></img>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img src={`${process.env.PUBLIC_URL}/sample-image/sample-banner-2.jpg`} className="d-block w-100" alt="Carousel Slide 2"></img>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
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
      </div>
    );
}
export default Home;

