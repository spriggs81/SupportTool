# SupportTool

## The Problem

While working on a support team for a B2B software company, our team had read-only access to a shared page that listed client server connection info. The problem was that once a client went live, the teams who owned that page — installation and setup — stopped keeping it current. Connection info would change, and instead of having one reliable place to look it up, team members would keep their own personal notes and we'd have to track each other down every time something changed. It was a constant headache.

At the time I was teaching myself to code, and rather than build another campsite app I decided to solve a real problem. I built SupportTool for my team — a place where support staff could view and update client info themselves, without depending on another team to do it for us.

## What Happened

My manager tried to get it adopted internally. Upper management passed on it, concerned about the learning curve and under the impression it was meant to replace existing systems across departments. It wasn't — it was only ever meant to be a tool for our team. But that's how it goes sometimes.

Rather than let it sit, I turned it into a portfolio piece. It ended up being the centerpiece of a technical interview where I walked through the middleware architecture, authentication flow, and how I structured the MVC pattern. I got the job.

## What It Does

- **Client Management** — add and update client accounts, support plans, VPN access, and contact info
- **Product & Server Tracking** — associate products and servers with individual client records
- **Knowledge Base** — create and manage internal articles for the support team
- **User Authentication** — secure login with role-based access (read-only and admin)
- **Admin Panel** — manage users, departments, support plans, and registration codes
- **Registration Code System** — users need a code to register, codes are managed by admins

## Demo Credentials

| Role      | Username   | Password    |
| --------- | ---------- | ----------- |
| Admin     | admin-user | password987 |
| Read-only | read-user  | password123 |

**Registration codes:**

- Admin: `23456`
- Standard user: `12345`

> Codes can be updated by an admin user in the admin panel. Admins can also add users directly without a registration code.

## Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Runtime          | Node.js                      |
| Framework        | Express.js                   |
| Templating       | EJS                          |
| Database         | MongoDB                      |
| ODM              | Mongoose                     |
| Auth             | Passport.js (Local Strategy) |
| UI Library       | Semantic UI                  |
| Containerization | Docker + Docker Compose      |

## The Docker Story

The original version ran on Heroku with a cloud-hosted MongoDB instance. When Heroku ended its free tier and the MongoDB provider was sold off, the app went offline. Rather than just redeploy it somewhere else, I used it as an opportunity to learn Docker — containerizing the Node.js app and MongoDB together so the whole thing runs with a single command and has no external dependencies.

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A free [Docker Hub](https://hub.docker.com) account
- Git

### 1. Clone the repo

```bash
git clone https://github.com/spriggs81/SupportTool.git
cd SupportTool
```

### 2. Create your `.env` file

```
DATABASEURL=mongodb://mongo:27017/support_tools_v4
PORT=3000
```

> The hostname `mongo` is the MongoDB container's service name — Docker resolves it automatically. Do not use `localhost` here.

### 3. Start the app

```bash
docker-compose up --build
```

### 4. Open it

[http://localhost:3000](http://localhost:3000)

### 5. Seed the database (first run only)

Uncomment these two lines in `app.js`, restart the containers, then comment them back out:

```javascript
((seedDB = require("./seeds")), seedDB());
```

## Stopping the App

```bash
# Stop containers
docker-compose down

# Stop and wipe all data for a clean start
docker-compose down -v
```

## Author

**John Spriggs**
[johnspriggs.com](https://johnspriggs.com) · [LinkedIn](https://linkedin.com/in/johnspriggs23) · [GitHub](https://github.com/spriggs81)
