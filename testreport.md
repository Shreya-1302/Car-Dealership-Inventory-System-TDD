# Car Dealership Inventory System - Test Report

**Generated on:** July 22, 2026  
**Test Framework:** Jest (Latest)  
**Total Test Cases:** 41  
**Test Result:** ALL TESTS PASSED

---

## Test Summary

| Metric         | Result                |
|----------------|-----------------------|
| Test Suites    | 11 passed / 11 total  |
| Tests          | 41 passed / 41 total  |
| Snapshots      | 0 total               |
| Time           | 16.07 seconds         |

---

## Code Coverage Report

| File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   |
|------------------------|---------|----------|---------|---------|---------------------|
| **All files**          | **93.39**| **92.13** | **95.23**| **93.39**|                     |
| **services**           | **96.8** | **95.89** | **100**  | **96.8** |                     |
| ├─ addvehicle.js       | 100     | 100      | 100     | 100     |                     |
| ├─ deletevehicle.js    | 100     | 100      | 100     | 100     |                     |
| ├─ loginuser.js        | 93.33   | 90       | 100     | 93.33   | 8                   |
| ├─ purchasevehicles.js | 91.66   | 87.5     | 100     | 91.66   | 6                   |
| ├─ registeruser.js     | 100     | 100      | 100     | 100     |                     |
| ├─ restockvehicle.js   | 91.66   | 91.66    | 100     | 91.66   | 8                   |
| ├─ searchvehicles.js   | 100     | 100      | 100     | 100     |                     |
| ├─ updatevehicle.js    | 100     | 100      | 100     | 100     |                     |
| └─ viewallvehicles.js  | 100     | 100      | 100     | 100     |                     |
| **src**                | **91.66**| **100**   | **0**    | **91.66**|                     |
| └─ app.js              | 91.66   | 100      | 0       | 91.66   | 18                  |
| **src/controllers**    | **86.66**| **50**    | **100**  | **86.66**|                     |
| ├─ authcontrollers.js  | 87.5    | 100      | 100     | 87.5    | 17, 31              |
| └─ vehiclecontroller.js| 86.36   | 50       | 100     | 86.36   | 26,43,51,60,69,79   |
| **src/middleware**     | **89.47**| **83.33** | **100**  | **89.47**|                     |
| ├─ adminMiddleware.js  | 100     | 100      | 100     | 100     |                     |
| └─ authMiddleware.js   | 86.66   | 75       | 100     | 86.66   | 16, 29              |
| **src/models**         | **100**  | **100**   | **100**  | **100**  |                     |
| ├─ User.js             | 100     | 100      | 100     | 100     |                     |
| └─ Vehicle.js          | 100     | 100      | 100     | 100     |                     |
| **src/routes**         | **100**  | **100**   | **100**  | **100**  |                     |
| ├─ authrouter.js       | 100     | 100      | 100     | 100     |                     |
| └─ vehiclerouter.js    | 100     | 100      | 100     | 100     |                     |

---

## Detailed Test Results

### Test Suites & Features

- **API Route Integration Tests (`tests/services/auth.test.js` & `tests/services/vehicle.test.js`):**
  - Registration API
  - Login API
  - Route authorization checks (Token presence/validation)
  - Admin-only routes access controls (Delete and Restock)
  - Vehicle CRUD route checks
  - Purchase vehicle API
  - Restock vehicle API
- **Unit / Service Layer Tests:**
  - `registerUser` service (Password hashing, duplicates, missing inputs)
  - `loginUser` service (Wrong credentials, missing inputs, valid JWT payload generation)
  - `addVehicle` service (Validation inputs, record storage)
  - `viewAllVehicles` service (Retrieval list, empty list handling)
  - `searchVehicles` service (Dynamic query building, regex search, price ranges)
  - `updateVehicle` service (Updating existing records, invalid ID handling)
  - `deleteVehicle` service (Deletions, invalid ID handling)
  - `purchaseVehicle` service (Stock level decrementing, out-of-stock validation)
  - `restockVehicle` service (Stock replenishment, decimal/negative values validation)

---

## Test Categories Summary

| Test Suite Type   | Tests Passed | Tests Failed | Success Rate |
|-------------------|--------------|--------------|---------------|
| Integration Tests | 12           | 0            | 100%          |
| Unit Tests        | 29           | 0            | 100%          |
| **TOTAL**         | **41**       | **0**        | **100%**      |

---

## Test Quality Metrics

### Error Handling Coverage

- "Vehicle not found" assertions for update, delete, purchase, and restock operations.
- "Invalid email or password" and "Email already in use" assertions.
- Input validation checks:
  - Missing field errors on vehicle creation.
  - Invalid restock quantity checks (decimal, negative, zero, non-numeric).
  - Out of stock checks for purchases.

### Edge Case Coverage

- Invalid/Malformatted MongoDB ObjectId validation checks.
- Empty search query results checks.
- Role privilege escalation rejection (`403 Forbidden` checks).
- Unauthorized request blocking (`401 Unauthorized` checks).

### Data Integrity

- Separate isolated databases created using MongoDB Memory Server per test file.
- Clean database collection deletes before each test suite execution.
- Auto-cleanup of connection processes.

---

## Performance Analysis

| Metric                 | Value    | Status      |
|------------------------|----------|-------------|
| Average Test Duration  | ~110ms   | Good        |
| Slowest Test Suite     | 6.518s   | Acceptable  |
| Fastest Test           | <1ms     | Optimal     |
| Total Execution Time   | 16.069s  | Good        |

---

## Conclusion

### Success Criteria Met

- All 41 test cases successfully executed and passed.
- 93.39% overall statements coverage achieved.
- 92.13% branch coverage and 95.23% function coverage.
- Secure authentication blocks and authorization roles completely mapped and verified.
- Business flow validations (e.g. inventory tracking, duplicate registrations) thoroughly covered.

---

**Report Status:** COMPLETE - ALL 41 TESTS PASSED
