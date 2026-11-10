import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowDown, HiOutlineLocationMarker } from 'react-icons/hi';
import { HiArrowUpRight } from 'react-icons/hi2';
import styles from './Home.module.css';

const Home = () => {
  const openResume = () => window.open(`${process.env.PUBLIC_URL}/assets/resume/nitinResume.pdf`, '_blank', 'noopener,noreferrer');
  return (
    <section className={styles.home}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><span /> Available for meaningful work</p>
        <h1>I build calm, capable <em>digital</em> experiences.</h1>
        <p className={styles.intro}>I’m Nitin Batra, a software engineer focused on thoughtful interfaces, reliable systems, and products people enjoy using.</p>
        <div className={styles.actions}>
          <Link className={styles.primary} to='/project'>See selected work <HiArrowUpRight /></Link>
          <button className={styles.secondary} onClick={openResume}>Résumé <HiArrowDown /></button>
        </div>
      </div>
      <aside className={styles.profileCard}>
        <div className={styles.imageFrame}><img src={`${process.env.PUBLIC_URL}/assets/photos/meForBanner.jpg`} alt='Nitin Batra' /></div>
        <p className={styles.cardLabel}>Currently exploring</p>
        <p className={styles.cardTitle}>Systems design, frontend craft &amp; open source.</p>
        <div className={styles.cardFooter}><HiOutlineLocationMarker aria-hidden="true" /><span>Based in Delhi, India</span></div>
      </aside>
      <div className={styles.stats}>
        <div><span className={styles.statNumber}>01</span><p>Thoughtful<br />product thinking</p></div>
        <div><span className={styles.statNumber}>02</span><p>Full-stack<br />foundations</p></div>
        <div><span className={styles.statNumber}>03</span><p>Always learning,<br />always shipping</p></div>
      </div>
    </section>
  );
};

export default Home;
