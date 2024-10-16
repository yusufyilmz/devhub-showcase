DO $$ 
DECLARE 
  -- Define variables for companies
  toptalCompanyId UUID := gen_random_uuid();
  scopelyCompanyId UUID := gen_random_uuid();
  marfeelCompanyId UUID := gen_random_uuid();
  turkcellCompanyId UUID := gen_random_uuid();
  sestekCompanyId UUID := gen_random_uuid();

  -- Define variables for experiences
  toptalExperienceId UUID := gen_random_uuid();
  scopelyExperienceId UUID := gen_random_uuid();
  marfeelExperienceId UUID := gen_random_uuid();
  turkcellExperienceId UUID := gen_random_uuid();
  sestekExperienceId UUID := gen_random_uuid();

  -- Define variables for educations
  bogaziciEducationId UUID := gen_random_uuid();
  ituEducationId UUID := gen_random_uuid();

    -- Define variables for Toptal projects
  assetsGeneratorProjectId UUID := gen_random_uuid();
  contentMonitoringToolProjectId UUID := gen_random_uuid();
  nkKeywordGenerationProjectId UUID := gen_random_uuid();
  pkKeywordOptimizationToolProjectId UUID := gen_random_uuid();
  performanceAlertsProjectId UUID := gen_random_uuid();
  dynamicContentManagementProjectId UUID := gen_random_uuid();
  mediaAssetsReviewProjectId UUID := gen_random_uuid();
  javascriptMinifierProjectId UUID := gen_random_uuid();
  cssMinifierProjectId UUID := gen_random_uuid();
  htmlMinifierProjectId UUID := gen_random_uuid();
  htmlShellProjectId UUID := gen_random_uuid();
  keycodeToolProjectId UUID := gen_random_uuid();
  hastebinProjectId UUID := gen_random_uuid();
    -- Define variables for Scopely projects
  automationToolsProjectId UUID := gen_random_uuid();
  -- Define variables for Marfeel projects
  webProductMigrationProjectId UUID := gen_random_uuid();
  -- Define variables for Turkcell projects
  webChatProjectId UUID := gen_random_uuid();
  chatGatewayProjectId UUID := gen_random_uuid();
  -- Define variables for SESTEK projects
  textToSpeechProjectId UUID := gen_random_uuid();
  speechRecognitionProjectId UUID := gen_random_uuid();

    -- Define variables for skills
  reactSkillId UUID := gen_random_uuid();
  nextJsSkillId UUID := gen_random_uuid();
  prismaSkillId UUID := gen_random_uuid();
  nodeJsSkillId UUID := gen_random_uuid();
  typescriptSkillId UUID := gen_random_uuid();
  scssSkillId UUID := gen_random_uuid();
  postgresqlSkillId UUID := gen_random_uuid();
  aiSkillId UUID := gen_random_uuid();
  bullMqSkillId UUID := gen_random_uuid();
  redisSkillId UUID := gen_random_uuid();
  googleAdsApiSkillId UUID := gen_random_uuid();
  kafkaJsSkillId UUID := gen_random_uuid();
  bigQuerySkillId UUID := gen_random_uuid();
  etlSkillId UUID := gen_random_uuid();
  websocketSkillId UUID := gen_random_uuid();
  reduxSkillId UUID := gen_random_uuid();
  dotNetSkillId UUID := gen_random_uuid();
  restApiSkillId UUID := gen_random_uuid();
  cSharpSkillId UUID := gen_random_uuid();
  cPlusPlusSkillId UUID := gen_random_uuid();
  objectiveCSkillId UUID := gen_random_uuid();

BEGIN

DELETE FROM
  "projects";

-- Delete all existing companies and education
DELETE FROM
  "companies";

DELETE FROM
  "educations";

DELETE FROM
  "referrals";

DELETE FROM
  "skills";

  DELETE FROM
  "experiences";

-- Add companies

-- Insert companies
INSERT INTO "companies" (id, created_at, updated_at, name, link)
VALUES 
  (toptalCompanyId, NOW(), NOW(), 'Toptal', 'https://www.toptal.com'),
  (scopelyCompanyId, NOW(), NOW(), 'Scopely', 'https://www.scopely.com'),
  (marfeelCompanyId, NOW(), NOW(), 'Marfeel', 'https://www.marfeel.com'),
  (turkcellCompanyId, NOW(), NOW(), 'Turkcell', 'https://turkcell.com'),
  (sestekCompanyId, NOW(), NOW(), 'SESTEK', 'https://www.sestek.com');

-- Insert experiences
INSERT INTO "experiences" (id, created_at, updated_at, role, started_at, finished_at, "companyId")
VALUES 
  (toptalExperienceId, NOW(), NOW(), 'Senior Fullstack Engineer', '2021-10-01', '2024-10-01', toptalCompanyId),
  (scopelyExperienceId, NOW(), NOW(), 'Senior Software Engineer', '2020-10-01', '2021-09-01', scopelyCompanyId),
  (marfeelExperienceId, NOW(), NOW(), 'Senior Full Stack Developer', '2019-10-01', '2020-09-01', marfeelCompanyId),
  (turkcellExperienceId, NOW(), NOW(), 'Senior Software Engineer', '2015-04-01', '2019-10-01', turkcellCompanyId),
  (sestekExperienceId, NOW(), NOW(), 'Software Engineer', '2012-11-01', '2015-04-01', sestekCompanyId);

-- Insert educations
INSERT INTO "educations" (id, created_at, updated_at, institution, institution_link, degree, field_of_study, started_at, finished_at, description)
VALUES 
  (bogaziciEducationId, NOW(), NOW(), 'Boğaziçi University', 'https://bogazici.edu.tr/en_us', 'Master of Science', 'Software Engineering', '2013-09-01', '2016-06-01', 'Focused on software engineering principles, including software design, architecture, and development.'),
  (ituEducationId, NOW(), NOW(), 'Istanbul Technical University', 'https://www.itu.edu.tr/en', 'Bachelor of Science', 'Control and Computer Engineering', '2007-09-01', '2012-06-01', 'Specialized in computer engineering and control systems.');

-- Insert projects and link them with experiences
INSERT INTO "projects" (
  id,
  created_at,
  updated_at,
  title,
  description,
  link,
  role,
  public,
  "companyId",
  "experienceId"
)
VALUES
  -- Toptal Projects
  -- Automated Story Generator
  (assetsGeneratorProjectId, NOW(), NOW(), 'Automated Story Generator', 'A tool designed to automate the generation of customized success stories by utilizing AI to process user input and generate personalized narratives. I was responsible for the full-stack development, handling both frontend (React, Next.js) and backend (Node.js, Prisma, PostgreSQL) components, along with implementing the queue system for processing requests using bullMQ and Redis.', NULL, 'Senior Fullstack Engineer', FALSE, toptalCompanyId, toptalExperienceId),

  -- Content Monitoring Tool
  (contentMonitoringToolProjectId, NOW(), NOW(), 'Content Monitoring Tool',  'A system for monitoring public content and generating alerts based on specific conditions. Integrated with a task management system to create tickets for any issues found. I was involved in full-stack development, ensuring proper data flow from the frontend to the backend while working with APIs for content analysis and task management.',  NULL, 'Senior Fullstack Engineer', FALSE, toptalCompanyId, toptalExperienceId),

  -- Keyword Generation Tool
  (nkKeywordGenerationProjectId, NOW(), NOW(), 'Negative Keyword Generation Tool',  'A tool that automates the generation of negative keywords for advertising campaigns, improving SEO performance. I was responsible for full-stack development, creating a user-friendly frontend with React and integrating with Google Ads API to dynamically generate keywords and manage campaigns.', NULL, 'Senior Fullstack Engineer', FALSE, toptalCompanyId, toptalExperienceId),

  -- Performance Alerts System
  (performanceAlertsProjectId, NOW(), NOW(), 'Performance Alerts System', 'An automated system designed to manage and update dynamic content on various web pages. I was responsible for the full-stack development, including integrating with content APIs, creating a responsive frontend, and building the backend for processing content updates in real time using Kafka.js and Redis.', NULL, 'Senior Fullstack Engineer', FALSE, toptalCompanyId, toptalExperienceId),

  -- Keyword Optimization Tool
  (pkKeywordOptimizationToolProjectId, NOW(), NOW(), 'Positive Keyword Optimization Tool', 'A tool for automating the generation and optimization of positive keywords for advertising campaigns. I contributed to the frontend development, focusing on creating a responsive UI and integrating it with backend services that interact with the Google Ads API for seamless campaign management.', NULL, 'Frontend Developer', FALSE, toptalCompanyId, toptalExperienceId),

  -- Dynamic Content Management System
  (dynamicContentManagementProjectId, NOW(), NOW(), 'Dynamic Content Management System', 'An automated system designed to manage and update dynamic content on various web pages. I was responsible for the full-stack development, including integrating with content APIs, creating a responsive frontend, and building the backend for processing content updates in real time using Kafka.js and Redis.', NULL, 'Senior Fullstack Engineer', FALSE, toptalCompanyId, toptalExperienceId),

  -- Media Assets Review Tool
  (mediaAssetsReviewProjectId, NOW(), NOW(), 'Media Assets Review Tool', 'A tool for reviewing and managing media assets used in marketing campaigns. My role involved full-stack development, including building the frontend for asset review and management, as well as developing the backend integration with the advertising API and media storage.', NULL, 'Senior Fullstack Engineer', FALSE, toptalCompanyId, toptalExperienceId),

  -- JavaScript Minifier
  (javascriptMinifierProjectId, NOW(), NOW(), 'JavaScript Minifier', 'A public tool for minifying JavaScript code, used by developers to compress and optimize their scripts. I developed the frontend interface using React and Next.js, ensuring a simple and intuitive user experience.', 'https://www.toptal.com/developers/javascript-minifier', 'Senior Frontend Developer', TRUE, toptalCompanyId, toptalExperienceId),

  -- CSS Minifier
  (cssMinifierProjectId, NOW(), NOW(), 'CSS Minifier', 'A public tool for minifying CSS code, helping developers compress and optimize stylesheets. I worked on the frontend using React and Next.js to ensure smooth functionality and user-friendly interaction.', 'https://www.toptal.com/developers/cssminifier', 'Senior Frontend Developer', TRUE, toptalCompanyId, toptalExperienceId),

  -- HTML Minifier
  (htmlMinifierProjectId, NOW(), NOW(), 'HTML Minifier', 'A public tool for minifying HTML code, used to compress HTML files for improved performance. I was responsible for building the frontend using React and Next.js.', 'https://www.toptal.com/developers/html-minifier', 'Senior Frontend Developer', TRUE, toptalCompanyId, toptalExperienceId),

  -- HTMLShell
  (htmlShellProjectId, NOW(), NOW(), 'HTMLShell', 'A public tool that generates HTML code snippets. I developed the frontend using React and Next.js, ensuring a user-friendly experience for developers needing to generate HTML quickly.', 'https://www.toptal.com/developers/htmlshell', 'Senior Frontend Developer', TRUE, toptalCompanyId, toptalExperienceId),

  -- Keycode Tool
  (keycodeToolProjectId, NOW(), NOW(), 'Keycode Tool', 'A public tool for developers to test and find keycodes for keyboard events. I built the frontend using React and Next.js, providing an easy-to-use interface for testing keycodes.', 'https://www.toptal.com/developers/keycode', 'Senior Frontend Developer', TRUE, toptalCompanyId, toptalExperienceId),

  -- Hastebin
  (hastebinProjectId, NOW(), NOW(), 'Hastebin', 'A public tool for sharing code snippets. I contributed to the full-stack development, focusing on building a responsive frontend with React and Next.js and ensuring proper backend integration for storing and retrieving code snippets.', 'https://www.toptal.com/developers/hastebin', 'Senior Full Stack Developer', TRUE, toptalCompanyId, toptalExperienceId),

  -- Scopely Projects
  (automationToolsProjectId, NOW(), NOW(), 'Automation Tools for Engineering Teams', 'Developed automation tools for engineering teams to streamline frontend and backend development processes.', NULL, 'Senior Software Engineer', FALSE, scopelyCompanyId, scopelyExperienceId),

  -- Marfeel Projects
  (webProductMigrationProjectId, NOW(), NOW(), 'Web Product Migration to Modern Framework', 'Led the conversion of existing web products to a modern framework, improving performance and maintainability.', NULL, 'Senior Full Stack Developer', FALSE, marfeelCompanyId, marfeelExperienceId),

  -- Turkcell Projects
  (webChatProjectId, NOW(), NOW(), 'WebChat', 'Developed a real-time WebChat platform for Turkcell for customers to talk customer service, supporting high traffic.', NULL, 'Senior Software Engineer', FALSE, turkcellCompanyId, turkcellExperienceId),
  (chatGatewayProjectId, NOW(), NOW(), 'Chat Gateway', 'Designed and implemented a multi-channel chat gateway for customer services chat platforms.', NULL, 'Senior Software Engineer', FALSE, turkcellCompanyId, turkcellExperienceId),

  -- SESTEK Projects
  (textToSpeechProjectId, NOW(), NOW(), 'Text-to-Speech Features', 'Developed key features for a text-to-speech system, integrating with multiple platforms.', NULL, 'Software Engineer', FALSE, sestekCompanyId, sestekExperienceId),
  (speechRecognitionProjectId, NOW(), NOW(), 'Speech Recognition Features', 'Worked on developing speech recognition features aimed at enhancing customer interactions.', NULL, 'Software Engineer', FALSE, sestekCompanyId, sestekExperienceId);


-- Insert referrals
INSERT INTO
  "referrals" (
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
    'I had the pleasure of working with Yusuf at Toptal, where he made a significant impact as a Senior Full-Stack Engineer. He is an incredibly fast developer, consistently delivering results with impressive speed and precision. Yusuf was always proactive in creating solutions, and bringing ideas to the table. His execution was top-notch, ensuring that his innovative concepts were implemented effectively.',
    'Yusuf would be a fantastic asset to any team, combining speed, proactivity, and a collaborative spirit to deliver exceptional results.',
    'john.doe@example.com',
    'unique-session-id-1'
  ),
    (
    'e1f8c0e4-0e8d-4114-b3eb-89e647282392',
    NOW(),
    NOW(),
    'Example',
    'Toptal, Team manager',
    '',
    'Yusuf would be a fantastic asset to any team, combining speed, proactivity, and a collaborative spirit to deliver exceptional results.',
    'john.doe@example.com',
    'unique-session-id-2'
  );


-- Insert skills
INSERT INTO "skills" (id, created_at, updated_at, name, type)
VALUES 
  (reactSkillId, NOW(), NOW(), 'React', 'frontend'),
  (nextJsSkillId, NOW(), NOW(), 'Next.js', 'frontend'),
  (prismaSkillId, NOW(), NOW(), 'Prisma', 'backend'),
  (nodeJsSkillId, NOW(), NOW(), 'Node.js', 'backend'),
  (typescriptSkillId, NOW(), NOW(), 'TypeScript', 'frontend'),
  (scssSkillId, NOW(), NOW(), 'SCSS', 'frontend'),
  (postgresqlSkillId, NOW(), NOW(), 'PostgreSQL', 'database'),
  (aiSkillId, NOW(), NOW(), 'AI', 'backend'),
  (bullMqSkillId, NOW(), NOW(), 'bullMQ', 'backend'),
  (redisSkillId, NOW(), NOW(), 'Redis', 'backend'),
  (googleAdsApiSkillId, NOW(), NOW(), 'Google Ads API', 'api'),
  (kafkaJsSkillId, NOW(), NOW(), 'Kafka.js', 'backend'),
  (bigQuerySkillId, NOW(), NOW(), 'BigQuery', 'data'),
  (etlSkillId, NOW(), NOW(), 'ETL', 'data pipeline'),
    (websocketSkillId, NOW(), NOW(), 'WebSockets', 'backend'),
  (reduxSkillId, NOW(), NOW(), 'Redux', 'frontend'),
  (dotNetSkillId, NOW(), NOW(), '.NET', 'backend'),
  (restApiSkillId, NOW(), NOW(), 'REST APIs', 'api'),
  (cSharpSkillId, NOW(), NOW(), 'C#', 'backend'),
  (cPlusPlusSkillId, NOW(), NOW(), 'C++', 'backend'),
  (objectiveCSkillId, NOW(), NOW(), 'Objective-C', 'backend');

-- Link projects to skills
INSERT INTO "_ProjectToSkill" ("A", "B")
VALUES 
  -- Linking skills to Automated Story Generator
  (assetsGeneratorProjectId, reactSkillId),
  (assetsGeneratorProjectId, nextJsSkillId),
  (assetsGeneratorProjectId, prismaSkillId),
  (assetsGeneratorProjectId, nodeJsSkillId),
  (assetsGeneratorProjectId, postgresqlSkillId),
  (assetsGeneratorProjectId, aiSkillId),
  (assetsGeneratorProjectId, bullMqSkillId),
  (assetsGeneratorProjectId, redisSkillId),

  -- Linking skills to Content Monitoring Tool
  (contentMonitoringToolProjectId, reactSkillId),
  (contentMonitoringToolProjectId, typescriptSkillId),
  (contentMonitoringToolProjectId, scssSkillId),
  (contentMonitoringToolProjectId, prismaSkillId),
  (contentMonitoringToolProjectId, postgresqlSkillId),
  (contentMonitoringToolProjectId, bullMqSkillId),
  (contentMonitoringToolProjectId, redisSkillId),

  -- Linking skills to Keyword Generation Tool
  (nkKeywordGenerationProjectId, reactSkillId),
  (nkKeywordGenerationProjectId, nextJsSkillId),
  (nkKeywordGenerationProjectId, typescriptSkillId),
  (nkKeywordGenerationProjectId, prismaSkillId),
  (nkKeywordGenerationProjectId, postgresqlSkillId),
  (nkKeywordGenerationProjectId, googleAdsApiSkillId),
  (nkKeywordGenerationProjectId, bullMqSkillId),
  (nkKeywordGenerationProjectId, redisSkillId),


  -- Linking skills to Keyword Generation Tool
  (pkKeywordOptimizationToolProjectId, reactSkillId),
  (pkKeywordOptimizationToolProjectId, nextJsSkillId),
  (pkKeywordOptimizationToolProjectId, typescriptSkillId),
  (pkKeywordOptimizationToolProjectId, prismaSkillId),
  (pkKeywordOptimizationToolProjectId, postgresqlSkillId),
  (pkKeywordOptimizationToolProjectId, googleAdsApiSkillId),
  (pkKeywordOptimizationToolProjectId, bullMqSkillId),
  (pkKeywordOptimizationToolProjectId, redisSkillId),

  -- Linking skills to Performance Alerts System
  (performanceAlertsProjectId, reactSkillId),
  (performanceAlertsProjectId, nextJsSkillId),
  (performanceAlertsProjectId, typescriptSkillId),
  (performanceAlertsProjectId, prismaSkillId),
  (performanceAlertsProjectId, postgresqlSkillId),
  (performanceAlertsProjectId, bigQuerySkillId),
  (performanceAlertsProjectId, etlSkillId),


  (dynamicContentManagementProjectId, reactSkillId),
  (dynamicContentManagementProjectId, nextJsSkillId),
  (dynamicContentManagementProjectId, typescriptSkillId),
  (dynamicContentManagementProjectId, prismaSkillId),
  (dynamicContentManagementProjectId, postgresqlSkillId),
  (dynamicContentManagementProjectId, kafkaJsSkillId),
  (dynamicContentManagementProjectId, bullMqSkillId),
  (dynamicContentManagementProjectId, redisSkillId),

  (mediaAssetsReviewProjectId, reactSkillId),
  (mediaAssetsReviewProjectId, typescriptSkillId),
  (mediaAssetsReviewProjectId, nextJsSkillId),
  (mediaAssetsReviewProjectId, prismaSkillId),
  (mediaAssetsReviewProjectId, postgresqlSkillId),
  (mediaAssetsReviewProjectId, googleAdsApiSkillId),
  (mediaAssetsReviewProjectId, redisSkillId),

  -- Linking skills to Dynamic Content Management System

  -- JavaScript Minifier
  (javascriptMinifierProjectId, reactSkillId),
  (javascriptMinifierProjectId, typescriptSkillId),
  (javascriptMinifierProjectId, nextJsSkillId),
  (javascriptMinifierProjectId, scssSkillId),
  (javascriptMinifierProjectId, redisSkillId),

  -- CSS Minifier
  (cssMinifierProjectId, reactSkillId),
  (cssMinifierProjectId, typescriptSkillId),
  (cssMinifierProjectId, nextJsSkillId),
  (cssMinifierProjectId, scssSkillId),
  (cssMinifierProjectId, redisSkillId),

  -- HTML Minifier
  (htmlMinifierProjectId, reactSkillId),
  (htmlMinifierProjectId, typescriptSkillId),
  (htmlMinifierProjectId, nextJsSkillId),
  (htmlMinifierProjectId, scssSkillId),
  (htmlMinifierProjectId, redisSkillId),

  -- HTMLShell
  (htmlShellProjectId, reactSkillId),
  (htmlShellProjectId, typescriptSkillId),
  (htmlShellProjectId, nextJsSkillId),
  (htmlShellProjectId, scssSkillId),
  (htmlShellProjectId, redisSkillId),

  -- Keycode Tool
  (keycodeToolProjectId, reactSkillId),
  (keycodeToolProjectId, typescriptSkillId),
  (keycodeToolProjectId, nextJsSkillId),
  (keycodeToolProjectId, scssSkillId),
  (keycodeToolProjectId, redisSkillId),

  -- Hastebin
  (hastebinProjectId, reactSkillId),
  (hastebinProjectId, typescriptSkillId),
  (hastebinProjectId, nextJsSkillId),
  (hastebinProjectId, scssSkillId),
  (hastebinProjectId, redisSkillId),

    -- Linking Scopely Project
  (automationToolsProjectId, reactSkillId),
  (automationToolsProjectId, typescriptSkillId),
  (automationToolsProjectId, nodeJsSkillId),
  (automationToolsProjectId, redisSkillId),
  
  -- Linking Turkcell Projects
  (webChatProjectId, reactSkillId),
  (webChatProjectId, nodeJsSkillId),
  (webChatProjectId, websocketSkillId),
  (webChatProjectId, reduxSkillId),
  
  (chatGatewayProjectId, dotNetSkillId),
  (chatGatewayProjectId, restApiSkillId),
  (chatGatewayProjectId, websocketSkillId),

  -- Linking SESTEK Projects
  (textToSpeechProjectId, cSharpSkillId),
  (textToSpeechProjectId, cPlusPlusSkillId),
  (textToSpeechProjectId, objectiveCSkillId),
  
  (speechRecognitionProjectId, cSharpSkillId),
  (speechRecognitionProjectId, cPlusPlusSkillId),
  (speechRecognitionProjectId, objectiveCSkillId),

    -- Linking Marfeel Project
  (webProductMigrationProjectId, reactSkillId),
  (webProductMigrationProjectId, scssSkillId),
  (webProductMigrationProjectId, typescriptSkillId);
END $$;





  -- -- Linking skills to Media Assets Review Tool


-- -- Define variables for company and experience IDs
-- DO $$ 
-- DECLARE 
--   toptalCompanyId UUID := gen_random_uuid();
--   toptalExperienceId UUID := gen_random_uuid();
-- BEGIN

-- -- Delete all existing projects
-- DELETE FROM
--   "projects";

-- -- Delete all existing companies, education, and referrals
-- DELETE FROM
--   "companies";

-- DELETE FROM
--   "educations";

-- DELETE FROM
--   "referrals";

-- DELETE FROM
--   "experiences";

-- -- Add companies
-- INSERT INTO
--   "companies" (id, created_at, updated_at, name, link)
-- VALUES
--   (
--     'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1',
--     NOW(),
--     NOW(),
--     'Toptal',
--     'https://www.toptal.com'
--   ),
--   (
--     'a2f8c0e4-0e8d-4114-b3eb-89e6472823c2',
--     NOW(),
--     NOW(),
--     'Scopely',
--     'https://www.scopely.com'
--   ),
--   (
--     'b2f8c0e4-0e8d-4114-b3eb-89e6472823c3',
--     NOW(),
--     NOW(),
--     'Marfeel',
--     'https://www.marfeel.com'
--   ),
--   (
--     'c2f8c0e4-0e8d-4114-b3eb-89e6472823c4',
--     NOW(),
--     NOW(),
--     'Turkcell',
--     'https://turkcell.com'
--   ),
--   (
--     'd2f8c0e4-0e8d-4114-b3eb-89e6472823c5',
--     NOW(),
--     NOW(),
--     'SESTEK',
--     'https://www.sestek.com'
--   );

-- -- Insert experiences based on CV
-- INSERT INTO
--   "experiences" (
--     id,
--     created_at,
--     updated_at,
--     role,
--     started_at,
--     finished_at,
--     "companyId"
--   )
-- VALUES
--   -- Experience at Toptal
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Senior Fullstack Engineer',
--     '2021-10-01',
--     '2024-10-01',
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--       LIMIT
--         1
--     )
--   ), -- Experience at Scopely
--   (
--     gen_random_uuid(), NOW(),
--     NOW(),
--     'Senior Software Engineer',
--     '2020-10-01',
--     '2021-09-01',
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Scopely'
--     )
--   ),
--   -- Experience at Marfeel
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Senior Full Stack Developer',
--     '2019-10-01',
--     '2020-09-01',
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Marfeel'
--     )
--   ),
--   -- Experience at Turkcell
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Senior Software Engineer',
--     '2015-04-01',
--     '2019-10-01',
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Turkcell'
--     )
--   ),
--   -- Experience at SESTEK
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Software Engineer',
--     '2012-11-01',
--     '2015-04-01',
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'SESTEK'
--     )
--   );

-- -- Add educations
-- INSERT INTO
--   "educations" (
--     id,
--     created_at,
--     updated_at,
--     institution,
--     institution_link,
--     degree,
--     field_of_study,
--     started_at,
--     finished_at,
--     description
--   )
-- VALUES
--   (
--     'e1f8c0e4-0e8d-4114-b3eb-89e6472823c1',
--     NOW(),
--     NOW(),
--     'Boğaziçi University',
--     'https://bogazici.edu.tr/en_us',
--     'Master of Science',
--     'Software Engineering',
--     '2013-09-01',
--     '2016-06-01',
--     'Focused on software engineering principles, including software design, architecture, and development.'
--   ),
--   (
--     'e2f8c0e4-0e8d-4114-b3eb-89e6472823c2',
--     NOW(),
--     NOW(),
--     'Istanbul Technical University',
--     'https://www.itu.edu.tr/en',
--     'Bachelor of Science',
--     'Control and Computer Engineering',
--     '2007-09-01',
--     '2012-06-01',
--     'Specialized in computer engineering and control systems.'
--   );

-- -- Insert skills based on your experience
-- INSERT INTO
--   "skills" (
--     id,
--     created_at,
--     updated_at,
--     name,
--     experience_year,
--     type
--   )
-- VALUES
--   -- Frontend Development Skills
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'React',
--     '12',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Next.js',
--     '12',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'JavaScript',
--     '12',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'TypeScript',
--     '8',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Redux',
--     '10',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Redux Saga',
--     '10',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Context API',
--     '8',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Webpack',
--     '10',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'HTML/HTML5',
--     '12',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'CSS',
--     '12',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'React Native',
--     '4',
--     'Frontend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'TailwindCSS',
--     '2',
--     'Frontend'
--   ),
--   -- Backend Development Skills
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Node.js',
--     '10',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Express.js',
--     '10',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     '.NET Core',
--     '12',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'C#',
--     '12',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'PostgreSQL',
--     '8',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'MongoDB',
--     '10',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'MSSQL',
--     '12',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'REST APIs',
--     '12',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'SOAP',
--     '12',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Kafka.js',
--     '4',
--     'Backend'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Redis',
--     '6',
--     'Backend'
--   ),
--   -- DevOps Skills
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Docker',
--     '6',
--     'DevOps'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Kubernetes',
--     '4',
--     'DevOps'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'AWS Lambda',
--     '6',
--     'DevOps'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'AWS S3',
--     '6',
--     'DevOps'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'CI/CD',
--     '6',
--     'DevOps'
--   ),
--   -- Testing Skills
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Jest',
--     '8',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Mocha',
--     '2',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Prisma',
--     '2',
--     'SQL'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Cypress',
--     '2',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Playwright',
--     '2',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'React Testing Library',
--     '8',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Sinon',
--     '10',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Enzyme',
--     '6',
--     'Testing'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'NUnit',
--     '10',
--     'Testing'
--   ),
--   -- Other Skills
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Google Ads API',
--     '3',
--     'Other'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'BigQuery',
--     '3',
--     'Other'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'ETL',
--     '3',
--     'Other'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Spinnaker',
--     '4',
--     'Other'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Chart.js',
--     '4',
--     'Other'
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'D3.js',
--     '4',
--     'Other'
--   );

-- INSERT INTO
--   "projects" (
--     id,
--     created_at,
--     updated_at,
--     title,
--     description,
--     link,
--     role,
--     public,
--     "companyId",
--     "experienceId"
--   )
-- VALUES
--   -- Automated Story Generator
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Automated Story Generator',
--     'A tool designed to automate the generation of customized success stories by utilizing AI to process user input and generate personalized narratives. I was responsible for the full-stack development, handling both frontend (React, Next.js) and backend (Node.js, Prisma, PostgreSQL) components, along with implementing the queue system for processing requests using bullMQ and Redis.',
--     NULL,
--     'Senior Fullstack Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Content Monitoring Tool
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Content Monitoring Tool',
--     'A system for monitoring public content and generating alerts based on specific conditions. Integrated with a task management system to create tickets for any issues found. I was involved in full-stack development, ensuring proper data flow from the frontend to the backend while working with APIs for content analysis and task management.',
--     NULL,
--     'Senior Fullstack Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Keyword Generation Tool
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Keyword Generation Tool',
--     'A tool that automates the generation of negative keywords for advertising campaigns, improving SEO performance. I was responsible for full-stack development, creating a user-friendly frontend with React and integrating with Google Ads API to dynamically generate keywords and manage campaigns.',
--     NULL,
--     'Senior Fullstack Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Performance Alerts System
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Performance Alerts System',
--     'Developed an alert system to monitor performance metrics and generate notifications based on custom filters. Implemented a data pipeline to process data from BigQuery, ensuring accurate and timely alerts. My role involved full-stack development, focusing on both the frontend interface and backend data handling, using technologies like ETL and Google Cloud services.',
--     NULL,
--     'Senior Fullstack Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Keyword Optimization Tool
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Keyword Optimization Tool',
--     'A tool for automating the generation and optimization of positive keywords for advertising campaigns. I contributed to the frontend development, focusing on creating a responsive UI and integrating it with backend services that interact with the Google Ads API for seamless campaign management.',
--     NULL,
--     'Frontend Developer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Dynamic Content Management System
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Dynamic Content Management System',
--     'An automated system designed to manage and update dynamic content on various web pages. I was responsible for the full-stack development, including integrating with content APIs, creating a responsive frontend, and building the backend for processing content updates in real time using Kafka.js and Redis.',
--     NULL,
--     'Senior Full Stack Developer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Media Assets Review Tool
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Media Assets Review Tool',
--     'A tool for reviewing and managing media assets used in marketing campaigns. My role involved full-stack development, including building the frontend for asset review and management, as well as developing the backend integration with the advertising API and media storage.',
--     NULL,
--     'Senior Full Stack Developer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Public Tools: JavaScript Minifier, CSS Minifier, HTML Minifier, HTMLShell, Keycode Tool, and Hastebin
--   -- JavaScript Minifier
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'JavaScript Minifier',
--     'A public tool for minifying JavaScript code, used by developers to compress and optimize their scripts. I developed the frontend interface using React and Next.js, ensuring a simple and intuitive user experience.',
--     'https://www.toptal.com/developers/javascript-minifier',
--     'Senior Frontend Developer',
--     TRUE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- CSS Minifier
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'CSS Minifier',
--     'A public tool for minifying CSS code, helping developers compress and optimize stylesheets. I worked on the frontend using React and Next.js to ensure smooth functionality and user-friendly interaction.',
--     'https://www.toptal.com/developers/cssminifier',
--     'Senior Frontend Developer',
--     TRUE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- HTML Minifier
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'HTML Minifier',
--     'A public tool for minifying HTML code, used to compress HTML files for improved performance. I was responsible for building the frontend using React and Next.js.',
--     'https://www.toptal.com/developers/html-minifier',
--     'Senior Frontend Developer',
--     TRUE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- HTMLShell
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'HTMLShell',
--     'A public tool that generates HTML code snippets. I developed the frontend using React and Next.js, ensuring a user-friendly experience for developers needing to generate HTML quickly.',
--     'https://www.toptal.com/developers/htmlshell',
--     'Senior Frontend Developer',
--     TRUE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Keycode Tool
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Keycode Tool',
--     'A public tool for developers to test and find keycodes for keyboard events. I built the frontend using React and Next.js, providing an easy-to-use interface for testing keycodes.',
--     'https://www.toptal.com/developers/keycode',
--     'Senior Frontend Developer',
--     TRUE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   ),
--   -- Hastebin
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Hastebin',
--     'A public tool for sharing code snippets. I developed the frontend using React and Next.js, ensuring a seamless experience for users to share and view code snippets.',
--     'https://www.toptal.com/developers/hastebin',
--     'Senior Frontend Developer',
--     TRUE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Toptal'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Fullstack Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Toptal'
--         )
--     )
--   );

-- -- Insert projects and link them to experiences based on the role and company
-- INSERT INTO
--   "projects" (
--     id,
--     created_at,
--     updated_at,
--     title,
--     description,
--     link,
--     role,
--     public,
--     "companyId",
--     "experienceId"
--   )
-- VALUES
--   -- Scopely Projects (linked to Senior Software Engineer at Scopely)
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Automation Tools for Engineering Teams',
--     'Developed automation tools for engineering teams to streamline frontend and backend development processes.',
--     NULL,
--     'Senior Software Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Scopely'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Software Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Scopely'
--         )
--     )
--   ),
--   -- Marfeel Projects (linked to Senior Full Stack Developer at Marfeel)
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Web Product Migration to Modern Framework',
--     'Led the conversion of existing web products to a modern framework, improving performance and maintainability.',
--     NULL,
--     'Senior Full Stack Developer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Marfeel'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Full Stack Developer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Marfeel'
--         )
--     )
--   ),
--   -- Turkcell Projects (linked to Senior Software Engineer at Turkcell)
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'WebChat',
--     'Developed a real-time WebChat platform for Turkcell, supporting high traffic.',
--     NULL,
--     'Senior Software Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Turkcell'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Software Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Turkcell'
--         )
--     )
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Chat Gateway',
--     'Designed and implemented a multi-channel chat gateway for customer services chat platforms.',
--     NULL,
--     'Senior Software Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'Turkcell'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Senior Software Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'Turkcell'
--         )
--     )
--   ),
--   -- SESTEK Projects (linked to Software Engineer at SESTEK)
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Text-to-Speech Features',
--     'Developed key features for a text-to-speech system, integrating with multiple platforms.',
--     NULL,
--     'Software Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'SESTEK'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Software Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'SESTEK'
--         )
--     )
--   ),
--   (
--     gen_random_uuid(),
--     NOW(),
--     NOW(),
--     'Speech Recognition Features',
--     'Worked on developing speech recognition features aimed at enhancing customer interactions.',
--     NULL,
--     'Software Engineer',
--     FALSE,
--     (
--       SELECT
--         id
--       FROM
--         "companies"
--       WHERE
--         name = 'SESTEK'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "experiences"
--       WHERE
--         role = 'Software Engineer'
--         AND "companyId" = (
--           SELECT
--             id
--           FROM
--             "companies"
--           WHERE
--             name = 'SESTEK'
--         )
--     )
--   );

-- -- Linking skills to projects (many-to-many relationships)
-- -- Example for linking React to Automated Story Generator
-- INSERT INTO
--   "_ProjectToSkill" ("A", "B")
-- VALUES
--   (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Automated Story Generator'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'React'
--       LIMIT
--         1
--     )
--   ), (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Automated Story Generator'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'Next.js'
--       LIMIT
--         1
--     )
--   ), (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Automated Story Generator'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'JavaScript'
--       LIMIT
--         1
--     )
--   ), (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Automated Story Generator'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'TailwindCSS'
--       LIMIT
--         1
--     )
--   ), -- Linking skills to Content Monitoring Tool
--   (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Content Monitoring Tool'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'React'
--       LIMIT
--         1
--     )
--   ), (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Content Monitoring Tool'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'TypeScript'
--       LIMIT
--         1
--     )
--   ), (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Content Monitoring Tool'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'Prisma'
--       LIMIT
--         1
--     )
--   ), (
--     (
--       SELECT
--         id
--       FROM
--         "projects"
--       WHERE
--         title = 'Content Monitoring Tool'
--       LIMIT
--         1
--     ), (
--       SELECT
--         id
--       FROM
--         "skills"
--       WHERE
--         name = 'PostgreSQL'
--       LIMIT
--         1
--     )
--   );

