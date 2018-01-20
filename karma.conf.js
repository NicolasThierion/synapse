// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-mocha-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        // branches: 80,
        // functions: 80
      }
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['mocha', /* 'progress', */ 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,

    // Allow remote debugging when using PhantomJS
    customLaunchers: {
      'PhantomJS_dbg': {
        base: 'PhantomJS',
        debug: true,
      },
    },
  });
};
