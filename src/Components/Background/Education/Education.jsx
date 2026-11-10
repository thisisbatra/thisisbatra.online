import React from 'react';
import Timeline from '../Timeline/Timeline';

const education = [
  {
    title: 'Master of Computer Applications',
    organization: 'GGSIPU',
    start: '2022',
    startLabel: '2022',
    end: '2024',
    endLabel: '2024',
    summary: 'Postgraduate studies in computer applications. Graduated with 76%.',
  },
  {
    title: 'Bachelor of Vocational Studies',
    organization: 'GGSIPU · Software Development',
    start: '2018',
    startLabel: '2018',
    end: '2021',
    endLabel: '2021',
    summary: 'A foundation in software development. Graduated with 82%.',
  },
];

const Education = () => <Timeline title='Education' intro='The academic foundation behind my software development journey.' entries={education} />;
export default Education;
