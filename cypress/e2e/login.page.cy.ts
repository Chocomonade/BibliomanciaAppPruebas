describe('Registro y Login E2E', () => {
  it('registra un usuario con fecha válida y luego inicia sesión', () => {
    cy.visit('/registro');

    // Usuario
    cy.get('ion-input[placeholder="Ingresa tu nombre de usuario"] input').type('e2eUser');

    // Contraseña
    cy.get('ion-input[placeholder="Mínimo 6 caracteres"] input').type('e2ePass');

    // Nivel de lectura
    cy.get('ion-select[placeholder="Selecciona una opción"]').click();
    cy.get('ion-alert').should('exist').within(() => {
      cy.contains('📘 Bajo').click();
    });
    cy.get('ion-alert').should('exist').within(() => {
      cy.contains('OK').click();
    });

    cy.wait(500);

    // 1) Abre el datepicker usando el toggle
    cy.get('mat-datepicker-toggle button').click();

    // 2) Cambia a la vista de años
    cy.get('mat-calendar').within(() => {
      cy.get('.mat-calendar-period-button').click();
    });

    // 3) Selecciona un año válido
    const currentYear = new Date().getFullYear();
    const validYear = currentYear - 15; // 15 años atrás
    cy.get('mat-multi-year-view').contains(validYear).click();

    cy.get('mat-year-view').contains('JAN').click();

    cy.get('mat-month-view').contains('15').click();

    cy.get('body').click(0, 0);

    // Click en registrar
    cy.contains('ion-button', 'Registrarse').click();

    cy.get('ion-alert').should('exist').within(() => {
      cy.contains('OK').click();
    });

    // Ahora debería redirigir
    cy.url().should('include', '/login');

    // Login
    cy.get('ion-input[placeholder="Usuario"] input').type('e2eUser');
    cy.get('ion-input[placeholder="Contraseña"] input').type('e2ePass');
    cy.contains('ion-button', 'Entrar').click();

    cy.url().should('include', '/home');

  });
});



