import React from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p>© {new Date().getFullYear()} Nitin Batra. Built with curiosity.</p>
      <div className={styles.links} aria-label='Social links'>
        <a href='https://www.linkedin.com/in/thisisbatra' target='_blank' rel='noreferrer' aria-label='LinkedIn'><FaLinkedinIn /></a>
        <a href='https://github.com/thisisbatra' target='_blank' rel='noreferrer' aria-label='GitHub'><FiGithub /></a>
        <a href='https://leetcode.com/u/thisisbatra' target='_blank' rel='noreferrer' aria-label='LeetCode'><SiLeetcode /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
