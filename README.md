Quiz Cloudflare Pages — Final package
====================================

Contents (top-level)
- public/                 ---> static frontend (HTML/CSS/JS)
- functions/api/          ---> Cloudflare Pages Functions (serverless endpoints)
- wrangler.toml           ---> add your KV namespace IDs
- package.json

Quick ZIP download: locate quiz-cloudflare-pages.zip in the workspace.

--- Deployment steps (GitHub + Cloudflare Pages) — detailed

1) Push repo to GitHub
   - Create a new GitHub repository (private or public).
   - Upload all files and folders (public/, functions/, wrangler.toml, package.json).
   - Commit & push to branch (e.g., main).

2) Create KV namespaces in Cloudflare
   - Log into Cloudflare dashboard -> Workers & Pages -> "KV" -> Create namespace.
   - Create three namespaces:
     - QUIZ_USERS
     - QUIZ_QUESTIONS
     - QUIZ_SUBMISSIONS
   - After creation, copy each Namespace ID.

3) Connect GitHub repo to Cloudflare Pages
   - In Cloudflare Pages -> Create a project -> Connect to your GitHub repo.
   - For build settings:
     - Framework: None
     - Build command: (leave empty)
     - Build output directory: public
   - Confirm and deploy. Pages will serve the content from public/.

4) Bind KV namespaces to the Pages project
   - In your Pages project -> Settings -> Environment variables & secrets -> Variables & bindings -> Add Binding -> Choose 'KV Namespace'.
   - Add 3 bindings:
     - Variable name: QUIZ_USERS        -> Namespace ID: (paste QUIZ_USERS ID)
     - Variable name: QUIZ_QUESTIONS    -> Namespace ID: (paste QUIZ_QUESTIONS ID)
     - Variable name: QUIZ_SUBMISSIONS  -> Namespace ID: (paste QUIZ_SUBMISSIONS ID)
   - Save changes.

5) Deploy Functions
   - Cloudflare Pages will automatically detect `functions/` and serve functions at /api/<filename>.
   - Example endpoints:
     - POST /api/login
     - POST /api/set-username
     - GET  /api/quiz
     - POST /api/submit
     - POST /api/upload-users
     - POST /api/upload-questions
     - GET  /api/admin-dashboard

6) Upload initial data (questions & users)
   - Open your site -> /admin-login.html
   - Login with upload admin:
     - ID: mohan_m
     - PW: upload
   - Use the Upload Users/Questions forms to select your Excel files (templates below).
   - The frontend parses the Excel (SheetJS) and sends JSON to the worker endpoints which write data into KV.

7) Excel templates
   - Users Excel columns (header row): email, password, username (optional)
   - Questions Excel columns (header row): question, optionA, optionB, optionC, optionD, correct
     - correct should be 0/1/2/3 referencing the correct option index.

8) Test the flow
   - Participant: /participant-login.html -> login with email/password -> set username if prompted -> take quiz -> results store in submissions.
   - Dashboard admin: /admin-login.html -> login as gc/2006 or harish/2005 or jai/2006 -> view dashboard.
   - Leaderboard: /leaderboard.html shows top 20 animated cards.

9) Notes & security
   - Basic Auth used for uploads and admin dashboard is a simple gate; do not expose upload credentials publicly.
   - For production: use Cloudflare Access (Teams) and short-lived tokens, or implement JWTs.
   - KV list() may only list 1,000 keys per call; for very large datasets use D1 (SQLite) or a DB.

10) If you prefer CLI (wrangler) deployment
   - Install Wrangler: npm i -g wrangler
   - Authenticate: wrangler login
   - Add KV namespaces with: wrangler kv:namespace create "QUIZ_USERS"
   - Update wrangler.toml with created IDs
   - Publish: wrangler publish

If you want, I can:
- Customize visuals (colors, fonts) or convert leaderboard animations to GSAP.
- Add Cloudflare Access guide (how to restrict upload page).
- Create sample Excel templates with example rows.

