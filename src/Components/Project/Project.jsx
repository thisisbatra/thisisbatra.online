import React from 'react';
import { HiOutlineDocumentSearch, HiOutlineCube, HiOutlineMusicNote } from 'react-icons/hi';
import { HiArrowUpRight } from 'react-icons/hi2';
import projects from './projectData';
import styles from './Project.module.css';

const visuals = {
  docanchor: { Icon: HiOutlineDocumentSearch, tone: styles.lilac },
  erp: { Icon: HiOutlineCube, tone: styles.mint },
  chorus: { Icon: HiOutlineMusicNote, tone: styles.blue },
};

const Project = () => (
  <section className={styles.projects}>
    <header className={styles.heading}>
      <p className={styles.kicker}>Projects / Building in public</p>
      <h1>Things I’m <em>building.</em></h1>
      <p>Ideas taking shape, one step at a time. A look at what I’m working on, what comes next, and the problems I want to solve.</p>
    </header>
    <div className={styles.grid}>
      {projects.map(project => {
        const { Icon, tone } = visuals[project.id];
        return (
          <article className={styles.card} key={project.id} aria-labelledby={`${project.id}-title`}>
            <div className={`${styles.visual} ${tone}`} aria-hidden='true'>
              <span>{project.number}</span><Icon />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.meta}>
                <p className={styles.type}>{project.type}</p>
                <span className={`${styles.status} ${project.status === 'Planned' ? styles.planned : styles.inProgress}`}>{project.status}</span>
              </div>
              <h2 id={`${project.id}-title`}>{project.title}</h2>
              <p className={styles.tagline}>{project.tagline}</p>
              <p className={styles.description}>{project.description}</p>
              <h3 className={styles.roadmapHeading}>Building toward</h3>
              <ul className={styles.roadmap}>
                {project.roadmap.map(feature => <li key={feature}>{feature}</li>)}
              </ul>
              <ul className={styles.stack} aria-label={`${project.title} technologies`}>
                {project.stack.map(item => <li key={item}>{item}</li>)}
              </ul>
              <div className={styles.cardFooter}>
                <p>{project.note}</p>
                {(project.githubUrl || project.liveUrl) && (
                  <div className={styles.links}>
                    {project.githubUrl && <a href={project.githubUrl} target='_blank' rel='noopener noreferrer' aria-label={`${project.title} on GitHub`}>GitHub <HiArrowUpRight aria-hidden='true' /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target='_blank' rel='noopener noreferrer' aria-label={`${project.title} live demo`}>Live demo <HiArrowUpRight aria-hidden='true' /></a>}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default Project;
