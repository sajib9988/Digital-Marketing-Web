# Digital Marketing Agency Portfolio Platform

## Project Instructions

You are working on a production-ready Digital Marketing Agency Portfolio Platform.

The project must be modular, scalable, secure, maintainable, testable, Dockerized, CI/CD enabled, and suitable for production deployment on a single VPS.

Treat this document as the project's architectural source of truth unless a newer explicit developer instruction overrides it.

---

# 1. Core Engineering Rules

Before implementing or changing anything:

1. Inspect the existing project structure and code.
2. Understand the existing architecture before modifying it.
3. Check the currently installed dependency versions.
4. Verify compatibility with official documentation before adding or upgrading major dependencies.
5. Do NOT blindly use `latest`.
6. Pin production dependency versions.
7. Do NOT use deprecated APIs, packages, configuration patterns, or obsolete approaches.
8. Do NOT introduce unnecessary dependencies.
9. Prefer the existing stack when it can reliably solve the problem.
10. Keep changes limited to the relevant module/domain.
11. Do not rewrite unrelated working code.
12. Preserve existing functionality unless the requested change intentionally modifies it.
13. After implementation, run appropriate type checks, linting, tests, and builds.
14. Check production implications for infrastructure, security, database, and deployment changes.

Always explain:

- WHAT is being changed
- WHY it is needed
- HOW it works
- What reasonable alternatives exist
- WHEN an alternative would be preferable

The goal is not only to implement the feature, but to teach the developer how to understand official documentation and implement similar features independently.

When providing code:

1. Explain important concepts first.
2. Break down important parts.
3. Explain why the implementation is structured that way.
4. Mention relevant alternatives.
5. Provide the complete final code together.

---

# 2. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui where appropriate

There are exactly TWO custom Next.js applications:

1. Public Website
2. Admin Dashboard + Payload CMS

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

## CMS

- Payload CMS
- Payload CMS MUST be integrated inside the Admin Next.js application.

## File Upload

For application/business uploads:

- Multer
- Cloudinary

For CMS/editorial uploads:

- Payload Media Collection
- Cloudinary-backed media storage where appropriate

Payload CMS MUST support image/media uploads for content such as:

- Hero images
- Section images
- Blog images
- Service images
- Portfolio images
- Case study images
- Open Graph images
- Other editorial media

Do NOT create a separate CMS application just for media management.

## Infrastructure

- Docker
- Docker Compose
- Nginx

## Deployment

- VPS
- GitHub Actions

## Edge / Security

- Cloudflare
- DNS
- CDN
- WAF
- DDoS protection
- TLS / SSL

---

# 3. Monorepo Structure

The repository must follow this architecture:

digital-marketing-platform/
│
├── apps/
│   ├── web/
│   │   └── Public Next.js
│   │
│   ├── admin/
│   │   └── Admin Next.js + Payload CMS
│   │
│   └── api/
│       └── NestJS + Prisma
│
├── packages/
│   ├── types/
│   ├── validation/
│   ├── config/
│   └── ui/
│
├── infrastructure/
│   └── nginx/
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── pnpm-workspace.yaml
└── package.json



---

# 4. Public Website

Application:

apps/web

Responsibilities:

- Public website
- Rendering
- SEO
- Services
- Portfolio
- Case Studies
- Blog
- Testimonials
- Clients
- Contact
- CTA sections
- Public CMS content rendering

Example routes:

/
 /about
 /services
 /services/[slug]
 /portfolio
 /portfolio/[slug]
 /case-studies
 /case-studies/[slug]
 /blog
 /blog/[slug]
 /contact

The Public Website MUST NOT contain:

/admin/login
/admin/dashboard

Do not put administrative business logic inside the Public Website.

---

# 5. Admin Application

Application:

apps/admin

The Admin application has TWO responsibilities:

1. Custom Admin Dashboard
2. Payload CMS

The custom Admin Dashboard is the PRIMARY administrative interface.

Example routes:

/admin/login
/admin/dashboard

/admin/content
/admin/pages
/admin/sections

/admin/services
/admin/portfolio
/admin/case-studies
/admin/blog
/admin/testimonials

/admin/navigation
/admin/seo

/admin/clients
/admin/contacts

/admin/users
/admin/settings

The administrator should manage both:

1. CMS content
2. NestJS application data

from ONE Admin Dashboard.

The administrator should NOT normally need to open Payload's built-in Admin Panel for normal CMS operations.

Payload's built-in Admin Panel may technically exist because it is part of Payload's architecture, but it is NOT the primary administrative interface.

---

# 6. Payload CMS

Payload MUST be installed inside:

apps/admin/

Use the official Payload + Next.js integration supported by the selected Payload version.

Verify compatibility between:

- Next.js
- React
- Payload CMS
- Node.js
- PostgreSQL
- selected Payload adapter

Do NOT blindly use package versions.

Payload is responsible for CMS/editorial functionality.

Payload responsibilities include:

- Pages
- Sections
- Rich Text
- Blog
- CMS Service Content
- CMS Portfolio Content
- Case Studies
- Testimonials
- Navigation
- SEO Content
- Content Ordering
- Editorial Media
- Image uploads
- Hero images
- Section images
- Blog images
- Open Graph images

Payload MUST NOT become the application's business backend.

Do NOT use Payload as the business/application database.

---

# 7. Payload Media / Image Upload

Payload MUST provide an image/media upload system because CMS content may require images.

Examples:

- Hero image
- Service image
- Portfolio image
- Blog featured image
- Case study image
- Testimonial/client image
- Section image
- SEO/Open Graph image

Use Payload's official Media Collection architecture.

The media collection should support appropriate fields such as:

- filename
- alt text
- caption where necessary
- width/height where supported
- MIME information
- metadata where appropriate

Media should preferably be stored using Cloudinary or another production-ready external media storage mechanism compatible with the selected Payload version.

Do NOT permanently store production media on the VPS filesystem.

Preferred flow:

Admin Dashboard
    ↓
Payload CMS
    ↓
Payload Media Collection
    ↓
Cloudinary
    ↓
Media URL
    ↓
CMS Content

The exact Cloudinary/Payload integration must follow the current official documentation for the selected Payload version.

Do NOT invent deprecated Payload upload APIs.

---

# 8. Payload Database

Payload uses its own PostgreSQL database:

payload_db

Conceptually:

PAYLOAD_DATABASE_URL=
postgresql://USER:PASSWORD@postgres:5432/payload_db

Use the exact environment variable and adapter configuration required by the selected Payload version.

Payload owns:

payload_db

Do NOT access Payload internal database tables directly from:

- NestJS
- Prisma
- Admin UI
- Public Next.js

Use Payload's supported APIs, Local API, or official interfaces.

---

# 9. Public CMS Content Flow

CMS content must flow through Payload's supported interfaces.

Visitor
    ↓
Public Next.js
    ↓
Payload supported API/interface
    ↓
Payload
    ↓
payload_db
    ↓
CMS Content

Do NOT directly query Payload PostgreSQL tables from Public Next.js.

---

# 10. NestJS Backend

Application:

apps/api

NestJS is responsible for application/business logic.

Responsibilities:

- Admin authentication
- Admin user management
- Application APIs
- Services data
- Projects data
- Clients data
- Testimonials data
- Contacts data
- Validation
- Transactions
- Rate limiting
- File upload handling
- Cloudinary integration
- Health checks
- Business workflows

Do NOT put business logic inside Payload.

Do NOT use Payload as the business/application backend.

---

# 11. NestJS Module Structure

The NestJS application should follow domain-based modules:

apps/api/src/

├── auth/
├── users/
├── services/
├── projects/
├── clients/
├── testimonials/
├── contacts/
├── uploads/
├── prisma/
├── health/
└── common/

Important:

`auth` is a functional module.

It does NOT represent a database table.

`uploads` is a functional infrastructure/application module.

It does NOT represent a database table.

`prisma` is an infrastructure module.

It does NOT represent a database table.

`health` is an infrastructure module.

It does NOT represent a database table.

`common` contains shared infrastructure/utilities.

It does NOT represent a database table.

There are NO modules for:

- companies
- roles
- permissions
- leads
- lead-notes
- team-members
- audit-logs
- refresh-tokens
- email-verifications
- password-reset-tokens

unless explicitly introduced later.

---

# 12. Authentication

Authentication is handled by NestJS.

There is ONLY an Admin user type in the current system.

There is NO public user account system.

There is NO role system at this stage.

Do NOT introduce:

SUPER_ADMIN
ADMIN
MANAGER
EDITOR

unless explicitly requested later.

Do NOT create:

- roles table
- permissions table
- role enum
- permission enum
- RBAC system

Admin login:

/admin/login

Flow:

Admin User
    ↓
Admin Next.js
    ↓
POST /api/v1/auth/login
    ↓
NestJS
    ↓
Authentication
    ↓
Secure HTTP-only Cookie / Session
    ↓
Admin Dashboard

Admin Next.js handles:

- Login UI
- Route protection
- Redirects
- UI state

NestJS handles:

- Authentication
- Session/token validation
- Backend security enforcement

Never trust frontend-only authentication.

Every protected API request must be validated by NestJS.

---

# 13. Authentication Data Rules

The `users` table contains the Admin account.

Email verification and password reset are stored directly inside the `users` table.

Do NOT create separate tables for:

refresh_tokens
email_verifications
password_reset_tokens

User model contains:

id
name
email
password
emailVerified
verificationCode
verificationCodeExpiresAt
resetToken
resetTokenExpiresAt
createdAt
updatedAt

There is NO role field.

There is NO UserRole enum.

There is NO RBAC system.

Passwords must be securely hashed using a current production-ready password hashing approach.

Authentication secrets must never be exposed to the browser.

---

# 14. Final Application Database

NestJS + Prisma uses:

app_db

The application database MUST contain exactly these six core tables:

users
services
projects
clients
testimonials
contacts

These are the authoritative application tables.

Do NOT add additional application tables unless a future explicit requirement requires them.

---

# 15. Explicitly Removed Tables

The following tables MUST NOT be created:

companies
roles
permissions
refresh_tokens
email_verifications
password_reset_tokens
project_categories
project_images
team_members
team_member_socials
leads
lead_notes
audit_logs

Do not reintroduce these tables based on assumptions.

If a feature appears to require one of these tables, stop and explain the architectural conflict before creating it.

---

# 16. Final Application Enums

The application database has exactly TWO enums:

ProjectCategory
ContactStatus

There is NO:

UserRole
LeadStatus

Do not create additional enums unless explicitly requested later.

---

# 17. Users Table

Purpose:

Admin authentication and account management.

Required fields:

id
name
email
password
emailVerified
verificationCode
verificationCodeExpiresAt
resetToken
resetTokenExpiresAt
createdAt
updatedAt

Rules:

- `email` must be unique.
- Passwords must be securely hashed.
- Verification data is stored in this table.
- Password reset data is stored in this table.
- Only Admin accounts exist.
- There is no role field.

---

# 18. Services Table

Purpose:

Application-level service data.

Suggested fields:

id
title
slug
shortDescription
description
icon
image
isActive
sortOrder
createdAt
updatedAt

Rules:

- `slug` must be unique.
- There is NO companyId.
- There is NO companies table.

Important architectural distinction:

Payload may also contain CMS Service Content.

The NestJS `services` table represents application-level service data.

Do not duplicate data unnecessarily between Payload and Prisma.

If a service only requires editorial content, prefer Payload.

If the Admin application requires structured application/business data, use the NestJS service table.

---

# 19. Projects Table

Purpose:

Portfolio project data.

Suggested fields:

id
title
slug
description
category
images
technologies
projectUrl
isFeatured
isPublished
clientId
createdAt
updatedAt

`category` MUST use:

ProjectCategory

Suggested enum values:

WEB_DEVELOPMENT
DIGITAL_MARKETING
SEO
SOCIAL_MEDIA_MARKETING
BRANDING
GRAPHIC_DESIGN
E_COMMERCE
OTHER

Do NOT create:

project_categories

table.

---

# 20. Project Images

Project images MUST be stored directly inside the `projects` table as a PostgreSQL array.

Use:

images String[]

Example:

images = [
  "https://res.cloudinary.com/...",
  "https://res.cloudinary.com/...",
  "https://res.cloudinary.com/..."
]

Do NOT create:

project_images

table.

Application upload flow:

Admin Next.js
    ↓
NestJS
    ↓
Multer
    ↓
Validation
    ↓
Cloudinary
    ↓
Cloudinary URL
    ↓
projects.images[]

---

# 21. Project Technologies

Technologies are stored as a PostgreSQL array.

Use:

technologies String[]

Example:

[
  "Next.js",
  "NestJS",
  "PostgreSQL",
  "Prisma"
]

Do NOT create a technologies table unless explicitly requested later.

---

# 22. Clients Table

Purpose:

Client information associated with projects and testimonials.

Suggested fields:

id
name
companyName
email
phone
website
logo
description
createdAt
updatedAt

Relations:

Client
├── Projects
└── Testimonials

A Project may optionally belong to a Client.

A Testimonial must belong to a Client.

Do NOT create a companies table.

`companyName` is simply a field on the Client model.

---

# 23. Testimonials Table

Purpose:

Client reviews/testimonials.

Suggested fields:

id
clientId
content
rating
isPublished
createdAt
updatedAt

Relation:

Testimonial
    ↓
Client

Use the existing `clients` table.

Do NOT create a separate testimonial author table.

Do NOT create a team-member table for testimonials.

---

# 24. Contacts Table

Purpose:

Website contact form submissions.

Suggested fields:

id
name
email
phone
subject
message
status
createdAt
updatedAt

`status` uses:

ContactStatus

Enum values:

NEW
READ
REPLIED
ARCHIVED

Do NOT create a separate status table.

Do NOT create a leads table.

Contact form submissions are stored in `contacts`.

---

# 25. Final Database Relationship

users
└── Admin only

services
└── standalone

clients
├── projects
└── testimonials

projects
└── optional client

testimonials
└── required client

contacts
└── standalone

---

# 26. Prisma

Prisma is used ONLY for:

app_db

Architecture:

NestJS
    ↓
PrismaService
    ↓
Prisma PostgreSQL Adapter
    ↓
app_db

Create ONE reusable Prisma Service/provider.

Do NOT create separate Prisma clients inside individual modules.

Use:

- migrations
- indexes
- constraints
- relations
- transactions
- type safety

Follow the current official Prisma PostgreSQL documentation.

Verify compatibility between:

- Prisma
- NestJS
- PostgreSQL
- Node.js

---

# 27. Prisma Organization

Preferred organization:

prisma/
├── schema.prisma
├── models/
│   ├── user.prisma
│   ├── service.prisma
│   ├── project.prisma
│   ├── client.prisma
│   ├── testimonial.prisma
│   └── contact.prisma
└── enums/
    └── common.prisma

However, the exact multi-file schema configuration MUST match the selected Prisma CLI/version.

Do NOT blindly use an old multi-file Prisma configuration.

Verify the current official Prisma documentation before implementing it.

If the selected Prisma version does not support the planned organization exactly as written, adapt the organization to the officially supported approach while preserving the same six database models.

---

# 28. API Architecture

NestJS must be exposed through:

https://example.com/api/*

Use versioned APIs:

/api/v1/*

Examples:

/api/v1/auth/*
/api/v1/users/*
/api/v1/services/*
/api/v1/projects/*
/api/v1/clients/*
/api/v1/testimonials/*
/api/v1/contacts/*
/api/v1/uploads/*
/api/v1/health

Use:

- DTO validation
- Guards
- Interceptors
- Exception filters
- API versioning
- Rate limiting
- Structured error responses

---

# 29. Media Upload

There are TWO media systems.

## A. Application Media

NestJS application uploads use:

Multer + Cloudinary

Flow:

Admin Next.js
    ↓
NestJS
    ↓
Multer
    ↓
Validation
    ↓
Cloudinary
    ↓
URL

Used for application data such as:

- Project images
- Service images
- Client logos
- Other application-managed media

Do NOT permanently store application uploads on the VPS filesystem.

Validate:

- MIME type
- Extension
- File size
- Upload permissions
- File security

Configure:

- File size limits
- Cloudinary folders
- Unique naming
- Error handling
- Failed upload cleanup

## B. Payload CMS Media

Payload uses its own Media Collection.

Payload media can be used for:

- Hero images
- Section images
- Blog images
- CMS Service images
- CMS Portfolio images
- Case Study images
- SEO/Open Graph images

Payload media should use Cloudinary or another officially supported production storage solution.

Do not create a separate NestJS database table for Payload media.

Do not create a `project_images` table.

---

# 30. Docker Architecture

Production services:

docker-compose
│
├── nginx
├── web
├── admin
├── api
└── postgres

Payload is part of:

admin

There is NO separate Payload container by default.

Admin container contains:

Next.js
+
Payload CMS

PostgreSQL contains two databases:

postgres
├── payload_db
└── app_db

---

# 31. Internal Ports

Use:

web      → 3000
admin    → 3001
api      → 4000
postgres → 5432
nginx    → 80 / 443

ONLY Nginx may publish ports publicly.

Do NOT publicly expose:

3000
3001
4000
5432

---

# 32. Docker Network

Use:

app-network

Docker service discovery:

web:3000
admin:3001
api:4000
postgres:5432

Never use hard-coded container IP addresses.

---

# 33. Nginx

Nginx is the SINGLE public-facing reverse proxy.

Routing:

https://example.com/
    ↓
web:3000

https://example.com/admin/*
    ↓
admin:3001

https://example.com/api/*
    ↓
api:4000

Payload runs inside the Admin service.

Nginx must:

- Preserve Host
- Forward X-Real-IP
- Forward X-Forwarded-For
- Forward X-Forwarded-Proto
- Support HTTP/1.1
- Support Upgrade/WebSocket where required
- Configure sensible proxy timeouts
- Configure request body limits
- Support uploads
- Prevent internal service exposure
- Support health checks
- Avoid Cloudflare redirect loops
- Support HTTPS
- Use Docker service names

---

# 34. Cloudflare

Use Cloudflare for:

- DNS
- CDN
- WAF
- DDoS protection
- Edge security
- TLS
- DNS management
- Appropriate caching

Use:

Cloudflare
    ↓
Full (strict)
    ↓
Nginx

Configure a valid origin certificate.

Production traffic must use HTTPS.

Do not cache authenticated Admin/API responses incorrectly.

Use appropriate cache rules for:

- Public website
- Admin routes
- API routes
- CMS/media content

---

# 35. Security

Implement defense-in-depth security.

Required:

- Secure authentication
- Secure password hashing
- DTO validation
- Rate limiting
- Secure HTTP-only cookies
- CSRF protection where applicable
- CORS
- Secure headers
- File upload validation
- Prisma SQL injection protection
- Environment variable protection
- Safe error responses
- Nginx security controls
- Cloudflare security

There is currently NO RBAC system.

Do NOT introduce roles/permissions without an explicit requirement.

Never expose server secrets through:

NEXT_PUBLIC_*

Never expose:

- DATABASE_URL
- PAYLOAD_DATABASE_URL
- PAYLOAD_SECRET
- JWT_SECRET
- Cloudinary API Secret
- SMTP credentials
- private API keys

to browser/client code.

---

# 36. Environment Variables

## Public Web

apps/web/.env

Only public configuration may be exposed to browser code.

## Admin

apps/admin/.env

Server-only values may include:

PAYLOAD_SECRET
PAYLOAD_DATABASE_URL
CLOUDINARY credentials if required by server-side Payload integration

## API

apps/api/.env

Server-only values may include:

DATABASE_URL
JWT_SECRET
CLOUDINARY_API_SECRET

Important:

PAYLOAD_DATABASE_URL
→ payload_db

DATABASE_URL
→ app_db

These MUST remain separate.

---

# 37. Admin Dashboard

The custom Admin Dashboard must provide ONE unified interface.

CMS management:

- Pages
- Sections
- Blog
- CMS Services
- CMS Portfolio
- Case Studies
- Testimonials
- Navigation
- SEO
- Content ordering
- Media
- Hero images
- Section images

Application management:

- Admin user
- Services
- Projects
- Clients
- Testimonials
- Contacts

The administrator must NOT normally need:

- Direct database access
- Prisma Studio
- Payload database access
- Payload Studio

for normal application management.

The custom Admin Dashboard is the primary interface.

---

# 38. Public Website Features

Build a modern professional Digital Marketing Agency website.

Required:

- Hero
- Services
- Portfolio
- Case Studies
- Clients
- Testimonials
- Blog
- Contact
- CTA sections
- SEO
- Social proof
- Responsive design
- Accessibility
- Optimized images
- Fast loading

A Team section may exist as CMS content.

However:

Do NOT create a `team_members` application database table.

Team content should be handled by Payload CMS if required.

---

# 39. SEO

Implement:

- Metadata
- Dynamic metadata
- Canonical URLs
- Open Graph
- Twitter/X cards
- Sitemap
- Robots
- JSON-LD
- Semantic HTML
- SEO-friendly URLs

Admin pages must not be indexed by search engines.

Use appropriate `robots` behavior for:

/admin/*
/api/*

where appropriate.

---

# 40. Performance

Optimize:

- Server rendering
- Static rendering
- Dynamic rendering
- Image optimization
- CMS requests
- API requests
- Database queries
- Caching
- Bundle size
- Client JavaScript

Avoid unnecessary Client Components.

Avoid unnecessary dependencies.

Use Next.js image optimization.

Use caching strategies appropriate for the selected Next.js version.

Do not introduce heavy client-side libraries without a clear reason.

---

# 41. Accessibility

Follow modern accessibility standards.

Implement:

- Semantic HTML
- Keyboard navigation
- Focus management
- Accessible forms
- Labels
- Error messages
- Accessible dialogs
- Screen reader support
- Proper ARIA usage
- Responsive design

---

# 42. Testing

## Unit Tests

Test:

- NestJS services
- Authentication services
- Validators
- Guards
- Business logic
- Utilities

## Integration Tests

Test:

- NestJS + Prisma
- PostgreSQL
- Authentication
- Contact workflow
- Application CRUD
- Payload integration
- Cloudinary integration
- Media upload validation

## E2E Tests

Test:

- Public website
- Admin login
- Admin dashboard
- CMS management
- Application data management
- Contact management
- Project management
- Media uploads
- Hero image upload
- Authentication flows

## Infrastructure Tests

Test:

- Docker
- Nginx
- Routing
- HTTPS
- Health checks
- Database migrations
- Production deployment

Do NOT create tests for removed systems such as:

- RBAC
- Roles
- Permissions
- Leads
- Audit Logs
- Team Members

unless those features are explicitly introduced later.

---

# 43. GitHub Actions CI/CD

Pipeline:

Developer
    ↓
Git Push
    ↓
Install Dependencies
    ↓
Lint
    ↓
Type Check
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Prisma Validate
    ↓
Prisma Generate
    ↓
Build Public Next.js
    ↓
Build Admin Next.js + Payload
    ↓
Build NestJS
    ↓
Docker Build
    ↓
Docker Push
    ↓
VPS
    ↓
Docker Compose Pull
    ↓
Database Migration
    ↓
Docker Compose Up
    ↓
Health Checks
    ↓
Deployment Verification

Never deploy broken builds.

---

# 44. Database Migration

Production Prisma migrations MUST use:

prisma migrate deploy

Do NOT use:

prisma migrate dev

in production.

Deployment order:

1. Pull verified images.
2. Start infrastructure.
3. Verify PostgreSQL.
4. Run Prisma production migrations.
5. Update application containers.
6. Run health checks.
7. Verify application availability.

Payload production migration/configuration MUST follow the current official Payload deployment requirements.

Never manually modify Payload internal database tables.

---

# 45. Docker Production Standards

Use:

- Multi-stage builds
- Minimal production images
- Pinned base images
- Non-root execution where practical
- Health checks
- Persistent PostgreSQL volume
- Runtime secrets
- Graceful shutdown
- Restart policies
- Reproducible builds

Do NOT use floating `latest` tags in production.

---

# 46. VPS Deployment

Deploy the complete platform to one VPS.

VPS contains:

Docker
Docker Compose
Nginx
web container
admin container
api container
PostgreSQL container
persistent PostgreSQL volume

PostgreSQL contains:

payload_db
app_db

Only Nginx exposes:

80
443

Application ports remain internal.

---

# 47. Health Checks

Implement health checks for:

- Public Website
- Admin application
- NestJS API
- PostgreSQL
- Nginx
- Payload readiness where appropriate

NestJS must expose:

GET /api/health

Health checks must distinguish between:

- application process alive
- application ready
- database connectivity

where appropriate.

---

# 48. Final Request Flow

## Public Website

Internet
    ↓
Cloudflare
    ↓
Nginx
    ↓
web:3000
    ↓
Public Next.js

## Admin

Internet
    ↓
Cloudflare
    ↓
Nginx
    ↓
admin:3001
    ↓
Admin Next.js
    ↓
Custom Dashboard

## Payload CMS

Admin Dashboard
    ↓
Payload CMS
    ↓
Payload Media / CMS
    ↓
payload_db

## Payload Image Upload

Admin Dashboard
    ↓
Payload CMS
    ↓
Media Collection
    ↓
Cloudinary
    ↓
Image URL

## Application Data

Admin Dashboard
    ↓
NestJS
    ↓
Prisma
    ↓
app_db

## Application Image Upload

Admin Dashboard
    ↓
NestJS
    ↓
Multer
    ↓
Validation
    ↓
Cloudinary
    ↓
URL
    ↓
Application table array/string field

---

# 49. Final Architecture

                    Cloudflare
                         ↓
                       Nginx
                         │
              ┌──────────┼──────────┐
              │          │          │
              ↓          ↓          ↓
           web:3000   admin:3001  api:4000
              │          │          │
              │          │          ↓
              │          │        Prisma
              │          │          ↓
              │          │        app_db
              │          │          │
              │          │          ├── users
              │          │          ├── services
              │          │          ├── projects
              │          │          ├── clients
              │          │          ├── testimonials
              │          │          └── contacts
              │          │
              │          ↓
              │       Payload CMS
              │          │
              │          ↓
              │      payload_db
              │
              ↓
        Public Website

Payload Media
    ↓
Cloudinary

NestJS Application Uploads
    ↓
Multer
    ↓
Cloudinary

---

# 50. Strict Architectural Boundaries

## Public Next.js

Responsible for:

- Public UI
- Rendering
- SEO
- Public CMS content consumption

Must NOT contain:

- Admin Dashboard
- Admin authentication implementation
- Business database access
- Prisma client

---

## Admin Next.js

Responsible for:

- Admin UI
- Admin login UI
- Dashboard
- CMS management UI
- Application management UI
- Payload integration

Must NOT directly access:

- Prisma database
- app_db
- payload database tables

Application data must go through NestJS.

CMS data must go through Payload's supported APIs/interfaces.

---

## Payload CMS

Responsible for:

- CMS engine
- Editorial content
- Pages
- Sections
- Blog
- CMS content
- Navigation
- SEO content
- Media
- Image uploads
- Hero images
- Editorial assets

Payload MUST NOT become the application business backend.

---

## NestJS

Responsible for:

- Admin authentication
- Application API
- Business/application logic
- Validation
- Contact management
- Application data
- Upload processing
- Cloudinary integration

---

## Prisma

Responsible for:

- Application database access only

Prisma MUST connect only to:

app_db

---

## payload_db

Responsible for:

- Payload CMS data only

---

## app_db

Responsible only for:

users
services
projects
clients
testimonials
contacts

---

## PostgreSQL

Responsible for:

- Database infrastructure

PostgreSQL may host both:

payload_db
app_db

but the databases remain logically separated.

---

## Multer

Responsible for:

- NestJS application upload handling

---

## Cloudinary

Responsible for:

- Media storage
- Media delivery

---

## Nginx

Responsible for:

- Reverse proxy
- Routing
- TLS
- Public service exposure

---

## Cloudflare

Responsible for:

- DNS
- CDN
- WAF
- DDoS protection
- Edge security
- TLS

---

## Docker

Responsible for:

- Containerization
- Service isolation
- Reproducible runtime

---

## GitHub Actions

Responsible for:

- CI/CD
- Build verification
- Docker image build
- Deployment automation

Do NOT move responsibilities between these layers without a clear architectural reason.

---

# 51. Development Workflow

For every implementation task:

1. Inspect the relevant existing files first.
2. Do not assume the project is empty.
3. Identify the affected application and domain.
4. Verify current package versions.
5. Verify official documentation when the feature depends on framework behavior.
6. Explain the implementation approach.
7. Explain why it is being used.
8. Mention reasonable alternatives.
9. Implement the smallest clean solution.
10. Keep modules separated by responsibility.
11. Do not introduce unnecessary dependencies.
12. Run formatting where applicable.
13. Run TypeScript checks.
14. Run linting.
15. Run relevant tests.
16. Run production build when appropriate.
17. Check Docker if infrastructure is affected.
18. Check migrations if the database changes.
19. Check security implications.
20. Summarize exactly what changed.

Before changing database schema:

1. Compare against the six-table source of truth.
2. Confirm whether the requested data belongs in an existing table.
3. Prefer arrays/enums/fields when appropriate instead of creating unnecessary tables.
4. Do not create a new table simply because it seems convenient.
5. If a removed table is apparently required, explain the conflict first.

---

# 52. Code Quality Rules

Prefer:

- Strong TypeScript typing
- Small focused modules
- Clear naming
- Dependency injection
- DTO validation
- Explicit error handling
- Reusable services
- Reusable utilities
- Testable business logic
- Server-side validation
- Secure defaults

Avoid:

- `any` unless genuinely necessary
- Giant services
- Giant controllers
- Duplicate business logic
- Direct database access from controllers
- Database queries inside UI components
- Hard-coded secrets
- Hard-coded production URLs
- Unnecessary abstractions
- Unnecessary dependencies
- Deprecated APIs
- Premature optimization

---

# 53. Final Database Source of Truth

The current NestJS application database is intentionally minimal.

Exactly six tables:

users
services
projects
clients
testimonials
contacts

Exactly two enums:

ProjectCategory
ContactStatus

Important rules:

- `users` is Admin-only.
- No `role`.
- No RBAC.
- No `roles` table.
- No `permissions` table.
- No refresh-token table.
- Email verification is inside `users`.
- Password reset is inside `users`.
- No companies table.
- No project category table.
- Project images are `String[]`.
- Project technologies are `String[]`.
- No project images table.
- No team members table.
- No team member social table.
- No leads table.
- No lead notes table.
- No audit logs table.
- No separate media table for application project images.

Do not add any of these removed tables unless the developer explicitly requests a new requirement that justifies it.

---

# 54. Important Payload vs Prisma Rule

There are TWO different data systems.

## Payload CMS

Used for:

- Pages
- Sections
- Blog
- Editorial Services
- Editorial Portfolio
- Case Studies
- Navigation
- SEO
- CMS Testimonials
- CMS media
- Hero images
- Content assets

Database:

payload_db

## NestJS + Prisma

Used for:

- Admin user
- Application services
- Application projects
- Clients
- Application testimonials
- Contacts

Database:

app_db

Never mix the two database systems.

Do NOT create Prisma models for Payload internal collections.

Do NOT access Payload tables through Prisma.

Do NOT access app_db through Payload.

---

# 55. Payload Image Requirement

The system MUST allow administrators to upload images through the Payload CMS interface.

For example, when creating/editing a Hero section, the administrator must be able to select/upload a Hero image.

The architecture should support:

Hero
├── title
├── subtitle
├── CTA
└── image
       ↓
    Payload Media
       ↓
    Cloudinary

The same principle applies to:

- Service images
- Blog featured images
- Portfolio images
- Case study images
- Section images
- Open Graph images

Do NOT solve this by adding image tables to app_db.

Do NOT create:

hero_images
service_images
blog_images
project_images

unless explicitly requested later.

Use Payload's Media Collection for CMS/editorial media.

---

# 56. Final Goal

The final platform must be:

- Modular
- Scalable
- Secure
- Maintainable
- Production-ready
- Dockerized
- CI/CD enabled
- HTTPS enabled
- Cloudflare compatible
- Nginx based
- PostgreSQL backed
- Prisma based
- NestJS business-logic driven
- Payload CMS driven
- Cloudinary based
- Accessible
- SEO optimized
- Performance optimized
- Tested
- Observable

Most importantly, the administrator must be able to manage BOTH:

1. Payload CMS content
2. NestJS application data

from ONE custom Admin Next.js Dashboard.

The administrator must NOT need to open a separate Payload Studio for normal CMS management.

The Admin Dashboard must also allow CMS editors to upload/select images through Payload Media.

Final architecture:

Public Next.js
+
Admin Next.js + Payload CMS
+
NestJS + Prisma
+
PostgreSQL with payload_db and app_db
+
Payload Media + Cloudinary
+
NestJS Multer + Cloudinary
+
Nginx
+
Docker
+
Cloudflare
+
GitHub Actions
+
VPS

The authoritative NestJS application database is:

app_db

with exactly:

users
services
projects
clients
testimonials
contacts

and exactly:

ProjectCategory
ContactStatus

No additional NestJS application database tables should be introduced without an explicit future requirement.