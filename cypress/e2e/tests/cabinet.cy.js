const { DateTime } = require('luxon')

describe('Тесты сайдбара страницы "Кабинет искателя" ', () => {
  it('Тестирование отображение контента при нажатии на меню сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(3000)

    cy.get('.cabinet-content').as('content')

    //Проверка отображения контента при нажатии на первое меню сайдбара
    cy.get('.sidebar-menu-item').first().as('first-menu-item')
    cy.get('@first-menu-item').realClick()

    cy.wait(1000)

    cy.get('@first-menu-item').should('have.css', 'color', 'rgb(255, 215, 0)')
    cy.get('@first-menu-item').parent().should('have.class', 'active')

    cy.get('@content').should('be.visible')
    cy.get('@content').should('have.css', 'opacity', '1')
    cy.get('@first-menu-item')
      .invoke('attr', 'id')
      .then(id => {
        cy.get(`#${id}-sb-cnt`).should('be.visible')
      })

    //Проверка всех остальных меню
    cy.get('.sidebar-menu-item').each(($el, index, $list) => {
      //Проверка отображение контейнера контента меню сайдбара при нажатии на пункт меню
      if (index < $list.length - 1) {
        cy.wrap($list.eq(index + 1)).realClick()

        cy.wait(1000)

        cy.get('@content').should('be.visible')
        cy.get('@content').should('have.css', 'opacity', '1')

        //Проверка отображения соответсвующего контейнера контента меню сайдбара
        cy.wrap($list.eq(index + 1))
          .invoke('attr', 'id')
          .then(id => {
            cy.get(`#${id}-sb-cnt`).should('be.visible')
          })

        //Проверка предидущего меню сайдбара на отсутсвие класса active и изменение цвета
        cy.wrap($el).parent().should('not.have.class', 'active')
        cy.wrap($el).should('have.css', 'color', 'rgb(255, 255, 255)')
      }
    })
  })

  it('Тестирование отображение подменю сайдбара при наведении мыши на меню сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(3000)

    //Проверка всех остальных меню
    cy.get('.sidebar-menu-item.serv-btn').each($el => {
      //Проверка отображение контейнера контента меню сайдбара при нажатии на пункт меню
      cy.wrap($el).as('menuItem')

      cy.wrap($el)
        .next()
        .find('.sidebar-submenu-item')
        .each(($el, index) => {
          cy.get('@menuItem').scrollIntoView()
          cy.get('@menuItem').realHover({
            position: 'center',
            force: true
          })

          cy.wait(1000)

          cy.wrap($el).should('be.visible').and('have.css', 'opacity', '1')

          cy.wrap($el).should(
            'have.css',
            'transform',
            'matrix(1, 0, 0, 1, 0, 0)'
          )

          cy.wrap($el).should('have.css', 'transition-delay', `${index / 10}s`)
        })
    })
  })

  it('Тестирование стилей подменю сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(3000)

    //Проверка всех остальных меню
    cy.get('.sidebar-menu-item.serv-btn').each(($el, index, $list) => {
      //Проверка отображение контейнера контента меню сайдбара при нажатии на пункт меню
      cy.wrap($el).as('menuItem')

      cy.get('@menuItem')
        .next()
        .find('.sidebar-submenu-item')
        .each(($el, index, $list) => {
          cy.get('@menuItem').scrollIntoView()
          cy.get('@menuItem').realHover({
            position: 'center',
            force: true
          })

          cy.wait(1000)

          cy.wrap($el).click()

          cy.wrap($list.eq(0)).should('have.css', 'color', 'rgb(255, 215, 0)')

          if (index > 0) {
            cy.wrap($el).should('have.css', 'color', 'rgb(255, 215, 0)')

            cy.wrap($el).should('have.class', 'active')
          }

          if (index > 1) {
            cy.wrap($list.eq(index - 1)).should('have.not.class', 'active')
          }
        })
    })
  })

  it('Тестирование отображение контента при нажатии на подменю сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(3000)

    cy.get('.cabinet-content').as('content')

    //Проверка всех остальных меню
    cy.get('.sidebar-menu-item.serv-btn').each(($el, index, $list) => {
      //Проверка отображение контейнера контента меню сайдбара при нажатии на пункт меню
      cy.wrap($el).as('menuItem')

      cy.wrap($el)
        .next()
        .find('.sidebar-submenu-item')
        .each($el => {
          cy.get('@menuItem').scrollIntoView()
          cy.get('@menuItem').realHover({
            position: 'center',
            force: true
          })

          cy.wait(1000)

          cy.wrap($el).realClick()

          cy.wrap($el)
            .invoke('attr', 'id')
            .then(id => {
              cy.get(`#${id}-sb-cnt`).should('be.visible')
            })
        })
    })
  })
})

describe('Тесты таблиц контента страницы Кабинета юзера', () => {
  it('Тестирование изменение положения каретки сортировки при нажатии на заголовок таблицы', () => {
    cy.visit('/cabinet.html')

    cy.wait(3000)

    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })

    cy.get('#link-will').click()

    cy.get('#will-tbl')
      .find('th')
      .each(($el, index, $list) => {
        if (index != $list.length - 1) {
          cy.wrap($el).click()

          cy.wrap($el).find('.fa-caret-down').should('have.class', 'rotate')

          cy.wrap($el).click()

          cy.wrap($el).find('.fa-caret-down').should('have.not.class', 'rotate')
        }
      })
  })
})
