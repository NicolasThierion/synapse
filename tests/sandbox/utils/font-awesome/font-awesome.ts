/**
 * Import font-awesome scss & append it to <head>
 */

/* tslint:disable no-require-imports */
  require(
    '!style-loader' +
    '!css-loader?{"sourceMap":false,"importLoaders":1}' +
    '!sass-loader?{"sourceMap":false,"precision":8,"includePaths":[' +
    '"./node_modules/font-awesome/fonts/", ' +
    '"./node_modules/font-awesome/scss/"' +
    ']}' +
    '!./font-awesome.scss'
  );
/* tslint:enable no-require-imports */
