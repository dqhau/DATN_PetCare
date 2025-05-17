import React from 'react';
import '../style/contact.css'

function ContactForm() {
  // URL của Google Form, sử dụng URL viewform thay vì formResponse
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfNYIhmzXzu82C8QTbxu_QubsIg-lArE_UqBRNocBucxBRB2g/viewform?embedded=true";

  return (
    <div>
      <div className="container123">
        <div className="contact-box">
          <div className="right">
            <h2 className='theh2'>Liên hệ với chúng tôi</h2>
            <div className="google-form-container">
              <iframe 
                src={googleFormUrl} 
                width="100%" 
                height="700px" 
                frameBorder="0" 
                marginHeight="0" 
                marginWidth="0"
                title="Form liên hệ"
              >
                Đang tải...
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContactForm;