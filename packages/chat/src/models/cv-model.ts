import type { CVModel } from '../types/cv.js'

export const CV_MODEL: CVModel = {
  personalInformation: {
    fullName: 'Yusuf Yilmaz',
    birthDate: 'February 07, 1989',
    age: '35',
    nationality: 'Turkish',
    location: 'Barcelona, Spain'
  },
  contact: {
    phone: '+34639464069',
    email: 'yilmazyu@gmail.com',
    github: 'github.com/yusufyilmz',
    linkedin: 'https://www.linkedin.com/in/yusuf-yilmaz-01543752/'
  },
  overview: {
    summary:
      'Highly skilled and dedicated Senior Software Engineer with over 12 years of experience. Specialized in building scalable, high-performance applications using modern web technologies such as React, Next.js, Node.js, and TypeScript. Extensive background in leading projects, mentoring teams, and solving complex challenges in industries like telecommunications and IT. Passionate about continuous learning, innovation, and improving processes to deliver efficient and impactful solutions.'
  },
  skills: {
    frontend: [
      { technology: 'reactjs', yearsOfExperience: '2024' },
      { technology: 'nextjs', yearsOfExperience: '2024' },
      { technology: 'typecript', yearsOfExperience: '2024' },
      {
        technology: 'javaScript',
        yearsOfExperience: '2024'
      },
      { technology: 'redux', yearsOfExperience: '2024' },
      { technology: 'hooks', yearsOfExperience: '2024' },
      { technology: 'html5', yearsOfExperience: '2024' },
      { technology: 'css3', yearsOfExperience: '2024' },
      { technology: 'tailwind', yearsOfExperience: '2024' }
    ],
    backend: [
      { technology: 'nodejs', yearsOfExperience: '2024' },
      { technology: 'expressjs', yearsOfExperience: '2024' },
      { technology: 'net', yearsOfExperience: '2023' },
      { technology: 'rest', yearsOfExperience: '2024' },
      { technology: 'MSSQL', yearsOfExperience: '2023' },
      { technology: 'PostgreSQL', yearsOfExperience: '2024' },
      { technology: 'MongoDB', yearsOfExperience: '2023' }
    ],
    devops: [
      { technology: 'Docker', yearsOfExperience: '2024' },
      { technology: 'Kubernetes', yearsOfExperience: '2023' },
      {
        technology: 'AWS (Lambda, S3)',

        yearsOfExperience: '2023'
      },
      {
        technology: 'CI/CD (GitHub Actions, Jenkins)',

        yearsOfExperience: '2024'
      }
    ],
    testing: [
      { technology: 'Jest', yearsOfExperience: '2024' },
      { technology: 'Mocha', yearsOfExperience: '2023' },
      { technology: 'Cypress', yearsOfExperience: '2024' },
      { technology: 'Enzyme', yearsOfExperience: '2022' },
      { technology: 'Jasmine', yearsOfExperience: '2022' },
      { technology: 'Nunit', yearsOfExperience: '2021' },
      { technology: 'Playwright', yearsOfExperience: '2023' }
    ],
    version_control: [
      { technology: 'Git', yearsOfExperience: '2024' },
      { technology: 'GitHub', yearsOfExperience: '2024' },
      { technology: 'GitLab', yearsOfExperience: '2023' }
    ],
    data_visualization: [
      { technology: 'D3.js', yearsOfExperience: '2023' },
      { technology: 'Chart.js', yearsOfExperience: '2023' }
    ],
    performance_optimization: [
      {
        technology: 'Client-side caching',

        yearsOfExperience: '2024'
      },
      {
        technology: 'Server-side rendering (SSR)',

        yearsOfExperience: '2024'
      },
      {
        technology: 'Load balancing',

        yearsOfExperience: '2023'
      },
      {
        technology: 'API optimization',

        yearsOfExperience: '2024'
      }
    ]
  },
  projects: [
    {
      name: 'TAG/Assets Generator',
      company: 'Toptal',
      description:
        'Automated success story generation using Dify.AI and created a user-friendly interface for story customization.',
      usedSkills: [
        'Next.js',
        'React',
        'JavaScript',
        'TypeScript',
        'Dify.AI',
        'PostgreSQL'
      ]
    },
    {
      name: 'Negative Keyword Generator',
      company: 'Toptal',
      description:
        'Developed a tool for generating negative keywords for Google Ads campaigns, helping improve ad targeting and reduce unnecessary spending.',
      usedSkills: ['JavaScript', 'Node.js', 'Google Ads API', 'PostgreSQL']
    },
    {
      name: 'Positive Keyword Generator',
      company: 'Toptal',
      description:
        'Built a tool for generating positive keywords for optimizing Google Ads campaigns, ensuring better ad performance.',
      usedSkills: ['JavaScript', 'Node.js', 'Google Ads API', 'PostgreSQL']
    },
    {
      name: 'Asset Review Tool',
      company: 'Toptal',
      description:
        'Created a tool for reviewing and managing Google Ads assets, improving the ability to assess campaign performance and content quality.',
      usedSkills: ['JavaScript', 'Node.js', 'Google Ads API', 'PostgreSQL']
    },
    {
      name: 'Public Page Alerts Tool',
      company: 'Toptal',
      description:
        'Designed a system to generate alerts for public pages in Google Ads, ensuring real-time monitoring and tracking of important pages.',
      usedSkills: ['JavaScript', 'Node.js', 'Google Ads API', 'PostgreSQL']
    },
    {
      name: 'Customer Service Chat Platform',
      company: 'Turkcell',
      description:
        'Built a real-time chat platform for customers and agents, designed to handle high traffic while maintaining performance.',
      usedSkills: [
        'React',
        'Node.js',
        'Redux',
        'MSSQL',
        'PostgreSQL',
        'MongoDB',
        'C#',
        '.NET Core'
      ]
    },
    {
      name: 'Web Automation Tool for Game Engineers',
      company: 'Scopely',
      description:
        'Developed a web automation tool that allows game engineers to create mobile device tests on Amazon Device Farm and view results and reports.',
      usedSkills: [
        'React',
        'Redux',
        'Node.js',
        'TypeScript',
        'AWS',
        'Amazon Device Farm',
        'Cypress'
      ]
    },
    {
      name: 'Unity Project Automation',
      company: 'Scopely',
      description:
        'Worked on automating Unity projects, developing tools that streamline Unity game development processes.',
      usedSkills: ['Unity', 'C#', 'React', 'Node.js']
    },
    {
      name: 'CLI Tools for Media Providers',
      company: 'Marfeel',
      description:
        'Developed CLI tools to assist media providers in managing their content and products.',
      usedSkills: ['Node.js', 'React', 'TypeScript', 'MongoDB', 'AWS']
    },
    {
      name: 'Server-Side Rendering for React Components',
      company: 'Marfeel',
      description:
        'Implemented server-side rendering (SSR) for React components, improving page load times and SEO performance.',
      usedSkills: ['React', 'Redux', 'Node.js', 'TypeScript', 'SSR']
    }
  ],
  education: [
    {
      degree: 'Master of Science in Software Engineering',
      university: 'Boğaziçi University',
      years: '2013-2016',
      gpa: '3.25/4.0',
      description:
        'Focused on software engineering principles, including software design, architecture, and development. Participated in multiple research projects related to software optimization and automation.'
    },
    {
      degree: 'Bachelor of Science in Control and Computer Engineering',
      university: 'Istanbul Technical University',
      years: '2007-2012',
      gpa: '3.36/4.0',
      description:
        'Specialized in computer engineering with a strong foundation in control systems, algorithms, and system design. Completed several projects related to control systems, embedded systems, and software development.'
    }
  ],
  experience: [
    {
      position: 'Senior Fullstack Engineer',
      company: 'Toptal',
      years: 'October 2021 – October 2024',
      description:
        'Developed the TAG / Assets Generator using Next.js and React to automate interviews and create success stories via Dify.AI. Built tools for Google Ads management and migrated 10-20 legacy websites to Next.js.'
    },
    {
      position: 'Senior Software Engineer',
      company: 'Scopely',
      years: 'October 2020 – September 2021',
      description:
        'Worked on migrating legacy web products to React and developing CLI tools for media providers. Contributed to web automation tools for game engineers and Unity development.'
    },
    {
      position: 'Senior Full Stack Developer',
      company: 'Marfeel',
      years: 'October 2019 – September 2020',
      description:
        'Converted web products to React, created CLI tools, and implemented Server-Side Rendering (SSR) for React components.'
    },
    {
      position: 'Senior Software Engineer',
      company: 'Turkcell Global Bilgi',
      years: 'April 2015 – October 2019',
      description:
        'Led the development of WebChat and other customer service tools, handling over 600,000 daily interactions. Converted WebChat to React and Redux within two weeks, significantly improving scalability.'
    },
    {
      position: 'Software Engineer',
      company: 'SESTEK',
      years: 'November 2012 – April 2015',
      description:
        'Developed core components for text-to-speech (TTS) and speech recognition (SR) systems. Designed and implemented web services using C++, C#, WCF, and built mobile applications with Swift and Objective-C.'
    }
  ],
  languages: [
    {
      language: 'Turkish',
      proficiency: 'Native'
    },
    {
      language: 'English',
      proficiency: 'Full Professional'
    },
    {
      language: 'Spanish',
      proficiency: 'Limited Working'
    }
  ],
  certifications: [
    {
      name: 'AWS Certificate Course',
      date: '09.2021',
      hours: '6 Hours'
    },
    {
      name: 'Docker: From Zero to Everything',
      date: '09.2021',
      hours: '24 Hours'
    },
    {
      name: 'GitHub Actions',
      date: '09.2021',
      hours: '24 Hours'
    },
    {
      name: 'Advanced React Patterns',
      date: '08.2018',
      hours: '24 Hours'
    },
    {
      name: 'Modern React with Redux Education',
      date: '03.2017',
      hours: '36 Hours'
    }
  ],
  references: [
    {
      name: 'Nazmi Soner Özçoban',
      position: 'Senior Solution Architect at Turkcell Global Bilgi',
      email: 'nazmisoner.ozcoban@globalbilgi.com.tr',
      contact: 'SkypeID: nazmisoner.ozcoban',
      feedback:
        'Yusuf was a key member of our engineering team, consistently delivering high-quality work under pressure.'
    },
    {
      name: 'Christian Lerke',
      position: 'Senior Solution Architect at Turkcell Global Bilgi',
      email: 'nazmisoner.ozcoban@globalbilgi.com.tr',
      contact: 'SkypeID: nazmisoner.ozcoban',
      feedback:
        'Yusuf was a key member of our engineering team, consistently delivering high-quality work under pressure.'
    },
    {
      name: 'Marcelo Carneiro',
      position: 'Senior Solution Architect at Turkcell Global Bilgi',
      email: 'nazmisoner.ozcoban@globalbilgi.com.tr',
      contact: 'SkypeID: nazmisoner.ozcoban',
      feedback:
        'Yusuf was a key member of our engineering team, consistently delivering high-quality work under pressure.'
    }
  ],
  achievements: [
    {
      title: 'Slack Centralized Notifications',
      description:
        'Developed a centralized system for managing Slack notifications across multiple applications. The system processes chat message requests from various apps and delivers them to users or channels based on customizable parameters, including scheduling, immediate delivery, and bulk notifications. This solution streamlined communication across teams by ensuring timely and organized message distribution.'
    },
    {
      title: 'WebChat Migration to React',
      description:
        'Successfully migrated Turkcell’s high-traffic WebChat platform from legacy systems to a modern React-based solution in one week, boosting scalability and performance, This platform, which handled over 600,000 daily interactions, saw significant improvements in scalability and performance due to the successful transition.'
    }
  ],
  character: {
    strengths: [
      'Problem-solving and ability to break down complex challenges',
      'Leadership in project management and migrations',
      'Strong communication and teamwork skills',
      'Deep expertise in modern web frameworks like React and Next.js'
    ],
    weaknesses: [
      'Tendency to focus too much on details in pursuit of perfection',
      'Sometimes overcommitting due to excitement about new technologies'
    ],
    leadership: {
      philosophy:
        'I believe in leading by example, providing clear guidance, and empowering my team to take ownership of their work. I focus on building a collaborative environment and maintaining open communication.',
      examples: [
        'Led the migration of Turkcell’s WebChat to React, coordinating across teams and delivering in record time.',
        'Mentored junior engineers at Toptal, helping them grow in their roles and improving team performance.'
      ]
    },
    teamwork: {
      philosophy:
        'I value open communication, mutual respect, and a shared sense of responsibility within teams. I’m a firm believer in leveraging each team member’s strengths to achieve the best results.',
      examples: [
        'Worked closely with cross-functional teams during the development of Google Ads tools at Toptal, ensuring seamless integration across systems.',
        'Collaborated with game engineers at Scopely to automate mobile testing workflows, improving overall efficiency.'
      ]
    },
    motivation: {
      shortTerm:
        'To continue mastering new technologies and leading impactful projects in modern web frameworks.',
      longTerm:
        'To become a technology leader, mentoring teams and influencing the direction of major software projects.'
    },
    communicationStyle:
      'I value clarity and openness, ensuring effective collaboration within teams.',
    problemSolvingPhilosophy:
      'I focus on root causes, break down complex problems, and use data-driven decisions.',
    adaptability:
      'I quickly adapt to new tools and frameworks, staying updated with industry trends.',
    innovation:
      'I constantly seek to improve processes, integrate new technologies, and deliver innovative solutions.',
    problemSolvingApproach:
      'I approach problems by analyzing the root cause, breaking the problem into smaller tasks, and iterating through solutions with data-driven decisions. I always seek to improve efficiency and performance in the systems I work with.',
    workEthic: {
      punctuality:
        'I consistently meet deadlines and ensure tasks are completed on time.',
      dedication:
        'I am committed to delivering high-quality work and am flexible to put in extra hours when necessary to meet deadlines or project goals.',
      continuousLearning:
        'I’m always learning new skills and keeping up with the latest technology trends to improve my work.'
    },
    resilience:
      'I stay calm and solution-focused under pressure, learning from failures and quickly adapting.',
    attentionToDetail:
      'While focusing on details, I also ensure they align with the overall project goals.',
    careerGoals: {
      shortTerm:
        'To continue leading projects in modern web frameworks and develop scalable, high-performance applications.',
      longTerm:
        'To become a technology leader or architect, shaping the direction of large-scale software projects and mentoring other engineers.'
    }
  },
  workPreferences: {
    remote:
      'I prefer remote work for its flexibility and productivity benefits.',
    office: 'I am not currently interested in full-time office work.',
    hybrid:
      'I am open to hybrid work models that balance in-person and remote work.'
  },
  technicalChallenges: [
    {
      challenge:
        'Scaling a real-time chat platform to handle 600,000+ daily interactions at Turkcell.',
      solution:
        'Refactored the system using React and Node.js, implementing Redux for state management and improving server performance with PostgreSQL optimizations.'
    }
  ]
}
