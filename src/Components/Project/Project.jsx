import React from 'react';
import { HiCode } from 'react-icons/hi';
import { HiArrowUpRight } from 'react-icons/hi2';
import styles from './Project.module.css';

// Replace these placeholders with your real project title, role, results, stack and links.
const projects = [
  { number: '01', title: 'Project one', type: 'Full-stack web app', description: 'A concise one-line explanation of the user problem this project solves. Keep this focused on the value, not just the tech.', stack: ['React', 'Node.js', 'MongoDB'], tone: styles.lilac },
  { number: '02', title: 'Project two', type: 'Developer tool', description: 'Explain the workflow you improved and the part you personally owned. Add a measurable outcome when you have one.', stack: ['Java', 'Spring Boot', 'SQL'], tone: styles.mint },
  { number: '03', title: 'Project three', type: 'Open-source contribution', description: 'Show how you investigated a problem, made the change, and what it unlocked for users or maintainers.', stack: ['JavaScript', 'Git', 'REST API'], tone: styles.blue },
];

const Project = () => (
  <section className={styles.projects}>
    <header className={styles.heading}>
      <p className={styles.kicker}>Selected work</p>
      <h1>A few things I’ve <em>built.</em></h1>
      <p>Replace the placeholders below with your strongest work. A great case study explains the problem, your contribution, and the outcome.</p>
    </header>
    <div className={styles.grid}>
      {projects.map((project) => (
        <article className={styles.card} key={project.number}>
          <div className={`${styles.visual} ${project.tone}`}><span>{project.number}</span><HiCode /></div>
          <div className={styles.cardBody}>
            <p className={styles.type}>{project.type}</p>
            <h2>{project.title}</h2>
            <p className={styles.description}>{project.description}</p>
            <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className={styles.cardFooter}><span>Links to add</span><span className={styles.icons}><HiArrowUpRight /> <HiCode /></span></div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Project;
