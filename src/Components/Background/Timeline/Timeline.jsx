import React from 'react';
import styles from './Timeline.module.css';

const Timeline = ({ title, intro, entries }) => (
  <section aria-label={title}>
    <div className={styles.heading}><h2>{title}</h2><p>{intro}</p></div>
    <ol className={styles.timeline}>
      {entries.map(entry => (
        <li className={styles.entry} key={`${entry.organization}-${entry.start}`}>
          <article className={styles.card}>
            <div className={styles.meta}>
              <p className={styles.date}><time dateTime={entry.start}>{entry.startLabel}</time><span> — </span>{entry.end ? <time dateTime={entry.end}>{entry.endLabel}</time> : 'Present'}</p>
              {!entry.end && <span className={styles.current}>Current role</span>}
            </div>
            <h3>{entry.title}</h3>
            <p className={styles.organization}>{entry.organization}</p>
            {entry.technologies && (
              <ul className={styles.tags} aria-label='Primary technologies'>
                {entry.technologies.map(technology => <li key={technology}>{technology}</li>)}
              </ul>
            )}
          </article>
        </li>
      ))}
    </ol>
  </section>
);

export default Timeline;
