const htmlFilesNames = [
  '/index.html',
  '/contacts.html',
  '/cabinet.html',
  '/searchingResult.html',
  '/userProfile.html',
  '/userSignUp.html'
]

describe('Тесты функций хедера', () => {
  it('Coverage должен собираться', () => {
    cy.visit('/')

    cy.window().then(win => {
      expect(win.__coverage__).to.not.be.undefined
    })
  })

  it('Проверка изменения цвета Альвадуда и названия школы при наведении мыши на эти элементы', () => {
    htmlFilesNames.forEach(element => {
      cy.visit(element)

      cy.get('.al-vadud').as('alvadud')
      cy.get('.school-name').as('schoolName')

      //Проверка изменения цвета Альвадуда и названия Школы при наведении мыши на иконку Альвадуд
      cy.get('@alvadud').realHover('mouse')
      cy.get('@schoolName').should('have.css', 'color', 'rgb(255, 215, 0)')
      cy.get('@alvadud').should('have.css', 'fill', 'rgb(255, 215, 0)')

      //Проверка изменения цвета Альвадуда и названия Школы при наведении мыши на название Школы
      cy.get('@schoolName').realHover('mouse')
      cy.get('@schoolName').should('have.css', 'color', 'rgb(255, 215, 0)')
      cy.get('@alvadud').should('have.css', 'fill', 'rgb(255, 215, 0)')

      //Проверка изменения цвета Альвадуда и названия Школы при отвода мыши с этих элементов
      cy.get('.search').realHover('mouse')
      cy.get('@schoolName').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('@alvadud').should('have.css', 'fill', 'rgb(255, 0, 0)')
    })
  })

  it('Проверка видимости окна поиска по сайту при нажатии на иконку поиска', () => {
    htmlFilesNames.forEach(element => {
      cy.visit(element)

      cy.get('.searchToggle').find('.search').as('searchIcon')
      cy.get('.searchToggle').find('.cancel').as('cancelIcon')
      cy.get('.searchBox').find('.searchToggle').as('searchToggle')
      cy.get('.searchBox').find('.search-field').as('searchField')

      //Наводим мышь на иконку поиск
      cy.get('@searchIcon').scrollIntoView()
      cy.get('@searchIcon').realHover({
        position: 'center',
        force: true
      })

      //Проверка видимости поля ввода поискового запроса при нажатии на иконку поиск
      cy.get('@searchIcon').click({ force: true })
      cy.wait(3000)
      cy.get('@searchToggle').should('have.class', 'active')
      cy.get('@searchField').should('be.visible')

      //Проверка закрытия окна ввода поискового запроса при нажатии на иконку закрыть
      cy.get('@cancelIcon').click({ force: true })
      cy.wait(3000)
      cy.get('@searchToggle').should('have.not.class', 'active')
      cy.get('@searchField').should('be.not.visible')

      //Проверка редиректа на страницу результатов поиска при нажатии на кнопку поиск в окне поиска
      cy.get('@searchIcon').click({ force: true })
      cy.wait(3000)
      cy.get('@searchToggle').should('have.class', 'active')
      cy.get('@searchField').find('.search').click({ force: true })
      cy.url().should('match', /searchingResult/)
    })
  })

  it('Проверка функций окна входа юзера в аккаунт', () => {
    htmlFilesNames.forEach(element => {
      cy.visit(element)

      cy.get('#user').as('userIcon')
      cy.get('.sign-in-container').as('signInContainer')

      //Наводим мышь на иконку юзера
      cy.get('@userIcon').scrollIntoView()
      cy.get('@userIcon').realHover({
        position: 'center',
        force: true
      })

      //Проверка отображения окна
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('@signInContainer').should('be.visible')

      //Проверка работы иконки отображения/скрытия пароля
      cy.get('#pass').as('passwordField')
      cy.get('#show-password').as('showPasswordIcon')
      cy.get('#hide-password').as('hidePasswordIcon')
      cy.get('@hidePasswordIcon').click()
      cy.get('@showPasswordIcon').should('be.visible')
      cy.get('@hidePasswordIcon').should('be.hidden')
      cy.get('@passwordField').should('have.attr', 'type', 'text')
      cy.get('@showPasswordIcon').click()
      cy.get('@showPasswordIcon').should('be.hidden')
      cy.get('@hidePasswordIcon').should('be.visible')
      cy.get('@passwordField').should('have.attr', 'type', 'password')

      //Проверка закрытия окна при нажатии на иконку юзера
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('@signInContainer').should('be.not.visible')

      //Проверка закрытия окна при нажатии на кнопку закрыть окно
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('.sign-in-form-cancel').click()

      cy.wait(1000)

      cy.get('@signInContainer').should('be.not.visible')

      //Проверка редиректа на страницу регистрации юзера при нажатии на кнопку "Зарегистрироваться"
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('.register').find('.sign-in-form-link').click()
      cy.url().should('match', /userSignUp/)
    })
  })

  it('Проверка функций окна информации юзера', () => {
    htmlFilesNames.forEach(element => {
      cy.visit(element)

      cy.get('#user').as('userIcon')
      cy.get('#user-information-container').as('userInformationContainer')

      //Наводим мышь на иконку юзера
      cy.get('@userIcon').scrollIntoView()
      cy.get('@userIcon').realHover({
        position: 'center',
        force: true
      })

      //Проверка отображения окна
      cy.get('@userIcon').click()
      cy.get('.sign-in-container').as('signInContainer')
      cy.get('@signInContainer').find('.sign-in-button').click()
      cy.wait(1000)
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('@userInformationContainer').should('be.visible')

      //Проверка закрытия окна при нажатии на иконку юзера
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('@userInformationContainer').should('be.not.visible')

      //Проверка закрытия окна при нажатии на кнопку закрыть окно
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('.user-information-form-cancel').click()
      cy.get('@userInformationContainer').should('be.not.visible')

      //Проверка редиректа на страницу регистрации юзера при нажатии на кнопку "Зарегистрироваться"
      cy.get('@userIcon').click()
      cy.wait(1000)
      cy.get('.user-fw-profile-link').click()
      cy.url().should('match', /userProfile/)
    })
  })

  it('Проверка функций окна уведомлений', () => {
    htmlFilesNames.forEach(element => {
      cy.visit(element)

      cy.get('#notification-svg').as('notificationIcon')
      cy.get('.notification-container').as('notificationContainer')

      //Наводим мышь на иконку юзера
      cy.get('@notificationIcon').scrollIntoView()
      cy.get('@notificationIcon').realHover({
        position: 'center',
        force: true
      })

      //Проверка отображения окна
      cy.get('@notificationIcon').click()
      cy.wait(1000)
      cy.get('@notificationContainer').should('be.visible')

      //Проверка закрытия окна при нажатии на иконку юзера
      cy.get('@notificationIcon').click()
      cy.wait(1000)
      cy.get('@notificationContainer').should('be.not.visible')

      //Проверка закрытия окна при нажатии на кнопку закрыть окно
      cy.get('@notificationIcon').click()
      cy.wait(1000)
      cy.get('.notification-form-cancel').click()
      cy.wait(1000)
      cy.get('@notificationContainer').should('be.not.visible')
    })
  })
})

describe('Проверка функций футера', () => {
  it('Проверка отображения текущего года в футере', () => {
    htmlFilesNames.forEach(element => {
      cy.visit(element)

      const currentYear = new Date().getFullYear()
      cy.get('.copyright').should(
        'have.text',
        `\n«Восходящий Поток» © 2015 —\n ${currentYear}`
      )
    })
  })
})
