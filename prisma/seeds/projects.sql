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
  -- Toptal projects
  (
    gen_random_uuid(),
    now(),
    now(),
    'TAG / Assets Generator',
    'A success story generator that automates interviews and generates personalized success stories.',
    null,
    'Senior Fullstack Engineer',
    '{"React", "Next.js", "Prisma", "Tailwind", "SCSS", "Dify.AI", "Node.js", "PostgreSQL", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Public Page Alerts',
    'Tool for monitoring public pages and creating jira ticket based on content king errors.',
    null,
    'Senior Fullstack Engineer',
    '{"React", "Typescript", "SCSS", "Next.js", "Prisma", "PostgreSQL", "Content King API", "Jira API", "bullMQ", "Redis"}',
    false,
    'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1'
  ),
  (
    gen_random_uuid(),
    now(),
    now(),
    'Negative Keywords Generator',
    'Tool to automate the generation of negative keywords for google ads campaign for SEO team.',
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
    'SEM Alerts',
    'Developed SEM alerts using custom filters generated via a React query builder. The project also involved implementing an ETL pipeline to fetch and process data from BigQuery on a daily basis, ensuring timely and accurate alerts for Google Ads performance and other metrics.',
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
    'Positive Keywords Generator',
    'Tool for automating the creation of positive keywords for google ads campaign for SEO team.',
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
    'Dynamic Content Manager',
    'Automated system for managing and updating dynamic content on pages.',
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
    'Assets Review Tool',
    'Tool for reviewing and managing media assets used in campaigns.',
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
    'Tool to minify JavaScript code. Public tool.',
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
    'Tool to minify CSS code. Public tool.',
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
    'Tool to minify HTML code. Public tool.',
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
    'HTML tool for generating code snippets. Public tool.',
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
    'Tool for developers to test and find keycodes for keyboard events. Public tool.',
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
    'Public tool for sharing code snippets.',
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
    'Web Product Conversion to React',
    'Converted existing Marfeel web products to React and developed CLI tools.',
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
    'Text-to-Speech System',
    'Developed Text-to-Speech (TTS) features at Sestek.',
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
    'Speech Recognition System',
    'Worked on Speech Recognition (SR) features for customer interactions.',
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
    'Web Automation Tool for Game Engineers',
    'Developed web automation tools and handled frontend/backend development.',
    null,
    'Full Stack Developer',
    '{"React", ".NET", "C#", "JavaScript", "Typescript", "HTML", "CSS", "AWS", "Amazon S3", "Amazon Device Farm"}',
    false,
    'a2f8c0e4-0e8d-4114-b3eb-89e6472823c2'
  );

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
    'Example Referrer 1',
    'Turcell, product manager',
    'Yusuf demonstrated excellent leadership, managing a complex project that resulted in a 30% increase in productivity. He consistently delivered high-quality work.',
    'I highly recommend Yusuf for any position requiring a full-stack engineer with strong leadership and technical skills',
    'john.doe@example.com',
    'unique-session-id-1'
  ),
  (
    'e1f8c0e4-0e8d-4114-b3eb-89e647282395',
    NOW(),
    NOW(),
    'Example Referrer 1',
    'Collaborated with Yusuf on an open-source project',
    'Yusuf’s expertise in React and TypeScript significantly enhanced the quality of the project. His contributions were essential to meeting tight deadlines.',
    'Yusuf is an outstanding developer, and I would strongly recommend him for any team needing a proactive and skilled full-stack developer.',
    'jane.smith@example.com',
    'unique-session-id-2'
  ),
  (
    'e1f8c0e4-0e8d-4114-b3eb-89e647282394',
    NOW(),
    NOW(),
    'Example Referrer 3',
    'Worked with Yusuf at StartupXYZ as a CTO',
    'Yusuf led the migration of our platform to a more scalable architecture, increasing performance by 40%. His problem-solving skills are unmatched.',
    'Yusuf is a great asset to any company looking for a dedicated and highly skilled full-stack developer.',
    'michael.lee@startupxyz.com',
    'unique-session-id-3'
  );