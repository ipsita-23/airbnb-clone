# StayFinder — Airbnb-style take-home

## Run it

1. `cd backend && python -m venv .venv && .venv\\Scripts\\activate && pip install -r requirements.txt`
2. `python seed.py`, then `uvicorn app.main:app --reload`.
3. In another terminal: `cd frontend && npm install && npm run dev`.
4. Open `http://localhost:3000`. Demo credentials: `guest@example.com` / `password123`; host: `host@example.com` / `password123`.

## Architecture

Next.js App Router holds pages and small UI components; `frontend/lib/api.ts` is the one fetch boundary. FastAPI routers group each API area, models contain persistence shape, and schemas contain request validation. SQLite keeps setup friction low.

| Entity | Purpose |
|---|---|
| User | guest or host, selected by `is_host` |
| Listing / Photo / Amenity | a host's home and its display information |
| Booking | guest, listing, check-in/out and guest count |
| Review | one completed booking's feedback |
| Favorite | a user's saved listing |

## API overview

- `/auth`: register, login and current user
- `/listings`: browse/search/paginate, detail, host CRUD
- `/bookings`: reserve, blocked date ranges, trips, host bookings
- `/favorites`, `/reviews`, `/uploads`: saved homes, completed-stay reviews, image upload

## Assumptions and shortcuts

- Prices are INR and the service fee is intentionally mocked in the UI.
- Date input is native HTML rather than a custom modal calendar; the server overlap check remains authoritative.
- Uploads go to `backend/uploads` and are served as static files. Replace the file write in `routers/uploads.py` with S3/Cloudinary to use cloud storage without changing callers.
- JWT is stored in localStorage because frontend and API run on separate local ports. In production, place both behind one origin and issue an httpOnly, secure cookie.
- A host is a superhost when their listings have at least 3 reviews averaging 4.8+. It is calculated at read time so it cannot become stale.

## Walkthrough notes

“I kept UI fetches in one API module so components explain user interaction rather than HTTP details. The booking endpoint performs the final availability decision: the interval query catches any intersecting ranges and protects against stale browser state. The UI mirrors simple guest/date rules for faster feedback, but handles 400 and 409 responses as the source of truth. Roles are deliberately a boolean because the assignment has only guest and host capabilities. Bonus features use replaceable boundaries: local upload is one function, superhost is a transparent derived rule, and the map is a client-only Leaflet component because it needs the browser window.”
