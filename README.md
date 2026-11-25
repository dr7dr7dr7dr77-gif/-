# VANTA AI

Arabic AI chat website with accounts, a single seeded owner account, regular users, and a small owner user-management panel.

## Requirements
- Node.js 20+
- A persistent disk for `data/vanta.sqlite` and session storage
- An OpenAI API key (API usage may cost money)

## Environment variables
Set these in your hosting provider:
- `SESSION_SECRET`: long random secret
- `OWNER_USERNAME`: owner account name on first deployment
- `OWNER_PASSWORD`: strong owner password on first deployment
- `OPENAI_API_KEY`: provider API key
- `OPENAI_MODEL`: optional; defaults to `gpt-4o-mini`
- `NODE_ENV=production`

The first boot creates the owner account. The owner password is hashed before storage. Changing `OWNER_PASSWORD` after the database has already been initialized does not reset the existing owner password.

## Run
```bash
npm install
npm start
```

The website is served from `public/`. Do not deploy on a host that deletes the `data/` directory between restarts. Do not commit `.env`, API keys, or the SQLite database.

## Security notes
- Public self-registration creates regular users only; role is assigned by the server.
- Only the owner can list or disable regular accounts.
- The AI endpoint requires a signed-in user and has rate limiting.
- This is a starter implementation. Before high-traffic public use, add email verification, password reset, CSRF protection, monitoring, backups, and stronger abuse controls.
