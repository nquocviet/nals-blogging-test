import React from 'react';
import { Container } from 'react-bootstrap';
import styles from './Footer.module.css';

const Footer: React.FunctionComponent = () => {
  return (
    <footer>
      <Container>
        <p className={styles['copyright']}>
          &copy; {new Date().getFullYear()} NALS Blogs. All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
