import kdImg from '../../assets/images/about/kuldeep-ghadiali.jpg';

const AboutSection = () => {
  return (
    <section id="about" className="page active">
      <div className="about-content">
        <div className="about-image">
          <img src={kdImg} alt="Kuldeep Ghadiali" />
        </div>
        <div className="about-text">
          <h2>About</h2>
          <p>
            I am Kuldeep Ghadiali, a photographer based in Toronto (originally from India) with a wide explorative range. Since 2014, I have been providing photography and media retouching services to mainly Commercial, Architectural businesses.In order to obtain sound grounding in the subtleties and trends of the profession, I pursued the 'Creative Photography Still+Motion' course from Mohawk College, Hamilton.
          </p>
          <p>
            I enjoy the varied technical and non-technical challenges associated with each project that I undertake, as I consider them important for my own development. My goal is to provide an exquisite photographic service that fulfills the demonstrative and the aesthetic requirement of my clients.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
