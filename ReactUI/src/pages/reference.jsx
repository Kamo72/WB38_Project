import { Helmet } from 'react-helmet-async';

import { ReferenceView } from 'src/sections/reference';

// ----------------------------------------------------------------------

export default function ReferencePage() {
  return (
    <>
      <Helmet>
        <title> Reference </title>
      </Helmet>

      <ReferenceView />
    </>
  );
}
