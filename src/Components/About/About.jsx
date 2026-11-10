import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const About = () => (
  <section className={styles.about}>
    <div className={styles.portraitWrap}><img src={`${process.env.PUBLIC_URL}/assets/photos/meLinkedIn.jpg`} alt='Nitin Batra' /><span className={styles.frame} /></div>
    <div className={styles.content}>
      <p className={styles.kicker}>About me</p>
      <h1>Curious about systems. Driven to <em>build.</em></h1>
      <p>I’m Nitin Batra, a software architect in the making. I enjoy understanding how things work and turning real-world problems into useful software.</p>
      <p>I’m interested in system design and AI. My goal is to grow into an engineer who can take an idea through to a reliable product people find useful.</p>
      <Link to='/contact' className={styles.link}>Start a conversation <span>→</span></Link>
    </div>
  </section>
);

export default About;
