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
