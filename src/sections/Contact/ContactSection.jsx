import { Phone, Mail } from 'lucide-react';
import instaLogo from '../../assets/images/icons/insta-logo.svg';

const ContactSection = () => {
  return (
    <section id="contact" className="page active">
      <h1>Contact</h1>

      <div className="contact-column-container">
        {/* Row 1: Phone */}
        <a
          href="tel:+919033227173"
          className="contact-row-item"
          aria-label="Call +91 9033227173"
        >
          <Phone size={20} strokeWidth={1.75} className="contact-row-icon" />
          <span className="contact-row-text">+91 9033227173</span>
        </a>

        {/* Row 2: Mail */}
        <a
          href="mailto:kd1894@gmail.com"
          className="contact-row-item"
          aria-label="Email kd1894@gmail.com"
        >
          <Mail size={20} strokeWidth={1.75} className="contact-row-icon" />
          <span className="contact-row-text">kd1894@gmail.com</span>
        </a>

        {/* Row 3: Instagram */}
        <a
          href="https://www.instagram.com/imagegraphy_/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-row-item"
          aria-label="Instagram Profile"
        >
          <img src={instaLogo} alt="Instagram" className="contact-row-icon" />
          <span className="contact-row-text">imagegraphy_</span>
        </a>
      </div>
    </section>
  );
};

export default ContactSection;





