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

# Captain Profile Endpoint

## Endpoint: `/captains/profile`

### Method: GET

### Description:
This endpoint is used to retrieve the profile of the authenticated captain.

### Request Headers:
The request should include the JWT token in the `Authorization` header or as a cookie.

Example:
```
Authorization: Bearer JWT_TOKEN_HERE
```

### Response Body:
The response body will be a JSON object containing the captain details.

Example:
```json
{
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
If the captain is not authenticated, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.

Example:
```json
{
  "message": "Unauthorized"
}
```

### Example Request:
```bash
curl -X GET http://localhost:3000/captains/profile \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Example Response:
```json
{
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

# Captain Logout Endpoint

## Endpoint: `/captains/logout`

### Method: GET

### Description:
This endpoint is used to log out the authenticated captain. It clears the JWT token from the cookies and blacklists the token.

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
  "message": "Logout successfully"
}
```

### Error Response:
If the captain is not authenticated, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.

Example:
```json
{
  "message": "Unauthorized"
}
```

### Example Request:
```bash
curl -X GET http://localhost:3000/captains/logout \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Example Response:
```json
{
  "message": "Logout successfully"
}
```

# Maps API Endpoints

## Get Coordinates Endpoint

### Endpoint: `/maps/get-coordinates`

### Method: GET

### Description:
This endpoint is used to get the coordinates (latitude and longitude) of a given address.

### Request Parameters:
The request should include the following query parameter:

- `address`: A string representing the address (required).

Example:
```bash
curl -X GET http://localhost:3000/maps/get-coordinates?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Response Body:
The response body will be a JSON object containing the coordinates.

Example:
```json
{
  "lat": 37.4224764,
  "lng": -122.0842499
}
```

### Error Response:
If there are validation errors or the address is not found, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.
- `error`: A string representing the detailed error message.

Example:
```json
{
  "message": "Coordinate not found",
  "error": "Google API Error: ZERO_RESULTS"
}
```

## Get Distance and Time Endpoint

### Endpoint: `/maps/get-distance-time`

### Method: GET

### Description:
This endpoint is used to get the distance and time between two locations.

### Request Parameters:
The request should include the following query parameters:

- `origin`: A string representing the origin address (required).
- `destination`: A string representing the destination address (required).

Example:
```bash
curl -X GET http://localhost:3000/maps/get-distance-time?origin=New+York,+NY&destination=Los+Angeles,+CA \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Response Body:
The response body will be a JSON object containing the distance and time.

Example:
```json
{
  "distance": {
    "text": "2,789 mi",
    "value": 4488370
  },
  "duration": {
    "text": "1 day 18 hours",
    "value": 151200
  }
}
```

### Error Response:
If there are validation errors or the origin/destination is not found, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.
- `error`: A string representing the detailed error message.

Example:
```json
{
  "message": "Error getting distance and time",
  "error": "Origin or destination not found"
}
```

## Get AutoComplete Suggestions Endpoint

### Endpoint: `/maps/get-suggestion`

### Method: GET

### Description:
This endpoint is used to get autocomplete suggestions for a given input.

### Request Parameters:
The request should include the following query parameter:

- `input`: A string representing the input query (required).

Example:
```bash
curl -X GET http://localhost:3000/maps/get-suggestion?input=1600+Amphitheatre \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Response Body:
The response body will be a JSON object containing the autocomplete suggestions.

Example:
```json
[
  {
    "description": "1600 Amphitheatre Parkway, Mountain View, CA, USA",
    "place_id": "ChIJ2eUgeAK6j4ARbn5u_wAGqWA"
  },
  // ...other suggestions...
]
```

### Error Response:
If there are validation errors or the input is not found, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.
- `error`: A string representing the detailed error message.

Example:
```json
{
  "message": "Error getting suggestions",
  "error": "Google API Error: INVALID_REQUEST"
}
```

# Ride Endpoints

## Create Ride Endpoint

### Endpoint: `/rides/create`

### Method: POST

### Description:
This endpoint is used to create a new ride. It validates the input data, calculates the fare, and creates a new ride in the database.

### Request Body:
The request body should be a JSON object with the following fields:

- `pickup`: A string representing the pickup address (required).
- `destination`: A string representing the destination address (required).
- `vehicleType`: A string that must be one of the following values: `auto`, `car`, `moto` (required).

Example:
```json
{
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "vehicleType": "car"
}
```

### Response Body:
The response body will be a JSON object containing the ride details.

Example:
```json
{
  "_id": "RIDE_ID",
  "user": "USER_ID",
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "fare": 100,
  "status": "pending",
  "otp": "123456"
}
```

### Error Response:
If there are validation errors or the ride creation fails, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.
- `error`: A string representing the detailed error message.

Example:
```json
{
  "message": "Error creating ride",
  "error": "Detailed error message"
}
```

### Example Request:
```bash
curl -X POST http://localhost:3000/rides/create \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "vehicleType": "car"
}'
```

### Example Response:
```json
{
  "_id": "RIDE_ID",
  "user": "USER_ID",
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "fare": 100,
  "status": "pending",
  "otp": "123456"
}
```

## Get Fare Endpoint

### Endpoint: `/rides/get-fare`

### Method: GET

### Description:
This endpoint is used to get the fare for a ride between two locations.

### Request Parameters:
The request should include the following query parameters:

- `pickup`: A string representing the pickup address (required).
- `destination`: A string representing the destination address (required).

Example:
```bash
curl -X GET http://localhost:3000/rides/get-fare?pickup=1600+Amphitheatre+Parkway,+Mountain+View,+CA&destination=1+Infinite+Loop,+Cupertino,+CA \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

### Response Body:
The response body will be a JSON object containing the fare details.

Example:
```json
{
  "auto": 50,
  "car": 100,
  "moto": 30
}
```

### Error Response:
If there are validation errors or the fare calculation fails, the response body will be a JSON object with the following fields:

- `message`: A string representing the error message.
- `error`: A string representing the detailed error message.

Example:
```json
{
  "message": "Error fetching fare",
  "error": "Detailed error message"
}
```
