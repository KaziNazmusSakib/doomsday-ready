# Doomsday Ready

A small full-stack app that helps MCU fans plan their rewatch before *Avengers: Doomsday* and book an opening-night watch party.

- **Rewatch plan:** pick a movie and get every movie to watch first, each exactly once, in a valid order, with watched ticks, a progress bar and the remaining watch time.
- **Booking:** pick a cinema and a group size and get the fewest seat bundles that fill exactly that many seats, or "not possible".

## Tech stack

| Layer | Tools |
| --- | --- |
| Backend | Node.js, NestJS, TypeORM, PostgreSQL |
| Frontend | React (Vite), Tailwind CSS v4, Axios |
| Route checking | Postman |

## Project structure

```
doomsday-ready/
├── backend/
│   └── src/
│       ├── movies/
│       │   ├── entities/movie.entity.ts
│       │   ├── dto/                      request validation  
│       │   ├── logic/
│       │   │   ├── circular-check.ts     Feature 1: cycle detection
│       │   │   └── rewatch-order.ts      Feature 1: rewatch order
│       │   ├── movies.controller.ts
│       │   ├── movies.service.ts
│       │   └── movies.module.ts
│       └── cinemas/
│           ├── entities/cinema.entity.ts
│           ├── dto/
│           ├── logic/booking-quote.ts    Feature 2: booking quote
│           ├── cinemas.controller.ts
│           ├── cinemas.service.ts
│           └── cinemas.module.ts
├── frontend/
│   └── src/
│       ├── api/client.js                 Axios instance and API calls
│       ├── pages/                        Movies, RewatchPlan, Booking
│       └── App.jsx
├── docs/postman/                         exported Postman collection
└── README.md
```

## Run locally

### Prerequisites

Node.js 20 or newer, PostgreSQL, Git.

### 1. Database

Create an empty database:

```sql
CREATE DATABASE doomsday_ready;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Edit `.env` and set your PostgreSQL password:

```
PORT=3000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@127.0.0.1:5432/doomsday_ready
```

Start the API:

```bash
npm run start:dev
```

The API runs at `http://localhost:3000/api`. Tables are created automatically on first start.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:5173`.

### 4. Sample data

Create the movies in this order (the ids become 1 to 8), using `POST /api/movies`:

| # | Title | Year | Runtime | Prerequisite ids |
| --- | --- | --- | --- | --- |
| 1 | Iron Man | 2008 | 126 | none |
| 2 | Captain America: The First Avenger | 2011 | 124 | none |
| 3 | The Avengers | 2012 | 143 | 1, 2 |
| 4 | Captain America: Civil War | 2016 | 147 | 3 |
| 5 | Thor: Ragnarok | 2017 | 130 | none |
| 6 | Avengers: Infinity War | 2018 | 149 | 4, 5 |
| 7 | Avengers: Endgame | 2019 | 181 | 6 |
| 8 | Avengers: Doomsday | 2026 | 150 | 7 |

Create the cinemas with `POST /api/cinemas`:

| Name | Bundle sizes |
| --- | --- |
| Cinema A | 1, 3, 4 |
| Cinema B | 2, 5 |
| Cinema C | 6, 9, 20 |
| Cinema D | 4, 6 |

The prerequisite links come from the assessment. The release years and runtimes are sample values I chose.

## API

All routes are under `/api`.

| Method and path | Purpose |
| --- | --- |
| `POST /movies` | Create a movie |
| `GET /movies` | List movies |
| `PATCH /movies/:id` | Update a movie, including `watched` and `prerequisiteIds` |
| `GET /movies/:id/rewatch-order` | Rewatch order (Feature 1) |
| `POST /cinemas` | Create a cinema |
| `GET /cinemas` | List cinemas |
| `PATCH /cinemas/:id` | Update a cinema's name or bundle sizes (extra route, not in the brief) |
| `GET /cinemas/:id/booking?groupSize=6` | Booking quote (Feature 2) |

### Example: create a movie

```json
POST /api/movies
{ "title": "The Avengers", "releaseYear": 2012, "runtimeMinutes": 143, "prerequisiteIds": [1, 2] }
```

### Example: rewatch order

```json
GET /api/movies/4/rewatch-order
{
  "movieId": 4,
  "title": "Captain America: Civil War",
  "order": [
    { "id": 1, "title": "Iron Man", "releaseYear": 2008, "runtimeMinutes": 126, "watched": true },
    { "id": 2, "title": "Captain America: The First Avenger", "releaseYear": 2011, "runtimeMinutes": 124, "watched": true },
    { "id": 3, "title": "The Avengers", "releaseYear": 2012, "runtimeMinutes": 143, "watched": false }
  ],
  "watchedCount": 2,
  "totalCount": 3,
  "remainingRuntimeMinutes": 143
}
```

### Example: booking quote

```json
GET /api/cinemas/2/booking?groupSize=11
{
  "cinemaId": 2,
  "cinemaName": "Cinema B",
  "groupSize": 11,
  "possible": true,
  "bundleCount": 4,
  "bundles": [ { "size": 2, "count": 3 }, { "size": 5, "count": 1 } ]
}
```

When no exact combination exists, the response is `200` with `"possible": false` and a message.

### Errors

Errors use the shape `{ "code": "...", "message": ... }`.

| Status | Code | When |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid input |
| 400 | `PREREQUISITE_NOT_FOUND` | A prerequisite id does not exist |
| 404 | `MOVIE_NOT_FOUND` / `CINEMA_NOT_FOUND` | Unknown id |
| 409 | `CIRCULAR_DEPENDENCY` | A create or update would make a movie depend on itself, directly or through other movies |
| 409 | `DUPLICATE_TITLE` / `DUPLICATE_NAME` | Title or cinema name already exists |

## Algorithms

Both algorithms are plain TypeScript functions in `logic/` folders. They import nothing, use no libraries, and only use loops, arrays and plain objects.

### Circular dependency check (`circular-check.ts`)

Before a movie's prerequisites are saved, the check starts from each new prerequisite and walks its prerequisites with an iterative depth-first search, using a stack and a `visited` marker. If the walk ever reaches the movie being edited, saving it would create a cycle, and the API returns `409 CIRCULAR_DEPENDENCY`. A movie listed as its own prerequisite is caught the same way. Time: O(movies + links).

### Rewatch order (`rewatch-order.ts`)

A post-order depth-first search from the target movie. A movie is added to the result only after all of its prerequisites have been added, and a `visited` marker guarantees each movie appears once. The target is the last item added and is removed before returning. Time: O(movies + links).

### Booking quote (`booking-quote.ts`)

Minimum-coin-change dynamic programming. `best[n]` holds the fewest bundles that add up to exactly `n` seats, and `lastSize[n]` remembers which bundle was used last. The answer for the group size is rebuilt by stepping back through `lastSize`. Time: O(group size × number of bundle sizes), at most about 100,000 steps.

## Data model

```mermaid
erDiagram
    MOVIES ||--o{ MOVIE_PREREQUISITES : "has prerequisite"
    MOVIES ||--o{ MOVIE_PREREQUISITES : "is prerequisite of"

    MOVIES {
        int id PK
        varchar title UK
        int release_year
        int runtime_minutes
        boolean watched
    }
    MOVIE_PREREQUISITES {
        int movie_id PK,FK
        int prerequisite_id PK,FK
    }
    CINEMAS {
        int id PK
        varchar name UK
        integer_array bundle_sizes
    }
```

Prerequisites are a self-referencing many-to-many relation on movies. A cinema stores its bundle sizes as a PostgreSQL integer array. Movies and cinemas are independent of each other.

## Assumptions and choices

- The brief says "1–300" next to both release year and runtime. I applied 1–300 to the runtime in minutes and accepted release years from 1888 to 2100.
- `watched` defaults to `false`.
- Sending `prerequisiteIds` in a `PATCH` replaces the whole prerequisite list for that movie.
- A cinema's bundle sizes must all be different.
- Several bundle combinations can be optimal. The API returns one of them.
- The rewatch order is a valid order, not a unique one.
- If no exact combination exists, the booking route returns `200` with `possible: false` rather than an error.
- `synchronize: true` creates the tables automatically. That is convenient for this assessment, but a production system would use migrations.
- `PATCH /cinemas/:id` is an extra route that the brief allows.

## Testing

Routes were checked in Postman. The exported collection is in `docs/postman/`. It covers every example from the brief, validation errors, the circular-dependency cases and the booking edge cases.

## How I used AI

**Tool:** Claude (Anthropic), in the claude.ai chat.

**What I used it for:**

- **Setup and tooling:** step-by-step guidance for installing PostgreSQL, creating the repository, scaffolding NestJS and React with Vite and Tailwind v4, and fixing environment problems (port conflicts, TypeORM configuration, module registration).
- **Boilerplate:** Claude generated the entities, request validation, services and controllers, the Axios client, and the three React pages. I tested them in Postman and in the browser.
- **Algorithms:** I wrote `circular-check.ts`, `rewatch-order.ts` and `booking-quote.ts` myself. Claude described the general approach in words (graph traversal and dynamic programming) and reviewed my code. The edits it suggested were small, such as replacing `Map` and `Set` with plain objects and fixing TypeScript type annotations.
- **Documentation:** Claude drafted this README and the Mermaid diagram, which I checked against the code.

**How I checked the work:** I ran every example from the brief against the running API and tested the error cases by hand.