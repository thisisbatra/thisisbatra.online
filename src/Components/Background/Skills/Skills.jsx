import React, { useState } from 'react';
import styles from './Skills.module.css';

const skillGroups = [
  { title: 'Languages', skills: ['C#', 'Java', 'JavaScript', 'TypeScript', 'SQL'] },
  { title: 'Backend', skills: ['ASP.NET Core', 'ASP.NET MVC', 'Web Forms', 'Spring', 'Spring Boot / JPA'] },
  { title: 'Frontend', skills: ['Vue.js (Pinia)', 'Angular (NgRx)', 'Flutter', 'React (Redux)'] },
  { title: 'Databases', skills: ['SQL Server', 'MySQL', 'PostgreSQL', 'MongoDB'] },
  { title: 'AI & GenAI', skills: ['RAG', 'LLM API Integration', 'Document-based Chatbots'] },
  { title: 'Tools & Technologies', skills: ['Git', 'Postman / Swagger', 'Docker', 'IIS', 'Nginx', 'Redis / Memcached', 'Tomcat / Jetty'] },
  { title: 'Core Concepts', skills: ['REST / SOAP APIs', 'JWT Authentication', 'Database Optimization', 'Caching', 'Microservices'] },
];

const Skills = () => {
  const [selected, setSelected] = useState(0);
  const activeGroup = skillGroups[selected];
  return (
  <section className={styles.skills} aria-labelledby='technical-skills-title'>
    <header className={styles.heading}>
      <h2 id='technical-skills-title'>Technical skills</h2>
      <p>Choose a category to explore my toolkit.</p>
    </header>
    <div className={styles.categories} role='group' aria-label='Skill categories'>
      {skillGroups.map(({ title }, index) => (
        <button key={title} type='button' aria-pressed={selected === index} aria-controls='skill-details' onClick={() => setSelected(index)}>{title}</button>
      ))}
    </div>
    <div id='skill-details' className={styles.details} aria-live='polite' aria-atomic='true'>
      <h3>{activeGroup.title}</h3>
      <ul className={styles.tags} aria-label={activeGroup.title}>
        {activeGroup.skills.map(skill => <li key={skill}>{skill}</li>)}
      </ul>
    </div>
  </section>
);
};
export default Skills;
