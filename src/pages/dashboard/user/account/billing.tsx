import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AccountBillingView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

const metadata = { title: `Account billing settings | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountBillingView />
    </>
  );
}
