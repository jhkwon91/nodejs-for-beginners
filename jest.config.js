// export default {
//   transform: {},
//   testEnvironment: 'node'
// }

// export default {
//   transform: {},
//   testEnvironment: 'node',
//   moduleNameMapper: {
//     '\\.(css|less)$': 'identity-obj-proxy'
//   }
// };


export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/node_test/'],
  "coveragePathIgnorePatterns": [
    "<rootDir>/tests/"
  ]
};
