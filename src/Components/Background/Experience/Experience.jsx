import React from 'react';
import Timeline from '../Timeline/Timeline';

const experience = [
  {
    title: 'Junior Software Engineer',
    organization: 'Advanced GRC',
    start: '2025-04',
    startLabel: 'Apr 2025',
    summary: 'Building and maintaining enterprise applications, modernizing frontend modules, and delivering enhancements directly with US clients.',
    highlights: [
      'Modernized Vue.js modules and custom build configurations with Webpack and Vite.',
      'Resolved security vulnerabilities involving JWT algorithm validation and transfer URL reuse.',
      'Maintained scheduled jobs and inbound/outbound SOAP integrations with third-party ERP systems.',
      'Built a RAG-based chatbot with Python and FastAPI to make product PDF documentation searchable through natural language.',
      'Coordinated requirements, technical documentation, Jira sprint tasks, QA, pull requests, and production deployments.',
    ],
    technologies: ['ASP.NET Core', 'Vue.js', 'SQL Server'],
  },
  {
    title: 'Junior Software Developer',
    organization: 'SecWebXperts Pvt. Ltd.',
    start: '2024-09',
    startLabel: 'Sep 2024',
    end: '2025-04',
    endLabel: 'Apr 2025',
    summary: 'Contributed to an LMS prototype, turning client requirements into application modules alongside senior developers.',
    highlights: [
      'Developed user-specific modules and test/quiz functionality using ASP.NET Core MVC.',
      'Integrated PDF data extraction, database storage, and application workflows.',
      'Prepared technical documentation and helped clarify client requirements.',
    ],
    technologies: ['ASP.NET Core', 'Angular', 'MySQL'],
  },
];

const Experience = () => <Timeline title='Professional experience' intro='My journey in production software, with the most recent chapter first.' entries={experience} />;

export default Experience;
