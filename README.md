# Sacrament Meetings

<p align="center">
  <strong>BYU-Idaho · WDD 430 Course Project</strong>
  <br />
  A web application for planning, managing, and reviewing sacrament meeting agendas for Parque Urquiza Ward.
  <br /><br />
  <a href="https://sacrament-meetings-fz9v3xwrz-brunocelada.vercel.app/">Open the live application</a>
  ·
  <a href="https://github.com/brunocelada/sacrament-meetings">View the source code</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.5-black?logo=nextdotjs" alt="Next.js 16.4.5" />
  <img src="https://img.shields.io/badge/React-19.3-149ECA?logo=react" alt="React 19.3" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Database-Neon-00E599" alt="Neon PostgreSQL" />
</p>

<p align="center">
  <img src="./public/hymns-banner.jpg" alt="Hymns book banner used by the application" width="720" />
</p>

> **Academic project:** This application was developed as part of **WDD 430 at Brigham Young University–Idaho (BYU-Idaho)**. It is a student project created for learning and demonstration purposes.

## Overview

**Sacrament Meetings** helps ward and branch leaders prepare and manage sacrament meeting programs while giving members a convenient way to browse current and previous agendas.

Each meeting brings its key information together in one place: meeting leadership, announcements, prayers, hymns, ward and stake business, speakers, and musical numbers. Public visitors can browse meeting information, while authorized accounts can create, edit, and delete meeting records.

## Live application

**[Open Sacrament Meetings – Parque Urquiza Ward](https://sacrament-meetings-fz9v3xwrz-brunocelada.vercel.app/)**

The application is deployed on Vercel and uses a Neon PostgreSQL database.

## Features

### Browse and review meetings

- View a paginated list of sacrament meeting records (five meetings per page).
- Search meetings by presiding leader, conducting leader, meeting type, or speaker information.
- Open a detailed agenda for each meeting.
- Use **Current Meeting** as a shortcut to the meeting scheduled for the current or upcoming Sunday.
- Review meeting programs in a structured layout that can be printed using the browser's print function.

### Meeting agenda management

Authorized meeting managers can create, update, and delete meeting records. Supported meeting types include:

- Regular meetings
- Testimony meetings
- Stake meetings
- General meetings

A meeting record can include:

- Date, meeting type, presiding leader, and conducting leader
- Announcements
- Opening, sacrament, and closing hymns
- Opening and closing prayers
- Ward business and a stake-business indicator
- Speakers, their topics, and musical numbers

Forms are validated before changes are saved, and deletion requires confirmation.

### Authentication and role-based access

The application uses Auth.js with email-and-password credentials. Passwords are stored as bcrypt hashes, and access to meeting-management functionality is checked on the server.

| Role     | Permissions                       |
| -------- | --------------------------------- |
| Visitor  | Browse meeting lists and details  |
| `user`   | Browse meeting lists and details  |
| `tester` | Create, edit, and delete meetings |
| `admin`  | Create, edit, and delete meetings |

There is no public registration form. Accounts are provisioned by an administrator.

### API

The application also exposes read-only meeting endpoints:

| Endpoint                 | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `GET /api/meetings`      | Retrieve meeting records; accepts an optional `date=YYYY-MM-DD` query parameter. |
| `GET /api/meetings/[id]` | Retrieve a meeting by its ID.                                                    |

### Responsive interface and metadata

- Responsive navigation and layouts for desktop and mobile screens.
- Lora and Noto Sans typography, loaded with `next/font`.
- Global page metadata and meeting-specific titles and descriptions.
- Open Graph metadata and a social-sharing image.

## Project tester account

Use the following account to explore the meeting-management features in the live application:

| Field        | Value                                                                           |
| ------------ | ------------------------------------------------------------------------------- |
| Sign-in page | [Open login](https://sacrament-meetings-fz9v3xwrz-brunocelada.vercel.app/login) |
| Email        | `tester@example.com`                                                            |
| Password     | `ProjectTester123`                                                              |
| Role         | `tester`                                                                        |

> [!WARNING]
> This is a **public demo account** with permission to create, edit, and delete meeting records in the shared application. Anyone with these credentials can change or remove shared demo data. Do not enter confidential, personal, or sensitive information, and do not reuse this password for any other account.

## Technology stack

| Technology                                                 | Purpose                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Next.js 16](https://nextjs.org/)                          | App Router, server-rendered pages, Server Actions, and API route handlers |
| [React 19](https://react.dev/)                             | Component-based user interface                                            |
| [TypeScript](https://www.typescriptlang.org/)              | Static typing                                                             |
| [Tailwind CSS 4](https://tailwindcss.com/)                 | Styling and responsive layouts                                            |
| [Neon](https://neon.tech/)                                 | Serverless PostgreSQL database                                            |
| [Auth.js](https://authjs.dev/)                             | Credentials authentication and JWT sessions                               |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs)         | Password hashing and verification                                         |
| [Zod](https://zod.dev/)                                    | Form and input validation                                                 |
| [use-debounce](https://www.npmjs.com/package/use-debounce) | Debounced meeting search                                                  |
| [Vercel](https://vercel.com/)                              | Application deployment                                                    |

## Run locally

### Prerequisites

- Node.js **20.9 or later**
- npm
- A Neon PostgreSQL database with the required `meetings` and `users` tables

### 1. Clone the repository

```bash
git clone https://github.com/brunocelada/sacrament-meetings.git
cd sacrament-meetings
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="your_neon_postgresql_connection_string"
AUTH_SECRET="your_auth_secret"
SITE_URL="http://localhost:3000"
```

Generate an Auth.js secret with:

```bash
npx auth secret
```

Use the generated value for `AUTH_SECRET`. Keep `.env.local` private and never commit database credentials or authentication secrets to Git.

For production, configure the same variables in the Vercel project's **Settings → Environment Variables**, using the production site URL for `SITE_URL`.

### 4. Prepare the database

The application expects a PostgreSQL database containing the `meetings` table with the columns and types queried by `lib/meetings-db.ts`, and a `users` table for authentication. The `users` table must include `id`, `name`, `email`, `password_hash`, `role`, and `created_at` fields.

For an existing database, apply the role migration in `database/migrations/002_add_tester_role.sql` so the role constraint accepts `admin`, `tester`, and `user`.

> The repository currently includes the tester-role migration, but the initial `meetings` and `users` table schema must already be provisioned in the Neon database before the application can run. Do not point a local setup at a production database unless you intend to work with its shared records.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the local development server.                 |
| `npm run build`        | Create an optimized production build.               |
| `npm run start`        | Start the production server locally after building. |
| `npm run lint`         | Run ESLint.                                         |
| `npm run format`       | Format project files with Prettier.                 |
| `npm run format:check` | Check formatting without modifying files.           |

## Deployment

The application is deployed on [Vercel](https://vercel.com/). To deploy your own instance:

1. Import the GitHub repository into Vercel.
2. Configure `DATABASE_URL`, `AUTH_SECRET`, and `SITE_URL` for the appropriate environments.
3. Confirm that the Neon database has the required schema and user accounts.
4. Deploy the project and test the public meeting pages and authenticated management flows.

## Academic context

This project is part of the **BYU-Idaho WDD 430** coursework. It applies full-stack development concepts including Next.js App Router architecture, server-side data access, PostgreSQL integration, authentication, authorization, form validation, responsive UI design, and deployment.

---

<p align="center">
  Built for learning, planning, and serving the Parque Urquiza Ward community.
</p>
