import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Footer, Header, Snackbar } from '@/components';
import { clearErrors } from '@/services/error';
import { selectorSnackbars } from '@/services/snackbar';
import styles from './BaseLayout.module.css';

const BaseLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { snackbars } = useSelector(selectorSnackbars);

  useEffect(() => {
    dispatch(clearErrors());
  }, [location]);

  return (
    <>
      <Header />
      <main className={styles['main']}>
        <Container>
          <div className={styles['content']}>
            <Outlet />
          </div>
        </Container>
      </main>
      <Footer />
      {!!snackbars.length && (
        <div className={styles['snackbar-container']}>
          {snackbars.map((snackbar) => (
            <Snackbar key={snackbar.id} open={true} {...snackbar} />
          ))}
        </div>
      )}
    </>
  );
};

export default BaseLayout;
