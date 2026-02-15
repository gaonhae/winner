This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Deployment Guide

For post-local deployment sequencing (EC2/RDS/IAM role/CloudFront verification), see:

- `DEPLOYMENT_NEXT_STEPS.md`

## Run With Docker Compose

Use `docker compose` (or `docker-compose` if you use v1) in this order:

```bash
# 1) Start MySQL first
docker-compose -f docker-compose.prod.yml up -d mysql

# 2) Apply Prisma migrations (one-shot)
docker-compose -f docker-compose.prod.yml run --rm migrate

# 3) Start app
docker-compose -f docker-compose.prod.yml up -d app
```

Useful checks:

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f app
```

Stop everything:

```bash
docker-compose -f docker-compose.prod.yml down
```

## Run On EC2 With RDS

Use `docker-compose.ec2.yml` when the database is managed by RDS (no local MySQL container).

```bash
# 0) Prepare env
cp .env.ec2.example .env
# then edit .env values

# 1) Apply Prisma migrations to RDS
docker-compose -f docker-compose.ec2.yml run --rm migrate

# 2) Start app
docker-compose -f docker-compose.ec2.yml up -d app

# 3) Check status/logs
docker-compose -f docker-compose.ec2.yml ps
docker-compose -f docker-compose.ec2.yml logs -f app
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
