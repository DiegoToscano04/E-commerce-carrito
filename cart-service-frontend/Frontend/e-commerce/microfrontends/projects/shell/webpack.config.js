const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

let config = withModuleFederationPlugin({
  name: 'shell',
  
 remotes: {
  "carrito-mfe": "http://10.6.101.125:4200/carrito-mfe/remoteEntry.js",
  //"carrito-mfe": "http://172.174.245.137:4200/carrito-mfe/remoteEntry.js",
},
shared: share({ // MISMA shared ultra-mínima
  '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  'rxjs': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
})
});
if (!config.output) {
  config.output = {};
}
config.output.publicPath = 'auto';
config.output.scriptType = 'text/javascript';
if (!config.output.uniqueName) {
   config.output.uniqueName = 'shell';
}

// if (!config.target) {
//   config.target = ['web', 'es2020'];
// } else if (Array.isArray(config.target) && !config.target.includes('web')) {
//   config.target.push('web');
// }

module.exports = config;
