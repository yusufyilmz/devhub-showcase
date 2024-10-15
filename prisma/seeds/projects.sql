-- Delete all existing projects
DELETE FROM
  "projects";

-- Delete all existing companies and education
DELETE FROM
  "companies";

DELETE FROM
  "educations";

DELETE FROM
  "referrals";

-- Add companies
INSERT INTO
  "companies" (id, name, url, role, started_at, finished_at)
VALUES
  (
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1',
    'Toptal',
    'https://www.toptal.com',
    'Senior Fullstack Engineer',
    '2021-10-01',
    '2024-10-01'
  ),
  (
    'a2f8c0e4-0e8d-4114-b3eb-89e6472823c2',
    'Scopely',
    'https://www.scopely.com',
    'Senior Software Engineer',
    '2020-10-01',
    '2021-09-01'
  ),
  (
    'b2f8c0e4-0e8d-4114-b3eb-89e6472823c3',
    'Marfeel',
    'https://www.marfeel.com',
    'Senior Full Stack Developer',
    '2019-10-01',
    '2020-09-01'
  ),
  (
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4',
    'Turkcell',
    'https://turkcell.com',
    'Senior Software Engineer',
    '2015-04-01',
    '2019-10-01'
  ),
  (
    'd2f8c0e4-0e8d-4114-b3eb-89e6472823c5',
    'SESTEK',
    'https://www.sestek.com',
    'Software Engineer',
    '2012-11-01',
    '2015-04-01'
  );

INSERT INTO
  "educations" (
    id,
    created_at,
    updated_at,
    institution,
    degree,
    field_of_study,
    started_at,
    finished_at,
    description,
    institution_link
  )
VALUES
  (
    'e1f8c0e4-0e8d-4114-b3eb-89e6472823c1',
    NOW(),
    NOW(),
    'Boğaziçi University',
    'Master of Science',
    'Software Engineering',
    '2013-09-01',
    '2016-06-01',
    'Focused on software engineering principles, including software design, architecture, and development.',
    'https://bogazici.edu.tr/en_us'
  ),
  (
    'e2f8c0e4-0e8d-4114-b3eb-89e6472823c2',
    NOW(),
    NOW(),
    'Istanbul Technical University',
    'Bachelor of Science',
    'Control and Computer Engineering',
    '2007-09-01',
    '2012-06-01',
    'Specialized in computer engineering and control systems.',
    'https://www.itu.edu.tr/en'
  );

INSERT INTO
  projects (
    id,
    created_at,
    updated_at,
    title,
    description,
    link,
    role,
    skills,
    public,
    "companyId"
  )
VALUES
  -- Updated projects with detailed descriptions
  (
    gen_random_uuid(),
    now(),
    now(),
    'Automated Story Generator',
    'A tool designed to automate the generation of customized success stories by utilizing AI to process user input and generate personalized narratives. I was responsible for the full-stack development, handling both frontend (React, Next.js) and backend (Node.js, Prisma, PostgreSQL) components, along with implementing the queue system for processing requests using bullMQ and Redis.',
    null,
    'Senior Fullstack Engineer',
    '{"React", "Next.js", "Prisma", "Tailwind", "SCSS", "AI", "Node.js", "PostgreSQL", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Content Monitoring Tool',
    'A system for monitoring public content and generating alerts based on specific conditions. Integrated with a task management system to create tickets for any issues found. I was involved in full-stack development, ensuring proper data flow from the frontend to the backend while working with APIs for content analysis and task management.',
    null,
    'Senior Fullstack Engineer',
    '{"React", "Typescript", "SCSS", "Next.js", "Prisma", "PostgreSQL", "Content Monitoring API", "Task Management API", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Keyword Generation Tool',
    'A tool that automates the generation of negative keywords for advertising campaigns, improving SEO performance. I was responsible for full-stack development, creating a user-friendly frontend with React and integrating with Google Ads API to dynamically generate keywords and manage campaigns.',
    null,
    'Senior Fullstack Engineer',
    '{"React", "Next.js", "Typescript", "SCSS", "Prisma", "PostgreSQL", "Google Ads API", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Performance Alerts System',
    'Developed an alert system to monitor performance metrics and generate notifications based on custom filters. Implemented a data pipeline to process data from BigQuery, ensuring accurate and timely alerts. My role involved full-stack development, focusing on both the frontend interface and backend data handling, using technologies like ETL and Google Cloud services.',
    null,
    'Senior Fullstack Engineer',
    '{"React", "Next.js", "Typescript", "Prisma", "SCSS", "PostgreSQL", "Google Ads API", "BigQuery", "ETL", "Avro", "Google Cloud Storage"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Keyword Optimization Tool',
    'A tool for automating the generation and optimization of positive keywords for advertising campaigns. I contributed to the frontend development, focusing on creating a responsive UI and integrating it with backend services that interact with the Google Ads API for seamless campaign management.',
    '',
    'Frontend Developer',
    '{"React", "Typescript", "Next.js", "Prisma", "SCSS", "PostgreSQL", "Google Ads API", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Dynamic Content Management System',
    'An automated system designed to manage and update dynamic content on various web pages. I was responsible for the full-stack development, including integrating with content APIs, creating a responsive frontend, and building the backend for processing content updates in real time using Kafka.js and Redis.',
    null,
    'Senior Full Stack Developer',
    '{"React", "Typescript", "Next.js", "Prisma", "SCSS", "PostgreSQL", "Google Ads API", "bullMQ", "Redis", "Kafka.js"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Media Assets Review Tool',
    'A tool for reviewing and managing media assets used in marketing campaigns. My role involved full-stack development, including building the frontend for asset review and management, as well as developing the backend integration with the advertising API and media storage.',
    null,
    'Senior Full Stack Developer',
    '{"React", "Typescript", "Next.js", "Prisma", "SCSS", "PostgreSQL", "Google Ads API", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'JavaScript Minifier',
    'A public tool for minifying JavaScript code, used by developers to compress and optimize their scripts. I developed the frontend interface using React and Next.js, ensuring a simple and intuitive user experience.',
    'https://www.toptal.com/developers/javascript-minifier',
    'Senior Frontend Developer',
    '{"React", "Typescript", "Next.js", "SCSS", "Redis"}',
    true,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'CSS Minifier',
    'A public tool for minifying CSS code, helping developers compress and optimize stylesheets. I worked on the frontend using React and Next.js to ensure smooth functionality and user-friendly interaction.',
    'https://www.toptal.com/developers/cssminifier',
    'Senior Frontend Developer',
    '{"React", "Typescript", "Next.js", "SCSS", "Redis"}',
    true,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'HTML Minifier',
    'A public tool for minifying HTML code, used to compress HTML files for improved performance. I was responsible for building the frontend using React and Next.js.',
    'https://www.toptal.com/developers/html-minifier',
    'Senior Frontend Developer',
    '{"React", "Typescript", "Next.js", "SCSS", "Redis"}',
    true,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'HTMLShell',
    'A public tool that generates HTML code snippets. I developed the frontend using React and Next.js, ensuring a user-friendly experience for developers needing to generate HTML quickly.',
    'https://www.toptal.com/developers/htmlshell',
    'Senior Frontend Developer',
    '{"React", "Typescript", "Next.js", "SCSS", "Redis"}',
    true,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Keycode Tool',
    'A public tool for developers to test and find keycodes for keyboard events. I built the frontend using React and Next.js, providing an easy-to-use interface for testing keycodes.',
    'https://www.toptal.com/developers/keycode',
    'Senior Frontend Developer',
    '{"React", "Typescript", "Next.js", "SCSS", "Redis"}',
    true,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Hastebin',
    'A public tool for sharing code snippets. I contributed to the full-stack development, focusing on building a responsive frontend with React and Next.js and ensuring proper backend integration for storing and retrieving code snippets.',
    'https://www.toptal.com/developers/hastebin',
    'Senior Full Stack Developer',
    '{"React", "Typescript", "Next.js", "SCSS", "Redis"}',
    true,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  );
  

-- Insert projects for Turkcell
INSERT INTO
  projects (
    id,
    created_at,
    updated_at,
    title,
    description,
    link,
    role,
    skills,
    public,
    "companyId"
  )
VALUES
  (
    gen_random_uuid(),
    now(),
    now(),
    'WebChat',
    'Developed a real-time WebChat platform for Turkcell, supporting high traffic.',
    null,
    'Lead Engineer',
    '{"React", "Node.js", "WebSockets", "Redux", "JavaScript", "HTML", "CSS"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Chat Gateway',
    'Designed and implemented a multi-channel chat gateway for customer services chat platforms.',
    null,
    'Lead Engineer',
    '{".NET", ".NET Core", "REST APIs", "WebSockets", "Genesis Framework", "AIML"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Customer Service Chat Tools',
    'Bot Info, Integration service, Chat and Phonex Configuration Manager, Transaction Manager, Opera, Phonex, IWS and other customer service tools for chat platform.',
    null,
    'Backend Developer',
    '{"Node.js", "C#", "REST APIs"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Phonex Configuration Manager',
    'Management system for Phonex configurations used in Turkcell’s customer service.',
    null,
    'Backend Developer',
    '{"C#", "SQL", "MS SQL Server"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  );
-- Insert projects for Turkcell
INSERT INTO
  projects (
    id,
    created_at,
    updated_at,
    title,
    description,
    link,
    role,
    skills,
    public,
    "companyId"
  )
VALUES
  (
    gen_random_uuid(),
    now(),
    now(),
    'Real-Time Communication Platform',
    'Led the development of a real-time chat platform, designed to handle high traffic for customer interactions.',
    null,
    'Lead Engineer',
    '{"React", "Node.js", "WebSockets", "Redux", "JavaScript", "HTML", "CSS"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Multi-Channel Chat Gateway',
    'Designed and implemented a chat gateway that supported multiple channels for customer service interactions.',
    null,
    'Lead Engineer',
    '{".NET", ".NET Core", "REST APIs", "WebSockets", "Genesis Framework", "AIML"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Customer Service Tools',
    'Developed various backend services and tools to improve customer service chat platforms, focusing on integration and management systems.',
    null,
    'Backend Developer',
    '{"Node.js", "C#", "REST APIs"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Configuration Management System',
    'Developed a system for managing configurations used in customer service operations.',
    null,
    'Backend Developer',
    '{"C#", "SQL", "MS SQL Server"}',
    false,
    'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4'
  );

-- Insert project for Marfeel
INSERT INTO
  projects (
    id,
    created_at,
    updated_at,
    title,
    description,
    link,
    role,
    skills,
    public,
    "companyId"
  )
VALUES
  (
    gen_random_uuid(),
    now(),
    now(),
    'Web Product Migration to Modern Framework',
    'Led the conversion of existing web products to a modern framework, improving performance and maintainability.',
    null,
    'Frontend Developer',
    '{"React", "CLI Tools", "JavaScript"}',
    false,
    'b2f8c0e4-0e8d-4114-b3eb-89e6472823c3'
  );

-- Insert projects for Sestek
INSERT INTO
  projects (
    id,
    created_at,
    updated_at,
    title,
    description,
    link,
    role,
    skills,
    public,
    "companyId"
  )
VALUES
  (
    gen_random_uuid(),
    now(),
    now(),
    'Text-to-Speech Features',
    'Developed key features for a text-to-speech system, integrating with multiple platforms.',
    null,
    'Software Engineer',
    '{"TTS", "C++", "C#", "Objective-C"}',
    false,
    'd2f8c0e4-0e8d-4114-b3eb-89e6472823c5'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Speech Recognition Features',
    'Worked on developing speech recognition features aimed at enhancing customer interactions.',
    null,
    'Software Engineer',
    '{"SR", "C#", "C++", "Objective-C"}',
    false,
    'd2f8c0e4-0e8d-4114-b3eb-89e6472823c5'
  );

-- Insert projects for Scopely
INSERT INTO
  projects (
    id,
    created_at,
    updated_at,
    title,
    description,
    link,
    role,
    skills,
    public,
    "companyId"
  )
VALUES
  (
    gen_random_uuid(),
    now(),
    now(),
    'Automation Tools for Engineering Teams',
    'Developed automation tools for engineering teams to streamline frontend and backend development processes.',
    null,
    'Full Stack Developer',
    '{"React", ".NET", "C#", "JavaScript", "Typescript", "HTML", "CSS", "AWS", "Amazon S3", "Amazon Device Farm"}',
    false,
    'a2f8c0e4-0e8d-4114-b3eb-89e6472823c2'
  );

-- referrals that i get from people

INSERT INTO
  referrals (
    id,
    created_at,
    updated_at,
    name,
    relationship,
    feedback,
    recommendation,
    contact_info,
    session_id
  )
VALUES
  (
    'e1f8c0e4-0e8d-4114-b3eb-89e647282399',
    NOW(),
    NOW(),
    'Marcelo Carneiro',
    'Toptal, Team manager',
    'I had the pleasure of working with Yusuf at Toptal, where he made a significant impact as a Senior Full-Stack Engineer. He is an incredibly fast developer, consistently delivering results with impressive speed and precision. Yusuf was always proactive in creating solutions, and bringing ideas to the table. His execution was top-notch, ensuring that his innovative concepts were implemented effectively. He maintained active communication with everyone on the engineering and design teams, which streamlined collaboration and ensured that all aspects of product implementation were aligned.',
    'Yusuf would be a fantastic asset to any team, combining speed, proactivity, and a collaborative spirit to deliver exceptional results',
    'john.doe@example.com',
    'unique-session-id-1'
  );