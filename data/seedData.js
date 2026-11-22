export const SEED_PROJECTS = [
  {
    id: "atoz-movies",
    slug: "atoz-movies",
    title: "Atoz Movies",
    subtitle: "SaaS Movie Review & Community Platform",
    category: "saas",
    featured: true,
    date: "2024",
    image: "assets/images/projects/Movie.jpg",
    link: "https://atozmovies.in/",
    github: "https://github.com/w3lalitsaini",
    tags: ["React", "Tailwind CSS", "Node.js", "Express", "REST APIs"],
    summary: "A dynamic movie review and community platform where users explore cinematic releases, read verified editorial reviews, and contribute audience ratings in real time.",
    overview: "Atoz Movies was engineered to bridge the gap between heavy, slow media aggregator sites and fast, mobile-friendly review engines. The application features an instant search index, responsive trailers modal, categorized movie taxonomies, and an optimized content caching strategy for ultra-fast browsing.",
    features: [
      "Instant debounced search across large movie catalog",
      "Dynamic review submission with verified audience ratings",
      "Genre-based categorization and trending sorting",
      "Fully responsive cinematic UI built with Tailwind CSS",
      "RESTful API integration with sub-second response times",
      "Lightweight SEO-optimized movie detail pages"
    ],
    challenges: [
      "Handling rich media thumbnails without impacting Core Web Vitals.",
      "Synchronizing real-time review updates without excessive server load."
    ],
    solutions: [
      "Implemented responsive image delivery with native lazy-loading and blur placeholders.",
      "Architected lightweight REST endpoints with client-side caching to reduce redundant network requests."
    ]
  },
  {
    id: "shayam-cafe",
    slug: "shayam-cafe",
    title: "Shayam Cafe",
    subtitle: "Modern Cafe Menu & Digital Ordering Platform",
    category: "ecommerce",
    featured: true,
    date: "2024",
    image: "assets/images/projects/shayam-cafe.jpg",
    link: "https://shayam-cafe.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["React", "Tailwind CSS", "EmailJS", "Cart System", "Local Storage"],
    summary: "A stylish and responsive cafe web application featuring dynamic menu browsing, interactive shopping cart, customer reviews, photo gallery, and instant order dispatch via EmailJS.",
    overview: "Designed for a local dining establishment seeking to replace traditional paper menus with an intuitive contactless ordering portal. The application provides instant item filtering (Beverages, Snacks, Meals), cart state persistence across reloads, and automatic order dispatch to kitchen staff via EmailJS.",
    features: [
      "Categorized interactive digital menu with pricing and dietary badges",
      "Persistent cart state powered by browser storage",
      "Real-time order calculation including taxes and service details",
      "Seamless EmailJS order notification system for kitchen dispatch",
      "Customer testimonials slider and high-resolution photo gallery",
      "One-tap call and WhatsApp reservation integration"
    ],
    challenges: [
      "Ensuring seamless cart persistence during mobile browser tab switching.",
      "Providing real-time order confirmation without a dedicated database server."
    ],
    solutions: [
      "Designed a decoupled React state store synchronized with LocalStorage.",
      "Integrated EmailJS automated email triggers formatted with full itemized receipts."
    ]
  },
  {
    id: "resume-builder",
    slug: "resume-builder",
    title: "Resume Builder SaaS",
    subtitle: "Modern Resume Builder & PDF Generator",
    category: "saas",
    featured: true,
    date: "2024",
    image: "assets/images/projects/resume-builder.jpg",
    link: "https://devfolio-saas.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["React", "Tailwind CSS", "Node.js", "html2pdf.js", "State Management"],
    summary: "A professional SaaS application that enables job seekers to create, customize, preview in real time, and download A4-formatted ATS-friendly resumes as high-resolution PDFs.",
    overview: "Resume Builder solves the common formatting frustration faced by applicants. It offers modular section editing (Experience, Education, Skills, Projects, Certifications), live two-column real-time preview, multiple layout themes, and pixel-perfect PDF rendering directly in the client browser.",
    features: [
      "Live dual-pane editor with instant synchronized preview",
      "Modular section reordering, addition, and deletion",
      "Dynamic ATS-optimized PDF generation and instant download",
      "Persistent draft state across browser sessions",
      "Curated professional font pairings and color themes"
    ],
    challenges: [
      "Maintaining strict A4 print boundary constraints across different device viewports.",
      "Rendering high-resolution vector text in generated PDF output without blurriness."
    ],
    solutions: [
      "Developed a custom CSS print-emulation preview container with fixed millimeter margins.",
      "Configured html2pdf canvas scaling with pixel-ratio multipliers for razor-sharp rendering."
    ]
  },
  {
    id: "shekhawati-furniture",
    slug: "shekhawati-furniture",
    title: "Shekhawati Furniture House",
    subtitle: "Handcrafted Heritage Furniture Catalog",
    category: "ecommerce",
    featured: true,
    date: "2023",
    image: "assets/images/projects/Furnture.jpg",
    link: "https://furniture-web-rho-ten.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["HTML5", "CSS3", "JavaScript", "E-Commerce", "Responsive UI"],
    summary: "An elegant e-commerce catalog engineered for premium handcrafted architectural furniture, featuring regional heritage designs, smooth catalog filters, and high visual impact.",
    overview: "Created for a heritage furniture manufacturer to showcase bespoke Shekhawati wood craftsmanship. The platform features categorized collections (Living, Bedroom, Dining, Decor), detailed product dimension guides, high-resolution zoomable imagery, and direct WhatsApp / phone inquiry dispatch.",
    features: [
      "Editorial product catalog with category and room filters",
      "High-resolution image modal and zoom preview",
      "Direct product inquiry workflows via WhatsApp API",
      "Customer testimonials and workshop craftsmanship showcase",
      "Mobile-optimized fluid typography and layout"
    ],
    challenges: [
      "Displaying large, detailed woodwork photography without sluggish load speeds.",
      "Providing frictionless direct buying intent pathways for non-tech-savvy customers."
    ],
    solutions: [
      "Engineered automated image compression and responsive source-sets.",
      "Built one-click WhatsApp pre-filled inquiry triggers linking product SKU and title."
    ]
  },
  {
    id: "rajasthan-tourism",
    slug: "rajasthan-tourism",
    title: "Rajasthan Tourism Portal",
    subtitle: "Cultural Heritage & Travel Destination Experience",
    category: "full-stack",
    featured: false,
    date: "2023",
    image: "assets/images/projects/Toursim.jpg",
    link: "https://rajasthan-tourism.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["HTML5", "CSS3", "JavaScript", "Travel Portal", "UX Design"],
    summary: "An immersive travel portal celebrating the historic forts, folk festivals, desert safaris, and royal culture of Rajasthan, with interactive itinerary planning.",
    overview: "Built to inspire global travelers to explore Rajasthan's cultural richness. The portal organizes travel guides by historic cities (Jaipur, Udaipur, Jodhpur, Jaisalmer), highlights seasonal fairs, provides travel tips, and includes an interactive itinerary planner.",
    features: [
      "City-by-city destination guides with landmarks and travel advisories",
      "Interactive itinerary builder with printable travel schedules",
      "Rich cultural media gallery with traditional folk music accents",
      "Responsive navigation drawer and search interface"
    ],
    challenges: [
      "Structuring extensive regional travel information in a digestible, modern hierarchy.",
      "Creating an inspiring editorial aesthetic that avoids generic government portal looks."
    ],
    solutions: [
      "Applied modern editorial card layouts with warm heritage accent tones.",
      "Created modular city cards with quick-read facts and highlighted photography."
    ]
  },
  {
    id: "lali-studio",
    slug: "lali-studio",
    title: "Lali Studio",
    subtitle: "Creative Photography & Videography Portfolio",
    category: "frontend",
    featured: false,
    date: "2023",
    image: "assets/images/projects/studio.jpg",
    link: "https://lali-studio.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["HTML5", "CSS3", "JavaScript", "Lightbox", "Media Gallery"],
    summary: "A sleek, dark-themed visual portfolio for a photography studio specializing in cinematic wedding stories, portraits, and commercial brand productions.",
    overview: "Designed with a minimalist dark aesthetic to let imagery take center stage. Built for visual artists needing a portfolio with ultra-fast masonry grids, categorized filters (Weddings, Pre-shoots, Portraits), and an interactive full-screen lightbox.",
    features: [
      "Masonry photo gallery with smooth category transitions",
      "Custom zero-dependency full-screen lightbox modal",
      "Service packages and pricing breakdown",
      "Integrated client inquiry form with date selector"
    ],
    challenges: [
      "Preventing layout shifts during masonry image loading.",
      "Ensuring rapid performance despite heavy photographic media."
    ],
    solutions: [
      "Pre-allocated aspect-ratio containers in CSS to eliminate Cumulative Layout Shift (CLS).",
      "Implemented IntersectionObserver-based lazy loading with progressive blur placeholders."
    ]
  },
  {
    id: "univ-result",
    slug: "univ-result",
    title: "Univ Result Portal",
    subtitle: "High-Traffic Academic Examination Results Portal",
    category: "full-stack",
    featured: false,
    date: "2023",
    image: "assets/images/projects/UnivResult.jpg",
    link: "https://univresult.in/",
    github: "https://github.com/w3lalitsaini",
    tags: ["Node.js", "Express", "MongoDB", "High-Concurrency", "REST APIs"],
    summary: "An optimized academic result lookup system engineered to withstand sudden traffic spikes when university annual examination results are declared.",
    overview: "During university result release days, portals frequently crash under peak loads. Univ Result was developed to solve this bottleneck using an in-memory caching layer, efficient MongoDB indexing on roll numbers, and clean student scorecards.",
    features: [
      "Sub-second roll number lookup across hundreds of thousands of student records",
      "Automated division and percentage calculation engine",
      "Print-ready downloadable official scorecard layout",
      "Fail-safe caching layer preventing database timeouts during surges"
    ],
    challenges: [
      "Handling thousands of concurrent roll number queries within minute-long result release windows.",
      "Validating messy tabular academic marks data imported from legacy university spreadsheets."
    ],
    solutions: [
      "Implemented composite MongoDB indexing on roll numbers and course codes.",
      "Created an automated data sanitization pipeline verifying totals before publication."
    ]
  },
  {
    id: "portfolio-v1",
    slug: "portfolio-v1",
    title: "Personal Portfolio V1",
    subtitle: "Interactive Motion Design & Creative Developer Portfolio",
    category: "frontend",
    featured: false,
    date: "2022",
    image: "assets/images/projects/portfolio2.jpg",
    link: "https://portfolio-v1-eta-ten.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["HTML5", "CSS3", "JavaScript", "GSAP", "Micro-Interactions"],
    summary: "An interactive personal developer portfolio showcasing skills, projects, and career milestones with smooth GSAP scroll triggers and modern component micro-interactions.",
    overview: "The initial generation of the W3 Lalit developer portfolio, focusing on creative motion design, smooth scrolling dynamics, and interactive project cards. It established the core visual identity that laid the foundation for the current enterprise platform.",
    features: [
      "GSAP scroll-triggered entrance animations",
      "Interactive technical skill cards with animated progress meters",
      "Contact form with instant client-side validation",
      "Theme switcher with smooth CSS transitions"
    ],
    challenges: [
      "Maintaining 60fps animation performance across low-powered mobile devices.",
      "Preventing layout thrashing caused by multiple ScrollTrigger instances."
    ],
    solutions: [
      "Utilized CSS transforms and opacity exclusively for GPU hardware acceleration.",
      "Batched ScrollTrigger recalculations and throttled resize event listeners."
    ]
  },
  {
    id: "rangilo-rajasthan",
    slug: "rangilo-rajasthan",
    title: "Rangilo Rajasthan",
    subtitle: "Cultural Heritage & Travel Showcase",
    category: "frontend",
    featured: false,
    date: "2022",
    image: "assets/images/projects/Rajastha.jpg",
    link: "https://rajasthan-view.vercel.app/",
    github: "https://github.com/w3lalitsaini",
    tags: ["HTML5", "CSS3", "JavaScript", "GSAP", "Motion Design"],
    summary: "A striking cultural landing page celebrating Rajasthan heritage and tourism with rich imagery, fluid scroll interactions, and conversion-focused travel CTAs.",
    overview: "Built to celebrate the culture, historic forts, folk festivals, and royal architecture of Rajasthan. Employs fluid GSAP transitions, royal color palettes, and engaging storytelling to inspire prospective travelers.",
    features: [
      "Hero section with staggered typographic reveals",
      "Interactive regional folklore audio-visual cards",
      "High-contrast royal typography and responsive layout",
      "Engaging Call-to-Action sections for customized itinerary planning"
    ],
    challenges: [
      "Balancing vivid cultural colors with clean modern readability.",
      "Creating seamless visual narrative flow between historical epochs."
    ],
    solutions: [
      "Adopted a disciplined color hierarchy with muted surfaces and deliberate royal accents.",
      "Built timeline-based GSAP sequences triggered as the user scrolls."
    ]
  },
  {
    id: "info-blog",
    slug: "info-blog",
    title: "Info Blog Portal",
    subtitle: "Modern Tech News & Editorial Knowledge Base",
    category: "full-stack",
    featured: false,
    date: "2022",
    image: "assets/images/projects/1.jpg",
    link: "https://info.univresult.in/",
    github: "https://github.com/w3lalitsaini",
    tags: ["React", "Node.js", "REST APIs", "Modern UI"],
    summary: "A feature-rich tech and academic news blog built with React, Node.js, and REST APIs, optimized for reading clarity, fast navigation, and user engagement.",
    overview: "Info Blog provides daily technological updates, examination notifications, and developer tutorials. Built with a focus on editorial typography, fast article rendering, and zero-distraction reader views.",
    features: [
      "Minimalist reader-first typography scale with optimized line heights",
      "Category and tag-based article filtering",
      "Responsive reading layout optimized for handheld devices",
      "REST API integration for dynamic post rendering",
      "Social sharing triggers and author bio attribution"
    ],
    challenges: [
      "Ensuring distraction-free reading while retaining strong navigational cues.",
      "Keeping article payload size minimal for rural readers on 3G/4G connections."
    ],
    solutions: [
      "Stripped unnecessary decorative assets, keeping CSS under 20KB.",
      "Implemented server-side gzip compression and clean semantic HTML."
    ]
  }
];

export const SEED_TESTIMONIALS = [
  {
    id: "test-1",
    name: "Ramesh Sharma",
    role: "Owner, Shayam Cafe • Sikar, Rajasthan",
    rating: 5,
    avatar: "assets/images/avatars/john.jpg",
    quote: "Lalit transformed our physical cafe ordering process into a frictionless digital menu experience. Table turnover improved significantly and customers constantly praise how fast and sleek the application feels on mobile. Delivered exactly on time with zero bugs."
  },
  {
    id: "test-2",
    name: "Virendra Singh",
    role: "Founder, Shekhawati Furniture",
    rating: 5,
    avatar: "assets/images/avatars/sara.jpg",
    quote: "Working with Lalit was straightforward from day one. He built our online furniture showroom with custom inquiry workflows that increased our customer leads by over 150%. His technical recommendations on image optimization saved us significant hosting costs."
  },
  {
    id: "test-3",
    name: "Mukesh Saini",
    role: "Creative Director, Lali Studio",
    rating: 5,
    avatar: "assets/images/avatars/umesh.jpg",
    quote: "Our photography studio needed a gallery that loaded ultra-high-resolution images instantly without sacrificing visual fidelity. Lalit engineered a custom lightbox and lazy loading architecture that makes our work look stunning on both mobile and large 4K displays."
  },
  {
    id: "test-4",
    name: "Priya Verma",
    role: "Product Manager & Tech Lead",
    rating: 5,
    avatar: "assets/images/avatars/priya.jpg",
    quote: "Lalit is an exceptional developer who cares deeply about code quality, API resilience, and performance. His ability to navigate both complex React frontend logic and Node/MongoDB backend pipelines makes him an invaluable asset to any project."
  }
];
