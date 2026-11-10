import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { HiArrowUpRight } from 'react-icons/hi2';
import styles from './navBeauty.module.css';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Background', to: '/background' },
  { label: 'Projects', to: '/project' },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label='Main navigation'>
        <Link to='/' className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandMark}>NB</span>
          <span>thisisbatra<span className={styles.dot}>.</span></span>
        </Link>
        <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)} aria-label='Toggle navigation' aria-expanded={isOpen}>
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
        <div className={`${styles.linksWrap} ${isOpen ? styles.open : ''}`}>
          <ul className={styles.links}>
            {links.map(({ label, to }) => <li key={to}><NavLink end={to === '/'} to={to} onClick={closeMenu}>{label}</NavLink></li>)}
          </ul>
          <Link to='/contact' onClick={closeMenu} className={styles.contactLink}>Let’s talk <HiArrowUpRight /></Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
