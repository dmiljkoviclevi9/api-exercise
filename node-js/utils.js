const http = require("http");
// Helper function for making HTTP requests
async function httpRequest(apiURL, method, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(apiURL);
    const headers = {"Content-Type": "application/json",};
    const payload = data ? JSON.stringify(data) : "";
    headers["Content-Length"] = Buffer.byteLength(payload);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: headers,
    };

    console.log(`Sending ${options.method} HTTP request`);

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        console.log("Received HTTP response with status code:", res.statusCode);
        console.log("Response data:", responseData);
  
        let parsedData;
        try {
          parsedData = JSON.parse(responseData);
        } catch (error) {
          console.warn("Non-JSON response data:", responseData);
          parsedData = responseData;
        }
  
        if ((res.statusCode >= 200 && res.statusCode < 300) || res.statusCode === 400) {
          resolve({
            data: parsedData,
            statusCode: res.statusCode,
          });
        } else {
          console.error(`Unexpected response status code: ${res.statusCode}`);
          reject(new Error(`Unexpected response status code: ${res.statusCode}`));
        }
      });   
      
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject(error);
    });

    if (data) {
      const payload = JSON.stringify(data);
      console.log("Request payload:", payload);
      req.write(payload);
    }

    req.end();
  });
}

// Helper function for cleaning up
async function cleanupEntries(apiURL) {
  // Retrieve all entries in the store
  const response = await httpRequest(apiURL, "GET");
  const entries = response.data;

  // Check if the entries variable is an array
  if (!Array.isArray(entries)) {
    console.error("Error: entries is not an array. Received:", entries);
    return;
  }

  // Loop through the entries and send a DELETE request for each
  for (const entry of entries) {
    const payload = { main_key: entry.main_key.toString() };
    console.log('Sending DELETE request with payload:', payload);
    const response = await httpRequest(apiURL, "DELETE", payload);
    console.log('Response:', response.statusCode, response.data);
  }
}

module.exports = {
  httpRequest,
  cleanupEntries,
};
