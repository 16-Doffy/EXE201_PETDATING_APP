# PetDating Admin Backend

Spring Boot admin API scaffold for the EXE201 PetDating MongoDB dataset.

## Requirements

- Java 17+
- Maven 3.9+
- MongoDB running locally
- Seeded database `bosistive`

## Environment variables

- `PORT`: HTTP port for the Spring Boot server. Defaults to `8080`.
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string. Defaults to `mongodb://localhost:27017/bosistive`.
- `ADMIN_CORS_ALLOWED_ORIGIN_PATTERNS`: Comma-separated allowed origins/patterns. Defaults to localhost origins plus `https://*.vercel.app`.

## Run

```bash
cd backend
mvn spring-boot:run
```

Default Mongo URI:

```text
mongodb://localhost:27017/bosistive
```

## Deploy

This backend is a standalone Spring Boot service. The current root `vercel.json` only exports the Expo web frontend, so `/api/v1/admin/*` is not served by the Vercel frontend deployment by default.

Deploy the backend to a Java host such as Render, Railway, Fly.io, or your own VM/container, then set these environment variables on that backend service:

```text
PORT=8080
SPRING_DATA_MONGODB_URI=<your-mongodb-uri>
ADMIN_CORS_ALLOWED_ORIGIN_PATTERNS=https://exe-201-petdating-app.vercel.app,https://*.vercel.app
```

The admin sign-in now authenticates against the MongoDB `users` collection. Create or update a document with:

```json
{
  "username": "admin",
  "email": "admin@petdating.local",
  "passwordHash": "{noop}Admin123!",
  "roles": ["ADMIN"],
  "status": "ACTIVE"
}
```

`{noop}` is supported for local/dev seeding. Replace it with a stronger encoded hash before using this flow in a shared or production environment.

After the backend is live, set the frontend build variable on Vercel:

```text
EXPO_PUBLIC_ADMIN_API_URL=https://<your-deployed-admin-api-host>
```

Example:

```text
EXPO_PUBLIC_ADMIN_API_URL=https://petdating-admin-api.onrender.com
```

Use the backend base URL only. Do not point `EXPO_PUBLIC_ADMIN_API_URL` at `https://exe-201-petdating-app.vercel.app` unless you separately add a same-origin proxy for `/api`.

## Admin endpoints

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/{userId}`
- `PATCH /api/v1/admin/users/{userId}/status`
- `GET /api/v1/admin/pets`
- `GET /api/v1/admin/pets/{petId}`
- `PATCH /api/v1/admin/pets/{petId}/moderation`

## Example requests

Update user status:

```http
PATCH /api/v1/admin/users/661c00000000000000000001/status
Content-Type: application/json

{
  "status": "SUSPENDED"
}
```

Update pet moderation:

```http
PATCH /api/v1/admin/pets/661c00000000000000000101/moderation
Content-Type: application/json

{
  "isVisible": false,
  "status": "ARCHIVED"
}
```
