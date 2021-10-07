const expect = require("chai").expect;
const request = require("request");
const { TESTING_URL } = require("../../constants/tests");

describe("SignUp API", function () {
  describe("Create user", function () {
    describe("Create user validation error", function () {
      describe("Create user missing field", function () {
        const payload = {
          name: "",
          email: "ciroma@ciroma.com",
          password: 123,
        };

        it("Status", (done) => {
          request.post(
            `${TESTING_URL}/signup`,
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
            `${TESTING_URL}/signup`,
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
    });
  });
});
