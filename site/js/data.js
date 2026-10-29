// Everything the site displays. Image paths are relative to assets/images/ (dashcomm = common://,
// shrdres = sharedres:// in the original dashboard).
//
// Each blade: tab label, title, colour (decoded dashboard gradients), theme (flat colours for panels),
// motd (description shown when nothing specific is highlighted), items, and an optional tray link.
// Items: label, icon, meta (summary in the description panel), details (shown when selected: strings,
// '• ' prefix for bullets) or href (opened directly).

export const owner = {
  name: 'JD Albright',
  picture: 'portfolio/profile.jpg',
  stats: [['Internships', 2], ['Projects', 6], ['Languages', 5]],
};

export const brand = { title: 'JD Albright', subtitle: 'Computer Science · University of Michigan' };

const EMAIL = 'junoa@umich.edu';
const LINKEDIN = 'https://www.linkedin.com/in/jd-albright';
const ARTSTATION = 'https://wxntergreen.artstation.com';
const GITHUB = 'https://github.com/w8w888';

const COLOURS = {
  orange: {
    back: [['#eb660f', 0], ['#e69a26', 0.349], ['#ebb13c', 0.6745], ['#c86e19', 0.9098]],
    front: [['#eb660f', 0], ['#e6911e', 0.349], ['#eba51e', 0.6627], ['#c86e19', 1]],
  },
  green: {
    back: [], backSolid: '#55eb0f',
    front: [['#0f6514', 0], ['#37af28', 0.3373], ['#0f7f0f', 0.7373], ['#0f2114', 1]],
  },
  blue: {
    back: [['#0f0f6e', 0], ['#0f529f', 0.1647], ['#0f72c7', 0.7961], ['#0f2886', 1]],
    front: [['#0f0f6e', 0], ['#1869b4', 0.1647], ['#0f72c7', 0.7961], ['#0f2886', 1]],
  },
  // System's decoded back layer is solid green (likely a leftover); its unused purple gradient is used.
  purple: {
    back: [['#7832b4', 0], ['#8c5adc', 0.3373], ['#6432b4', 0.6196], ['#323232', 0.9765]],
    front: [['#7832b4', 0], ['#8250d2', 0.3373], ['#7341c3', 0.6196], ['#323232', 0.9843]],
  },
  red: {
    back: [['#c8460f', 0], ['#d7960f', 0.4392], ['#c8280f', 0.9216], ['#c8320f', 1]],
    front: [['#c8460f', 0], ['#eb770f', 0.4392], ['#c8280f', 0.9216], ['#c8320f', 1]],
  },
};
const THEMES = {
  orange: { band: '#cb8347', body: '#eeae3f', bodyLight: '#fdc654', footer: '#f8a73e' },
  green: { band: '#2f7a14', body: '#5cb532', bodyLight: '#78c94a', footer: '#3e8f1e' },
  blue: { band: '#1f4f9a', body: '#2f7fd0', bodyLight: '#4a95dc', footer: '#2a5fae' },
  purple: { band: '#5a2a8a', body: '#8a5ad0', bodyLight: '#9a70d8', footer: '#6a3aa0' },
  red: { band: '#b4400f', body: '#e0661a', bodyLight: '#eb8a2a', footer: '#d0501a' },
};

const EMAIL_TRAY = { label: 'Email Me', href: `mailto:${EMAIL}`, icon: 'shrdres/ico_32x_Mail.png' };

export const blades = [
  {
    id: 'about',
    tab: 'about',
    title: 'About',
    colour: COLOURS.orange, theme: THEMES.orange,
    tile: true,
    motd: {
      title: 'JD Albright',
      body: 'Computer Science student at the University of Michigan who likes building software, reviving old software, and making digital art.',
    },
    tray: EMAIL_TRAY,
    items: [
      { id: 'me', label: 'About Me', icon: 'shrdres/ico_32x_Friend.png',
        meta: { title: 'About Me', body: 'CS student at Michigan with two Bosch internships, a habit of rebuilding legacy software, and 50+ digital art pieces on ArtStation.' },
        details: [
          "I'm a Computer Science student at the University of Michigan in Ann Arbor.",
          'At Bosch I built internal tools: a Microsoft Teams AI agent, plant-wide part tracking, and repair tracking with Power BI dashboards.',
          'On my own I like bringing old software back: an iOS remake of a 26-year-old desktop companion, and this site, a working recreation of the Xbox 360 dashboard.',
          'I also make digital art and video, and experiment with generative AI image workflows.',
        ] },
      { id: 'education', label: 'Education', icon: 'gamesbla/ico_32x_achievements_white.png',
        meta: { title: 'Education', body: 'B.S. Computer Science, University of Michigan (2025 – 2028). Associate’s, Lake Michigan College (2021 – 2024).' },
        details: [
          'University of Michigan, Ann Arbor: Bachelor of Science in Computer Science, Jan 2025 – Jan 2028 (expected).',
          '• Coursework: Programming and Intro Data Structures, Computer Science Pragmatics, Data Structures and Algorithms, Intro to Computer Organization',
          'Lake Michigan College, Benton Harbor: Associate’s in General Studies, Sep 2021 – Dec 2024.',
          '• Coursework: Multi-variable calculus, vector calculus',
        ] },
      { id: 'leadership', label: 'Leadership', icon: 'dashmain/ico_32x_parentalControl.png',
        meta: { title: 'Sigma Phi Fraternity', body: 'President and Property Manager since May 2025.' },
        details: [
          'Sigma Phi Fraternity, Ann Arbor: President, Property Manager (May 2025 – present)',
          '• Direct operations and property management; primary liaison to alumni, university administration, and external partners',
          '• Preside over weekly chapter meetings to set goals, vote on policy, and build consensus',
          '• Built the chapter website and run automated email outreach campaigns',
        ] },
    ],
  },
  {
    id: 'experience',
    tab: 'experience',
    title: 'Experience',
    colour: COLOURS.green, theme: THEMES.green,
    motd: { title: 'Experience', body: 'Two summers at Bosch USA in Saint Joseph, Michigan, building tools for logistics and engineering teams.' },
    tray: EMAIL_TRAY,
    items: [
      { id: 'bosch-2024', label: ['Bosch USA · 2024', 'Logistics Intern'], size: 'large', icon: 'dashmain/ico_32x_systemSet.png',
        meta: { title: 'Logistics Intern', body: 'May – Aug 2024. Teams AI agent (TypeScript, GPT-4), plant-wide part tracking in Python, $20K+ in savings found in SAP.' },
        details: [
          'Bosch USA, Saint Joseph, MI: Logistics Intern, May – Aug 2024',
          '• Developed a Microsoft Teams agent with the Teams SDK, TypeScript, and GPT-4 to automate communication between the logistics department and external suppliers',
          '• Implemented and deployed a Python part-tracking metrics system across the plant’s production environment',
          '• Performed product analysis in SAP, identifying end-of-life optimizations that saved over $20,000',
        ] },
      { id: 'bosch-2023', label: ['Bosch USA · 2023', 'Engineering Intern'], size: 'large', icon: 'dashmain/ico_32x_console.png',
        meta: { title: 'Engineering Intern', body: 'May – Aug 2023. Repair tracking in Python with Power BI, Visual Basic automation, SAP inventory data.' },
        details: [
          'Bosch USA, Saint Joseph, MI: Engineering Intern, May – Aug 2023',
          '• Programmed a Python system for tracking machine repairs, with historical analysis and visualization in Power BI',
          '• Automated data entry with Visual Basic scripts, significantly reducing manual work',
          '• Managed warehouse inventory data in SAP, tracking thousands of data points',
        ] },
    ],
  },
  {
    id: 'projects',
    tab: 'projects',
    title: 'Projects',
    colour: COLOURS.blue, theme: THEMES.blue,
    motd: { title: 'Projects', body: 'Things I’ve built: games, legacy-software revivals, AI image workflows, and digital art.' },
    tray: { label: 'ArtStation Portfolio', href: ARTSTATION, icon: 'dashcomm/ico_32x_DigitalCamera.png' },
    items: [
      { id: 'this-site', label: 'This Website', icon: 'gamesbla/ico_32x_demos.png',
        meta: { title: 'Xbox 360 Dashboard Recreation', body: 'A working web recreation of the 2008 “Blades” dashboard, rebuilt from the console’s own files.' },
        details: [
          'A recreation of the Xbox 360 “Blades” dashboard (2.0.6770) in plain HTML, CSS, and JavaScript.',
          '• Decrypted and decompressed the dashboard executable (AES + an LZX decoder written in Python) to extract its images, sounds, and UI scenes',
          '• Wrote a decoder for the binary XUI scene format to recover exact layout, colours, vector shapes, and animation timing',
          '• Converted the console’s own UI font (an .xtt file) back into a standard TrueType font',
          '• Mouse, touch, keyboard, and controller input; adapts to any screen size',
        ] },
      { id: 'ukagaka', label: 'iOS Ukagaka Remake', icon: 'shrdres/ico_32x_messenger.png',
        meta: { title: 'iOS Ukagaka Ghost Legacy Remake', body: 'Swift and WidgetKit. A 26-year-old desktop companion brought to iOS widgets.' },
        details: [
          'iOS Ukagaka Ghost Legacy Remake: Swift, WidgetKit',
          '• Engineered an iOS widget remake of legacy desktop software with dynamic character animations and custom rendering',
          '• Built a custom parser that interprets and executes 26-year-old scripting files, preserving the original character logic',
          '• Implemented on-device import and ZIP extraction so users can add their own characters and assets',
        ] },
      { id: 'trading', label: 'Trading Simulation Game', icon: 'gamesbla/ico_32x_arcade.png',
        meta: { title: 'Trading Simulation Game', body: 'Java and Swing. A turn-based market simulation with AI opponents.' },
        details: [
          'Trading Simulation Game: Java, Swing',
          '• Engineered a turn-based market simulation using object-oriented design for player portfolios, fluctuating assets, and AI opponents',
          '• Built an event-driven GUI with Java Swing to visualize market data',
          '• Wrote unit tests for trade calculations, edge cases, and AI behavior',
        ] },
      { id: 'genai', label: 'Generative AI Workflows', icon: 'dashcomm/ico_32x_DigitalCamera.png',
        meta: { title: 'Generative AI Image Workflows', body: 'ComfyUI, Stable Diffusion, and Photoshop.' },
        details: [
          'Generative AI Image Workflows: ComfyUI, Stable Diffusion, Photoshop',
          '• Built and iterated on node-based image-generation workflows in ComfyUI, refining prompts and settings to improve output quality',
          '• Combined AI-generated imagery with Photoshop editing to produce finished graphics',
        ] },
      { id: 'art', label: 'Digital Art & Video', icon: 'mediabla/ico_64x_TrailersFolder_white.png', href: ARTSTATION,
        meta: { title: 'Digital Art & Video Editing', body: '50+ digital art and graphic design pieces on ArtStation; video editing in Premiere Pro and After Effects. Select to open ArtStation.' } },
      { id: 'lab', label: 'Hardware Lab', icon: 'dashcomm/ico_32x_PC.png',
        meta: { title: 'Workstation Deployment & Hardware Lab', body: 'Windows, macOS, and Linux installs on physical and virtual machines.' },
        details: [
          'Workstation Deployment & Hardware Lab: Windows, macOS, Linux, VMs, FTP',
          '• Installed and configured Windows (multiple releases), macOS, and Linux on physical and virtual machines, with bootable install media for each',
          '• Configured MBR and GPT partition schemes under legacy BIOS and UEFI',
          '• Migrated data with drive cloning and FTP, and replaced drives and internal components',
        ] },
    ],
  },
  {
    id: 'skills',
    tab: 'skills',
    title: 'Skills',
    colour: COLOURS.purple, theme: THEMES.purple,
    motd: { title: 'Skills', body: 'Languages, tools, and platforms I work with.' },
    tray: EMAIL_TRAY,
    items: [
      { id: 'languages', label: 'Languages', icon: 'gamesbla/ico_32x_myGames.png',
        meta: { title: 'Languages', body: 'C++, Java, Python, Swift, TypeScript, Visual Basic' } },
      { id: 'tools', label: 'Developer Tools', icon: 'dashmain/ico_32x_systemSet.png',
        meta: { title: 'Developer Tools', body: 'Git, GDB, Make, Visual Studio Code, Xcode, Linux, WSL' } },
      { id: 'ai', label: 'Generative AI', icon: 'shrdres/ico_32x_messenger.png',
        meta: { title: 'Generative AI', body: 'Prompt engineering, Claude, Gemini, GPT-4, Stable Diffusion, ComfyUI, AI coding agents' } },
      { id: 'creative', label: 'Creative & Design', icon: 'dashcomm/ico_32x_DigitalCamera.png',
        meta: { title: 'Creative & Design', body: 'Photoshop, Illustrator, After Effects, Premiere Pro; video editing, graphic design' } },
      { id: 'systems', label: 'Systems & IT', icon: 'dashcomm/ico_32x_MU.png',
        meta: { title: 'Systems & IT', body: 'Windows, macOS, Linux, VMs; OS imaging, bootable media, drive cloning, MBR/GPT, UEFI/BIOS; hardware setup and repair' } },
      { id: 'data', label: 'Data & Platforms', icon: 'dashmain/ico_32x_network.png',
        meta: { title: 'Data & Platforms', body: 'Microsoft Power BI, SAP, Microsoft Teams SDK' } },
    ],
  },
  {
    id: 'contact',
    tab: 'contact',
    title: 'Contact',
    colour: COLOURS.red, theme: THEMES.red,
    motd: { title: 'Get in Touch', body: 'Email is the fastest way to reach me.' },
    tray: EMAIL_TRAY,
    items: [
      { id: 'email', label: 'Email', icon: 'shrdres/ico_32x_Mail.png', href: `mailto:${EMAIL}`,
        meta: { title: 'Email', body: EMAIL } },
      { id: 'linkedin', label: 'LinkedIn', icon: 'shrdres/ico_32x_Friend.png', href: LINKEDIN,
        meta: { title: 'LinkedIn', body: 'linkedin.com/in/jd-albright' } },
      { id: 'github', label: 'GitHub', icon: 'dashcomm/ico_32x_PC.png', href: GITHUB,
        meta: { title: 'GitHub', body: 'github.com/w8w888' } },
      { id: 'artstation', label: 'ArtStation', icon: 'dashcomm/ico_32x_DigitalCamera.png', href: ARTSTATION,
        meta: { title: 'ArtStation', body: 'wxntergreen.artstation.com' } },
    ],
  },
];

export const startBlade = 'about';
