import useDocumentTitle from '../hooks/useDocumentTitle';
import ContactSection from '../sections/Contact';

const ContactPage = () => {
  useDocumentTitle('Contact');

  return <ContactSection />;
};

export default ContactPage;
