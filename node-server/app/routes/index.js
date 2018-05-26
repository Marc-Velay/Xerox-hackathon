const blockRoutes = require('./blockstore_routes');

module.exports = function(app) {
  blockRoutes(app);
  // Other route groups could go here, in the future
};
