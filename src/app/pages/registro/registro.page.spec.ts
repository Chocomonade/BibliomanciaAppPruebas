import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { AlertController } from '@ionic/angular';
import { Router, Navigation, UrlTree } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let alertController: jasmine.SpyObj<AlertController>;
  let router: jasmine.SpyObj<Router>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let alertSpy: jasmine.SpyObj<HTMLIonAlertElement>;

  beforeEach(async () => {
    // Crear spies
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl', 'getCurrentNavigation']);
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['registrar']);
    alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);

    await TestBed.configureTestingModule({
      imports: [
        RegistroPage,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule
      ],
      providers: [
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();

    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;

    alertController.create.and.returnValue(Promise.resolve(alertSpy));
    alertSpy.present.and.returnValue(Promise.resolve());
  });

  it('should create', () => {
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería inicializar con usuario de navegación', () => {
      const mockNavigation: Partial<Navigation> = {
        id: 1,
        initialUrl: {} as UrlTree,
        extractedUrl: {} as UrlTree,
        trigger: 'imperative',
        extras: {
          state: {
            usuario: 'mockUser'
          }
        }
      };

      router.getCurrentNavigation.and.returnValue(mockNavigation as Navigation);

      fixture = TestBed.createComponent(RegistroPage);
      component = fixture.componentInstance;

      expect(component.nombreUsuario).toBe('mockUser');
    });

    it('debería inicializar sin usuario si no hay navegación', () => {
      router.getCurrentNavigation.and.returnValue(null);

      fixture = TestBed.createComponent(RegistroPage);
      component = fixture.componentInstance;

      expect(component.nombreUsuario).toBe('');
    });
  });

  describe('Validación de campos', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RegistroPage);
      component = fixture.componentInstance;
    });

    it('debería mostrar error si nombre de usuario vacío', async () => {
      component.nombreUsuario = '';
      component.password = '123456';
      component.nivel = 'Básico';
      component.fechaNacimiento = new Date('2000-01-01');

      await component.registrar();

      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/Nombre de usuario/)
      }));
    });

    it('debería mostrar error si contraseña corta', async () => {
      component.nombreUsuario = 'test';
      component.password = '123';
      component.nivel = 'Básico';
      component.fechaNacimiento = new Date('2000-01-01');

      await component.registrar();

      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/contraseña.*6/)
      }));
    });

    it('debería mostrar error si nivel vacío', async () => {
      component.nombreUsuario = 'test';
      component.password = '123456';
      component.nivel = '';
      component.fechaNacimiento = new Date('2000-01-01');

      await component.registrar();

      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/Nivel/)
      }));
    });

    it('debería mostrar error si fecha de nacimiento no definida', async () => {
      component.nombreUsuario = 'test';
      component.password = '123456';
      component.nivel = 'Básico';
      component.fechaNacimiento = null;

      await component.registrar();

      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/Fecha/)
      }));
    });

    it('debería mostrar error si menor de 10 años', async () => {
      component.nombreUsuario = 'test';
      component.password = '123456';
      component.nivel = 'Básico';

      const fechaReciente = new Date();
      fechaReciente.setFullYear(fechaReciente.getFullYear() - 5);
      component.fechaNacimiento = fechaReciente;

      await component.registrar();

      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/10 años/)
      }));
    });
  });

  describe('Registro de usuario', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RegistroPage);
      component = fixture.componentInstance;

      component.nombreUsuario = 'testUser';
      component.password = 'password123';
      component.nivel = 'Básico';
      const fechaValida = new Date();
      fechaValida.setFullYear(fechaValida.getFullYear() - 15);
      component.fechaNacimiento = fechaValida;
    });

    it('debería registrar exitosamente', async () => {
      usuarioService.registrar.and.returnValue(true);

      await component.registrar();

      expect(usuarioService.registrar).toHaveBeenCalledWith('testUser', 'password123');
      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/exitosamente/)
      }));
    });

    it('debería mostrar error si usuario ya existe', async () => {
      usuarioService.registrar.and.returnValue(false);

      await component.registrar();

      expect(alertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
        message: jasmine.stringMatching(/ya está registrado/)
      }));
    });

    it('debería navegar al login tras registro', (done) => {
      usuarioService.registrar.and.returnValue(true);

      component.registrar().then(() => {
        setTimeout(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        }, 600);
      });
    });
  });

  describe('Navegación', () => {
    it('debería navegar al login al volver', async () => {
      fixture = TestBed.createComponent(RegistroPage);
      component = fixture.componentInstance;

      await component.volverAlLogin();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/login', jasmine.any(Object));
    });
  });
});

