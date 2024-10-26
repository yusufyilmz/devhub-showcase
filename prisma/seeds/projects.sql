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

css3MakerProjectId UUID := gen_random_uuid();

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
INSERT INTO
  "companies" (id, created_at, updated_at, name, link)
VALUES
  (
    toptalCompanyId,
    NOW(),
    NOW(),
    'Toptal',
    'https://www.toptal.com'
  ),
  (
    scopelyCompanyId,
    NOW(),
    NOW(),
    'Scopely',
    'https://www.scopely.com'
  ),
  (
    marfeelCompanyId,
    NOW(),
    NOW(),
    'Marfeel',
    'https://www.marfeel.com'
  ),
  (
    turkcellCompanyId,
    NOW(),
    NOW(),
    'Turkcell',
    'https://turkcell.com'
  ),
  (
    sestekCompanyId,
    NOW(),
    NOW(),
    'SESTEK',
    'https://www.sestek.com'
  );

-- Insert experiences
INSERT INTO
  "experiences" (
    id,
    created_at,
    updated_at,
    role,
    started_at,
    finished_at,
    "companyId",
    "description"
  )
VALUES
  (
    toptalExperienceId,
    NOW(),
    NOW(),
    'Senior Fullstack Engineer',
    '2021-10-01',
    '2024-10-01',
    toptalCompanyId,
    'Developed the Assets Generator using Next.js to automate interviews and create success stories via AI, generating personalized success stories with an interface for modifying, fixing, and publishing stories.\n
  Created 8 tools for automating  Google Ads management, including positive/negative keyword generation, asset reviews, and dynamic content management from scratch by getting parts in all phases, Planning, Design, Development, Testing, Deployment.
  Migrated around 10 legacy websites (e.g., JavaScript Minifier, Html shell, Hastebin, css3maker) to Next.js, improving performance and responsiveness and design.
  Created centralized Slack service for handling Slack messages across multiple applications. This system streamlined communication processes by managing message requests in one place, improving efficiency and reducing complexity for users interacting with multiple platforms
  Created an ETL composer to save BigQuery Google ads data into usable data for the SEM alerts system.'
  ),
  (
    scopelyExperienceId,
    NOW(),
    NOW(),
    'Senior Software Engineer',
    '2020-10-01',
    '2021-09-01',
    scopelyCompanyId,
    'Development for frontend and backend for Web automatıon tool that is used by game engıneers to create mobıle devıce tests on amazon devıce farm and see results and reports according to these tests.
Development for Unity part of the project.
Converted the tool to micro frontend architecture.'
  ),
  (
    marfeelExperienceId,
    NOW(),
    NOW(),
    'Senior Full Stack Developer',
    '2019-10-01',
    '2020-09-01',
    marfeelCompanyId,
    'Converted existing web products to React and created CLI tools for media providers.
Developed automatic, generated Playgrounds for providers.
Implemented Server-Side Rendering (SSR) for React components.'
  ),
  (
    turkcellExperienceId,
    NOW(),
    NOW(),
    'Senior Software Engineer',
    '2015-04-01',
    '2019-10-01',
    turkcellCompanyId,
    'Led the development of WebChat, Chat Gateway, Bot Info, Integration service, Chat and Phonex Configuration Manager, Transaction Manager, Opera, Phonex, IWS and other customer service tools for Turkcell, handling over 600,000 daily interactions.
Converted WebChat to React and Redux within two weeks, significantly improving scalability.
Designed and implemented a multichannel chat gateway, integrating over 20 clients into a unified architecture.
Mentoring Junior team members
Teaching and leading for chat platform to team members and infrastructure teams. '
  ),
  (
    sestekExperienceId,
    NOW(),
    NOW(),
    'Software Engineer',
    '2012-11-01',
    '2015-04-01',
    sestekCompanyId,
    'Developed core components for text-to-speech (TTS) and speech recognition (SR) systems.
Designed and implemented web services using C++, C#, WCF, and built mobile applications with Swift and Objective-C.'
  );

-- Insert educations
INSERT INTO
  "educations" (
    id,
    created_at,
    updated_at,
    institution,
    institution_link,
    degree,
    field_of_study,
    started_at,
    finished_at,
    description
  )
VALUES
  (
    bogaziciEducationId,
    NOW(),
    NOW(),
    'Boğaziçi University',
    'https://bogazici.edu.tr/en_us',
    'Master of Science',
    'Software Engineering',
    '2013-09-01',
    '2016-06-01',
    'Focused on software engineering principles, including software design, architecture, and development.'
  ),
  (
    ituEducationId,
    NOW(),
    NOW(),
    'Istanbul Technical University',
    'https://www.itu.edu.tr/en',
    'Bachelor of Science',
    'Control and Computer Engineering',
    '2007-09-01',
    '2012-06-01',
    'Specialized in computer engineering and control systems.'
  );

-- Insert projects and link them with experiences
INSERT INTO
  "projects" (
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
  (
    assetsGeneratorProjectId,
    NOW(),
    NOW(),
    'Automated Story Generator',
    'A tool designed to automate the generation of customized success stories by utilizing AI to process user input and generate personalized narratives. I was responsible for the full-stack development, handling both frontend (React, Next.js) and backend (Node.js, Prisma, PostgreSQL) components, along with implementing the queue system for processing requests using bullMQ and Redis.',
    NULL,
    'Senior Fullstack Engineer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Content Monitoring Tool
  (
    contentMonitoringToolProjectId,
    NOW(),
    NOW(),
    'Content Monitoring Tool',
    'A system for monitoring public content and generating alerts based on specific conditions. Integrated with a task management system to create tickets for any issues found. I was involved in full-stack development, ensuring proper data flow from the frontend to the backend while working with APIs for content analysis and task management.',
    NULL,
    'Senior Fullstack Engineer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Keyword Generation Tool
  (
    nkKeywordGenerationProjectId,
    NOW(),
    NOW(),
    'Negative Keyword Generation Tool',
    'A tool that automates the generation of negative keywords for advertising campaigns, improving SEO performance. I was responsible for full-stack development, creating a user-friendly frontend with React and integrating with Google Ads API to dynamically generate keywords and manage campaigns.',
    NULL,
    'Senior Fullstack Engineer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Performance Alerts System
  (
    performanceAlertsProjectId,
    NOW(),
    NOW(),
    'Performance Alerts System',
    'An automated system designed to manage and update dynamic content on various web pages. I was responsible for the full-stack development, including integrating with content APIs, creating a responsive frontend, and building the backend for processing content updates in real time using Kafka.js and Redis.',
    NULL,
    'Senior Fullstack Engineer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Keyword Optimization Tool
  (
    pkKeywordOptimizationToolProjectId,
    NOW(),
    NOW(),
    'Positive Keyword Optimization Tool',
    'A tool for automating the generation and optimization of positive keywords for advertising campaigns. I contributed to the frontend development, focusing on creating a responsive UI and integrating it with backend services that interact with the Google Ads API for seamless campaign management.',
    NULL,
    'Frontend Developer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Dynamic Content Management System
  (
    dynamicContentManagementProjectId,
    NOW(),
    NOW(),
    'Dynamic Content Management System',
    'An automated system designed to manage and update dynamic content on various web pages. I was responsible for the full-stack development, including integrating with content APIs, creating a responsive frontend, and building the backend for processing content updates in real time using Kafka.js and Redis.',
    NULL,
    'Senior Fullstack Engineer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Media Assets Review Tool
  (
    mediaAssetsReviewProjectId,
    NOW(),
    NOW(),
    'Media Assets Review Tool',
    'A tool for reviewing and managing media assets used in marketing campaigns. My role involved full-stack development, including building the frontend for asset review and management, as well as developing the backend integration with the advertising API and media storage.',
    NULL,
    'Senior Fullstack Engineer',
    FALSE,
    toptalCompanyId,
    toptalExperienceId
  ),
    -- Css3 Maker
  (
    css3MakerProjectId,
    NOW(),
    NOW(),
    'CSS3 Maker',
    'A public tool designed to simplify the creation of CSS3 styles, providing a range of customizations and previews for web developers. With CSS3 Maker, users can generate CSS code for various effects, such as gradients, transforms, transitions, and animations, helping streamline development workflows and enhance styling options with minimal effort.',
    'https://www.toptal.com/developers/css3maker',
    'Senior Frontend Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- JavaScript Minifier
  (
    javascriptMinifierProjectId,
    NOW(),
    NOW(),
    'JavaScript Minifier',
    'A public tool for minifying JavaScript code, used by developers to compress and optimize their scripts. I developed the frontend interface using React and Next.js, ensuring a simple and intuitive user experience.',
    'https://www.toptal.com/developers/javascript-minifier',
    'Senior Frontend Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),

  -- HTMLShell
  (
    htmlShellProjectId,
    NOW(),
    NOW(),
    'HTMLShell',
    'A public tool that generates HTML code snippets. I developed the frontend using React and Next.js, ensuring a user-friendly experience for developers needing to generate HTML quickly.',
    'https://www.toptal.com/developers/htmlshell',
    'Senior Frontend Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Keycode Tool
  (
    keycodeToolProjectId,
    NOW(),
    NOW(),
    'Keycode Tool',
    'A public tool for developers to test and find keycodes for keyboard events. I built the frontend using React and Next.js, providing an easy-to-use interface for testing keycodes.',
    'https://www.toptal.com/developers/keycode/a',
    'Senior Frontend Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Hastebin
  (
    hastebinProjectId,
    NOW(),
    NOW(),
    'Hastebin',
    'A public tool for sharing code snippets. I contributed to the full-stack development, focusing on building a responsive frontend with React and Next.js and ensuring proper backend integration for storing and retrieving code snippets.',
    'https://hastebin.com/share/donicodecu.bash',
    'Senior Full Stack Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),
    -- CSS Minifier
  (
    cssMinifierProjectId,
    NOW(),
    NOW(),
    'CSS Minifier',
    'A public tool for minifying CSS code, helping developers compress and optimize stylesheets. I worked on the frontend using React and Next.js to ensure smooth functionality and user-friendly interaction.',
    'https://www.toptal.com/developers/cssminifier',
    'Senior Frontend Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- HTML Minifier
  (
    htmlMinifierProjectId,
    NOW(),
    NOW(),
    'HTML Minifier',
    'A public tool for minifying HTML code, used to compress HTML files for improved performance. I was responsible for building the frontend using React and Next.js.',
    'https://www.toptal.com/developers/html-minifier',
    'Senior Frontend Developer',
    TRUE,
    toptalCompanyId,
    toptalExperienceId
  ),
  -- Scopely Projects
  (
    automationToolsProjectId,
    NOW(),
    NOW(),
    'Automation Tools for Engineering Teams',
    'Developed automation tools for engineering teams to streamline frontend and backend development processes.',
    NULL,
    'Senior Software Engineer',
    FALSE,
    scopelyCompanyId,
    scopelyExperienceId
  ),
  -- Marfeel Projects
  (
    webProductMigrationProjectId,
    NOW(),
    NOW(),
    'Web Product Migration to Modern Framework',
    'Led the conversion of existing web products to a modern framework, improving performance and maintainability.',
    NULL,
    'Senior Full Stack Developer',
    FALSE,
    marfeelCompanyId,
    marfeelExperienceId
  ),
  -- Turkcell Projects
  (
    webChatProjectId,
    NOW(),
    NOW(),
    'WebChat',
    'Developed a real-time WebChat platform for Turkcell for customers to talk customer service, supporting high traffic.',
    NULL,
    'Senior Software Engineer',
    FALSE,
    turkcellCompanyId,
    turkcellExperienceId
  ),
  (
    chatGatewayProjectId,
    NOW(),
    NOW(),
    'Chat Gateway',
    'Designed and implemented a multi-channel chat gateway for customer services chat platforms.',
    NULL,
    'Senior Software Engineer',
    FALSE,
    turkcellCompanyId,
    turkcellExperienceId
  ),
  -- SESTEK Projects
  (
    textToSpeechProjectId,
    NOW(),
    NOW(),
    'Text-to-Speech Features',
    'Developed key features for a text-to-speech system, integrating with multiple platforms.',
    NULL,
    'Software Engineer',
    FALSE,
    sestekCompanyId,
    sestekExperienceId
  ),
  (
    speechRecognitionProjectId,
    NOW(),
    NOW(),
    'Speech Recognition Features',
    'Worked on developing speech recognition features aimed at enhancing customer interactions.',
    NULL,
    'Software Engineer',
    FALSE,
    sestekCompanyId,
    sestekExperienceId
  );

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
  );

-- Insert skills
INSERT INTO
  "skills" (id, created_at, updated_at, name, type)
VALUES
  (reactSkillId, NOW(), NOW(), 'React', 'frontend'),
  (
    nextJsSkillId,
    NOW(),
    NOW(),
    'Next.js',
    'frontend'
  ),
  (prismaSkillId, NOW(), NOW(), 'Prisma', 'backend'),
  (
    nodeJsSkillId,
    NOW(),
    NOW(),
    'Node.js',
    'backend'
  ),
  (
    typescriptSkillId,
    NOW(),
    NOW(),
    'TypeScript',
    'frontend'
  ),
  (scssSkillId, NOW(), NOW(), 'SCSS', 'frontend'),
  (
    postgresqlSkillId,
    NOW(),
    NOW(),
    'PostgreSQL',
    'database'
  ),
  (aiSkillId, NOW(), NOW(), 'AI', 'backend'),
  (bullMqSkillId, NOW(), NOW(), 'bullMQ', 'backend'),
  (redisSkillId, NOW(), NOW(), 'Redis', 'backend'),
  (
    googleAdsApiSkillId,
    NOW(),
    NOW(),
    'Google Ads API',
    'api'
  ),
  (
    kafkaJsSkillId,
    NOW(),
    NOW(),
    'Kafka.js',
    'backend'
  ),
  (
    bigQuerySkillId,
    NOW(),
    NOW(),
    'BigQuery',
    'data'
  ),
  (etlSkillId, NOW(), NOW(), 'ETL', 'data pipeline'),
  (
    websocketSkillId,
    NOW(),
    NOW(),
    'WebSockets',
    'backend'
  ),
  (reduxSkillId, NOW(), NOW(), 'Redux', 'frontend'),
  (dotNetSkillId, NOW(), NOW(), '.NET', 'backend'),
  (restApiSkillId, NOW(), NOW(), 'REST APIs', 'api'),
  (cSharpSkillId, NOW(), NOW(), 'C#', 'backend'),
  (cPlusPlusSkillId, NOW(), NOW(), 'C++', 'backend'),
  (
    objectiveCSkillId,
    NOW(),
    NOW(),
    'Objective-C',
    'backend'
  );

-- Link projects to skills
INSERT INTO
  "_ProjectToSkill" ("A", "B")
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
  (
    contentMonitoringToolProjectId,
    typescriptSkillId
  ),
  (contentMonitoringToolProjectId, scssSkillId),
  (contentMonitoringToolProjectId, prismaSkillId),
  (
    contentMonitoringToolProjectId,
    postgresqlSkillId
  ),
  (contentMonitoringToolProjectId, bullMqSkillId),
  (contentMonitoringToolProjectId, redisSkillId),
  -- Linking skills to Keyword Generation Tool
  (nkKeywordGenerationProjectId, reactSkillId),
  (nkKeywordGenerationProjectId, nextJsSkillId),
  (nkKeywordGenerationProjectId, typescriptSkillId),
  (nkKeywordGenerationProjectId, prismaSkillId),
  (nkKeywordGenerationProjectId, postgresqlSkillId),
  (
    nkKeywordGenerationProjectId,
    googleAdsApiSkillId
  ),
  (nkKeywordGenerationProjectId, bullMqSkillId),
  (nkKeywordGenerationProjectId, redisSkillId),
  -- Linking skills to Keyword Generation Tool
  (pkKeywordOptimizationToolProjectId, reactSkillId),
  (
    pkKeywordOptimizationToolProjectId,
    nextJsSkillId
  ),
  (
    pkKeywordOptimizationToolProjectId,
    typescriptSkillId
  ),
  (
    pkKeywordOptimizationToolProjectId,
    prismaSkillId
  ),
  (
    pkKeywordOptimizationToolProjectId,
    postgresqlSkillId
  ),
  (
    pkKeywordOptimizationToolProjectId,
    googleAdsApiSkillId
  ),
  (
    pkKeywordOptimizationToolProjectId,
    bullMqSkillId
  ),
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
  (
    dynamicContentManagementProjectId,
    typescriptSkillId
  ),
  (dynamicContentManagementProjectId, prismaSkillId),
  (
    dynamicContentManagementProjectId,
    postgresqlSkillId
  ),
  (
    dynamicContentManagementProjectId,
    kafkaJsSkillId
  ),
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
    -- css3 maker
  (css3MakerProjectId, reactSkillId),
  (css3MakerProjectId, typescriptSkillId),
  (css3MakerProjectId, nextJsSkillId),
  (css3MakerProjectId, scssSkillId),
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
