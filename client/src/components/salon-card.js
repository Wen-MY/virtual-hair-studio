// salon-card.js

import React from 'react';

const SalonCard = ({ imageSrc, cardTitle, cardText }) => {
  return (
    <div className="col" style={{display: 'flex', justifyContent: 'space-around' }}>
      <div className="card" style={{ maxWidth: '240px', display: 'flex', justifyContent: 'space-around' }}>
        <img src={imageSrc} className="card-img-top" alt="Card Image" style={{ objectFit: 'cover', aspectRatio: '4/3', height: '100%'}}/>
        <div className="card-body">
          <h5 className="card-title">{cardTitle}</h5>
          <p className="card-text">{cardText}</p>
          {/*<a href="#" className="btn btn-primary">Go somewhere</a>*/}
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
