// Dependencies
const expect = require("chai").expect;
const createServer = require("../server");
const request = require("supertest");
const { TESTING_URL } = require("../constants/tests");

// const app = createServer();
const app = request.agent(`${TESTING_URL}`)

describe("/POST signin", () => {
  describe("User can sign in with user details", () => {
    describe("Create user login validation error", () => {
      describe("Create user missing field", () => {
        const payload = {
          email: "ciroma@ciroma.com",
          password: "",
        };

        test("Status", async () => {
          const res = await app.post("/api/signin").send(payload);

          expect(res.statusCode).to.equal(400);
        });

        test("Message", async () => {
          const res = await app.post("/api/signin").send(payload);

          expect(res.body).to.equal("incorrect form submission");
        });
      });
    });

    describe("Create user wrong credentials", () => {
      const payload = {
        email: "ciroma@ciroma.com",
        password: 123,
      };

      test("Status", async () => {
        const res = await app.post("/api/signin").send(payload);

        expect(res.statusCode).to.equal(400);
      });

      test("Message", async () => {
        const res = await app.post("/api/signin").send(payload);

        expect(res.body).to.equal("wrong credentials");
      });
    });
  });

  describe("Login successful", () => {
    const payload = {
      email: "ciroma@ciroma.com",
      password: "123"
    };
    test("Should return user details", async () => {
      const res = await app.post("/api/signin").send(payload);

      expect(res.body).to.be.an("object");
    });
    test("Status", async () => {
      const res = await app.post("/api/signin").send(payload);

      expect(res.statusCode).to.equal(200);
    });
  });
});
