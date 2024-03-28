import React, { useState } from 'react';

const TryOnTermPopUp = ({ onAgree }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleAgree = () => {
        if (isChecked) {
            onAgree();
        } else {
            alert('Please tick the checkbox of read and understand the terms before agreeing.');
        }
    };

    return (
        <div>
            <div className="modal fade" id="termModal" data-bs-keyboard="false" tabIndex="-1" >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-3">Term of Use</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='d-flex justify-content-center row mx-5'>
                                {/* Input fields for step 1 */}
                                <div className="mb-3 row overflow-scroll fix-height border border-2 rounded-2 ">
                                    <p className=' text-start fs-5 p-5 '>
                                        <strong>1. Image Usage Consent</strong> : By using our application and uploading your portrait selfie, you agree to grant us the non-exclusive, worldwide, royalty-free license to collect, store, and analyze your image for application analytics purposes only. We will not use your image for any other purposes without your explicit consent.
                                        <br></br><br></br>
                                        <strong>  2. Data Security</strong> : We prioritize the security and confidentiality of your personal data, including your portrait selfie. Your image will be securely stored within our application's database and will not be shared with or accessed by any third parties, except for the purpose of analytics as outlined in this agreement.
                                        <br></br><br></br>
                                        <strong>  3. Anonymity</strong> : We will anonymize your image and dissociate it from any personally identifiable information before using it for analytics. Your privacy is of utmost importance to us, and we will take all necessary measures to ensure that your identity remains protected.
                                        <br></br><br></br>
                                        <strong>  4. Purpose Limitation</strong> : Your portrait selfie will solely be used for application analytics, including but not limited to user engagement analysis, feature optimization, and demographic insights. We will not use your image for marketing or promotional activities without obtaining your explicit consent.
                                        <br></br><br></br>
                                        <strong>  5. Data Retention</strong> : We will retain your image for as long as necessary to fulfill the purposes outlined in this agreement. If you choose to delete your account or remove your image from our application, we will promptly delete your image from our database, unless retention is required by law or for legitimate business purposes.
                                        <br></br><br></br>
                                        <strong>  6. User Control</strong> : You have the right to access, modify, or delete your portrait selfie at any time. You can manage your image preferences through the application settings or by contacting our support team for assistance.
                                        <br></br><br></br>
                                        <strong>  7. Updates to Terms</strong> : We reserve the right to update or modify these terms of use to reflect changes in our practices or legal requirements. We will notify you of any significant changes to these terms, and your continued use of the application after such modifications constitutes your acceptance of the updated terms.
                                        <br></br><br></br>
                                        <strong>  8.Usage of image</strong> : By using our application and uploading your portrait selfie, you acknowledge that you have read, understood, and agreed to abide by these terms of use regarding the usage of your image for application analytic purposes.
                                        <br /><br />
                                        {/* Add more terms here */}
                                    </p>
                                    <div className={`border-top mt-5 fs-5 ${isChecked?'bg-success text-light':'bg-light'}`}>
                                    <div className="d-flex justify-content-center pb-3">
                                        <div className="form-check-reverse mt-4" >
                                            <input className="form-check-input" type="checkbox" value="" id="agreementCheckbox" checked={isChecked} onChange={handleCheckboxChange} />
                                            <label className="form-check-label" htmlFor="agreementCheckbox">
                                                I have read and understand the terms.
                                            </label>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-lg btn-secondary me-3" data-bs-dismiss="modal">Disagree</button>
                            <button type="button" className="btn btn-lg btn-primary px-4"  data-bs-dismiss="modal" onClick={handleAgree} disabled={!isChecked}>Agree</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TryOnTermPopUp;
