# URL Shortener

> Turn long, messy links into clean, shareable short URLs - with password protection, custom codes and click tracking

---

## What is Thi?

It is a full-stack URL shortening web app. You paste a long URL, and it gives you a short one that redirects anyone who visits it. Think Bit.ly or TinyURL - but built fromm scratch, wih you own features and auth system.

**Kwy Things you can do:**
- Shorten any URL instantly with a random generated code
- Choose you own custom short code 
- Password-protect a link so only people with the password can access it
- Track how many times each link has been clicked
- Delete links you no longer need
- Expand a short URL to see where it actually points befor clicking

---

## Features At a Glance

| Feature | Description |
|---|---|
| Random Short Code | Auto-generates a unique short code for your URL |
| Custom Short Code | Pick you own code and check if it's available in real time |
| Password Protection | Protect links with a password; visitors see a unlock form |
| Click Tracking | See how many times each of your links has been clicked |
| URL Expander | Pasta a short URL and Find out where it leads |
| Delete Links | Remove any link you've created |
| Auth System | Register, login, or continue with Google OAuth |
| Profile Page | View your account info and manage your session |

---

## Demo Walkthrough

### Creating a Short Link
1. Log in to your account
2. On the Home page, paste your long URL
3. Choose **Random code** (auto-generated) or **Custom code** (your own keyword)
4. Click **Generate** - your short link is ready to copy and share

### Password-Protecting a Link
1. On the Random Code tab, check **"Password Protect"**
2. Enter a password
3. Anyone visiting the short link will see a password from before being redirected

### Manage Your Links
- Go to **My URLs** to see all links you've created
- Each card shows the original URL, short URL, click count and creation data
- Copy or delete any link directly from the list

---

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - page navigation and tab state via URL params
- **Framer Motion** - smooth tab transition animations
- **Tailwind CSS** - Styling and layout
- **Axios** - API requests

### Backend
- **Go (GoLang)** - Server Language
- **Gin** - HTTP web framework and routing
- **GROM** - ORM for database interactions
- **MySQL** - relational database (with TLS connection support)
- **JWT** - authentication tokens
- **bcrypt** - password hashing

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/google` | Google OAuth Login |

### URLs *(Requires auth)*
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/shorten` | Create a random short URL |
| POST | `/api/shorten/custom` | Create a custom short URL |
| POST | `/api/protected` | Create a password-protected URL |
| GET | `/api/myurls` | Get All URLs for logged-in user |
| DELETE | `/api/url/:code` | Delete a URL (owner only) |
| GET | `/api/shortcode/:code/check` | Check if a short code is taken |
| GET | `/api/expand?url=...` | Resolve a URL to its final destination |

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/:code` | Redirect to original URL (or show password form) |
| POST | `/:code/verify` | Submit password and redirect |

---

### Prerequesties
- Go 1.21 +
- Node.js 18+
- MySQL database
- `.env` file with `DB_DSN` and `DB_CERT`

### Backend
```bash
cd server
go mod tidy
go run main.go
# Server runs on :8000
```

### Frontend
```bash
cd client
npm install
npm run dev
# App runs on :5173
```

### Environment Variables (server/.env)
```env
DB_DSN=user:password@tcp(host:port)/dbname?tls=custom&parseTime=true
DB_CERT=-------BEGIN CERTIFICATE-----\n...\n----END CERTIFICATE-------
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=google_client_id
```

---

## Notable Implementation Details

- **Short Code Collision handling** - when generating a random code, the server loops and regenerates until a unique code is confirmed against the DB. This prevents duplicates even under high load.

-- **TLS-Secured DB connection** - the MySQL connection uses a custom TLS config with a CA cert parsed from an environment variable, supporting cloud-hosted databases that require encrypted connections.

- **DB connection retry** - on startup, the server retries the DB connection up to 5 times with a 3-second delay between attempts, making it resilient to cold-start race conditions.

- **Password hashing** - link passwords are hashed with bcrypt before storage. Plain-text passwords are never saved. Verification uses `bcrypt.Compare`.

- **Real-time availability** - the custom short code input debounces API calls and shows instant feedback ("Available" / "Already Takend") befor the user submits.

- **Tab state in URL** - the Home page uses `useSearchParams` to persist the active tab (`?tab=random` / `?tab=custom`) in the URL, so the tab survives page refreshes and can be bookmarked or shared.

- **Connection pooling** - GORM's underlying `sql.DB` is configured with max open/idle connections and lifetime limits to prevent connection exhaustion on a hosted DB.

## Admin Panel

The application includes a dedicated **Admin Dashboard** that allows priviliged users to manage the entire system.

> Only users with `admin` role can access these endpoints and UI features.

---

## Admin Capabilities

| Feature | Description |
|---|---|
| View all Users | Fetch and list all registered users |
| Delete Users | Remove users (except yourself) |
| View All URLs | See every URL shortened URL in the system |
| Delete Any URL | Remove any URL regardless of owner |
| User Status | Check if users are active/inactive |
| Role management | Indentify user roles (admin/user) |

---

## Admin API Endpoints

> All routes require authentication **+ admin role**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Get all Users |
| GET | `/api/admin/urls` | Get all URLs |
| DELETE | `/api/admin/user/:id` | Delete a user |
| DELETE | `/api/admin/url/:code` | Delete any URL |

---

## Terminal Interface

The app includes a browser-based terminal for power users and developers who prefer a keyboard-driven workflow.

### Available Commands

- shorten <url>                     generate a random short link
- shorten <url> --pass <password>   generate a password-protected short lin
- custom <url> <code>               create a custom short lin
- check <code>                      check if a short code is available or not
- expand <short-url>                expand a short URL to its original URL
- clear                             clear the terminal
- help                              show available commands

### Features

- **Command history** - use the `↑` / `↓` arrow keys to cycle through the previous commands, just like a real terminal
- **Password-protected links** - pass `--pass <password>` inline; no seperate form needed
- **Real-time feedback** - colored output distinguishes prompts, results, errors and success messages at a glance
- **Non-blocking input** - The input field is disabled during requests to prevent duplicate submissions
- **Auto-Scroll** - output automatically scrolls to the latest line as commands run
- **Clicks-to-focus** - Clicking anywhere on the terminal panel focuses the input

### Output Colors
| Color | Meaning |
|---|---|
| Green (prompt) | Your command input |
| Yellow | Short URLs |
| Bright green | Success Messages |
| Red | Errors |
| Blue | Info/banners |
| Gray | Muted / loading text |

## Important Logic

### Self-Delete Protection
Admins cannot delte their own account.

### Cascade cleanup
When a user is deleted, all their URLs are deleted first.

### Secure Access
Protected by:
- `AuthMiddleware()` → verifies JWT
- `AdminOnly()` → restricts access to admin only

---

## Admin Dashboard UI

The frontend includes a clean admin interface with:

### Tabbed Layout
- Users Tab
- URLs Tab

### User Management Table
- Avatar, Name, Email, Role, Status, Created Date
- Delete action with confirmation modal

### URL Management Table
- Short Code, Original URL, User ID, Clicks, Created Date
- Delete Action with confirmation modal

### Confirmation Modal
- Prevents accidental deletions
- Shows loading state while deleting

## Author 
Built `by Jaison David M` with **love**