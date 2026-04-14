# PetDating Admin Backend

Spring Boot admin API scaffold for the EXE201 PetDating MongoDB dataset.

## Requirements

- Java 17+
- Maven 3.9+
- MongoDB running locally
- Seeded database `bosistive`

## Run

```bash
cd backend
mvn spring-boot:run
```

Default Mongo URI:

```text
mongodb://localhost:27017/bosistive
```

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
