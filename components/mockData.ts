export const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'Full-time',
    posted: '2 days ago',
    industry: 'Technology',
    companySize: '500-1000',
    matchPercentage: 95,
    description: 'Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. You\'ll work on products used by millions of users worldwide.',
    requirements: [
      '5+ years of React experience',
      'Strong TypeScript skills',
      'Experience with modern build tools',
      'Knowledge of performance optimization',
      'Familiarity with testing frameworks'
    ],
    benefits: [
      'Competitive salary + equity',
      'Health, dental, vision insurance',
      'Unlimited PTO',
      'Remote work options',
      '$5000 learning budget',
      'Free meals and snacks'
    ]
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    salary: '$90k - $120k',
    type: 'Full-time',
    posted: '1 day ago',
    industry: 'Design',
    companySize: '50-100',
    matchPercentage: 88,
    description: 'Lead design initiatives for consumer-facing products. Work closely with engineering and product teams to create intuitive user experiences.',
    requirements: [
      '4+ years of product design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating UX/UI skills',
      'Experience with design systems',
      'Understanding of front-end development'
    ],
    benefits: [
      'Flexible work schedule',
      'Health insurance',
      'Professional development budget',
      'Creative workspace',
      'Team retreats',
      'Latest design tools'
    ]
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    salary: '$100k - $130k',
    type: 'Full-time',
    posted: '3 days ago',
    industry: 'Fintech',
    companySize: '10-50',
    matchPercentage: 92,
    description: 'Build scalable backend systems and beautiful frontend interfaces. Perfect for someone who loves working across the full technology stack.',
    requirements: [
      'Experience with Node.js and React',
      'Database design and optimization',
      'RESTful API development',
      'Cloud platforms (AWS/GCP)',
      'Agile development practices'
    ],
    benefits: [
      'Startup equity package',
      'Flexible PTO',
      'Health & wellness stipend',
      'Home office setup',
      'Monthly team events',
      'Learning opportunities'
    ]
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Seattle, WA',
    salary: '$110k - $140k',
    type: 'Full-time',
    posted: '5 days ago',
    industry: 'Artificial Intelligence',
    companySize: '100-500',
    matchPercentage: 85,
    description: 'Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets to derive actionable insights.',
    requirements: [
      'PhD or Masters in related field',
      'Python and R programming',
      'Machine learning frameworks',
      'Statistical analysis expertise',
      'Data visualization skills'
    ],
    benefits: [
      'Research publication support',
      'Conference attendance',
      'Cutting-edge tech stack',
      'Collaborative environment',
      'Patent bonuses',
      'Flexible work arrangements'
    ]
  },
  {
    id: '5',
    title: 'Mobile App Developer',
    company: 'MobileTech',
    location: 'Los Angeles, CA',
    salary: '$95k - $125k',
    type: 'Full-time',
    posted: '1 week ago',
    industry: 'Mobile Technology',
    companySize: '200-500',
    matchPercentage: 90,
    description: 'Develop high-performance mobile applications for iOS and Android platforms. Focus on creating smooth user experiences and efficient code.',
    requirements: [
      'React Native or Flutter experience',
      'Native iOS/Android development',
      'App store deployment experience',
      'Performance optimization skills',
      'Mobile UI/UX best practices'
    ],
    benefits: [
      'Device allowance',
      'Health insurance',
      'Stock options',
      'Gym membership',
      'Catered lunches',
      'Professional development'
    ]
  }
];

export const mockApplications = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    appliedDate: '2024-01-15',
    status: 'interview_scheduled' as const,
    interviewDate: '2024-01-22T14:00:00',
    stages: [
      { name: 'Application Submitted', status: 'completed' as const, date: 'Jan 15, 2024' },
      { name: 'Initial Review', status: 'completed' as const, date: 'Jan 17, 2024' },
      { name: 'Phone Interview', status: 'current' as const },
      { name: 'Technical Assessment', status: 'pending' as const },
      { name: 'Final Interview', status: 'pending' as const },
      { name: 'Offer Decision', status: 'pending' as const }
    ]
  },
  {
    id: '2',
    jobTitle: 'Product Designer',
    company: 'Design Studio',
    appliedDate: '2024-01-10',
    status: 'under_review' as const,
    stages: [
      { name: 'Application Submitted', status: 'completed' as const, date: 'Jan 10, 2024' },
      { name: 'Portfolio Review', status: 'current' as const },
      { name: 'Design Challenge', status: 'pending' as const },
      { name: 'Team Interview', status: 'pending' as const },
      { name: 'Final Decision', status: 'pending' as const }
    ],
    nextAction: 'Complete design challenge by Jan 25th'
  }
];