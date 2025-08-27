// ARQUIVO FINAL E CORRETO: src/app/app.spec.ts

import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router'; // 1. Importe 'provideRouter'
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        // RouterTestingModule foi REMOVIDO daqui
      ],
      providers: [
        // O provedor para o modo Zoneless
        provideZonelessChangeDetection(),

        // 2. O provedor moderno para o Router em testes.
        // Fornecemos um array de rotas vazio porque só queremos
        // que o TestBed "entenda" o que é o <router-outlet>.
        provideRouter([]),
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'purchase-request-dashboard' title signal`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toEqual('purchase-request-dashboard');
  });
});