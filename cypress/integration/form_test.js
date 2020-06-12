describe('Form Testing', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
      });
    it("Form Input Testing", () => {
        cy.get("input[name=name]")
            .type("Angel")
            .should("have.value", "Angel")
        cy.get("input[name=email]")
            .type("asd.aa@aas.as")
            .should("have.value", "asd.aa@aas.as")
        cy.get("input[name=password]")
            .type("Ahe32Yio90Pj")
            .should("have.value", "Ahe32Yio90Pj")
        cy.get("a[data-cy=dropdownButton]")
            .click()
        cy.get("div[data-cy=rootAdmin]")
            .click()
        cy.get("input[name=role]")
            .should("have.value", "Root Admin")
        cy.get("input[type=checkbox]")
            .click()
        cy.get("input[type=checkbox]")
            .click()
        cy.get("button[type=submit]")
            .click()
    })
})
