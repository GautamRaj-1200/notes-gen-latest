# PDF Notes Generator AI

An intelligent web application that transforms your PDF documents into concise, well-structured study notes using the power of Google's Gemini AI. Upload a PDF, and let the AI do the hard work of summarizing content, extracting key takeaways, and formatting it all into easy-to-digest Markdown.

![image](https://github.com/user-attachments/assets/00d4aabe-de36-40ca-911d-399cb5cf5f78)

## ✨ Features

- **Secure Google Authentication:** Sign in safely and quickly with your Google account using NextAuth.js.
- **Role-Based Access Control:** Middleware protects routes, ensuring only authenticated users can access certain pages (e.g., `/user/...`).
- **Secure PDF Uploads:** Files are uploaded directly from the client to a private AWS S3 bucket using pre-signed URLs, ensuring privacy and efficiency.
- **AI-Powered Note Generation:** Leverages the Google Gemini 1.5 Flash model to analyze PDF content and generate high-quality notes in Markdown format.
- **Credit System:** Each user has a credit balance, and one credit is deducted for each note generation, managed via Prisma and a PostgreSQL database.
- **Interactive Note Editor:** View the generated Markdown notes, switch to an edit mode to make your own modifications, and download the final version as a PDF.
- **Dark Mode & Responsive UI:** Built with Tailwind CSS for a clean, modern, and responsive user experience that looks great on all devices.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL database (e.g., via [Docker](https://www.docker.com/) or a cloud provider like [Vercel Postgres](https://vercel.com/storage/postgres) or [Supabase](https://supabase.com/)).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project by copying the example file:

```bash
cp .env.example .env.local
```

Now, fill in the `.env.local` file with your credentials.

```env
# Prisma / Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth.js
# You can generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials
# Get these from the Google Cloud Console: https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID="YOUR_GOOGLE_CLIENT_ID"
AUTH_GOOGLE_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# AWS S3 Bucket Credentials
# Get these from the AWS IAM Console
AWS_S3_BUCKET_NAME="YOUR_S3_BUCKET_NAME"
AWS_REGION="YOUR_BUCKET_REGION" # e.g., us-east-1
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"

# Google Gemini API Key
# Get this from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

**Important:** Remember to configure the S3 Bucket's CORS policy to allow uploads from `http://localhost:3000`.

### 4. Set Up the Database

Run the Prisma migrations to set up your database schema. This will create the necessary tables for users, sessions, accounts, etc.

```bash
npx prisma migrate dev
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **File Storage:** [AWS S3](https://aws.amazon.com/s3/)
- **AI:** [Google Gemini API](https://ai.google.dev/)
- **PDF Generation (Client-side):** [jspdf](https://github.com/parallax/jsPDF)
- **Markdown Rendering:** [react-markdown](https://github.com/remarkjs/react-markdown)

## 📁 Project Structure

A brief overview of the key directories in this project:

```
.
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/
│   │   ├── api/          # All API routes (auth, upload, generate)
│   │   ├── (pages)/      # Main application pages
│   │   └── layout.tsx    # Root layout
│   ├── components/       # Reusable React components
│   ├── lib/              # Helper functions, Prisma client, Auth config
│   └── middleware.ts     # Next.js middleware for route protection
├── .env.local            # Environment variables (ignored by git)
└── README.md
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
