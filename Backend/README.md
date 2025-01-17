# User Registration Endpoint

## Endpoint: `/users/register`

### Method: POST

### Description:
This endpoint is used to register a new user. It validates the input data, hashes the password, creates a new user in the database, and returns a JSON Web Token (JWT) along with the user details.

### Request Body:
The request body should be a JSON object with the following fields:

- `fullname`: An object containing:
  - `firstname`: A string with a minimum length of 3 characters (required).
  - `lastname`: A string with a minimum length of 3 characters (optional).
- `email`: A string representing a valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).

Example:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response Body:
The response body will be a JSON object with the following fields:

- `token`: A string representing the JWT token.
- `user`: An object containing:
  - `_id`: A string representing the user ID.
  - `fullname`: An object containing:
    - `firstname`: A string representing the user's first name.
    - `lastname`: A string representing the user's last name.
  - `email`: A string representing the user's email address.

Example:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "USER_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Response:
If there are validation errors, the response body will be a JSON object with the following fields:

- `errors`: An array of objects containing:
  - `msg`: A string representing the error message.
  - `param`: A string representing the field name where the error occurred.
  - `location`: A string representing the location of the error (e.g., "body").

Example:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### Example Request:
```bash
curl -X POST http://localhost:3000/users/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

### Example Response:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "USER_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

# User Login Endpoint

## Endpoint: `/users/login`

### Method: POST

### Description:
This endpoint is used to authenticate a user. It validates the input data, checks the user's credentials, and returns a JSON Web Token (JWT) along with the user details if the credentials are valid.

### Request Body:
The request body should be a JSON object with the following fields:

- `email`: A string representing a valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response Body:
The response body will be a JSON object with the following fields:

- `token`: A string representing the JWT token.
- `user`: An object containing:
  - `_id`: A string representing the user ID.
  - `fullname`: An object containing:
    - `firstname`: A string representing the user's first name.
    - `lastname`: A string representing the user's last name.
  - `email`: A string representing the user's email address.

Example:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "USER_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Response:
If there are validation errors, the response body will be a JSON object with the following fields:

- `errors`: An array of objects containing:
  - `msg`: A string representing the error message.
  - `param`: A string representing the field name where the error occurred.
  - `location`: A string representing the location of the error (e.g., "body").

Example:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### Example Request:
```bash
curl -X POST http://localhost:3000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

### Example Response:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "USER_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

# User Profile Endpoint

## Endpoint: `/users/profile`

### Method: GET

### Description:
This endpoint is used to retrieve the profile of the authenticated user.

### Request Headers:
The request should include the JWT token in the `Authorization` header or as a cookie.

Example:
```
Authorization: Bearer JWT_TOKEN_HERE
```

### Response Body:
The response body will be a JSON object containing the user details.

Example:
```json
{
  "_id": "USER_ID",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

### Error Response:
If the user is not authenticated, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.

Example:
```json
{
  "message": "Unauthorized"
}
```

### Example Request:
```bash
curl -X GET http://localhost:3000/users/profile \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Example Response:
```json
{
  "_id": "USER_ID",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

# User Logout Endpoint

## Endpoint: `/users/logout`

### Method: GET

### Description:
This endpoint is used to log out the authenticated user. It clears the JWT token from the cookies and blacklists the token.

### Request Headers:
The request should include the JWT token in the `Authorization` header or as a cookie.

Example:
```
Authorization: Bearer JWT_TOKEN_HERE
```

### Response Body:
The response body will be a JSON object with the following fields:

- `message`: A string representing the success message.

Example:
```json
{
  "message": "Logged out successfully"
}
```

### Error Response:
If the user is not authenticated, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.

Example:
```json
{
  "message": "Unauthorized"
}
```

### Example Request:
```bash
curl -X GET http://localhost:3000/users/logout \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Example Response:
```json
{
  "message": "Logged out successfully"
}
```


# Captain Registration Endpoint

## Endpoint: `/captains/register`

### Method: POST

### Description:
This endpoint is used to register a new captain. It validates the input data, hashes the password, creates a new captain in the database, and returns a JSON Web Token (JWT) along with the captain details.

### Request Body:
The request body should be a JSON object with the following fields:

- `fullname`: An object containing:
  - `firstname`: A string with a minimum length of 3 characters (required).
  - `lastname`: A string with a minimum length of 3 characters (optional).
- `email`: A string representing a valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).
- `vehicle`: An object containing:
  - `color`: A string with a minimum length of 3 characters (required).
  - `plate`: A string with a minimum length of 3 characters (required).
  - `capacity`: A number with a minimum value of 1 (required).
  - `vehicleType`: A string that must be one of the following values: `car`, `motorcycle`, `auto` (required).

Example:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Response Body:
The response body will be a JSON object with the following fields:

- `token`: A string representing the JWT token.
- `captain`: An object containing:
  - `_id`: A string representing the captain ID.
  - `fullname`: An object containing:
    - `firstname`: A string representing the captain's first name.
    - `lastname`: A string representing the captain's last name.
  - `email`: A string representing the captain's email address.
  - `vehicle`: An object containing:
    - `color`: A string representing the vehicle color.
    - `plate`: A string representing the vehicle plate.
    - `capacity`: A number representing the vehicle capacity.
    - `vehicleType`: A string representing the vehicle type.

Example:
```json
{
  "token": "JWT_TOKEN_HERE",
  "captain": {
    "_id": "CAPTAIN_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

### Error Response:
If there are validation errors, the response body will be a JSON object with the following fields:

- `errors`: An array of objects containing:
  - `msg`: A string representing the error message.
  - `param`: A string representing the field name where the error occurred.
  - `location`: A string representing the location of the error (e.g., "body").

Example:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### Example Request:
```bash
curl -X POST http://localhost:3000/captains/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}'
```

### Example Response:
```json
{
  "token": "JWT_TOKEN_HERE",
  "captain": {
    "_id": "CAPTAIN_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```
