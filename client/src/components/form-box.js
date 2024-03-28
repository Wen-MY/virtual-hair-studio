import React from 'react';
import '../styles/form-box.css'
const FormBox = ({ className, children, onClick }) => {
  return (
    <div className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-auto">
          <div className={`card p-5 px-5 box ${className?className:''}`} onClick={onClick?onClick:null}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormBox;
