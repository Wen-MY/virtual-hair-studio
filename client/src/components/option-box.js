import React from 'react';

const OptionBox = ({ className, optionId, iconUrl, name, categoryId , onClick}) => {
  return (
    <div className={`options-box col-2 m-3 btn btn-lg ${className} d-flex justify-content-center`} onClick={onClick} style={{height: '7em'}}>
      <div className='row text-center'> 
      <div className='col-12'>
        <img src={process.env.PUBLIC_URL + '/icon-image/default.png'} alt="Option Icon" className="option-icon" style={{width: '3em',height: '3em'}} />
      </div>
      <div className="col-12">
        <h3 className='fs-5'>{name}</h3>
      </div>
      </div>
    </div>
  );
}

export default OptionBox;
