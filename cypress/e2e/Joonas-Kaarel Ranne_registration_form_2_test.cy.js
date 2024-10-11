beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})


describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', () => {
        inputValidData("username")
        cy.get('#input_error_message').should('not.be.visible')
        cy.get('.submit_button').should('be.enabled')
        cy.get('[name="confirm"]').clear().type('Parool123456')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('be.visible')
    })

    it('User can submit form with all fields added', () => {
        inputValidData("username")
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible')
    })

    it('User can submit form with valid data and only mandatory fields added', () => {
        inputValidMandatoryData("username")
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible')
    })

    it('User cannot submit form without filling mandatory fields(username)', () => {
        inputValidData("username")
        cy.get('input[name="username"]').clear()
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#input_error_message').should('be.visible')
    })
})


describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('img').invoke('height').should('be.lessThan', 178).and('be.greaterThan', 100)
    })

    it('My test for second picture', () => {
        cy.log('Will check logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').should('include', 'cypress_logo')
        cy.get('img').invoke('height').should('be.lessThan', 178).and('be.greaterThan', 100)
    });

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav').children().eq(0).should('be.visible').and('have.attr', 'href', 'registration_form_1.html').click().url().should('contain', '/registration_form_1.html')
        cy.go('back').url().should('contain', '/registration_form_2.html').log('Back again in registration form 2')
    })

    it('Check navigation part', () => {
        cy.get('nav').children().eq(1).should('be.visible').and('have.attr', 'href', 'registration_form_3.html').click().url().should('contain', '/registration_form_3.html')
        cy.go('back').url().should('contain', '/registration_form_2.html').log('Back again in registration form 2')
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        const expectedLabels = ['HTML', 'CSS', 'JavaScript', 'PHP']
        expectedLabels.forEach((label, index) => { cy.get('input[type="radio"]').next().eq(index).should('have.text', label) })
        for (let i = 0; i < 4; i++) { cy.get('input[type="radio"]').eq(i).should('not.be.checked') }

        const radioIndexes = [0, 1, 2, 3]
        radioIndexes.forEach((index, i) => {
            cy.get('input[type="radio"]').eq(index).check().should('be.checked')
            radioIndexes.filter(idx => idx !== index).forEach(uncheckedIndex => {
                cy.get('input[type="radio"]').eq(uncheckedIndex).should('not.be.checked')
            })
        })
    })

    it('Check that checkbox list is correct', () => {
        const checkboxLabels = ['I have a bike', 'I have a car', 'I have a boat']
        cy.get('input[type="checkbox"]').should('have.length', 3)

        cy.get('input[type="checkbox"]').each(($el, index) => {
            cy.wrap($el).next().should('have.text', checkboxLabels[index])
        })

        cy.get('input[type="checkbox"]').should('not.be.checked')
        cy.get('input[type="checkbox"]').check().should('be.checked')

        cy.get('input[type="checkbox"]').eq(0).uncheck().should('not.be.checked')
        cy.get('input[type="checkbox"]').each(($el, index) => {
            if (index !== 0) {
                cy.wrap($el).should('be.checked')
            }
        })
    })

    it('Car dropdown is correct', () => {
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    it('Animal dropdown is correct', () => {
        cy.get('#animal').children().should('have.length', 6)
        cy.get('#animal').find('option').eq(0).should('have.text', 'Dog')
        cy.get('#animal').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'])
        })
    })
})

function inputValidData(username) {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type(username)
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
    cy.get('input[name="fav_language"][value="HTML"]').check()
    cy.get('input[name="vehicle2"][value="Car"]').check()
    cy.get('select[name="cars"]').select("audi")
    cy.get('select[name="animal"]').select("cat")
}

function inputValidMandatoryData(username) {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type(username)
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
}