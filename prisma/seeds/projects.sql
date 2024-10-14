-- Delete all existing projects
DELETE FROM "projects";

-- Delete all existing companies and education
DELETE FROM "companies";
DELETE FROM "educations";

-- Add companies
INSERT INTO "companies" (id, name, url, role, started_at, finished_at) VALUES 
('d1f8c0e4-0e8d-4114-b3eb-89e6472823c1', 'Toptal', 'https://www.toptal.com', 'Senior Fullstack Engineer', '2021-10-01', '2024-10-01'),
('a2f8c0e4-0e8d-4114-b3eb-89e6472823c2', 'Scopely', 'https://www.scopely.com', 'Senior Software Engineer', '2020-10-01', '2021-09-01'),
('b2f8c0e4-0e8d-4114-b3eb-89e6472823c3', 'Marfeel', 'https://www.marfeel.com', 'Senior Full Stack Developer', '2019-10-01', '2020-09-01'),
('c2f8c0e4-0e8d-4114-b3eb-89e6472823c4', 'Turkcell Global Bilgi', 'https://globalbilgi.com', 'Senior Software Engineer', '2015-04-01', '2019-10-01'),
('d2f8c0e4-0e8d-4114-b3eb-89e6472823c5', 'SESTEK', 'https://www.sestek.com', 'Software Engineer', '2012-11-01', '2015-04-01');

-- Add education
-- Add education entries with explicit createdAt and updatedAt values
INSERT INTO "educations" (id, created_at, updated_at, institution, degree, field_of_study, started_at, finished_at, description, institution_link) 
VALUES 
('e1f8c0e4-0e8d-4114-b3eb-89e6472823c1', NOW(), NOW(), 'Boğaziçi University', 'Master of Science', 'Software Engineering', '2013-09-01', '2016-06-01', 'Focused on software engineering principles, including software design, architecture, and development.', 'https://bogazici.edu.tr/en_us'),
('e2f8c0e4-0e8d-4114-b3eb-89e6472823c2', NOW(), NOW(), 'Istanbul Technical University', 'Bachelor of Science', 'Control and Computer Engineering', '2007-09-01', '2012-06-01', 'Specialized in computer engineering and control systems.', 'https://www.itu.edu.tr/en');
-- Add projects and associate them with Toptal (companyId: 'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1')
INSERT INTO "projects" 
  (id, title, description, link, role, skills, "created_at", "updated_at", "companyId", "public") 
VALUES
  ('c2f50d08-626f-4779-9d49-cfcc077150c7', 'JavaScript Minifier', 'The JavaScript Minifier tool helps developers optimize their code...', 'https://javascript-minifier.com', 'Fullstack Developer', ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], NOW(), NOW(), 'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1', true),
  
  ('9cad6776-3c3a-4724-b742-7aad79797efb', 'CSS Minifier', 'The CSS Minifier tool optimizes CSS files by removing unnecessary characters...', 'https://cssminifier.com', 'Frontend Developer', ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], NOW(), NOW(), 'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1', true),
  
  ('b670cc32-00ed-41a9-9966-fa272e731d0c', 'Hastebin', 'Hastebin allows users to share code snippets quickly...', 'https://hastebin.com', 'Backend Developer', ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], NOW(), NOW(), 'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1', true),
  
  ('fe08d102-909c-4028-bf21-53d2913f227f', 'HTML Shell', 'HTML Shell provides a customizable HTML boilerplate...', 'https://htmlshell.com', 'Frontend Developer', ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], NOW(), NOW(), 'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1', true),
  
  ('fe08d102-909c-0028-bf21-53d2998f227f', 'Keycode Tool', 'The Keycode Tool allows developers to quickly identify JavaScript key codes...', 'https://keycode.info', 'Fullstack Developer', ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], NOW(), NOW(), 'd1f8c0e4-0e8d-4114-b3eb-89e6472823c1', true);