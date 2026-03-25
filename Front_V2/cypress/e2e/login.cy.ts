describe('Login real', () => {
  const user = {
    email: 'agosMonti2@hotmail.com', // Rol admin
    password: 'password12345',
  };

  beforeEach(() => {
    cy.visit('/login');
  });

  it('debería loguear correctamente y redirigir a /prestamos', () => {
    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);

    cy.get('button[type="submit"]').click();

    // espera implícita a que Angular navegue
    cy.url().should('include', '/prestamos');

    // verifica localStorage
    cy.window().then((win) => {
      const rol = win.localStorage.getItem('rol');
      expect(rol).to.not.be.null;
    });
  });
});
