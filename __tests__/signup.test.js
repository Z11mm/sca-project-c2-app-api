
// Dependencies
const expect = require("chai").expect;
const createServer = require('../server')
const request = require("supertest");
const { TESTING_URL } = require("../constants/tests");

// const app = createServer();
const app = request.agent(`${TESTING_URL}`);

describe("SignUp API", () => {
  describe("/POST /signup", () => {
    describe("Create user validation error", () => {
      describe("Create user missing field", () => {
        const payload = {
          name: "",
          email: "ciroma@ciroma.com",
          password: 123,
        };

        test("Status", async () => {
          const res = await app.post('/signup').send(payload);

          expect(res.statusCode).to.equal(400);
          
        }
        );
      

        test("Message", async () => {
          const res = await app.post('/signup').send(payload);
          
          expect(res.body).to.equal("incorrect form submission");
        }
        );
      });


      describe("Create duplicate user error", () => {
        const payload = {
          name: "Ciroma",
          email: "ciroma@ciroma.com",
          password: 123,
        };

        test("Status", async () => {
          const res = await app.post('/signup').send(payload);
            
          expect(res.statusCode).to.equal(400);
        });
      })

      // describe('Create user successful', () => {
      //   const payload = {
      //     name: "Ciroma",
      //     email: "ciroma@ciroma.com",
      //     password: 123,
      //   };

      //   test("Status", async () => {
      //     const res = await app.post('/signup').send(payload);
            
      //     expect(res.statusCode).to.equal(200);
      //   });
      // })
    })
  });
});
