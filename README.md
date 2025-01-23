# Kadince Todo List App

This project is a Todo List application designed to help users manage their tasks efficiently.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Usage](#usage)

## Features

- **User Authentication and Authorization**: Secure user login and registration using NextAuth.js.
- **Task Management**: Create, view, edit, delete and sort tasks with ease.
- **Responsive Design**: The application is fully responsive and accessible, ensuring a seamless experience on both desktop and mobile devices, thanks to shadcn/ui and Tailwind CSS.
- **Real-time Updates**: Real-time task updates using tRPC and React Query, ensuring that all users see the latest changes instantly.
- **Database Management**: Efficient database operations using Drizzle ORM, with support for migrations and schema management.
- **User-friendly Interface**: Intuitive and clean user interface designed to enhance productivity.

## Tech Stack

This project uses cutting-edge technologies:

- **[Next.js](https://nextjs.org)**: A React framework for building server-side rendered applications. Chosen for its performance, scalability, and ease of use.
- **[NextAuth.js](https://next-auth.js.org)**: Authentication for Next.js applications. Simplifies the implementation of secure user authentication and authorization.
- **[shadcn/ui](https://ui.shadcn.com/)**: Beautifully designed components that you can copy and paste.
- **[tRPC](https://trpc.io)**: End-to-end typesafe APIs made easy. Facilitates real-time communication and data synchronization.
- **[Drizzle](https://orm.drizzle.team)**: A lightweight ORM for TypeScript. Ensures efficient database operations with minimal overhead.
- **[React Query](https://react-query.tanstack.com)**: Data-fetching library for React. Used for managing server state and caching.
- **[Tailwind CSS](https://tailwindcss.com)**: A utility-first CSS framework for rapid UI development. Enables rapid and consistent styling across the application.
- **[TypeScript](https://www.typescriptlang.org)**: A strongly typed programming language that builds on JavaScript. Ensures type safety and improves code quality.

### Why These Technologies?

- **Next.js**: Provides a robust framework for building scalable and performant web applications.
- **NextAuth.js**: Simplifies the implementation of authentication and authorization.
- **shadcn/ui**: Provides a set of accessible, reusable and customizable UI components, enhancing the development speed and consistency of the user interface.
- **Drizzle**: Ensures efficient database operations with minimal overhead.
- **tRPC**: Facilitates real-time communication and data synchronization.
- **React Query**: Efficiently manages server state and caching, improving the performance and user experience.
- **Tailwind CSS**: Enables rapid and consistent styling across the application.
- **TypeScript**: Enhances code quality and maintainability with static typing.

## Project Setup

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/kadince-todo-list-app.git
   cd kadince-todo-list-app
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Set up environment variables:**

   ```sh
   cp .env.example .env
   ```

4. **Push database schema:**

   ```sh
   pnpm db:push
   ```

5. **Start the development server:**

   ```sh
   pnpm dev
   ```

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`. Here are some useful tips for using the application:

- **Authentication**: Sign up or log in to start managing your tasks.
- **Task Management**: Create, edit, and delete tasks. You can also categorize and prioritize tasks.
- **Real-time Updates**: Any changes you make will be reflected in real-time across all connected clients.
