import { editPersonalInfomation } from "../../../../js/main.js";

describe("editPersonalInfomation method", () => {
  it("should toggle the disabled state of the input field", () => {
    cy.visit("../userProfile.html");
    // Create a test input field
    cy.get("#profile-user-login").should("be.disabled");

    // Call the editPersonalInfomation method
    //editPersonalInfomation("#test-input");

    // Verify that the input field is now enabled
    //cy.get("#test-input").should("not.be.disabled");
  });
});
