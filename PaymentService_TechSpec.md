# Payment Service – Tech Spec

## Overview
This Payment Service simulates charging users and retrieving their charge history. It exposes two endpoints and uses a single database table to store charge records. All input is validated, and errors are returned in a consistent JSON format.

## Endpoints

### 1. POST `/api/payments/charge`
- **Description:** Simulate charging a user a specified amount.
- **Request Body:**
  - `userId` (string, required): ID of the user to charge
  - `amount` (number, required): Amount to charge (must be > 0)
  - `description` (string, optional): Description of the charge
- **Responses:**
  - `201 Created`: Charge successful, returns charge object
  - `400 Bad Request`: Validation error
  - `404 Not Found`: User not found
  - `500 Internal Server Error`: Unexpected error

### 2. GET `/api/users/:id/charges`
- **Description:** Retrieve all charges for a given user.
- **Path Parameter:**
  - `id` (string, required): User ID
- **Responses:**
  - `200 OK`: Returns array of charge objects
  - `404 Not Found`: User not found
  - `500 Internal Server Error`: Unexpected error

## Database Table

### `charges`
| Column       | Type      | Description                |
|--------------|-----------|----------------------------|
| id           | string    | Primary key (UUID)         |
| user_id      | string    | Foreign key to users table |
| amount       | decimal   | Amount charged             |
| description  | string    | Charge description         |
| created_at   | datetime  | Timestamp                  |

## Error Handling
- All errors are returned as JSON objects:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Amount must be greater than 0"
    }
  }
  ```
- Error codes: `VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`
- HTTP status codes are used appropriately.

## Input Validation
- All required fields must be present and valid.
- Amount must be a positive number.
- User must exist for both endpoints.

## Goal
- The API simulates charging a user and retrieving their charge history, with robust validation and consistent error responses.

