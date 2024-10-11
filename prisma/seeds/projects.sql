DELETE FROM "portfolio"."projects";

INSERT INTO "portfolio"."projects" 
  (id, title, description, link, role, skills, "created_at", "updated_at") 
VALUES
  (
    'c2f50d08-626f-4779-9d49-cfcc077150c7',
    'JavaScript Minifier', 
    'The JavaScript Minifier tool helps developers optimize their code by removing unnecessary characters such as whitespace, line breaks, and comments, while preserving the code’s functionality. This results in faster load times and improved performance for web applications. I was responsible for designing and implementing both the frontend and backend. I built the minification engine using Node.js and Express, ensuring it could efficiently process large JavaScript files. The frontend was designed to be user-friendly, with drag-and-drop functionality and instant download of the minified file.', 
    'https://javascript-minifier.com', 
    'Fullstack Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),

  (
    '9cad6776-3c3a-4724-b742-7aad79797efb',
    'CSS Minifier', 
    'The CSS Minifier tool simplifies and optimizes CSS files by removing unnecessary characters and reducing file size without impacting the functionality or styling of the web pages. This tool is essential for improving website load times, especially on slower networks. As the frontend developer, I designed an intuitive interface that allows users to upload their CSS files, minify them, and download the results instantly. The project uses Sass to ensure maintainability and scalability of the CSS code, allowing future developers to easily extend its functionality.', 
    'https://cssminifier.com', 
    'Frontend Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),

  (
    'b670cc32-00ed-41a9-9966-fa272e731d0c',
    'Hastebin', 
    'Hastebin is a web application designed for sharing code snippets and textual information easily and securely. It allows users to paste their code and share a unique link with others, making it perfect for quick debugging or collaboration. I implemented the backend using Node.js and MongoDB to ensure fast and reliable storage and retrieval of snippets. The service includes functionality for self-destructing snippets after a certain time and public/private sharing options. I optimized MongoDB queries to handle a high volume of requests while ensuring low latency for the users.', 
    'https://hastebin.com', 
    'Backend Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),

  (
    'fe08d102-909c-4028-bf21-53d2913f227f',
    'HTML Shell', 
    'HTML Shell provides a basic HTML boilerplate template for developers to kickstart their projects. The tool offers customizable options such as including meta tags, favicons, or external libraries like jQuery or Bootstrap. My role in the project involved designing the template to ensure it followed best practices for SEO, accessibility, and performance. I implemented features like real-time code previews and the ability to download custom-tailored HTML files based on user preferences. This tool significantly reduces the setup time for developers starting new web projects.', 
    'https://htmlshell.com', 
    'Frontend Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  ),

  (
    'fe08d102-909c-0028-bf21-53d2998f227f',
    'Keycode Tool', 
    'The Keycode Tool helps developers quickly look up JavaScript key codes for various keyboard events. This tool is especially useful when debugging or building custom keyboard shortcuts for web applications. The interface allows users to press any key on their keyboard and instantly see its corresponding keycode, character, and event information. As the fullstack developer, I built the frontend using HTML and CSS for a clean and intuitive interface. The backend logic was implemented in JavaScript, leveraging the DOM to capture keyboard events in real-time. Additionally, I optimized the tool to provide results instantly without any page reloads, ensuring a smooth user experience.', 
    'https://keycode.info', 
    'Fullstack Developer', 
    ARRAY['React', 'Typescript', 'Next.js', 'JavaScript', 'HTML', 'CSS'], 
    NOW(), 
    NOW()
  );
  