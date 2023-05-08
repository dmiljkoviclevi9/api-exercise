# api-exercise
[![Test](https://img.shields.io/badge/setup-automated-blue?logo=npm)](https://github.com/dmiljkoviclevi9/api-exercise/actions/workflows/nodejs-test.yml)
[![Test](https://badgen.net/badge/failing/8/red)](https://github.com/dmiljkoviclevi9/api-exercise/actions/runs/4909558166/jobs/8766037036)
[![Test](https://badgen.net/badge/passing/11/green)](https://github.com/dmiljkoviclevi9/api-exercise/actions/runs/4909558166/jobs/8766037036)

**Install Node.js**: To use this test project locally, you need to have Node.js installed. If you don't have Node.js installed, you should download and install it from the official [Node.js website](https://nodejs.org/). Follow the installation instructions for your operating system. Any version should work, but LTS version is usually recommended.

# Overview
This project provides automated testing for the CRUD operations of a REST API.
To run tests, clone the repository and open a terminal window in the root directory. Then, run the command **npm test**. To clean up the API storage, run the command **npm run clr**.

### [Run Node.js Test](https://github.com/dmiljkoviclevi9/api-exercise/actions/workflows/nodejs-test.yml)
Run the workflow, open the finished Node.js Test run and check the results in "Run tests" step.

# Tests
|#| Test | Flow | Method | Status |
| -------- | -------- | -------- | -------- | -------- |
|1.| Add a new entry | Happy | PUT | Passing ✅ |
|2.| Get all entries and verify the entry added by test is present | Happy | GET | Passing ✅ |
|3.| Update an existing entry | Happy | POST | Passing ✅ |
|4.| Update a non-existent entry | Unhappy | POST | Failing ❌ - 'value **dose** not exist' |
|5.| Delete an entry | Happy | DELETE | Passing ✅ |
|6.| Delete a non-existent entry | Unhappy | DELETE | Failing ❌ - expected 400, actual 200 OK |
|7.| Add entry with integer value | Unhappy | PUT | Failing ❌ - expected 400, actual 200 OK|
|8.| Add entry with boolean value | Unhappy | PUT | Failing ❌ - expected 400, actual 200 OK|
|9.| Add entry with object as value | Unhappy | PUT | Failing ❌ - expected 400, actual 200 OK|
|10.| Add entry with array as value | Unhappy | PUT | Failing ❌ - expected 400, actual 200 OK|
|11.| Add entry with integer main_key | Unhappy | PUT | Passing ✅ |
|12.| Add entry with boolean main_key | Unhappy | PUT | Passing ✅ |
|13.| Add entry with object as main_key | Unhappy | PUT | Passing ✅ |
|14.| Add entry with array as main_key | Unhappy | PUT | Passing ✅ |
|15.| POST response is valid JSON | Happy | POST | Passing ✅ |
|16.| PUT response is valid JSON | Happy | PUT | Passing ✅ |
|17.| DELETE response is valid JSON | Happy | DELETE | Passing ✅ |
|18.| Verify the storage quota limit is 10 entries | Happy | PUT | Failing ❌ - Quota limit should be 10, but API allows 11 entries.|
|19.| Check if the quota limit message is as expected | Happy | PUT | Failing ❌ - 'you reached your **quta**'|
