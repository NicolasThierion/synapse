// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
      'karma-coverage-istanbul-reporter',
      '@angular/cli/plugins/karma',
      'karma-htmlfile-reporter'
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
    reporters: ['mocha', /* 'progress', */ 'kjhtml', 'html'],

    htmlReporter: {
      outputFile: 'tests/units.html',
      // Optional
      groupSuites: true,
      useCompactStyle: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    captureTimeout: 60 * 1000 * 5,   // gitlab runner is extremely slow
    // Allow remote debugging when using PhantomJS
    customLaunchers: {
      'PhantomJS_dbg': {
        base: 'PhantomJS',
        debug: true,
      },
    },
  });
};
