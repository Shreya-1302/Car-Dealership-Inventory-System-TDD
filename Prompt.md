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


