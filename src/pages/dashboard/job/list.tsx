import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { JobListView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

const metadata = { title: `Job list | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobListView />
    </>
  );
}
