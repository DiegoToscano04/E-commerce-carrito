// projects/carrito/webpack.config.js
const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const carritoMfePort = 4300;

const mfConfig = {
  name: 'carrito-mfe',
  filename: 'remoteEntry.js',
  exposes: {
    './AppComponent': './projects/carrito/src/app/app.component.ts',
  },
  shared: share({ // Usamos el helper share
    // Configuración MÍNIMA para cada paquete
    '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    'rxjs': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
   
  })
};

let config = withModuleFederationPlugin(mfConfig);

if (!config.output) {
  config.output = {};
}
config.output.publicPath = `http://localhost:${carritoMfePort}/`;
config.output.scriptType = 'text/javascript'; // Mantenemos esto que evita el error 'import' en la config más básica
if (!config.output.uniqueName) {
   config.output.uniqueName = mfConfig.name || 'carritoMfeUnique';
}

// Comentamos library y target
// if (config.output.library) delete config.output.library;
// if (config.library) delete config.library;
// delete config.target;


module.exports = config;