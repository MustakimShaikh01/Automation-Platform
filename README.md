<p align="center">
  <img src="./apps/assets/autoify_logo_banner_1773778964909.png" alt="Autoify Banner" width="100%" />
</p>

<h1 align="center">🚀 Autoify</h1>

<p align="center">
  <strong>The Ultimate Open-Source Automation Platform with AI-First Workflows.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-15+-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11+-E0234E?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6.0-2D3748?logo=prisma" alt="Prisma" />
</p>

<hr />

## ✨ Overview

**Autoify** is a powerful, multi-tenant automation platform designed to streamline business processes through an intuitive, node-based workflow editor. Unlike traditional automation tools, Autoify puts **Artificial Intelligence** at the core of every workflow, enabling complex decision-making, summarization, and data extraction with ease.

Built on a modern, high-performance tech stack, Autoify is scalable, extensible, and developer-friendly.

---

## 🔥 Key Features

- 🎨 **Visual Workflow Editor**: Build complex automations visually using a drag-and-drop interface powered by **React Flow**.
- 🤖 **AI-First Logic**: Native integration with OpenAI for smart nodes:
  - **Summarize**: Condense large documents or messages.
  - **Classify**: Categorize incoming data automatically.
  - **Extract**: Pull structured JSON from unstructured text.
  - **Decide**: Let AI choose the execution path based on natural language logic.
- 🏢 **Multi-Tenant Architecture**: Scale-ready design with white-labeling capabilities, organization management, and plan-based limitations.
- ⚡ **Robust Execution Engine**: Background processing powered by **BullMQ** and **Redis**, ensuring reliability even for heavy tasks.
- 🔌 **Dynamic Integrations**: Connect seamlessly with Slack, Gmail, Stripe, Twilio, and more.
- 📥 **Flexible Triggers**: Start workflows via Webhooks, Cron Schedules, Email, or Manual triggers.
- 🛡️ **Enterprise Security**: JWT/OAuth2 authentication, API key management, and detailed execution logs.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [React Query](https://tanstack.com/query/latest)
- **Workflow**: [React Flow](https://reactflow.dev/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

### Backend
- **Framework**: [NestJS 11](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Queue System**: [BullMQ](https://docs.bullmq.io/) with [Redis](https://redis.io/)
- **AI**: [OpenAI API](https://openai.com/)
- **API Docs**: [Swagger / OpenAPI](https://swagger.io/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)
- [Docker](https://www.docker.com/) & Docker Compose

### Fast Track
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/automation-platform.git
   cd automation-platform
   ```

2. **Setup Infrastructure**:
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**:
   ```bash
   pnpm install
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env` in the root and configure your `DATABASE_URL`, `REDIS_URL`, and `OPENAI_API_KEY`.

5. **Run Migrations**:
   ```bash
   pnpm -F api prisma migrate dev
   ```

6. **Start Development**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the UI and [http://localhost:3001/api](http://localhost:3001/api) for the API.

---

## 🏗️ Architecture

Autoify is a monorepo managed by **Turbo**, organized into:
- `/apps/web`: The Next.js dashboard and workflow editor.
- `/apps/api`: The NestJS execution engine and core API.
- `/packages`: (Coming soon) Shared UI components and utilities.

---

## 🤝 Contributing

We welcome contributions! Check our [Contribution Guide](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by the Autoify Team
</p>
