// Curated Podcasts Catalog and Popular Episodes
export const PODCAST_CATEGORIES = [
  'All Podcasts',
  'Technology & AI',
  'Science & Health',
  'Culture & Society',
  'Business & Finance',
  'True Crime & Mystery',
  'Comedy & Talk'
];

export const FEATURED_PODCASTS = [
  {
    id: 'huberman-lab',
    title: 'Huberman Lab',
    publisher: 'Scicomm Media / Dr. Andrew Huberman',
    category: 'Science & Health',
    description: 'Dr. Andrew Huberman discusses neuroscience: how our brain and its connections with the organs of our body control our perceptions, our behaviors, and our health.',
    thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400',
    subscribers: '5.2M',
    episodes: [
      {
        id: 'gXDMoiEkyuQ',
        title: 'Master Your Sleep & Be More Alert When Awake',
        podcastName: 'Huberman Lab',
        description: 'Tools to optimize sleep, sleep architecture, and morning alertness using circadian principles.',
        duration: 7200,
        durationFormatted: '2h 00m',
        date: 'Oct 2026',
        thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400',
        type: 'podcast'
      },
      {
        id: 'h2rRFDvhqhk',
        title: 'How to Increase Motivation & Drive with Dopamine',
        podcastName: 'Huberman Lab',
        description: 'Understand the biological mechanisms of dopamine and how to sustain drive and mood.',
        duration: 6840,
        durationFormatted: '1h 54m',
        date: 'Sep 2026',
        thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400',
        type: 'podcast'
      }
    ]
  },
  {
    id: 'lex-fridman',
    title: 'Lex Fridman Podcast',
    publisher: 'Lex Fridman',
    category: 'Technology & AI',
    description: 'Conversations about science, tech, history, philosophy, and the intelligence, consciousness, love, and power of the universe.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    subscribers: '4.1M',
    episodes: [
      {
        id: 'ygRAG77L7rU',
        title: 'Sam Altman: OpenAI, GPT-5, and Future of Superintelligence',
        podcastName: 'Lex Fridman Podcast',
        description: 'Deep discussion on artificial general intelligence, compute scaling, and alignment.',
        duration: 8100,
        durationFormatted: '2h 15m',
        date: 'Oct 2026',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        type: 'podcast'
      },
      {
        id: 'DxREm3UgumM',
        title: 'Elon Musk: Neuralink, Starship, and Civilizational Future',
        podcastName: 'Lex Fridman Podcast',
        description: 'Engineering deep dives into space exploration, neural interfaces, and energy.',
        duration: 9400,
        durationFormatted: '2h 36m',
        date: 'Aug 2026',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        type: 'podcast'
      }
    ]
  },
  {
    id: 'mkbhd-waveform',
    title: 'Waveform: The MKBHD Podcast',
    publisher: 'Marques Brownlee & Vox Media',
    category: 'Technology & AI',
    description: 'A deep dive into gadget reviews, tech trends, electric cars, and interviews with Silicon Valley leaders.',
    thumbnail: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400',
    subscribers: '1.8M',
    episodes: [
      {
        id: 'kJQP7kiw5Fk',
        title: 'The Reality of Smart Glasses & AI Hardware in 2026',
        podcastName: 'Waveform: The MKBHD Podcast',
        description: 'Testing the latest augmented glasses, camera tech, and smartphone breakthroughs.',
        duration: 4200,
        durationFormatted: '1h 10m',
        date: 'Oct 2026',
        thumbnail: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400',
        type: 'podcast'
      }
    ]
  },
  {
    id: 'joe-rogan',
    title: 'The Joe Rogan Experience',
    publisher: 'Joe Rogan',
    category: 'Comedy & Talk',
    description: 'Long-form in-depth conversations with comedians, scientists, fighters, authors, and artists.',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
    subscribers: '18M',
    episodes: [
      {
        id: '09R8_2nJtjg',
        title: 'JRE #2180 - Explorations into Consciousness & Physics',
        podcastName: 'The Joe Rogan Experience',
        description: 'Discussing quantum gravity, meditation, and ancient civilizations.',
        duration: 10200,
        durationFormatted: '2h 50m',
        date: 'Oct 2026',
        thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
        type: 'podcast'
      }
    ]
  },
  {
    id: 'darknet-diaries',
    title: 'Darknet Diaries',
    publisher: 'Jack Rhysider',
    category: 'True Crime & Mystery',
    description: 'True stories from the dark side of the internet: hackers, breaches, shadow brokers, and state-sponsored espionage.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    subscribers: '950K',
    episodes: [
      {
        id: '4NRXx6U8ABQ',
        title: 'Ep 148: The Billion Dollar Heist',
        podcastName: 'Darknet Diaries',
        description: 'How cybercriminals penetrated sovereign banks and vanished with international wires.',
        duration: 3800,
        durationFormatted: '1h 03m',
        date: 'Sep 2026',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        type: 'podcast'
      }
    ]
  }
];
