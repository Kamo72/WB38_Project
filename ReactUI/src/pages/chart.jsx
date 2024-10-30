import { Helmet } from 'react-helmet-async';

import { ChartView } from 'src/sections/chart';

// ----------------------------------------------------------------------

export default function ChartPage() {
  return (
    <>
      <Helmet>
        <title> Chart </title>
      </Helmet>

      <ChartView />
    </>
  );
}
