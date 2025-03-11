const htmlFilesNames = [
  "/index.html",
  "/contacts.html",
  "/cabinet.html",
  "/searchingResult.html",
  "/userProfile.html",
  "/userSignUp.html",
];

describe("Тесты функций хедера", () => {
  it("Coverage должен собираться", () => {
    cy.visit("/");

    cy.window().then((win) => {
      expect(win.__coverage__).to.not.be.undefined;
    });
  });

  it("Проверка изменения цвета Альвадуда и названия школы при наведении мыши на эти элементы", () => {
    htmlFilesNames.forEach((element) => {
      cy.visit(element);

      cy.get(".al-vadud").as("alvadud");
      cy.get(".school-name").as("schoolName");

      cy.get("@alvadud").realHover("mouse");
      cy.get("@schoolName").should("have.css", "color", "rgb(255, 215, 0)");
      cy.get("@alvadud").should("have.css", "fill", "rgb(255, 215, 0)");

      cy.get("@schoolName").realHover("mouse");
      cy.get("@schoolName").should("have.css", "color", "rgb(255, 215, 0)");
      cy.get("@alvadud").should("have.css", "fill", "rgb(255, 215, 0)");

      cy.get(".search").realHover("mouse");
      cy.get("@schoolName").should("have.css", "color", "rgb(255, 0, 0)");
      cy.get("@alvadud").should("have.css", "fill", "rgb(255, 0, 0)");
    });
  });

  it("Проверка видимости окна поиска по сайту при нажатии на иконку поиска", () => {
    htmlFilesNames.forEach((element) => {
      cy.visit(element);

      cy.get(".searchToggle").find(".search").as("searchIcon");
      cy.get(".searchToggle").find(".cancel").as("cancelIcon");

      cy.get("@searchIcon").click();
      cy.get(".search-field").should("be.visible");

      cy.get("@cancelIcon").click();
      cy.get(".search-field").should("be.not.visible");

      cy.get("@searchIcon").click();
      cy.get(".search-field").find(".search").click();
      cy.url().should("match", /searchingResult/);
    });
  });

  it("Проверка функций окна входа юзера в аккаунт", () => {
    htmlFilesNames.forEach((element) => {
      cy.visit(element);

      cy.get("#user").as("userIcon");
      cy.get(".sign-in-container").as("signInContainer");

      //Проверка отображения окна
      cy.get("@userIcon").click();
      cy.get("@userIcon").click();
      cy.get("@signInContainer").should("be.visible");

      //Проверка работы иконки отображения/скрытия пароля
      cy.get("#pass").as("passwordField");
      cy.get("#show-password").as("showPasswordIcon");
      cy.get("#hide-password").as("hidePasswordIcon");
      cy.get("@hidePasswordIcon").click();
      cy.get("@showPasswordIcon").should("be.visible");
      cy.get("@hidePasswordIcon").should("be.hidden");
      cy.get("@passwordField").should("have.attr", "type", "text");
      cy.get("@showPasswordIcon").click();
      cy.get("@showPasswordIcon").should("be.hidden");
      cy.get("@hidePasswordIcon").should("be.visible");
      cy.get("@passwordField").should("have.attr", "type", "password");

      //Проверка закрытия окна
      cy.get("@userIcon").click();
      cy.get("@signInContainer").should("be.not.visible");
    });
  });
});
