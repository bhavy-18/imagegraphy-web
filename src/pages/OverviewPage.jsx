import useDocumentTitle from '../hooks/useDocumentTitle';
import OverviewSection from '../sections/Overview';

const OverviewPage = (props) => {
  useDocumentTitle();

  return <OverviewSection {...props} />;
};

export default OverviewPage;
