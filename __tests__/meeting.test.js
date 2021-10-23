const expect = require("chai").expect;
const createServer = require("../server");
const request = require("supertest");
const { TESTING_URL } = require("../constants/tests");

const app = request.agent(`${TESTING_URL}`);

describe("Meeting API", () => {
  describe("Modifies meeting by id", () => {
    describe("Get meeting by id", () => {
      const id = 1;
      test("Status", async () => {
        const res = await app.get(`/api/profile/${id}/meeting`);
        expect(res.statusCode).to.equal(200);
      });
      test("Content", async () => {
        const res = await app.get(`/api/profile/${id}/meeting`);
        expect(res.body).to.be.an("array").that.is.empty;
      });
    });
    describe("Get all meetings", () => {
      test("Status", async () => {
        const res = await app.get("/api/meeting");
        expect(res.statusCode).to.equal(200);
      });
      test("Content", async () => {
        const res = await app.get("/api/meeting");
        expect(res.body).to.be.an("array");
      });
    });
  });
  describe("Error getting meeting by id", function () {
    const id = 16548941164846;
    test("Message", async () => {
      const res = await app.get(`/api/profile/${id}/meeting`);
      expect(res.body.message).to.equal("Error getting meeting");
    });
    test("Status", async () => {
      const res = await app.get(`/api/profile/${id}/meeting`);
      expect(res.statusCode).to.equal(404);
    });
  });
});
