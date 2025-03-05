describe("Тесты страницы Профиля юзера", () => {
  it("Coverage должен собираться", () => {
    cy.visit("/userProfile.html");

    cy.window().then((win) => {
      expect(win.__coverage__).to.not.be.undefined;
    });
  });

  it("Проверка на изменения доступности поля ввода информации о юзере", () => {
    cy.visit("/userProfile.html");

    cy.get("#profile-main-inf-cnt")
      .find(".user-profile-pncl-icon")
      .each(($el) => {
        cy.wrap($el).click();
      });
    cy.get("#profile-main-inf-cnt")
      .find(".profile-user-form-el")
      .each(($el) => {
        cy.wrap($el).should("be.not.disabled");
      });
  });

  it("Проверка работы кнопки очищения поля ввода информации о юзере", () => {
    cy.visit("/userProfile.html");

    cy.get("#profile-main-inf-cnt")
      .find(".user-profile-erase-icon")
      .each(($el) => {
        cy.wrap($el).click();
      });

    cy.get("#profile-main-inf-cnt")
      .find(".profile-user-form-el")
      .each(($el) => {
        cy.wrap($el).should("have.not.text");
      });
  });

  it('Проверка изменения типа поля пароля при нажатии на иконки "показать/скрыть пароль"', () => {
    cy.visit("/userProfile.html");

    cy.get("#profile-user-password").as("passwordField");
    cy.get("#profile-show-password").as("showPasswordIcon");
    cy.get("#profile-hide-password").as("hidePasswordIcon");
    cy.get("@hidePasswordIcon").click();
    cy.get("@showPasswordIcon").should("be.visible");
    cy.get("@hidePasswordIcon").should("be.hidden");
    cy.get("@passwordField").should("have.attr", "type", "text");
    cy.get("@showPasswordIcon").click();
    cy.get("@showPasswordIcon").should("be.hidden");
    cy.get("@hidePasswordIcon").should("be.visible");
    cy.get("@passwordField").should("have.attr", "type", "password");
  });

  it('Проверка отображения модального окна при нажатии на кнопку редайтирования в вкладке "Администрирование"', () => {
    cy.visit("/userProfile.html");

    cy.get("#tabToggle03").next().click();
    cy.get("#profile-user-login").next().as("pencilIcon");
    cy.get("tbody > tr").find(".profile-adm-edit-icon").click();
    cy.get(".profile-seeker-detail-information").then(($el) => {
      Cypress.dom.isVisible($el);
    });
  });

  it("Проверка отображения модального окна при нажатии на кнопку закрытия этого окна", () => {
    cy.visit("/userProfile.html");

    cy.get("#tabToggle03").next().click();
    cy.get("#profile-user-login").next().as("pencilIcon");
    cy.get("tbody > tr").find(".profile-adm-edit-icon").click();
    cy.get(".profile-seeker-detail-information")
      .find("#profile-seeker-modal-cross-svg")
      .as("closeIcon");
    cy.get("@closeIcon").click();
    cy.get(".profile-seeker-detail-information").then(($el) => {
      Cypress.dom.isHidden($el);
    });
  });
});

describe("Тесты страницы Регистрацию юзера", () => {
  it('Проверка изменения типа поля пароля при нажатии на иконки "показать/скрыть пароль"', () => {
    cy.visit("/userSignUp.html");

    cy.get("#sign-up-pass").as("passwordField");
    cy.get("#sign-up-show-password").as("showPasswordIcon");
    cy.get("#sign-up-hide-password").as("hidePasswordIcon");
    cy.get("@hidePasswordIcon").click();
    cy.get("@showPasswordIcon").should("be.visible");
    cy.get("@hidePasswordIcon").should("be.hidden");
    cy.get("@passwordField").should("have.attr", "type", "text");
    cy.get("@showPasswordIcon").click();
    cy.get("@showPasswordIcon").should("be.hidden");
    cy.get("@hidePasswordIcon").should("be.visible");
    cy.get("@passwordField").should("have.attr", "type", "password");
  });

  it("Проверка автозаполнения города проживания юзера", () => {
    cy.visit("/userSignUp.html");

    cy.get("#resident-city").as("cityField");
    cy.get(".suggestions").as("suggestions");

    cy.get("@cityField").type("Чернігів");
    cy.wait(3000); // wait for 2 seconds
    cy.get("@suggestions").should("be.visible");

    cy.get(".suggestions div:first").should("have.text", "Чернігів, Україна");

    cy.get("@cityField").clear();
    cy.get("@cityField").type("fffffffffff");
    cy.wait(3000); // wait for 2 seconds

    cy.get(".suggestions div:first").should("have.text", "Город не найден");
  });
});
