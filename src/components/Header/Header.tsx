import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { ThemeContext } from '@/context/ThemeContext';
import { ROUTES } from '@/routes/constants';
import styles from './Header.module.css';

const Header: React.FunctionComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={styles['header']}>
      <Container>
        <nav className={styles['nav']}>
          <Link to={ROUTES.HOME} className={styles['nav-logo']}>
            NALS Blogs
          </Link>
          <div>
            <Link to={ROUTES.BLOG.NEW} className={styles['nav-link']}>
              Write post
            </Link>
            <span
              role="button"
              aria-label="Theme toggler"
              className="p-1"
              onClick={toggleTheme}>
              {theme === 'dark' ? <BsFillSunFill /> : <BsFillMoonFill />}
            </span>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
