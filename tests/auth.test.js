const request = require("supertest");
const app = require("../app");
const { User } = require("../models");

describe("Authentication API Tests", () => {
  let testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  let authToken;

  // Clean up before each test
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(testUser.name);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.role).toBe("user");
    });

    it("should not register user with existing email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send(testUser);

      // Second registration with same email
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("already exists");
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Register a user first
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.email).toBe(testUser.email);

      // Save token for other tests
      authToken = res.body.data.token;
    });

    it("should not login with invalid password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    beforeEach(async () => {
      // Register and login to get token
      await request(app).post("/api/auth/register").send(testUser);

      const loginRes = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      authToken = loginRes.body.data.token;
    });

    it("should get current user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.name).toBe(testUser.name);
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("should not get profile without token", async () => {
      const res = await request(app).get("/api/auth/me").expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Not authorized");
    });

    it("should not get profile with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe("User Model Tests", () => {
    it("should create user with hashed password", async () => {
      const user = await User.create(testUser);

      expect(user).toHaveProperty("id");
      expect(user.name).toBe(testUser.name);
      expect(user.email).toBe(testUser.email);
      expect(user.password).not.toBe(testUser.password); // Should be hashed
      expect(user.role).toBe("user");
      expect(user.isActive).toBe(true);
    });

    it("should compare password correctly", async () => {
      const user = await User.create(testUser);

      const isMatch = await user.comparePassword(testUser.password);
      expect(isMatch).toBe(true);

      const isWrong = await user.comparePassword("wrongpassword");
      expect(isWrong).toBe(false);
    });

    it("should not create user with duplicate email", async () => {
      await User.create(testUser);

      await expect(User.create(testUser)).rejects.toThrow();
    });
  });
});
