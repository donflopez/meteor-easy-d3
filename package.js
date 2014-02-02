Package.describe({
  summary: "Create easy d3 graphs with a helper"
});

Package.on_use(function (api, where) {
  api.add_files('easy-d3.js', ['client']);
  api.use(["handlebars", "underscore"], "client");
});

Package.on_test(function (api) {
  api.use('easy-d3');

  api.add_files('easy-d3_tests.js', ['client', 'server']);
});
