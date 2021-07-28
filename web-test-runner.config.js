process.env.NODE_ENV = 'test';

module.exports = {
    coverage: true,
    coverageConfig: {
        exclude: ['**/*/snowpack/**/*', '**/*.proxy.js']
    },
    plugins: [require('@snowpack/web-test-runner-plugin')()]
};
