import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { _tours } from 'src/_mock/_tour';
import { CONFIG } from 'src/global-config';

import { TourDetailsView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

const metadata = { title: `Detalle actividad | ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const actividadActual = _tours.find((tour) => tour.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourDetailsView tour={actividadActual} />
    </>
  );
}
