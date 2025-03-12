import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ActividadCrearView } from 'src/sections/actividad/view';

// ----------------------------------------------------------------------

const metadata = { title: `Crear actividad | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ActividadCrearView />
    </>
  );
}
