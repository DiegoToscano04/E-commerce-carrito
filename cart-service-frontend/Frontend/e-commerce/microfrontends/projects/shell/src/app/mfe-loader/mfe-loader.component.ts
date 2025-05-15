import {
  Component,
  OnInit,
  ViewContainerRef,
  inject,
  Injector,
  createNgModule,
  EnvironmentInjector,
  Provider,
  Type,
  createEnvironmentInjector
} from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para leer datos de la ruta si es necesario

interface MfeMountResult {
  Component: Type<any>;
  providers: Provider[];
}

@Component({
  selector: 'app-mfe-loader',
  standalone: true,
  imports: [],
  template: '', // El template se llenará dinámicamente
  // No necesitamos styleUrls si no tiene template propio
})
export class MfeLoaderComponent implements OnInit {
  private vcr = inject(ViewContainerRef);
  private route = inject(ActivatedRoute);
  private parentInjector = inject(EnvironmentInjector); // O Injector

  async ngOnInit(): Promise<void> {
    // Determinar qué MFE cargar (podrías pasar esto como 'data' en la ruta)
    const mfeName = this.route.snapshot.data['mfeName']; // Ejemplo: 'carrito-mfe'
    const exposedModule = this.route.snapshot.data['exposedModule']; // Ejemplo: './mount'

    if (!mfeName || !exposedModule) {
      console.error('MFE Loader: mfeName o exposedModule no definidos en la data de la ruta.');
      return;
    }

    try {
      console.log(`MFE Loader: Intentando cargar ${mfeName} -> ${exposedModule}`);
      const mountFnModule = await import(`${mfeName}/${exposedModule.replace('./', '')}`);

      if (mountFnModule && typeof mountFnModule.mount === 'function') {
        const mountResult: MfeMountResult = await mountFnModule.mount();

        if (mountResult && mountResult.Component) {
          console.log('MFE Loader: Componente y providers obtenidos:', mountResult);

          // Crear un EnvironmentInjector hijo con los providers del MFE
          // y el inyector padre (del Shell)
          const mfeInjector = createEnvironmentInjector(
            mountResult.providers,
            this.parentInjector
          );

          this.vcr.clear(); // Limpiar el contenedor por si acaso
          this.vcr.createComponent(mountResult.Component, {
            environmentInjector: mfeInjector, // Usar el inyector específico del MFE
          });
          console.log('MFE Loader: Componente del MFE creado y adjuntado.');
        } else {
          console.error('MFE Loader: La función mount() no devolvió Component o providers.');
        }
      } else {
        console.error(`MFE Loader: La función mount() no se encontró en el módulo importado de ${mfeName}/${exposedModule}.`);
      }
    } catch (error) {
      console.error(`MFE Loader: Error al cargar o montar el MFE ${mfeName}:`, error);
      // Podrías mostrar un mensaje de error en el template aquí
    }
  }
}