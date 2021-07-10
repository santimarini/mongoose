const User = require('../../../src/models/users');
const jwt = require('jsonwebtoken');
const {mockRequest, mockResponse} = require('../../fixtures/responses/requests-mock');
const AuthController = require('../../../src/controllers/auth');

jest.mock('../../../src/models/users');
jest.mock('jsonwebtoken');

// create new controller and then call functions
const controller = new AuthController();

afterEach(() => {
  jest.clearAllMocks();
});

describe("Login", () => {
  it("should login", async () => {
    let req = mockRequest();
    const res = mockResponse();
    // set body
    req.body = {
      email: 'fake@fake.com',
      password: 12344321
    };
    // mock as exists in database
    const userFindOneMock = User.findOne.mockResolvedValue({
      email: 'fake@fake.com',
      password: 12344321
    });
    // mock as equal passwords
    const comparePasswordsMock = User.comparePasswords.mockResolvedValue(true);

    // mock returned token
    jwt.sign = jest.fn().mockImplementation(() => 'token');

    await controller.login(req, res);

    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith({token: 'token'})
    expect(res.send.mock.calls.length).toBe(1);
    expect(userFindOneMock).toHaveBeenCalledTimes(1)
    expect(userFindOneMock).toHaveBeenCalledWith({
      email: req.body.email
    });
    expect(comparePasswordsMock).toHaveBeenCalledTimes(1)
  });

  it("should show error 400 invalid user or password", async () => {
    let req = mockRequest();
    const res = mockResponse();
    // set body
    req.body = {
      email: 'fakenotfound@fake.com',
      password: 12344321
    };
    // mock as exists in database
    const userFindOneMock = User.findOne.mockResolvedValue({
      email: 'fake@fake.com',
      password: 12344321
    });
    // passwords not match
    const comparePasswordsMock = User.comparePasswords.mockResolvedValue(false);

    // call login with parameters
    await controller.login(req, res);

    // check codes, messages and calls
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith({error: "Invalid user or password."})
    expect(res.send.mock.calls.length).toBe(1);
    expect(userFindOneMock).toHaveBeenCalledTimes(1)
    expect(userFindOneMock).toHaveBeenCalledWith({
      email: req.body.email
    });
    expect(comparePasswordsMock).toHaveBeenCalledTimes(1)
  });
});

describe("Sign Up", () => {
  it("should sign-up", async () => {
    let req = mockRequest();
    const res = mockResponse();
    // set body
    req.body = {
      email: 'fake@fake.com',
      password: 12344321,
      name: "fake"
    };
    // mock as not exists in database
    const userFindOneMock = User.findOne.mockResolvedValue(null);

    const newUser = new User({
      ...req.body
    });

    const newUserSaveMock = newUser.save.mockResolvedValue({
      _id: 1234,
      ...newUser
    });
    await controller.signUp(req, res);

    // check codes, messages and calls
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1);
    expect(newUserSaveMock).toHaveBeenCalledTimes(1)
    expect(userFindOneMock).toHaveBeenCalledTimes(1)
    expect(userFindOneMock).toHaveBeenCalledWith({
      email: req.body.email
    });
  });

  it("should show error 400 required fields", async () => {
    let req = mockRequest();
    const res = mockResponse();
    // set body without name
    req.body = {
      email: 'fake@fake.com',
      password: 12344321
    };

    await controller.signUp(req, res);

    // check codes, messages and calls
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({"error": "Name, email and password are required."});
    expect(res.send.mock.calls.length).toBe(1);
  });

  it("should show error 400 user already exists", async () => {
    let req = mockRequest();
    const res = mockResponse();
    // set body without name
    req.body = {
      email: 'fake@fake.com',
      password: 12344321,
      name: "fake"
    };

    const userFindOneMock = User.findOne.mockResolvedValue({
      _id: 1,
      ...req.body
    })
    await controller.signUp(req, res);

    // check codes, messages and calls
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({"error": `User with email '${req.body.email}' already exists.`});
    expect(res.send.mock.calls.length).toBe(1);
    expect(userFindOneMock).toHaveBeenCalledTimes(1)
    expect(userFindOneMock).toHaveBeenCalledWith({
      email: req.body.email
    });
  });

});
