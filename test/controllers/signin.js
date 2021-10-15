const expect = require("chai").expect;
const request = require("request");
const { TESTING_URL } = require("../../constants/tests");

describe("/POST signin", function () {
  describe("User can sign in with user details", function () {
    describe("Create user login validation error", function () {
      describe("Create user missing field", function () {
        const payload = {
          email: "ciroma@ciroma.com",
          password: "",
        };

        it("Status", (done) => {
          request.post(
            `${TESTING_URL}/signin`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.statusCode).to.equal(400);
              done();
            }
          );
        });

        it("Message", (done) => {
          request.post(
            `${TESTING_URL}/signin`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.body).to.equal("incorrect form submission");
              done();
            }
          );
        });
      });

      describe("Create user wrong credentials", function () {
        const payload = {
          email: "ciroma@ciroma.com",
          password: 123,
        };

        it("Status", (done) => {
          request.post(
            `${TESTING_URL}/signin`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.statusCode).to.equal(400);
              done();
            }
          );
        });

        it("Message", (done) => {
          request.post(
            `${TESTING_URL}/signin`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.body).to.equal("wrong credentials");
              done();
            }
          );
        });
      });
    });

    describe("Login successful", function () {
      const payload = {
        email: "ciroma@ciroma.com",
        password: "123",
      };
      it("Should return user details", (done) => {
        request.post(
          `${TESTING_URL}/signin`,
          {
            json: payload,
          },
          (_, response) => {
            expect(response.body).to.be.an("object");
            done();
          }
        );
      });
    });
  });
});
