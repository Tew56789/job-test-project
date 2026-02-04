const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");

beforeAll(async () => {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/job-test-db-test"
  );
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /applications", () => {

  test("success create application", async () => {
    const res = await request(app)
      .post("/applications")
      .send({
        name: "John Doe",
        email: "john@test.com",
        jobTitle: "QA Engineer"
      });

    expect(res.statusCode).toBe(201);
  });

  test("very long name", async () => {
    const longName = "a".repeat(200);

    const res = await request(app)
      .post("/applications")
      .send({
        name: longName,
        email: "long@test.com",
        jobTitle: "QA Engineer"
      });

    expect(res.statusCode).toBe(201);
  });

});
