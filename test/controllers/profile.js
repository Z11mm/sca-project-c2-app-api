const expect = require("chai").expect;
const request = require("request");
const { TESTING_URL } = require("../../constants/tests");

describe("Profile API", function () {
  describe("/GET profile", function () {
    describe("Get user by id", function () {
      const id = 1;
      it("Status", (done) => {
        request.get(`${TESTING_URL}/profile/${id}`, (_, response) => {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
      it("Content", (done) => {
        request.get(`${TESTING_URL}/profile/${id}`, (_, response) => {
          const body = JSON.parse(response.body);
          expect(body).to.be.an("object");
          done();
        });
      });
    });

    describe("Error getting user", function () {
      const id = 16548941164846;
      it("Message", (done) => {
        request.get(`${TESTING_URL}/profile/${id}`, (_, response) => {
          const body = JSON.parse(response.body);
          expect(body).to.equal("Error getting user");
          done();
        });
      });
      it("Status", (done) => {
        request.get(`${TESTING_URL}/profile/${id}`, (_, response) => {
          expect(response.statusCode).to.equal(400);
          done();
        });
      });
    });
  });
  describe("/PUT profile", function () {
    describe("Update user by id", function () {
      const id = 2;
        const payload = {
          formInput: {
            name: "Oma",
            department: "finance",
            title: "assistant",
          },
        };
      it("Status", (done) => {
        request.put(
          `${TESTING_URL}/profile/${id}`,
          { json: payload },
          (_, response) => {
            expect(response.statusCode).to.equal(200);
            done();
          }
        );
      });
      it("Content", (done) => {
        request.put(
          `${TESTING_URL}/profile/${id}`,
          { json: payload },
          (_, response) => {
            expect(response.body).to.be.an("object");
            done();
          }
        );
      });
    });
  });
  describe("Error updating user", function () {
    const id = 16548941164846;
    it("Message", (done) => {
      request.get(`${TESTING_URL}/profile/${id}`, (_, response) => {
        const body = JSON.parse(response.body);
        expect(body).to.equal("Error getting user");
        done();
      });
    });
    it("Status", (done) => {
      request.get(`${TESTING_URL}/profile/${id}`, (_, response) => {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });
});
