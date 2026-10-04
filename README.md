# MovieBook (movie ticket booking)

A movie booking website with a public browsing experience, user accounts and an admin panel.

- **Frontend (does most of the work):** React 18, Vite, React Router, Axios. It holds the movie catalog, poster images and all poster handling.
- **Backend (kept small):** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt. It only handles **sign up / sign in, the admin role, and seat bookings**.

---

## How the work is split

| Frontend | Backend |
|---|---|
| All movie data (`src/data/movies.js`) | Sign up and sign in (users) |
| All poster images (`public/posters`) | Admin login check (from `.env`) |
| Poster upload, resize and preview (in the browser) | Seat bookings and double-booking protection |
| Admin add / delete movie | Admin cancel booking, and cancel a deleted movie's bookings |
| Home, movie list, movie details, seat map layout | Who is allowed to do what (roles) |

**Nothing is seeded in the database.** MongoDB stays empty until a user registers or books a seat. The admin account is not stored in the database at all: the backend compares the login against `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`.

**The frontend works without the backend.** If the backend is off, visitors can still see the home page, all movies, posters, details and showtimes. Only signing in, seeing taken seats and booking need the backend (the page shows a clear notice).

---

## Who can do what

| Action | Visitor | User | Admin |
|---|:--:|:--:|:--:|
| See movie titles, posters, details, showtimes | Yes | Yes | Yes |
| Open a movie and look at the seat map | Yes | Yes | Yes |
| Select seats | Yes | Yes | n/a |
| **Confirm a booking** | Must sign in | Yes | No |
| See "My bookings" | No | Yes | No |
| Add a movie (with poster) | No | No | Yes |
| Delete a movie | No | No | Yes |
| Cancel any user's booking | No | No | Yes |

A visitor can pick seats, press **Sign in to book**, sign in or register, and return to the same movie with the seats still selected.

### Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `admin123` |
| User | Anyone registers on the **Create account** page | Their own (min 6 characters) |

You wrote the admin password as "admin 123"; I used `admin123` with no space. Change it in `backend/.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) and restart the backend. Registering with the admin email is blocked.

---

## Run it locally

Requirements: Node.js 18+, and MongoDB running locally (or a MongoDB Atlas link in `backend/.env`).

**Backend**
```bash
cd backend
npm install
npm run dev
```
You should see `MongoDB connected` and `Server running on http://localhost:5000`.

**Frontend** (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

To see the frontend-only behaviour, run just the frontend. Movies and posters still appear.

### Try it
1. Browse movies without signing in, open one and look at the seats.
2. Select seats, press **Sign in to book**, create an account, and book. See it under **My bookings**.
3. Sign out and sign in as the admin. In the **Admin panel** you can view all bookings, cancel one, add a movie (with a poster) or delete a movie.

---

## Managing movies (important)

The movie list is stored in the frontend:

- **Permanent catalog for everyone:** edit `frontend/src/data/movies.js` and put the poster image in `frontend/public/posters/`.
- **Admin panel add / delete:** these changes are saved in **the admin's browser only** (localStorage). Other visitors will not see them, because there is no movie database. This is the trade-off of keeping movies out of the backend.
- **Making admin changes permanent:** in Admin panel > Movies, press **Export catalog**. It downloads a ready-made `movies.js`. Replace `frontend/src/data/movies.js` with it and rebuild. Posters added through the panel are embedded in that file as small images.
- **Restore defaults** in the same place clears the browser changes.
- When the admin deletes a movie, the frontend also asks the backend to cancel that movie's active bookings. If the backend is off at that moment, the movie is still deleted and the panel tells you to cancel the bookings later from the Bookings tab.

The 11 posters from your project are in the catalog. The descriptions, durations, genres and prices are starter data I wrote, so check them in `movies.js`.

---

## Configuration (`backend/.env`)

| Variable | Meaning | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection | `mongodb://localhost:27017/moviebook` |
| `PORT` | Backend port | `5000` |
| `FRONTEND_URL` | Allowed browser origin (CORS) | `http://localhost:5173` |
| `JWT_SECRET` | Signs login tokens. **Change before deploying.** | placeholder |
| `ADMIN_EMAIL` | Admin login email | `admin@gmail.com` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |

`frontend/.env` holds `VITE_API_URL=/api`. In development Vite forwards `/api` to the backend. If you host them on different domains, set `VITE_API_URL` to the full backend URL, e.g. `https://your-api.example.com/api`.

The default database name changed to `moviebook`, so an old `movie` database from the previous version will not interfere.

---

## Project structure

```
movie-booking/
├── backend/
│   ├── .env / .env.example
│   └── src/
│       ├── server.js                App setup, routes, error handler
│       ├── config/                  db.js, cors.js
│       ├── models/                  User, Booking
│       ├── middleware/auth.js       JWT check, admin check, admin token
│       ├── controllers/             authController, bookingController
│       ├── routes/                  authRoutes, bookingRoutes
│       └── utils/validators.js
└── frontend/
    ├── public/posters/              Poster images
    └── src/
        ├── data/movies.js           The movie catalog
        ├── lib/catalog.js           Read / add / delete / export movies (browser)
        ├── lib/image.js             Poster validation, resize, preview (browser)
        ├── api/                     Axios client; booking calls only
        ├── context/AuthContext      Login state
        ├── components/              Navbar, MovieCard, SeatGrid, ConfirmDialog, RequireRole…
        ├── pages/                   Home, Movies, MovieDetail, Login, Register,
        │                            MyBookings, AdminDashboard, AddMovie, Info
        └── styles/styles.css
```

## API reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a user |
| POST | `/api/auth/login` | Public | Sign in as user or admin |
| GET | `/api/auth/me` | Signed in | Current account |
| GET | `/api/bookings/booked?movieId=&showtime=` | Public | Taken seats for a show |
| POST | `/api/bookings` | User | Book seats |
| GET | `/api/bookings/mine` | User | Own bookings |
| GET | `/api/bookings` | Admin | All bookings |
| DELETE | `/api/bookings/:id` | Admin | Cancel one booking (seats freed) |
| DELETE | `/api/bookings/movie/:movieId` | Admin | Cancel all active bookings of a movie |

Role checks run on the server, so hiding a button is never the only protection.

## Things to know

- **Seat price trust:** because prices live in the frontend, the backend uses the price the frontend sends (checked only to be between 1 and 10,000). A technical user could send a lower price. If real payments matter later, keep prices in the backend.
- **Booking records** store the movie id and title as text. My bookings looks up the poster from the frontend catalog, and shows a placeholder if the movie was deleted.
- Users cannot cancel their own bookings (as requested). Only the admin can.
- A user can book up to 10 seats at once. A database index prevents two bookings holding the same seat, even if two people press Book at the same moment.

## Before deploying

1. Set a long random `JWT_SECRET` and a strong `ADMIN_PASSWORD`. The default admin password is public in this README.
2. Use MongoDB Atlas for `MONGO_URI` and set `FRONTEND_URL` to your real frontend address.
3. Run `npm run build` in `frontend/` and host the `dist` folder (Netlify, Vercel…). Host the backend on Render, Railway or similar, and set `VITE_API_URL` to its `/api` URL.
