import React from 'react';

const OptionBox = ({ className, optionId, icon, name, categoryId , onClick}) => {
  return (
    <div className={`options-box col-2 m-3 btn btn-lg ${className} d-flex justify-content-center align-items-center rounded-5`} onClick={onClick} style={{height: '6em'}}>
      <div className='row text-center'> 
      {icon &&
      <div className='col-12'>
        <img src={process.env.PUBLIC_URL + `/icon-image/${icon}.png` || process.env.PUBLIC_URL + '/icon-image/default.png'} alt="Option Icon" className="option-icon rounded-5" style={{width: '2em',height: '2em'}} />
      </div>
      }
      <div className="col-12">
        <h3 className='fs-4'>{name}</h3>
      </div>
      </div>
    </div>
  );
}

export default OptionBox;
