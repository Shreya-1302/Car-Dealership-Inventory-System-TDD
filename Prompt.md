# PROMPTS.md
## 1. TDD Prerequisites
### Prompt
I'm building a project named car-dealership-inventory-system using TDD approach. What are the prerequisites to follow TDD?
### Key Answer
* Follow the Red → Green → Refactor cycle.
* Define requirements before implementation.
* Use Jest for testing and Supertest for API testing.
* Use mongodb-memory-server for isolated database tests.
* Separate app configuration from server startup.
* Organize tests into unit and integration folders.
### Outcome
Established the TDD workflow and testing architecture for the project.

---
## 2. Testing Configuration
### Prompt
Any config file for testing?
### Key Answer
Create:
* `jest.config.js`

  * Node environment
  * Test matching configuration
  * Setup file configuration
  * Mock cleanup
  * Custom timeout
* `tests/setup.js`

  * Test environment variables
  * Test JWT secret
  * Test port
* Add Jest scripts in `package.json`.
### Outcome
Defined the testing configuration required for the project.

---

## 3. Jest Setup
### Prompt
Would you like me to create jest.config.js? Yes please.
### Key Answer
Created:

* `server/jest.config.js`
* `server/tests/setup.js`
* Added `"test:watch": "jest --watch"` script
### Outcome
Backend testing environment prepared for TDD development.

## 4. MongoDB Connection & Express App Setup

### Prompt

I want to do MongoDB connection and app setup. Can you help me with this? The testing part I will do by myself.

### Key Answer

Created the basic backend application structure:

* `server/src/config/db.js`

  * Configured Mongoose connection using `process.env.MONGO_URI`.
  * Added connection success and error handling.

* `server/src/app.js`

  * Configured Express middleware (`cors`, `express.json`).
  * Added a health check endpoint (`/api/health`).
  * Exported the Express app instance.

* `server/src/server.js`

  * Loaded environment variables using `dotenv`.
  * Connected to MongoDB.
  * Started the Express server on the configured port.

### Outcome
Established the backend foundation with MongoDB connectivity and Express application setup, ready for implementing features using TDD.
## Prompt 5

### Prompt

What test scenarios should I cover for the `registerUser` service? Please guide me through the implementation using TDD rather than providing the complete solution.

### Key Answer

Recommended covering the following behaviors:

* Successfully register a new user.
* Store the password in a hashed format.
* Prevent registration when the email is already in use.
* Return an error when required fields are missing.

### TDD Guidance

#### RED Phase

* Create a test file for the registration service.
* Configure the test database environment.
* Write tests describing the expected behaviors.
* Execute the tests and verify they fail initially.

#### GREEN Phase

* Implement the `registerUser` service.
* Validate the input fields.
* Check for existing users with the same email.
* Hash the password before persisting the user.
* Save and return the created user.
* Run the test suite until all tests pass.

#### REFACTOR Phase

* Clean up and simplify the implementation where appropriate.
* Remove duplication and improve readability.
* Confirm that all tests remain successful after refactoring.

### Outcome

Defined the test scenarios and implementation steps required to develop the `registerUser` service using the TDD workflow.

## Prompt 6
Guide me step by step to implement the `loginUser` service using TDD instead of giving the complete code.

### AI Response

Suggested the following test cases for the `loginUser` service:

- Return a JWT token when the email and password are correct.
- Throw an error if the password is incorrect.
- Throw an error if the email does not exist.

Then provided step-by-step guidance following the TDD approach:

#### Step 1 (RED)
- Create `tests/services/loginUser.test.js`.
- Set up an in-memory MongoDB database for testing.
- Create a test user with a hashed password.
- Write tests for successful login, incorrect password, and unknown email.
- Verify the returned JWT contains the expected payload (`userId` and `role`).
- Run the tests and confirm they fail.

#### Step 2 (GREEN)
- Create `src/services/loginUser.js`.
- Validate that the email and password are provided.
- Find the user by email.
- Compare the provided password with the stored hashed password using `bcrypt.compare()`.
- Generate and return a JWT using `jwt.sign()` with the user's ID and role.
- Run the tests again and verify they pass.

#### Step 3 (REFACTOR)
- Improve the implementation without changing its behavior.
- Run all tests to ensure they continue to pass.

## Prompt 7

### Prompt

Help me set up the initial authentication controller and routing structure for user registration and login.

### Key Answer

Generated the basic authentication layer consisting of:

#### `src/controllers/authController.js`

* Added controller methods for user registration and login.
* Connected each method to the appropriate service function.
* Returned JSON responses with suitable HTTP status codes.
* Included basic error handling for failed operations.

#### `src/routers/authRouter.js`

* Created a dedicated Express router for authentication.
* Configured the registration endpoint to invoke the register controller.
* Configured the login endpoint to invoke the login controller.
* Exported the router so it can be mounted in the application.

### Outcome

Established the authentication routing and controller structure, providing the entry points for registration and login functionality.

## Prompt 8

### Prompt

Explain how to build middleware for authentication and authorization, and guide me through the implementation process step by step.

### Key Answer

Outlined the implementation of middleware responsible for securing protected routes.

#### Step 1: Authentication Middleware (`src/middleware/authMiddleware.js`)

* Retrieve the token from the request's `Authorization` header.
* Ensure the token uses the `Bearer <token>` convention.
* Validate the token using `jwt.verify()` and the application's secret key.
* Store the decoded user information in `req.user`.
* Proceed to the next middleware using `next()`.
* Return a `401 Unauthorized` response when the token is absent or invalid.

#### Step 2: Authorization Middleware (`src/middleware/adminMiddleware.js`)

* Access the authenticated user information from `req.user`.
* Confirm that the user's role is `admin`.
* Allow the request to continue if the role check passes.
* Return a `403 Forbidden` response when the user lacks sufficient permissions.

### Outcome

Defined the authentication and role-based authorization middleware required to secure protected and admin-only routes.

## Prompt 9

### Prompt

I need to implement the `addVehicle` service using TDD. The service should create a vehicle when valid data is provided and throw an error when required fields are missing. Guide me through the process without changing the expected behavior.

### Key Answer

Provided guidance for implementing the `addVehicle` feature using the TDD workflow.

#### Step 1: RED Phase

* Create a test file for the `addVehicle` service.
* Write a test to verify that a vehicle is successfully created when all required fields are supplied.
* Write a test to verify that an error is thrown when any mandatory field is missing.
* Run the tests and confirm they fail initially.

#### Step 2: GREEN Phase

* Create the `addVehicle` service implementation.
* Validate that all required vehicle fields are present.
* Throw an appropriate error when validation fails.
* Create and save a new vehicle record when validation succeeds.
* Run the tests again and ensure they pass.

#### Step 3: REFACTOR Phase

* Improve code readability and structure where necessary.
* Remove duplication and simplify logic.
* Verify that all tests continue to pass after refactoring.

### Outcome

Implemented the `addVehicle` service with validation logic and database persistence while following the TDD cycle.
## Prompt 10

### Prompt

I need to implement a `viewAllVehicles` service using TDD. The service should return all vehicles from the database and return an empty list when no vehicles exist. Guide me through the implementation process.

### Key Answer

Provided a TDD-based approach for implementing the `viewAllVehicles` service.

#### Step 1: RED Phase

* Create a test file for the `viewAllVehicles` service.
* Write a test to verify that all stored vehicles are returned.
* Write a test to verify that an empty array is returned when no vehicles exist.
* Run the tests and confirm they fail initially.

#### Step 2: GREEN Phase

* Create the `viewAllVehicles` service.
* Retrieve all vehicle records from the database using the Vehicle model.
* Return the resulting collection of vehicles.
* Execute the tests and ensure they pass.

#### Step 3: REFACTOR Phase

* Review the implementation for simplicity and readability.
* Remove any unnecessary code.
* Verify that all tests continue to pass after refactoring.

### Outcome

Implemented a service that retrieves all vehicle records while validating the behavior through automated tests following the TDD workflow.
## Prompt 11

### Prompt

I need to implement an `updateVehicle` service using TDD. The service should update vehicle details for a valid ID and return an error when the vehicle does not exist or the ID is invalid. Guide me through the implementation process.

### Key Answer

Provided a TDD-based approach for implementing the `updateVehicle` service.

#### Step 1: RED Phase

* Create a test file for the `updateVehicle` service.
* Write a test to verify that vehicle details are updated successfully for a valid ID.
* Write a test to verify that an error is thrown when the vehicle does not exist.
* Write a test to verify that an error is returned for missing or invalid IDs.
* Run the tests and confirm they fail initially.

#### Step 2: GREEN Phase

* Create the `updateVehicle` service implementation.
* Validate the provided vehicle ID.
* Update the specified vehicle fields in the database.
* Return the updated vehicle document.
* Throw an error when no matching vehicle is found.
* Run the tests and ensure they pass.

#### Step 3: REFACTOR Phase

* Review the implementation for clarity and maintainability.
* Simplify logic where appropriate.
* Verify that all tests continue to pass after refactoring.

### Outcome

Implemented vehicle update functionality with validation for invalid or non-existent IDs while following the TDD workflow.

## Prompt 12

### Prompt

I need to implement a `deleteVehicle` service using TDD. The service should delete a vehicle for a valid ID and throw an error when the vehicle does not exist or the ID is invalid. Guide me through the implementation process.

### Key Answer

Provided a TDD-based approach for implementing the `deleteVehicle` service.

#### Step 1: RED Phase

* Create a test file for the `deleteVehicle` service.
* Write a test to verify that a vehicle is successfully deleted when a valid ID is provided.
* Write a test to verify that an error is thrown when the vehicle does not exist.
* Write a test to verify that an error is returned for missing or invalid IDs.
* Run the tests and confirm they fail initially.

#### Step 2: GREEN Phase

* Create the `deleteVehicle` service implementation.
* Validate the supplied vehicle ID.
* Delete the corresponding vehicle record from the database.
* Return the deleted vehicle document.
* Throw an error when no matching vehicle is found.
* Run the tests and ensure they pass.

#### Step 3: REFACTOR Phase

* Improve code readability and maintainability where necessary.
* Remove any redundant logic.
* Verify that all tests continue to pass after refactoring.

### Outcome

Implemented vehicle deletion functionality with proper validation and error handling while following the TDD workflow.




