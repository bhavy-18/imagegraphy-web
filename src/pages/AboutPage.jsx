import useDocumentTitle from '../hooks/useDocumentTitle';
import AboutSection from '../sections/About';

const AboutPage = () => {
  useDocumentTitle('Kuldeep Ghadiali');

  return <AboutSection />;
};

export default AboutPage;
