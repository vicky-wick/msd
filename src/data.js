import meta from './media-meta.json'

export const CONTACT = {
  email: 'mainstreamdigitalsofficial@gmail.com',
  phone: '+91 92042 20568',
  phoneHref: 'tel:+919204220568',
  whatsapp: 'https://wa.me/919204220568',
}

export const img = (name, size = 'lg') => `/media/img/${name}${size === 'sm' ? '-sm' : ''}.webp`
export const ratio = (name) => (meta[name] ? meta[name].w / meta[name].h : 1)
export const vid = (name) => ({ src: `/media/vid/${name}.mp4`, poster: `/media/vid/${name}.jpg` })

export const CATEGORIES = ['All', 'Weddings', 'Events', 'Food & Cafe', 'Product', 'Fashion', 'Films']

export const PROJECTS = [
  {
    slug: 'the-red-bride',
    title: 'The Red Bride',
    category: 'Weddings',
    year: '2026',
    cover: 'bridal-2',
    video: 'bridal-reel',
    intro:
      'An intimate bridal portrait session built around deep reds, warm tungsten light and heirloom gold. Every frame was lit to feel like a painting.',
    services: ['Bridal photography', 'Cinematic reel', 'Colour grading'],
    gallery: ['bridal-2', 'bridal-1', 'bridal-3'],
  },
  {
    slug: 'monsoon-promise',
    title: 'Monsoon Promise',
    category: 'Weddings',
    year: '2025',
    cover: 'prewed-2',
    video: 'prewed-reel',
    intro:
      'A pre-wedding story shot among tall grass and soft greens. Purple dupattas, Bengali gold and an afternoon that felt like it would never end.',
    services: ['Pre-wedding shoot', 'Save-the-date film', 'Styling direction'],
    gallery: ['prewed-2', 'prewed-1', 'prewed-3'],
  },
  {
    slug: 'after-dark',
    title: 'After Dark',
    category: 'Events',
    year: '2026',
    cover: 'event-singer-1',
    intro:
      'Club nights, live sets and the blur between them. We shoot events for the energy, not just the attendance list.',
    services: ['Event coverage', 'Artist portraits', 'Social cut-downs'],
    gallery: ['event-singer-1', 'event-dj-1', 'event-glow', 'event-stage', 'event-haus', 'event-singer-2', 'event-crowd', 'event-dj-2'],
  },
  {
    slug: 'garba-nights',
    title: 'Garba Nights',
    category: 'Films',
    year: '2025',
    cover: 'garba-event',
    coverIsVideo: true,
    video: 'garba-event',
    intro:
      'A festival highlight film full of colour, rhythm and spinning ghagras, cut fast for reels and slow for the memories.',
    services: ['Event film', 'Reels edit', 'Same-day highlights'],
    gallery: ['event-glow', 'event-crowd'],
  },
  {
    slug: 'the-spice-table',
    title: 'The Spice Table',
    category: 'Food & Cafe',
    year: '2026',
    cover: 'food-biryani',
    intro:
      'A menu shoot for a modern Indian kitchen: dum biryani, shawarma rolls and kebabs styled to make the scroll stop.',
    services: ['Food styling', 'Menu photography', 'Social content'],
    gallery: ['food-biryani', 'food-shawarma', 'food-kebab', 'food-paneer', 'food-burger', 'food-mocktail', 'food-dessert'],
  },
  {
    slug: 'silver-heritage',
    title: 'Silver Heritage',
    category: 'Product',
    year: '2026',
    cover: 'silver-peacocks',
    intro:
      'A catalogue for handcrafted silver: peacocks, swans and temple pieces lit low and moody so every engraving reads.',
    services: ['Product photography', 'Catalogue design', 'E-commerce assets'],
    gallery: ['silver-peacocks', 'silver-clutch', 'silver-temple', 'silver-swans', 'silver-peacock-lamp', 'silver-durga', 'silver-horse', 'silver-peacock', 'silver-shivling', 'silver-vase'],
  },
  {
    slug: 'glass-and-gold',
    title: 'Glass & Gold',
    category: 'Fashion',
    year: '2025',
    cover: 'model-2',
    video: 'portrait-reel',
    intro:
      'Beauty and jewellery portraits with glass skin, emerald eyes and diamonds catching every bit of the key light.',
    services: ['Beauty photography', 'Jewellery campaign', 'Retouching'],
    gallery: ['model-2', 'model-1', 'model-3', 'model-concert-1', 'model-concert-2'],
  },
  {
    slug: 'crown-season',
    title: 'Crown Season',
    category: 'Fashion',
    year: '2026',
    cover: 'pageant-2',
    video: 'saree-reel',
    intro: 'Runway and pageant coverage, plus bridal-saree reels for the designers behind the looks.',
    services: ['Runway coverage', 'Designer reels', 'Press images'],
    gallery: ['pageant-2', 'pageant-1', 'bridal-1'],
  },
]

export const SERVICES = [
  {
    id: 'weddings',
    title: 'Wedding Photography',
    line: 'Stories worth remembering.',
    image: 'bridal-1',
    points: ['Weddings & receptions', 'Pre-wedding shoots', 'Bridal portraits', 'Cinematic wedding films'],
  },
  {
    id: 'commercial',
    title: 'Commercial & Product',
    line: 'Visuals that sell.',
    image: 'silver-peacocks',
    points: ['Product catalogues', 'E-commerce photography', 'Jewellery & luxury', 'Brand lookbooks'],
  },
  {
    id: 'food',
    title: 'Food & Cafe',
    line: 'Make every detail desirable.',
    image: 'food-biryani',
    points: ['Menu photography', 'Food styling', 'Cafe interiors', 'Reels for restaurants'],
  },
  {
    id: 'events',
    title: 'Event Photography',
    line: 'Capture the energy.',
    image: 'event-singer-1',
    points: ['Concerts & club nights', 'Corporate events', 'Festivals & cultural', 'Same-day edits'],
  },
  {
    id: 'ads',
    title: 'Ad Film Production',
    line: 'Ideas transformed into films.',
    image: 'model-concert-1',
    points: ['Concept & scripting', 'Shoot & direction', 'Edit, grade & sound', 'Reels & short-form'],
  },
  {
    id: 'marketing',
    title: 'Digital Marketing',
    line: 'Creativity backed by strategy.',
    image: 'model-2',
    points: ['Social media management', 'Meta & Google Ads', 'Performance campaigns', 'Brand strategy & identity'],
  },
]

export const PROCESS = [
  { n: '01', t: 'Discover', d: 'We get to know your brand, your audience and the story you want people to feel.' },
  { n: '02', t: 'Conceptualise', d: 'Moodboards, shot lists, scripts and a strategy that ties the creative to results.' },
  { n: '03', t: 'Create', d: 'Photography, filmmaking and design, produced by one team from lighting to final cut.' },
  { n: '04', t: 'Deliver', d: 'Edits, grading, publishing and paid campaigns that put the work in front of the right people.' },
]
