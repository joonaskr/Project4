import 'cypress-file-upload'
beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('Visual tests for registration form 3', () => {

    it('Radio buttons and their content', () => {

        const radioLabels = ['Daily', 'Weekly', 'Monthly', 'Never']

        radioLabels.forEach((label) => {
            cy.get(`input[type="radio"][value="${label}"]`).should('be.visible')
            cy.get(`label:contains("${label}")`).should('be.visible')
        })
    })

    it('Dropdown and dependencies between 2 dropdowns', () => {

        const countries = ['Spain', 'Estonia', 'Austria']
        const expectedCities = {
            Spain: ['Malaga', 'Madrid', 'Valencia', 'Corralejo'],
            Estonia: ['Tallinn', 'Haapsalu', 'Tartu'],
            Austria: ['Vienna', 'Salzburg', 'Innsbruck']
        }

        countries.forEach((country) => {
            cy.get('#country').find('option').contains(country).should('be.visible')

            cy.get('#country').select(country)
            expectedCities[country].forEach((city) => { cy.get('#city').find('option').contains(city).should('be.visible') })
        })

        cy.get('#country').should('be.visible').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('#country').select('Estonia')
        cy.get('#city').should('not.have.value', 'Madrid')
        cy.get('#city option[value=""]').should('be.visible')

    })

    it('Checkboxes, their content and links', () => {
        // Check if checkboxes and contet is visible
        cy.get('input[type="checkbox"][ng-model="checkbox"]').should('be.visible')
        cy.contains('Accept our privacy policy').should('be.visible')
        cy.get('input[type="checkbox"]').should('be.visible')

        cy.get('a[href="cookiePolicy.html"]').should('be.visible').click()
        cy.url().should('include', 'cookiePolicy.html').go('back')
        cy.url().should('include', 'cypress/fixtures/registration_form_3.html')

    });

    it('Email format with regex', () => {
        // Define a regex for valid email formats
        const emailRegex = /^(?!.*\s)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,}$/

        const validEmails = [
            'test@cerebrumhub.com',
            'user.name+tag+sorting@cerebrumhub.com',
            'user_name@cerebrumhub.co.uk',
            'user@cerebrumhub.com',
            'john.doe@cerebrumhub.com',
            'first.last@sub.cerebrumhub.com',
            'user+test@sub.cerebrumhub.com'
        ];

        const invalidEmails = [
            'invalidemail',
            'user@.com',
            'user@cerebrumhub.',
            '@cerebrumhub.com',
            'user@cerebrumhub.c',
            'user@cerebrumhub..com',
            'user@-cerebrumhub.com',
            'user@cerebrumhub-.com',
            'user@cerebrumhub,com',
            'user@.cerebrumhub.com',
            'user@cerebrumhub..sub.com'
        ];

        cy.get('input[name="email"]')
            .should('be.visible')
            .and('have.attr', 'type', 'email')
            .and('have.attr', 'required')

        validEmails.forEach((email) => {
            cy.get('input[name="email"]').clear().type(email)
            cy.get('#email_error_message').should('not.exist')
            cy.get('input[name="email"]').invoke('val').then((value) => { expect(value).to.match(emailRegex) })
        });

        invalidEmails.forEach((email) => {
            cy.get('input[name="email"]').clear().type(email)
            cy.get('input[name="email"]').invoke('val').then((value) => { expect(value).not.to.match(emailRegex) })
            cy.get('span[ng-show="myForm.email.$error.email"]').should('contain', 'Invalid email address.')
        })

    })

})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */
describe('Functional Tests for Registration Form 3', () => {

    beforeEach(() => {
        cy.visit('cypress/fixtures/registration_form_3.html')
    })

    it('should fill in all fields and verify their values', () => {
        inputAllFields(name)
        cy.get('#successFrame').siblings('input[type="submit"]').click()
    })

    it('should fill in only mandatory fields and verify their values', () => {
        inputMandatoryFields(name)
        cy.get('input[name="name"]').should('have.value', '')
        cy.get('input[type="date"]').should('have.value', '')
        cy.get('input[name="freq"]').each(($el) => {
            cy.wrap($el).should('not.be.checked')
        })
        cy.get('input[name="birthday"]').should('have.value', '')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
    })

    it('should show error messages when mandatory fields are absent', () => {
        checkMandatoryFields()
        cy.get('input[type="submit"]').should("be.disabled")
    })

    it('should upload a file and verify the upload', () => {
        cy.get('input[type="file"]#myFile').attachFile('something.txt')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', 'cypress/fixtures').go("back")
    })

    it.only('should enable submit button only when mandatory fields are filled', () => {
        cy.get('input[type="submit"]').should("be.disabled")
        inputMandatoryFields(name)
        cy.get('input[type="submit"]').should("be.enabled")
    })

    function inputAllFields(name) {
        cy.get('input[name="name"]').type('John Doe')
        cy.get('input[name="email"]').type('user@cerebrumhub.com')
        cy.get('select#country').select('Spain')
        cy.get('select#city').select('Malaga')
        cy.get('input[type="date"]').eq(0).type('2024-10-04')
        cy.get('input[name="freq"][value="Weekly"]').check()
        cy.get('input[name="birthday"]').type('1990-01-01')
        cy.get('input[type="file"]#myFile').attachFile('something.txt')
        cy.get('input[type="checkbox"][ng-model="checkbox"]').check()
        cy.get('input[type="checkbox"]').check()
    }

    function inputMandatoryFields(name) {
        cy.get('input[name="email"]').type('user@cerebrumhub.com')
        cy.get('select#country').select('Spain')
        cy.get('select#city').select('Malaga')
        cy.get('input[type="checkbox"][ng-model="checkbox"]').check()
    }

    function checkMandatoryFields() {
        cy.get('input[name="email"]').should('have.value', '')
        cy.get('select#country').should('have.value', '')
        cy.get('select#city').should('not.be.checked')
        cy.get('input[type="checkbox"]').should('not.be.checked')
    }
})