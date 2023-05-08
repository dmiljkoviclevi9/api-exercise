const proxyServer = require("./proxyServer");
const { httpRequest, cleanupEntries } = require("./utils");

const assert = require("assert");

const apiURL = "http://localhost:3000/default/exercise_api";
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test wrapper function
async function test(description, callback) {
  totalTests++;
  try {
    await callback();
    console.log(`\x1b[32m✓ ${description}\x1b[0m`);
    passedTests++;
  } catch (error) {
    console.error(`\x1b[31m✕ ${description}\x1b[0m`);
    console.error(error);
    failedTests++;
  }
}

(async () => {
  console.log("Running tests...\n");

  // Cleanup: Remove any entries before start
  await cleanupEntries(apiURL);
  
  // Test adding a new entry
  await test("Add a new entry", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: "test_key",
      value: "test_value",
    });
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data.main_key, "test_key");
    assert.strictEqual(response.data.value, "test_value");
  });

  // Test getting all entries and verify the new entry added by test is present
  await test("Get all entries and verify the entry added by test is present", async () => {
    const response = await httpRequest(apiURL, "GET");
    const entries = Array.isArray(response.data)
      ? response.data
      : [response.data];

    const entryExists = entries.some(
      (entry) => entry.main_key == "test_key" && entry.value == "test_value"
    );
    assert.strictEqual(
      entryExists,
      true,
      'The expected entry {"value": "test_value","main_key": "test_key"} is missing'
    );
  });

  // Test updating an entry
  await test("Update an existing entry", async () => {
    const response = await httpRequest(apiURL, "POST", {
      main_key: "test_key",
      value: "new_value",
    });
    assert.strictEqual(response.data.main_key, "test_key");
    assert.strictEqual(response.data.value, "new_value");
  });

  // Test updating a non-existent entry
  await test("Update a non-existent entry", async () => {
    const response = await httpRequest(apiURL, "POST", {
      main_key: "non_existent_key",
      value: "non_existent_value",
    });
    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.data, "value does not exist");
  });

  // Test deleting an entry
  await test("Delete an entry", async () => {
    const response = await httpRequest(
      apiURL,
      "DELETE",
      {
        main_key: "test_key",
      },
      "application/x-www-form-urlencoded"
    );
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data.main_key, "test_key");
  });

  // Test deleting a non-existent entry
  await test("Delete a non-existent entry", async () => {
    const response = await httpRequest(apiURL, "DELETE", {
      main_key: "non_existent_key",
    });
    if (response.statusCode !== 400) {
      console.error(
        "Bug: Should not be allowing attempt to delete a key that does not exist."
      );
    } else {
      console.log("Test OK");
    }
    assert.strictEqual(response.statusCode, 400);
  });

  // Test adding an entry with integer value
  await test("Add entry with integer value", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: "123",
      value: 456,
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Integer was added. API shouldn't allow adding a non-string value."
      );
    } else {
      console.log("API correctly rejects non-string values");
    }

    assert.strictEqual(response.statusCode, 400); // Assuming the API returns a 400 error for invalid data types
  });

  // Test adding an entry with boolean value
  await test("Add entry with boolean value", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: "true",
      value: false,
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Boolean was added. API shouldn't allow adding a non-string value."
      );
    } else {
      console.log("API correctly rejects non-string values");
    }

    assert.strictEqual(response.statusCode, 400); // Assuming the API returns a 400 error for invalid data types
  });

  // Test adding an entry with an object value
  await test("Add entry with object as value", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: "object_value",
      value: { key: "test" },
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Object was added. API shouldn't allow adding a non-string value."
      );
    } else {
      console.log("API correctly rejects non-string values");
    }

    assert.strictEqual(response.statusCode, 400); // Assuming the API returns a 400 error for invalid data types
  });

  // Test adding an entry with an array as the value
  await test("Add entry with array as value", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: "array_value",
      value: [1, 2, 3],
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Array was added. API shouldn't allow adding a non-string value."
      );
    } else {
      console.log("API correctly rejects non-string values");
    }

    assert.strictEqual(response.statusCode, 400); // Check the status code
  });

  // Test adding an entry with an integer main_key
  await test("Add entry with integer main_key", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: 123,
      value: "integer_key",
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Integer was added as main_key. API shouldn't allow a non-string main_key."
      );
    } else {
      console.log("API correctly rejects non-string main_keys");
    }

    assert.strictEqual(response.statusCode, 400);
  });

  // Test adding an entry with a boolean main_key
  await test("Add entry with boolean main_key", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: true,
      value: "boolean_key",
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Boolean was added as main_key. API shouldn't allow a non-string main_key."
      );
    } else {
      console.log("API correctly rejects non-string main_keys");
    }

    assert.strictEqual(response.statusCode, 400);
  });

  // Test adding an entry with an object main_key
  await test("Add entry with object as main_key", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: { key: "test" },
      value: "object_key",
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Object was added as main_key. API shouldn't allow a non-string main_key."
      );
    } else {
      console.log("API correctly rejects non-string main_keys");
    }

    assert.strictEqual(response.statusCode, 400);
  });

  // Test adding an entry with an array as the main_key
  await test("Add entry with array as main_key", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: [1, 2, 3],
      value: "array_key",
    });

    if (response.statusCode !== 400) {
      console.error(
        "Bug: Array was added as main_key. API shouldn't allow a non-string main_key."
      );
    } else {
      console.log("API correctly rejects non-string main_keys");
    }

    assert.strictEqual(response.statusCode, 400);
  });

  // Test: Check if PUT response is valid JSON
  test("PUT response is valid JSON", async () => {
    const response = await httpRequest(apiURL, "PUT", {
      main_key: "test_put_key",
      value: "test_put_value",
    });

    if (typeof response !== "object") {
      throw new Error("PUT response is not a valid JSON object");
    }
  });

  // Test: Check if POST response is valid JSON
  test("POST response is valid JSON", async () => {
    const response = await httpRequest(apiURL, "POST", {
      main_key: "test_post_key",
      value: "test_post_value",
    });

    if (typeof response !== "object") {
      throw new Error("POST response is not a valid JSON object");
    }
  });

  // Test: Check if DELETE response is valid JSON
  test("DELETE response is valid JSON", async () => {
    // First, ensure there is an entry to delete
    await httpRequest(apiURL, "PUT", {
      main_key: "test_delete_key",
      value: "test_delete_value",
    });

    const response = await httpRequest(apiURL, "DELETE", {
      main_key: "test_delete_key",
    });

    if (typeof response !== "object") {
      throw new Error("DELETE response is not a valid JSON object");
    }
  });

  // Test the quota limit
  await test("Verify the storage quota limit is 10 entries", async () => {
    // Count the existing number of entries
    const existingEntries = await httpRequest(apiURL, "GET");
    const existingEntryCount = existingEntries.data.length;

    let addedEntries = 0;
    let quotaExceeded = false;
    const maxEntries = 10;
    const maxAttempts = 20;

    // Keep adding entries until the quota is reached or an error occurs
    while (!quotaExceeded && addedEntries + existingEntryCount < maxAttempts) {
      const addEntry = await httpRequest(apiURL, "PUT", {
        main_key: `key${addedEntries}`,
        value: `value${addedEntries}`,
      });

      if (addEntry.statusCode === 400) {
        quotaExceeded = true;
        break;
      }

      addedEntries++;
    }

    // Request all the entries again
    const finalEntries = await httpRequest(apiURL, "GET");
    const finalEntryCount = finalEntries.data.length;

    // Check if the quota is as expected
    if (finalEntryCount > maxEntries) {
      throw new Error(
        `Quota limit should be 10, but it allowed ${finalEntryCount} entries.`
      );
    } else {
      console.log(
        `Quota limit test passed, the API allowed ${finalEntryCount} entries as expected.`
      );
    }
  });

  // Test if on reaching the quota limit the message is correct
  await test("Check if the quota limit message is as expected", async () => {
    const checkMessage = await httpRequest(apiURL, "PUT", {
      main_key: `checkQuotaMessage`,
      value: `value`,
    });

    // Assert that the message is correct
    assert.strictEqual(checkMessage.data, "you reached your quota");
  });

  // Print the summary
  console.log(`
  ---------------------------------------
  TEST SUMMARY
  ---------------------------------------
  
  ${totalTests} tests executed with \x1b[32m${passedTests} passing\x1b[0m and \x1b[31m${failedTests} failing\x1b[0m.
  
  
    \x1b[33mNOTE:\x1b[0m Please note that the functionality of the PUT and POST methods has been reversed in this API. 
      This means that using the PUT method will have the effect of a POST request, and using the POST method will have
      the effect of a PUT request. This unexpected behavior could lead to confusion and errors, 
      so please take this into account when using this API. 
  
  `);

  // Close the server after all tests have completed
  proxyServer.close(() => {
    console.log("Proxy server closed");
  });
})();
