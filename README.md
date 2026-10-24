# Profile Intelligence Service

A RESTful API built with Node.js, Express, and MySQL that enriches user-provided names with demographic estimates from Genderize, Agify, and Nationalize.

The service aggregates external API responses, classifies estimated age groups, and persists validated profiles for retrieval and filtering.

## Features

- **Multi-API enrichment:** Fetches gender, age, and country probability estimates from three external APIs concurrently.
- **Age classification:** Categorizes estimated ages into child (0–12), teenager (13–19), adult (20–59), and senior (60+).
- **Country selection:** Selects the country with the highest reported probability.
- **Data persistence:** Stores enriched profiles in MySQL.
- **Duplicate handling:** Returns existing profiles for previously processed names, avoiding unnecessary API calls.
- **UUID v7:** Uses time-sortable UUIDs for profile identifiers.
- **Filtering:** Supports case-insensitive filtering by gender, country code, and age group.
- **Validation and error handling:** Rejects invalid input and prevents incomplete upstream data from being stored.
- **Standardized responses:** Provides consistent JSON responses and HTTP status codes.
- **Connection pooling:** Uses `mysql2/promise` for database connections.

## Tech Stack

- Node.js (ES modules)
- Express.js
- MySQL 8.0+
- MySQL2
- Axios
- UUID
- dotenv
- CORS

## Architecture

The application follows a modular MVC-style architecture with separated business logic and data access.

```text
src/
├── app.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils
└── utils/
server.js
schema.sql
```

- `server.js` — Application entry point.
- `src/app.js` — Express configuration and middleware.
- `src/controllers/` — HTTP request and response handling.
- `src/services/` — Business logic and external API integrations.
- `src/models/` — Database queries and persistence.
- `src/utils/` — Shared utilities and response formatting.
- `schema.sql` — Database schema.

## Getting Started

### Prerequisites

- Node.js
- MySQL 8.0+
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Chidiogoezeh/Task-1_Data-Persistence---API-Design.git
cd profile-intelligence-service
```

Install dependencies:

```bash
npm install
```

### Database Setup

Create a MySQL database and execute the provided `schema.sql` file to create the required tables.

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=profile_db
```

Replace the example database credentials with your local configuration.

### Run the Application

Development:

```bash
npm run dev
```

Production:

```bash
node server.js
```

The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint            | Description                             |
| ------ | ------------------- | --------------------------------------- |
| POST   | `/api/profiles`     | Create or retrieve an existing profile  |
| GET    | `/api/profiles`     | Retrieve profiles with optional filters |
| GET    | `/api/profiles/:id` | Retrieve a profile by UUID              |
| DELETE | `/api/profiles/:id` | Delete a profile                        |

### 1. Create a Profile

`POST /api/profiles`

Request body:

```json
{
  "name": "Ella"
}
```

The service retrieves demographic estimates, validates the aggregated data, classifies the estimated age, and stores the resulting profile. If a matching profile already exists, it returns the existing record.

### 2. Get All Profiles

`GET /api/profiles`

Optional query parameters:

- `gender` — Filter by estimated gender.
- `country_id` — Filter by country code.
- `age_group` — Filter by age classification.

Example:

```http
GET /api/profiles?gender=male&country_id=NG
```

### 3. Get a Single Profile

`GET /api/profiles/:id`

Retrieves a profile using its UUID.

### 4. Delete a Profile

`DELETE /api/profiles/:id`

Deletes the specified profile and returns `204 No Content` on success.

## Error Handling

Errors use a consistent JSON structure:

```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

| Status | Meaning                                            |
| ------ | -------------------------------------------------- |
| `400`  | Missing or empty name                              |
| `404`  | Profile not found                                  |
| `422`  | Invalid input data                                 |
| `502`  | External API failure or insufficient upstream data |

## External APIs

- [Genderize](https://genderize.io/) — Estimates gender from a name.
- [Agify](https://agify.io/) — Estimates age from a name.
- [Nationalize](https://nationalize.io/) — Estimates likely nationality from a name.

These services provide statistical estimates, not verified demographic facts.

## License

Add your chosen license here if the project is intended for public reuse.
