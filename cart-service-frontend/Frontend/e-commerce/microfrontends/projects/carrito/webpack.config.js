// projects/carrito/webpack.config.js
const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

//const carritoMfePort = 4300; para usarse en docker se comenta.

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

// --- CAMBIO IMPORTANTE AQUÍ ---
// Cuando el carrito se sirve desde una subcarpeta del mismo host que el shell
// (ej. http://localhost:4200/carrito-mfe/), el publicPath debe ser esa subcarpeta.
config.output.publicPath = '/carrito-mfe/'; // Asegúrate de que la barra final esté presente
// Alternativamente, para mayor robustez si se despliega en diferentes subdominios/paths:
// config.output.publicPath = "auto"; // "auto" a veces funciona bien, pero puede ser menos predecible
                                      // con Nginx sirviendo desde subcarpetas.
                                      // "/carrito-mfe/" es más explícito para esta configuración.


//config.output.publicPath = `http://localhost:${carritoMfePort}/`;
//config.output.scriptType = 'text/javascript'; // Mantenemos esto que evita el error 'import' en la config más básica
//if (!config.output.uniqueName) {
  // config.output.uniqueName = mfConfig.name || 'carritoMfeUnique';
//}

// Comentamos library y target
// if (config.output.library) delete config.output.library;
// if (config.library) delete config.library;
// delete config.target;


module.exports = config;