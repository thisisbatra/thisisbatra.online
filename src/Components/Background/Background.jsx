import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './Background.module.css';

const Background = () => (
  <section className={styles.background}>
    <header className={styles.heading}>
      <p className={styles.eyebrow}>Background / My journey</p>
      <h1>Learning. Building.<br /><em>Moving forward.</em></h1>
      <p className={styles.intro}>From a foundation in software development to enterprise applications and GenAI. The experience and education behind my work.</p>
    </header>
    <div className={styles.layout}>
      <nav className={styles.navigation} aria-label='Background sections'>
        <NavLink end to='/background'><span aria-hidden='true'>01</span>Experience</NavLink>
        <NavLink to='education'><span aria-hidden='true'>02</span>Education</NavLink>
      </nav>
      <div className={styles.panel}><Outlet /></div>
    </div>
  </section>
);
export default Background;
