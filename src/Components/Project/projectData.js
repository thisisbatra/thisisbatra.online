// Update status, roadmap, and links here as each project evolves.
// Add real HTTPS URLs when the repositories or live demos are ready.
const projects = [
  {
    id: 'docanchor',
    number: '01',
    title: 'DocAnchor',
    type: 'Product documentation assistant',
    status: 'In progress',
    tagline: 'Ask your docs. See the source.',
    description: 'A document assistant for uploading product documentation and asking questions, with answers linked to supporting sources.',
    roadmap: ['Document upload and processing', 'Answers with source references', 'Clear responses when an answer is not found'],
    stack: ['FastAPI', 'Angular'],
    note: 'Current priority: a focused, reliable first version.',
    githubUrl: null,
    liveUrl: null,
  },
  {
    id: 'erp',
    number: '02',
    title: 'Family Business ERP',
    type: 'Retail operations',
    status: 'Planned',
    tagline: 'Everyday business, in one place.',
    description: 'A practical ERP for my family’s unstitched ladies’ suits business, bringing stock, sales, and wholesaler accounts into one workflow.',
    roadmap: ['Stock and daily sales tracking', 'Wholesaler purchases, payments, and balances', 'A clear overview of retail operations'],
    stack: ['ASP.NET Core', 'Angular'],
    note: 'Future direction: connect inventory and orders to e-commerce.',
    githubUrl: null,
    liveUrl: null,
  },
  {
    id: 'chorus',
    number: '03',
    title: 'Chorus',
    type: 'Web music player',
    status: 'In progress',
    tagline: 'From a college idea to a fuller listening experience.',
    description: 'Evolving my college prototype, which used a personal audio library and iTunes search, into a web music player with accounts and personal collections.',
    roadmap: ['User login and authentication', 'Playback controls and favourites', 'Personal playlists'],
    stack: ['Java', 'React'],
    note: 'Web first. A Flutter app is planned for a later phase.',
    githubUrl: null,
    liveUrl: null,
  },
];

export default projects;
