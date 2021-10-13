// process.env.NODE_ENV = 'test';

// const app = require("../../app");

// Dependencies
// const chai = require('chai')
const expect = require("chai").expect;
// const chaiHttp = require('chai-http');
const request = require("request");
const { TESTING_URL } = require("../../constants/tests");

// chai.use(chaiHttp)

// Parent block
// describe('POST /signup ', () => {
  // beforeEach(done => {
  // })
//   describe('Create user', () => {
//     it('It should create a user', done => {
//       const payload = {
//         name: "Ola",
//         email: "ola@ola.com",
//         password: 123
//       }
//       chai.request(`${TESTING_URL}`).post('/signup').send(payload).end(
//         (err, res) => {
//           expect(res).to.have.status(200);
//           done();
//         }
//       )
//     })
//   })
//   after(done => {
//     chai.request(app).close();
//     done();
//   })
// })



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
      describe("Create duplicate user error", function () {
        const payload = {
          name: "Ciroma",
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
      })
    });

    describe('Create user successful', function () {
      const payload = {
        name: "Ade",
        email: "ade@ade.com",
        password: 123,
      };

      it("Status", (done) => {
        request.post(
          `${TESTING_URL}/signup`,
          {
            json: payload
          },
          (_, response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an('object');
            done();
          }
        );
      });
    })
  });
});
