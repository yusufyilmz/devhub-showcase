DELETE FROM "devhub"."projects";

INSERT INTO "devhub"."projects" 
  (id, title, description, link, role, skills, "created_at", "updated_at") 
VALUES
  (
    'c2f50d08-626f-4779-9d49-cfcc077150c7',
    'JavaScript Minifier', 
    'The JavaScript Minifier tool helps developers optimize their code by removing unnecessary characters such as whitespace, line breaks, and comments, while preserving the code’s functionality. I played a key role in migrating the application from vanilla JavaScript to Next.js, enhancing its performance and scalability. The minification engine was built using Node.js and Express, and the frontend was revamped for a smoother user experience.', 
    'https://javascript-minifier.com', 
    'Fullstack Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),
  
  (
    '9cad6776-3c3a-4724-b742-7aad79797efb',
    'CSS Minifier', 
    'The CSS Minifier tool optimizes CSS files by removing unnecessary characters, improving load times. I led the migration from vanilla JavaScript to Next.js, modernizing the frontend interface and making the tool more responsive and user-friendly.', 
    'https://cssminifier.com', 
    'Frontend Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),
  
  (
    'b670cc32-00ed-41a9-9966-fa272e731d0c',
    'Hastebin', 
    'Hastebin allows users to share code snippets quickly. I migrated the application from vanilla JavaScript to Next.js, optimizing the backend and frontend performance while adding features like self-destructing snippets and public/private sharing.', 
    'https://hastebin.com', 
    'Backend Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),
  
  (
    'fe08d102-909c-4028-bf21-53d2913f227f',
    'HTML Shell', 
    'HTML Shell provides a customizable HTML boilerplate template for developers. I led the migration from vanilla JavaScript to Next.js, incorporating real-time code previews and improving the project setup experience for developers.', 
    'https://htmlshell.com', 
    'Frontend Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),
  
  (
    'fe08d102-909c-0028-bf21-53d2998f227f',
    'Keycode Tool', 
    'The Keycode Tool allows developers to quickly identify JavaScript key codes. I migrated the tool from vanilla JavaScript to Next.js, optimizing performance and improving the user interface for better usability and instant feedback.', 
    'https://keycode.info', 
    'Fullstack Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  );
  