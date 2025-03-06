import status from "http-status";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";

describe("Auth Routes", () => {
  let server: any;

  beforeAll(async () => {
    server = app.listen();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should register a new user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      fullName: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      password: "@Password123",
      confirmPassword: "@Password123",
    });
    expect(res.status).toBe(status.CREATED);
    expect(res.body).toHaveProperty("data");
  });

  it("should not register with existing email", async () => {
    await request(server).post("/api/auth/register").send({
      fullName: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      password: "@Password123",
      confirmPassword: "@Password123",
    });
    const res = await request(server).post("/api/auth/register").send({
      fullName: "Test User 2",
      username: "testuser2",
      email: "testuser@example.com",
      password: "@Password123",
      confirmPassword: "@Password123",
    });
    expect(res.status).toBe(status.BAD_REQUEST);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login an existing user", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "@Password123",
    });
    expect(res.status).toBe(status.OK);
    expect(res.body).toHaveProperty("data");
  });

  it("should not login with incorrect credentials", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(status.BAD_REQUEST);
    expect(res.body.message).toBe("Incorrect email or password");
  });
});
