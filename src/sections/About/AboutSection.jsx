import { Phone, Mail } from 'lucide-react';
import kdImg from '../../assets/images/about/kuldeep-ghadiali.jpg';
import instaLogo from '../../assets/images/icons/insta-logo.svg';

const AboutSection = () => {
  return (
    <section id="about" className="page active">
      <div className="about-content">
        <div className="about-text">
          <h2>About</h2>
          <p>
            I am Kuldeep Ghadiali, a photographer based in Toronto (originally from India) with a wide explorative range. Since 2014, I have been providing photography and media retouching services to mainly Commercial, Architectural businesses.In order to obtain sound grounding in the subtleties and trends of the profession, I pursued the 'Creative Photography Still+Motion' course from Mohawk College, Hamilton.
          </p>
          <p>
            I enjoy the varied technical and non-technical challenges associated with each project that I undertake, as I consider them important for my own development. My goal is to provide an exquisite photographic service that fulfills the demonstrative and the aesthetic requirement of my clients.
          </p>
          <div className="about-contact-section">
            <h3 className="about-contact-title">Contact</h3>
            <div className="contact-column-container">
              <a
                href="tel:+919033227173"
                className="contact-row-item"
                aria-label="Call +91 9033227173"
              >
                <Phone size={20} strokeWidth={1.75} className="contact-row-icon" />
                <span className="contact-row-text">+91 9033227173</span>
              </a>
              <div className="contact-row-group">
                <Mail size={20} strokeWidth={1.75} className="contact-row-icon contact-multi-icon" />
                <div className="contact-emails-stacked">
                  <a
                    href="mailto:kd1894@gmail.com"
                    className="contact-email-link"
                    aria-label="Email kd1894@gmail.com"
                  >
                    <span className="contact-row-text">kd1894@gmail.com</span>
                  </a>
                  <a
                    href="mailto:kd@imagegraphy.com"
                    className="contact-email-link"
                    aria-label="Email kd@imagegraphy.com"
                  >
                    <span className="contact-row-text">kd@imagegraphy.com</span>
                  </a>
                </div>
              </div>
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
          </div>
        </div>
        <div className="about-image">
          <img src={kdImg} alt="Kuldeep Ghadiali" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
