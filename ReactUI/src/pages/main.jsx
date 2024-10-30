import { Helmet } from 'react-helmet-async';
import MainView from 'src/sections/main/main-view';

// ----------------------------------------------------------------------

export default function MainPage() {
  return (
    <>
      <Helmet>
        <title> Main </title>
      </Helmet>

      <MainView />
    </>
  );
}
