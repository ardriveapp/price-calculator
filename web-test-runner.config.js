process.env.NODE_ENV = 'test';

module.exports = {
    coverage: true,
    coverageConfig: {
        exclude: ['**/*/_snowpack/**/*']
    },
    plugins: [require('@snowpack/web-test-runner-plugin')()]
};
