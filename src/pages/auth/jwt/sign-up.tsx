import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { JwtSignUpView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Registro | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignUpView />
    </>
  );
}
