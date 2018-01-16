/**
 * Import bootstrap scss & append it to <head>
 * While this represent a little slowdown at runtime,
 * this make development builds & live-reloads A LOT faster.
 * Classic way would require to import this within .angular-cli.json, but angular cli would proceed to optimization of
 * all those files at each builds (::creep).
 *
 */

/* tslint:disable no-require-imports */
declare const require;
  require(
    '!style-loader' +
    '!css-loader?{"sourceMap":false,"importLoaders":1}' +
    '!sass-loader?{"sourceMap":false,"precision":8,"includePaths":[' +
    '"./node_modules/bootstrap/scss/"]}' +
    '!./bootstrap.scss'
  );
/* tslint:enable no-require-imports */
