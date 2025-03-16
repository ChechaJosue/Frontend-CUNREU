import type { IUsuarioAPI } from 'src/api';

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { UsuarioService } from 'src/api';
import { CONFIG } from 'src/global-config';

import { LoadingScreen } from 'src/components/loading-screen';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Editar usuario | ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const [currentUser, setCurrentUser] = useState<IUsuarioAPI | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UsuarioService.getUsuarioById(Number(id));
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <UserEditView user={currentUser} />
    </>
  );
}
