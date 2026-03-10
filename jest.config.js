export default {
  testEnvironment: 'node', // jset support multiple enviroment like node for backend, 
                          // jsdom for fronted Dom testing

  testTimeout: 30000,     // Bydefault the tests are run for 5 sec but we can set tiemout to set how long the test can run

  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], //This tells Jest: run this file before running tests
                                                    //<rootDir> means the project root directory.

  collectCoverageFrom: [ // This tell jest what file measure coverage for. Coverage = how much code is tested.
    'src/**/*.js',  // thie line tell select all file from src foulder.
    '!src/**/index.js',  // this line tell which part to ignore.
    '!src/**/*.config.js',
  ],
  coverageThreshold: { //This defines minimum coverage requirements.
    global: {
      branches: 50,   // If coverage drops below this, tests fail.
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

/*
Waht is jest?
Ans: Jset is a testing framework developed by meta.
     A testing framework is a tool that lets you:
     - automatically run code to check if you application works.
     - verify functions, api and logic.
     - detect bugs when you change code.
     - prevent breaking existing feature.

Why Jest is used in backend APIs
Ans:In a Node backend you test things like:
    - API endpoints
    - authentication
    - database queries
    - controllers
    - middleware

What is jest.config.js
ans: jest.config.js is Jest’s configuration file.

    It tells Jest:
    - how to run tests
    - where tests are located
    - what setup files to run
    - how long tests can run
    - coverage settings


*/