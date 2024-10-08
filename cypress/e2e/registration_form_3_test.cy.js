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
            cy.get(`input[type="radio"][value="${label}"]`)
                .should('be.visible')
            cy.get(`label:contains("${label}")`)
                .should('be.visible')})
    })

    it('Dropdown and dependencies between 2 dropdowns', () => {

        const countries = ['Spain', 'Estonia', 'Austria']
        const expectedCities = {
            Spain: ['Malaga', 'Madrid', 'Valencia', 'Corralejo'],
            Estonia: ['Tallinn', 'Haapsalu', 'Tartu'],
            Austria: ['Vienna', 'Salzburg', 'Innsbruck']}

        countries.forEach((country) => {
            cy.get('#country')
                .find('option')
                .contains(country)
                .should('be.visible')

            cy.get('#country')
                .select(country)

            expectedCities[country]
                .forEach((city) => {cy.get('#city')
                    .find('option')
                    .contains(city)
                    .should('be.visible')})
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
            cy.get('input[name="email"]').invoke('val').then((value) => {
                expect(value).to.match(emailRegex)
            })
        });

        invalidEmails.forEach((email) => {
            cy.get('input[name="email"]').clear().type(email)
            cy.get('input[name="email"]').invoke('val').then((value) => {
                expect(value).not.to.match(emailRegex)})
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
        cy.visit('cypress/fixtures/registration_form_3.html'); // Adjust the URL as necessary
    });

    it('should fill in all fields and verify their values', () => {
        cy.get('input[name="name"]').type('John Doe'); // Fill name field
        cy.get('input[name="email"]').type('user@cerebrumhub.com'); // Fill email
        cy.get('select#country').select('Spain'); // Select country
        cy.get('select#city').select('Malaga'); // Select city
        cy.get('input[type="date"]').type('2024-10-04'); // Fill registration date
        cy.get('select[name="newsletterFrequency"]').select('Weekly'); // Frequency of newsletter
        cy.get('input[name="birthday"]').type('1990-01-01'); // Fill birthday field
        cy.get('input[type="file"]').attachFile('exampleFile.pdf'); // Upload file
        cy.get('input[type="checkbox"][ng-model="checkboxPrivacy"]').check(); // Check privacy policy checkbox
        cy.get('input[type="checkbox"][ng-model="checkboxCookie"]').check(); // Check cookie policy checkbox

        // Assert that all values are filled in correctly
        cy.get('input[name="name"]').should('have.value', 'John Doe');
        cy.get('input[name="email"]').should('have.value', 'user@cerebrumhub.com');
        cy.get('select#country').should('have.value', 'Spain');
        cy.get('select#city').should('have.value', 'Malaga');
        cy.get('input[type="date"]').should('have.value', '2024-10-04');
        cy.get('select[name="newsletterFrequency"]').should('have.value', 'Weekly');
        cy.get('input[name="birthday"]').should('have.value', '1990-01-01');
        cy.get('input[type="file"]').invoke('val').should('contain', 'exampleFile.pdf'); // Verify file upload
        cy.get('input[type="checkbox"][ng-model="checkboxPrivacy"]').should('be.checked');
        cy.get('input[type="checkbox"][ng-model="checkboxCookie"]').should('be.checked');
    });

    it('should fill in only mandatory fields and verify their values', () => {
        // Fill only mandatory fields
        cy.get('input[name="email"]').type('user@cerebrumhub.com'); // Fill email
        cy.get('select#country').select('Spain'); // Select country
        cy.get('select#city').select('Malaga'); // Select city

        // Assert that mandatory values are filled in correctly
        cy.get('input[name="email"]').should('have.value', 'user@cerebrumhub.com');
        cy.get('select#country').should('have.value', 'Spain');
        cy.get('select#city').should('have.value', 'Malaga');

        // Assert that other fields are empty
        cy.get('input[name="name"]').should('have.value', '');
        cy.get('input[type="date"]').should('have.value', '');
        cy.get('select[name="newsletterFrequency"]').should('have.value', '');
        cy.get('input[name="birthday"]').should('have.value', '');
        cy.get('input[type="checkbox"][ng-model="checkboxPrivacy"]').should('not.be.checked');
        cy.get('input[type="checkbox"][ng-model="checkboxCookie"]').should('not.be.checked');
    });

    it('should show error messages when mandatory fields are absent', () => {
        // Submit the form without filling any mandatory fields
        cy.get('.submit_button').click(); // Adjust selector for your submit button

        // Check for error messages for mandatory fields
        cy.get('#email_error_message').should('be.visible').and('contain', 'Email is required.'); // Adjust as necessary
        cy.get('#country_error_message').should('be.visible').and('contain', 'Country is required.'); // Adjust as necessary
        cy.get('#city_error_message').should('be.visible').and('contain', 'City is required.'); // Adjust as necessary
    });

    it('should upload a file and verify the upload', () => {
        const fileName = 'exampleFile.pdf'; // Replace with your actual file name

        cy.get('input[type="file"]').attachFile(fileName); // Use the `cypress-file-upload` plugin

        // Verify that the file is uploaded successfully
        cy.get('input[type="file"]').invoke('val').should('contain', fileName); // Check that the file name is displayed in the input
    });

    it('should enable submit button only when mandatory fields are filled', () => {
        // Initially, the submit button should be disabled
        cy.get('.submit_button').should('be.disabled'); // Adjust selector as necessary

        // Fill only mandatory fields
        cy.get('input[name="email"]').type('user@cerebrumhub.com');
        cy.get('select#country').select('Spain');
        cy.get('select#city').select('Malaga');

        // Now the submit button should be enabled
        cy.get('.submit_button').should('not.be.disabled');
    });
})//TEST