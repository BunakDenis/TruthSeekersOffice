import "@cypress/code-coverage/support";
import "cypress-real-events";
Cypress.on("uncaught:exception", (err, runnable) => {
  // Возвращаем true, чтобы игнорировать ошибку
  return false;
});
