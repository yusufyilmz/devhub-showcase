Here’s the full detailed README file in the string format you requested:

# DevHub Showcase

This is a portfolio application designed to showcase public projects, professional experience, and an interactive AI chat feature for users to learn more about the developer. The app is built using `Next.js`, `React`, `Typescript`, `Prisma`, `PostgreSQL`, and `Tailwind CSS`.

## Features

- **Portfolio Showcase**: A section displaying public projects the developer has worked on.
- **Interactive AI Chat**: Uses OpenAI’s API to allow users to ask questions and learn more about the developer's experiences and skills.
- **CV Page**: Displays the developer's professional resume, highlighting their education, experience, and skills.
- **Dark/Light Theme Toggle**: Allows users to switch between themes.
- **Responsive Design**: Fully responsive and optimized for all devices.

## Tech Stack

- `Next.js`: For server-side rendering and optimized routing.
- `React`: Frontend framework for building user interfaces.
- `Typescript`: Strongly typed language ensuring safer and more reliable code.
- `Prisma`: ORM used to interact with the PostgreSQL database.
- `PostgreSQL`: Database used for storing project information, user data, and more.
- `Tailwind CSS`: Utility-first CSS framework for fast styling.
- `Vercel`: Hosting and deployment platform for serverless functions and static sites.

## Project Structure

The project is set up as a **monorepo** using `Turborepo` to manage the different packages:

- `/app`: Contains the frontend application using `Next.js` and `React`.
- `/packages/lib`: Shared utilities, constants, and types.
- `/packages/ui`: Shared UI components and theming.

## AI Chat Feature

The AI chat is built using a combination of NLP (Natural Language Processing) and OpenAI’s API. The process works as follows:

1. **Classification using NLP**: User input is first classified using the `compromise` NLP library. The classification determines the intent of the message (e.g., greeting, question about skills, unrelated message, etc.).
   
2. **Response Logic**:
   - For certain categories like greetings or unrelated queries, predefined responses are triggered automatically.
   - For more complex questions (e.g., about work experience or skills), the query is sent to the OpenAI API with relevant context about my CV or projects.

3. **Dynamic Responses**: Depending on the classification, either a predefined message is shown, or the response is dynamically generated from OpenAI’s model based on the category of the question.

This system ensures efficient responses for both casual interactions and more detailed inquiries about my professional background.


## Getting Started

To get started with the project, follow these steps:

### Prerequisites

Ensure that you have the following installed:

- `Node.js` (v16 or later)
- `Yarn` package manager
- `PostgreSQL` (local or cloud database)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yusufyilmz/devhub-showcase.git
    ```

2. Navigate into the project directory:

    ```bash
    cd devhub-showcase
    ```

3. Install dependencies using `yarn`:

    ```bash
    yarn install
    ```

4. Set up the database by running the Prisma migration:

    ```bash
    yarn prisma migrate dev
    ```

### Development

To run the application in development mode:

```bash
yarn dev

This will start the Next.js development server, and you can access the application at http://localhost:3000.

### Build

To create a production build of the application:

yarn build

Environment Variables

The project requires the following environment variables to be configured in a .env file:

```
DATABASE_URL=your_postgresql_database_url
OPENAI_API_KEY=your_openai_api_key
```

### Deployment

This project is deployed using Vercel. To deploy:

	1.	Connect the repository to Vercel.
	2.	Set the necessary environment variables in Vercel’s dashboard.
	3.	Push changes to the main branch, and Vercel will automatically deploy the latest version.

### Contributions

Feel free to submit pull requests or create issues for any bugs or suggestions!

### License

This project is licensed under the MIT License.

You can copy and paste this into your project's `README.md`. It includes explanations of the tech stack, features, project setup, and instructions for running the project locally or in production. Let me know if you'd like any changes!
