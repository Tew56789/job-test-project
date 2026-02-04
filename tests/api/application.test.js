require("dotenv").config({ path: ".env.test" });

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");

/* ----------------- DB SETUP ----------------- */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db
      .collection("applications")
      .deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

/* ----------------- HELPER ----------------- */
const createApplication = async () => {
  return await request(app)
    .post("/applications")
    .send({
      name: "John Doe",
      email: "john@test.com",
      jobTitle: "QA Engineer",
    });
};

/* ----------------- TESTS ----------------- */
describe("POST /applications", () => {

  // ✅ Happy case
  test("success create application", async () => {
    const res = await createApplication();
    expect(res.statusCode).toBe(201);
  });

  // ❌ name ยาวเกิน
  test("should fail when name is too long", async () => {
    const longName = "a".repeat(200);

    const res = await request(app)
      .post("/applications")
      .send({
        name: longName,
        email: "long@test.com",
        jobTitle: "QA Engineer",
      });

    expect(res.statusCode).toBe(400);
  });

  // ❌ email format ผิด
  test("should fail with invalid email", async () => {
    const res = await request(app)
      .post("/applications")
      .send({
        name: "John Doe",
        email: "invalid-email",
        jobTitle: "QA Engineer",
      });

    expect(res.statusCode).toBe(400);
  });

  // ❌ ส่งข้อมูลไม่ครบ
  test("should fail when missing required fields", async () => {
    const res = await request(app)
      .post("/applications")
      .send({
        name: "John Doe",
      });

    expect(res.statusCode).toBe(400);
  });

  // ❌ body ว่าง
  test("should fail with empty body", async () => {
    const res = await request(app)
      .post("/applications")
      .send({});

    expect(res.statusCode).toBe(400);
  });
  describe("GET /applications", () => {
  test("should return list of applications", async () => {
    // สร้างข้อมูลก่อน
    await request(app)
      .post("/applications")
      .send({
        name: "John Doe",
        email: "john@test.com",
        jobTitle: "QA Engineer",
      });

    const res = await request(app).get("/applications");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("name", "John Doe");
  });
});

test("should fail when email already exists", async () => {
  // สมัครครั้งแรก
  await request(app)
    .post("/applications")
    .send({
      name: "John Doe",
      email: "dup@test.com",
      jobTitle: "QA Engineer",
    });

  // สมัครซ้ำ
  const res = await request(app)
    .post("/applications")
    .send({
      name: "Jane Doe",
      email: "dup@test.com",
      jobTitle: "Backend Dev",
    });

  expect(res.statusCode).toBe(409);
});

});
