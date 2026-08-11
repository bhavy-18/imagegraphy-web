import useDocumentTitle from '../hooks/useDocumentTitle';
import AlbumsSection from '../sections/Albums';

const ProjectsPage = (props) => {
  useDocumentTitle('Projects');

  return <AlbumsSection {...props} />;
};

export default ProjectsPage;
