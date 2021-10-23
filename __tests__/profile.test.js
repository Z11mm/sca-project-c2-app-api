const expect = require("chai").expect;
const createServer = require("../server");
const request = require("supertest");
const { TESTING_URL } = require("../constants/tests");

const app = request.agent(`${TESTING_URL}`);

describe("Profile API", () => {
  describe("/GET profile", () => {
    describe("Get user by id", () => {
      const id = 1;
      test("Status", async () => {
        const res = await app.get(`/api/profile/${id}`);
        expect(res.statusCode).to.equal(200);
      });
      test("Content", async () => {
        const res = await app.get(`/api/profile/${id}`);
        expect(res.body).to.be.an("object");
      });
    });

    describe("Error getting user", () => {
      const id = 16548941164846;
      test("Message", async () => {
        const res = await app.get(`/api/profile/${id}`);
        expect(res.body).to.equal("Error getting user");
      });
      test("Status", async () => {
        const res = await app.get(`/api/profile/${id}`);
        expect(res.statusCode).to.equal(400);
      });
    });
    describe("/PUT profile", () => {
      describe("Update user by id", () => {
        const id = 2;
        const payload = {
          formInput: {
            name: "Oma",
            department: "finance",
            title: "assistant",
          },
        };
        test("Status", async () => {
          const res = await app.put(`/api/profile/${id}`).send(payload);

          expect(res.statusCode).to.equal(200);
        });
        test("Content", async () => {
          const res = await app.put(`/api/profile/${id}`).send(payload);

          expect(res.body).to.be.an("object");
        });
      });
    });
    describe("Error updating user", function () {
      const id = 2;
      const payload = {
        formInput: {
          name: "Oma",
          department: "finance",
          title: "",
        },
      };
      test("Message", async () => {
        const res = await app.put(`/api/profile/${id}`).send(payload);
        expect(res.body).to.equal("incorrect form submission");
      });
      test("Status", async () => {
        const res = await app.put(`/api/profile/${id}`).send(payload);
        expect(res.statusCode).to.equal(400);
      });
    });
  });
});
