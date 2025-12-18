// testAll.js
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const testAuth = async() => {
    console.log("--- Testing Authentication ---");
    try {
        // Register user
        const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: "John Doe",
            email: "john@example.com",
            password: "123456",
        });
        console.log("Register Success:", registerRes.data);

        // Login user
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: "john@example.com",
            password: "123456",
        });
        console.log("Login Success:", loginRes.data);

        return loginRes.data.token;
    } catch (err) {
        const message =
            err.response && err.response.data ? err.response.data : err.message;
        console.error("Backend Error:", message);
    }
};

const testProducts = async(token) => {
    console.log("\n--- Testing Products ---");
    try {
        const res = await axios.get(`${BASE_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Products List:", res.data);
    } catch (err) {
        const message =
            err.response && err.response.data ? err.response.data : err.message;
        console.error("Backend Error:", message);
    }
};

const testOrders = async(token) => {
    console.log("\n--- Testing Orders ---");
    try {
        const res = await axios.post(
            `${BASE_URL}/orders`, {
                items: [{ product_id: 1, quantity: 1 }],
                shipping_address: "123 Test Street",
            }, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("Order Created:", res.data);
    } catch (err) {
        const message =
            err.response && err.response.data ? err.response.data : err.message;
        console.error("Backend Error:", message);
    }
};

const runTests = async() => {
    const token = await testAuth();
    if (!token) return;

    await testProducts(token);
    await testOrders(token);
};

runTests();