import React from 'react';

const Section = ({ background, title, paragraph, imgSrc,children }) => {
    return (
        <div className="section" style={{ background, paddingTop: '200px', paddingBottom: '200px' }}>
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col">
                        <h1>{title}</h1>
                        <p>{paragraph}</p>
                        {imgSrc && <img src={imgSrc} alt="Banner" className="img-fluid" />}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section;
