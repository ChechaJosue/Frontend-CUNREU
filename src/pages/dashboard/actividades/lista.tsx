import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ActividadListaView } from 'src/sections/actividad/view';

// ----------------------------------------------------------------------

const metadata = { title: `Actividades | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ActividadListaView />
    </>
  );
}
