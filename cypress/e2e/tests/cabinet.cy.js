const { DateTime } = require('luxon')
import '../../support/commands.js'

describe('Тесты сайдбара страницы "Кабинет искателя" ', () => {
  it('Тестирование отображение контента при нажатии на меню сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    cy.get('.cabinet-content').as('content')

    //Проверка отображения контента при нажатии на первое меню сайдбара
    cy.get('.sidebar-menu-item').first().as('first-menu-item')
    cy.get('@first-menu-item').click()

    cy.wait(2000)

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
        cy.wrap($list.eq(index + 1)).click()

        cy.wait(2000)

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

    cy.wait(2000)

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

          cy.wait(2000)

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

    cy.wait(2000)

    //Проверка всех остальных меню
    cy.get('.sidebar-menu-item.serv-btn').each(($el, $index, $list) => {
      //Проверка отображение контейнера контента меню сайдбара при нажатии на пункт меню
      cy.wrap($el).as('menuItem')

      if ($index > 0) {
        cy.wrap($list.eq($index - 1)).should('have.not.class', 'active')
      }

      cy.get('@menuItem')
        .next()
        .find('.sidebar-submenu-item')
        .each(($el, $index, $list) => {
          cy.get('@menuItem').scrollIntoView()
          cy.get('@menuItem').realHover({
            position: 'center',
            force: true
          })

          cy.wait(1000)

          cy.wrap($el).click()

          cy.wrap($list.eq(0)).should('have.class', 'title')
          cy.wrap($list.eq(0)).should('have.class', 'active')
          cy.wrap($list.eq(0)).should('have.css', 'color', 'rgb(255, 215, 0)')

          if ($index > 0) {
            cy.wrap($el).should('have.css', 'color', 'rgb(255, 215, 0)')

            cy.wrap($el).should('have.class', 'active')
          }

          if ($index > 1) {
            cy.wrap($list.eq($index - 1)).should('have.not.class', 'active')
          }
        })
    })
  })

  it('Тестирование отображение контента при нажатии на подменю сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

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

          cy.wait(2000)

          cy.wrap($el).click()

          cy.wrap($el)
            .invoke('attr', 'id')
            .then(id => {
              cy.get(`#${id}-sb-cnt`).should('be.visible')
            })
        })
    })
  })
})

/*
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
*/

describe('Тесты переключателя между форматом отображения контента таблицы и плитки', () => {
  it('Тестирование переключателя между форматом отображения контента таблицы и плитки', () => {
    cy.visit('/cabinet.html')

    cy.wait(1000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(2000)
    cy.get('#link-will').click()

    //Инициализация alias
    cy.get('.sb-cnt-tbl-container').as('tbl')
    cy.get('.sb-cnt-title-container').as('title')
    cy.get('.sb-cnt-tabs-cnt').as('tabsContainer')
    cy.get('.cnt-tab').as('tabs')
    cy.get('.cnt-tab').eq(0).as('tabTable')
    cy.get('.cnt-tab').eq(1).as('tabTitle')

    //Проверка отображения переключателя
    cy.get('@tabsContainer').should('be.visible')

    //Проверка активности переключателя таблицы
    cy.get('@tbl').should('have.class', 'active')
    cy.get('@title').should('have.not.class', 'active')
    cy.get('@tabTable').should('have.class', 'active')
    cy.get('@tabTitle').should('have.not.class', 'active')
    cy.get('@tabTable').should('have.attr', 'tab-id', 'tbl')

    //Включаем режим отображения контента - "Плитка"
    cy.get('@tabTitle').click()

    //Проверка активности переключателя плитки
    cy.get('@tbl').should('have.not.class', 'active')
    cy.get('@title').should('have.class', 'active')
    cy.get('@tabTitle').should('have.class', 'active')
    cy.get('@tabTable').should('have.not.class', 'active')
    cy.get('@tabTitle').should('have.attr', 'tab-id', 'title')
  })
})

/*
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
*/

describe('Тесты таблиц контента страницы Кабинета юзера', () => {
  beforeEach(() => {
    cy.visitCabinetPage()
    cy.initTableAliases()
  })
  it('Тестирование изменение положения каретки сортировки при нажатии на заголовок таблицы', () => {
    cy.get('@glLbCheckbox').scrollIntoView()
    cy.get('@glLbCheckbox').realHover({
      position: 'center',
      force: true
    })
    cy.wait(3000)

    cy.get('@willTable')
      .find('th')
      .each(($el, index, $list) => {
        if (index < $list.length - 2) {
          cy.wrap($el).click()

          cy.wrap($el).find('.fa-caret-down').should('have.class', 'rotate')

          cy.wrap($el).click()

          cy.wrap($el).find('.fa-caret-down').should('have.not.class', 'rotate')
        }
      })
  })

  it('Тестирование кнопки "Добавить запись" в таблицу', () => {
    //Находим и жмём на кнопку добавить запись
    cy.get('@btnAddCell').then($btn => {
      cy.wrap($btn).click()
    })

    //Считываем количество строк до добавления записи
    cy.get('@tblRows').its('length').as('rowCount')
    cy.log('@rowCount')
    cy.get('@rowCount').then(rowCount => {
      cy.wrap(rowCount + 1).as('rowCount')
    })

    cy.wait(2000)

    //Проверка видимости модального окна добавления записи
    cy.get('@editModalContainer').should('be.visible')

    //Переменные для заполнения
    const date = '2025-03-25'
    const briefDescription = 'Вывезти людей из осаждённого города'
    const description = 'Необходимо сделать ближайшие 2 дня'

    //Заполняем элементы формы данными
    cy.get('@editFormInputField').each(($el, $index, $list) => {
      cy.wrap($list.eq(0)).type(date)
      cy.wrap($list.eq(1)).type(briefDescription)
      cy.wrap($list.eq(2)).type(description)
      return false
    })

    // Блокируем перезагрузку страницы после добавления записи
    cy.get('@editModalSaveBtn').then($btn => {
      $btn.on('click', e => e.preventDefault())
    })
    //Жмём на кнопку сохранить
    cy.get('@editModalSaveBtn').click()

    //Проверка количества строк после добавления записи
    cy.get('@tblRows').its('length').as('executedRowCount')
    cy.get('@executedRowCount').then(executedRowCount => {
      cy.get('@rowCount').should('eq', executedRowCount)
    })

    cy.get('@tblRows').each(($el, $index, $list) => {
      if ($index === $list.length - 1) {
        cy.wrap($el).should('have.attr', 'obj-id', $list.length)

        cy.wrap($el).find('td').eq(0).should('have.text', '25.03.2025')
        cy.wrap($el).find('td').eq(1).should('have.text', briefDescription)
        cy.wrap($el).find('td').eq(2).should('have.text', description)
      }
    })
  })

  it('Тестирование чекбоксов мультивыбора таблицы', () => {
    cy.get('@glLbCheckbox').click({ force: true })
    cy.wait(2000)

    //Проверка перехода главного чекбокса в заголовке таблицы в активное состояние при клике
    cy.get('@glCheckbox').should('be.not.checked')
    cy.get('@glChecmark').should('have.class', 'active')
    cy.get('@tblChecmarks').each($el => {
      cy.wrap($el).should('have.css', 'opacity', '1')
    })

    //Проверка отображения галочки в дефолтном чекбоксе заголовка таблицы после повторного клика
    cy.get('@glChecmark').click({ force: true })
    cy.wait(2000)

    cy.get('@glCheckbox').should('be.checked')
    cy.get('@glChecmark')
      .should('have.class', 'active')
      .then($el => {
        const after = window.getComputedStyle($el[0], '::after')
        expect(after).to.have.property('content', '""') // Проверяем, что content существует
        expect(after).to.have.property('display', 'block') // Проверяем видимость элемента
      })
    //Проверка отображения галочки в дефолтных чекбоксах таблицы после повторного клика на главный чекбокс
    cy.get('@tblChecmarks').each($el => {
      const after = window.getComputedStyle($el[0], '::after')
      expect(after).to.have.property('content', '""') // Проверяем, что content существует
      expect(after).to.have.property('display', 'block') // Проверяем элемента
    })

    //Проверка состояния чекбоксов после повторного клика на главный чекбокс
    cy.get('@glCheckbox').should('be.checked')
    cy.get('@tblCheckboxes').each($el => {
      cy.wrap($el).should('be.checked')
    })

    cy.get('@glChecmark').click({ force: true })
    cy.wait(2000)

    //Проверка состояния чекбоксов после клика на главный чекбокс
    cy.get('@glCheckbox').should('be.not.checked')
    cy.get('@tblCheckboxes').each($el => {
      cy.wrap($el).should('be.not.checked')
    })

    //Проверка изменения состояния главного чекбокса при переводе всех чекбоксов таблицы в активное состояние
    cy.get('@tblCheckboxes').each($el => {
      cy.wrap($el).click({ force: true })
    })

    cy.get('@glCheckbox').should('be.checked')

    //Проверка состояния главного чекбокса при снятия активного состояния у одного из чекбоксов таблицы
    cy.get('@tblCheckboxes').eq(0).click({ force: true })

    cy.get('@glCheckbox').should('be.not.checked')
  })

  it('Тестирование стилей выбраной ячейки таблицы', () => {
    cy.get('@glCheckbox').click({ force: true })
    cy.get('@glCheckbox').click({ force: true })
    cy.wait(2000)

    //Проверка ячеек таблицы на наличие класса selected
    cy.get('@tblRows').each($row => {
      cy.wrap($row).should('have.class', 'selected')
    })

    //Последовательно убираем активность у всех чекбоксов таблицы и проверяем на отстутствие класса selected
    cy.get('@tblCheckboxes').each(($checkbox, $index) => {
      cy.wrap($checkbox).click({ force: true })

      cy.get('@tblRows').eq($index).should('have.not.class', 'selected')
    })

    //Последовательно добавляем активность у всех чекбоксов таблицы и проверяем на наличие класса selected
    cy.get('@tblCheckboxes').each(($checkbox, $index) => {
      cy.wrap($checkbox).click({ force: true })

      cy.get('@tblRows').eq($index).should('have.class', 'selected')
    })
  })

  it('Тестирование отображения кнопки "Удалить записи" и работы кнопки при всех отмеченных чекбоксах в таблице', () => {
    //Активируем главный чекбокс и отмечаем все чекбоксы в таблице
    cy.get('@glLbCheckbox').click({ force: true })
    cy.get('@glLbCheckbox').click({ force: true })

    cy.wait(2000)
    //Проверка видимости кнопки "Удалить записи"
    cy.get('@btnDltAll').should('be.visible')

    //Проверка работы кнопки
    cy.get('@btnDltAll').click()

    //Проверка наличия записей в таблице
    cy.get('@willTable').find('.tbl-row').should('have.length', 0)
  })

  it('Тестирование отображения кнопки "Удалить записи" и работы кнопки при двух отмеченных чекбоксах в таблице', () => {
    //Считываем количество строк до удаления записей
    cy.get('@willTable').find('tbody tr').its('length').as('rowCount')
    cy.log('@rowCount')
    cy.get('@rowCount').then(rowCount => {
      cy.wrap(rowCount - 2).as('rowCount')
    })

    //Активируем главный чекбокс и отмечаем все чекбоксы в таблице
    cy.get('@glLbCheckbox').click({ force: true })

    //Отмечаем один чекбокс в таблице
    cy.get('@willTable')
      .find('.tbl-body-row')
      .eq(0)
      .find('.tbl-lb-checkbox')
      .click({ force: true })

    cy.wait(2000)

    //Проверка видимости кнопки "Удалить записи"
    cy.get('@btnDltAll').should('be.not.visible')

    cy.wait(2000)

    //Отмечаем ещё один чекбокс в таблице
    cy.get('@willTable')
      .find('.tbl-body-row')
      .eq(1)
      .find('.tbl-lb-checkbox')
      .click({ force: true })

    cy.wait(2000)

    //Проверка работы кнопки
    cy.get('@btnDltAll').click()

    cy.wait(2000)

    //Считываем количество строк после удаления записи
    cy.get('@willTable').find('tbody tr').its('length').as('executedRowCount')

    //Проверка наличия записей в таблице
    cy.get('@rowCount').then(rowCount => {
      cy.get('@executedRowCount').should('eq', rowCount)
    })
  })

  it('Тестирование скрытия отображения кнопки "Удалить записи" при отсутствии отмеченных чекбоксов', () => {
    cy.get('@glLbCheckbox').click({ force: true })
    cy.get('@glLbCheckbox').click({ force: true })

    cy.get('@btnDltAll').should('be.visible')

    //Снимаем отметку со всех чекбоксов в таблице
    cy.get('@glLbCheckbox').click({ force: true })

    //Проверка скрытия видимости кнопки
    cy.get('@btnDltAll').should('be.not.visible')
  })

  it('Тестирование работы иконки "Добавить в избранное"', () => {
    //Проверка видимости иконки "Добавить в избранное"
    cy.get('@favIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-star')
      cy.wrap($el).should('have.attr', 'title', 'Добавить в избранное')
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Удалить из избранного"
    cy.get('@favIcons').each($el => {
      cy.wrap($el).should('have.class', 'bxs-star')
      cy.wrap($el).should('have.attr', 'title', 'Удалить из избранного')
      cy.wrap($el).should('have.class', 'active')
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Добавить в избранное"
    cy.get('@favIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-star')
      cy.wrap($el).should('have.attr', 'title', 'Добавить в избранное')
      cy.wrap($el).click()
    })
  })

  it('Тестирование работы иконки "Редактировать" в таблице (сравнение значений таблицы с значениями в модальном окне)', () => {
    //Сравниваем значения в таблице с значениями в модальном окне
    cy.get('@willTable')
      .find('.tbl-body-row')
      .each(($el, $index, $list) => {
        let expectedId = $list.eq($index).attr('obj-id')

        cy.wrap($el).find('.tbl-edit-icon').as('tblEditIcon')
        cy.wrap($el)
          .find('.tbl-row-data')
          .then($cells => {
            const date = $cells.eq(0).text().trim()
            const [day, month, year] = date.split('.')
            const expectedDate = `${year}-${month}-${day}`
            const expectedBriefDescription = $cells.eq(1).text().trim()
            const expectedDescription = $cells.eq(2).text().trim()

            // Сохраняем значения в alias
            cy.wrap(expectedId).as('expectedId')
            cy.wrap(expectedDate).as('expectedDate')
            cy.wrap(expectedBriefDescription).as('expectedBriefDescription')
            cy.wrap(expectedDescription).as('expectedDescription')

            // Кликаем на иконку редактирования
            cy.get('@tblEditIcon').click({ force: true })

            cy.get('.edit-modal-container').should('be.visible')

            cy.get('@editForm').should('have.attr', 'obj-id', expectedId)

            // Ожидаем появления модального окна и проверяем значения в формах
            cy.get('.edit-modal-input-field').each(($input, $index) => {
              switch ($index) {
                case 0:
                  cy.wrap($input).should('have.value', expectedDate)
                  break
                case 1:
                  cy.wrap($input).should('have.value', expectedBriefDescription)
                  break
                case 2:
                  cy.wrap($input).should('have.value', expectedDescription)
                  break
              }
            })

            //Закрываем модельное окно и проверяем его видимость
            cy.get('.edit-form').find('.edit-modal-close-icon').click()
            cy.get('.edit-modal-container').should('be.not.visible')
          })
      })
  })

  it('Тестирование работы иконки "Редактировать" в таблице (сравнение отредактированных значений таблицы)', () => {
    const date = '2025-03-25'
    const expectedDate = '25.03.2025'
    const expectedBriefDescription = 'Краткое описание'
    const expectedDescription = 'Описание'

    //Кликаем на иконку редактирования
    cy.get('@willTable')
      .find('.tbl-body-row')
      .eq(0)
      .then($cells => {
        // Сохраняем значения в alias
        cy.wrap(date).as('date')
        cy.wrap(expectedDate).as('expectedDate')
        cy.wrap(expectedBriefDescription).as('expectedBriefDescription')
        cy.wrap(expectedDescription).as('expectedDescription')

        cy.wrap($cells).find('.tbl-edit-icon').click({ force: true })

        cy.get('@editForm')
          .find('.edit-modal-input-field')
          .eq(0)
          .clear()
          .type(date)
        cy.get('@editForm')
          .find('.edit-modal-input-field')
          .eq(1)
          .clear()
          .type(expectedBriefDescription)
        cy.get('@editForm')
          .find('.edit-modal-input-field')
          .eq(2)
          .clear()
          .type(expectedDescription)

        // Блокируем перезагрузку страницы перед сохранением изменений
        cy.get('@editModalSaveBtn').then($btn => {
          $btn.on('click', e => e.preventDefault())
        })

        cy.get('@editModalSaveBtn').click()
      })

    cy.get('@willTable')
      .find('.tbl-body-row')
      .eq(0)
      .then($cells => {
        cy.wrap($cells)
          .find('.tbl-row-data')
          .eq(0)
          .should('have.text', expectedDate)
        cy.wrap($cells)
          .find('.tbl-row-data')
          .eq(1)
          .should('have.text', expectedBriefDescription)
        cy.wrap($cells)
          .find('.tbl-row-data')
          .eq(2)
          .should('have.text', expectedDescription)
      })
  })

  it('Тестирование работы иконки "Удалить" в таблице', () => {
    cy.get('@tblRows').each(($row, $index, $list) => {
      if ($index == $list.length - 1) return false

      //Считываем количество строк до удаления записи
      cy.get('@willTable').find('tbody tr').its('length').as('rowCount')
      cy.log('@rowCount')
      cy.get('@rowCount').then(rowCount => {
        cy.wrap(rowCount - 1).as('rowCount')
      })

      //Кликаем на иконку удаления
      cy.wrap($row).find('.tbl-dlt-icon').click({ force: true })

      //Проверка количества строк после удаления записи
      cy.get('@willTable').find('tbody tr').its('length').as('executedRowCount')
      cy.get('@executedRowCount').then(executedRowCount => {
        cy.get('@rowCount').should('eq', executedRowCount)
      })
    })
  })

  it('Тестирование работы иконки "Сделать запись доступной куратору" в таблице', () => {
    //Проверка видимости иконки "Сделать запись не доступной куратору"
    cy.get('@curatorAccessIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-show')
      cy.wrap($el).should(
        'have.attr',
        'title',
        'Сделать запись не доступной куратору'
      )
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Сделать запись доступной куратору"
    cy.get('@curatorAccessIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-hide')
      cy.wrap($el).should(
        'have.attr',
        'title',
        'Сделать запись доступной куратору'
      )
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Сделать запись не доступной куратору"
    cy.get('@curatorAccessIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-show')
      cy.wrap($el).should(
        'have.attr',
        'title',
        'Сделать запись не доступной куратору'
      )
      cy.wrap($el).click()
    })
  })

  it('Тестирование отображения окна предупреждения при поиске без выбранного столбца поиска', () => {
    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')

    //Повторная проверка для кнопки поиска
    cy.visitCabinetPage()

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')

    //Повторная проверка для клавиши Enter
    cy.visitCabinetPage()

    //Кликаем по кнопке поиска
    cy.get('@searchInputField').type('{enter}')
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска с текстом "Поиск не дал результатов" при пустой строке поиска', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии кнопки поиска
    cy.visitCabinetPage()

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии на клавишу Enter
    cy.visitCabinetPage()

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Кликаем по кнопке поиска
    cy.get('@searchInputField').type('{enter}')
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска с текстом "Поиск не дал результатов" при ложном запросе поиска', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('test')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии на кнопку поиска
    cy.visitCabinetPage()

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('test')

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии на клавишу Enter
    cy.visitCabinetPage()

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('test')

    //Кликаем по кнопке поиска
    cy.get('@searchInputField').type('{enter}')
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(2)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('Сайт')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .should('have.text', 'Найдено 1 результат')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '1 из 1')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе поиска в столбце "Дата принятия"', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('2025')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Инициализация количества результатов поиска
    cy.get('@willTable').find('.highlight').as('highlights')
    cy.get('@highlights').its('length').as('highlightsCount')
    cy.get('@highlightsCount').should('be.gt', 1)

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .its('text')
      .as('searchResultCntText')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .invoke('text')
      .then(searchResultText => {
        cy.get('@highlightsCount').then(highlightsCount => {
          const expectedText = `Найдено ${highlightsCount} результатов`

          // Приводим строки к стандартной форме
          const normalizedSearchText = searchResultText.trim().normalize('NFC')
          const normalizedExpectedText = expectedText.normalize('NFC')

          expect(normalizedExpectedText).to.eq(normalizedSearchText)
        })
      })

    //Проверка работы кнопок навигации по результатам поиска и изменения значения текущего результата
    cy.get('@searchChevronsCnt').should('be.visible')

    cy.get('@searchChevronsCnt').find('.bx-chevron-up').as('prevBtn')
    cy.get('@searchChevronsCnt').find('.bx-chevron-down').as('nextBtn')

    //Перебор от первого результата к последнему
    cy.get('@highlights').each((highlight, i) => {
      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = i + 1
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })

      cy.get('@nextBtn').click()
    })

    //Перебор в обратном порядке
    cy.get('@highlights').each((highlight, i, $list) => {
      cy.get('@prevBtn').click()

      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = $list.length - i
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })
    })
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе поиска в столбце "Краткое описание"', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(2)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Инициализация количества результатов поиска
    cy.get('@willTable').find('.highlight').as('highlights')
    cy.get('@highlights').its('length').as('highlightsCount')
    cy.get('@highlightsCount').should('be.gt', 1)

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .its('text')
      .as('searchResultCntText')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .invoke('text')
      .then(searchResultText => {
        cy.get('@highlightsCount').then(highlightsCount => {
          const expectedText = `Найдено ${highlightsCount} результатов`

          // Приводим строки к стандартной форме
          const normalizedSearchText = searchResultText.trim().normalize('NFC')
          const normalizedExpectedText = expectedText.normalize('NFC')

          expect(normalizedExpectedText).to.eq(normalizedSearchText)
        })
      })

    //Проверка работы кнопок навигации по результатам поиска и изменения значения текущего результата
    cy.get('@searchChevronsCnt').should('be.visible')

    cy.get('@searchChevronsCnt').find('.bx-chevron-up').as('prevBtn')
    cy.get('@searchChevronsCnt').find('.bx-chevron-down').as('nextBtn')

    //Перебор от первого результата к последнему
    cy.get('@highlights').each((highlight, i) => {
      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = i + 1
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })

      cy.get('@nextBtn').click()
    })

    //Перебор в обратном порядке
    cy.get('@highlights').each((highlight, i, $list) => {
      cy.get('@prevBtn').click()

      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = $list.length - i
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })
    })
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе поиска в столбце "Описание"', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(3)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Инициализация количества результатов поиска
    cy.get('@willTable').find('.highlight').as('highlights')
    cy.get('@highlights').its('length').as('highlightsCount')
    cy.get('@highlightsCount').should('be.gt', 1)

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .its('text')
      .as('searchResultCntText')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .invoke('text')
      .then(searchResultText => {
        cy.get('@highlightsCount').then(highlightsCount => {
          const expectedText = `Найдено ${highlightsCount} результатов`

          // Приводим строки к стандартной форме
          const normalizedSearchText = searchResultText.trim().normalize('NFC')
          const normalizedExpectedText = expectedText.normalize('NFC')

          expect(normalizedExpectedText).to.eq(normalizedSearchText)
        })
      })

    //Проверка работы кнопок навигации по результатам поиска и изменения значения текущего результата
    cy.get('@searchChevronsCnt').should('be.visible')

    cy.get('@searchChevronsCnt').find('.bx-chevron-up').as('prevBtn')
    cy.get('@searchChevronsCnt').find('.bx-chevron-down').as('nextBtn')

    //Перебор от первого результата к последнему
    cy.get('@highlights').each((highlight, i) => {
      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = i + 1
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })

      cy.get('@nextBtn').click()
    })

    //Перебор в обратном порядке
    cy.get('@highlights').each((highlight, i, $list) => {
      cy.get('@prevBtn').click()

      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = $list.length - i
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })
    })
  })

  it('Тестирование работы кнопки очистки поиска (при нажатии на кнопку и клавишу Escape)', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(3)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Очищаем поле поиска при помощи кнопки очистки
    cy.get('@clearInputField').click()

    cy.get('@searchResultCnt').should('be.not.visible')

    cy.get('@searchInputField').should('have.value', '')

    //Повторная проверка очистки поля с помощью клавиши Escape
    cy.visitCabinetPage()

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(3)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Очищаем поле поиска при помощи кнопки очистки
    cy.get('@searchInputField').type('{esc}')

    cy.get('@searchResultCnt').should('be.not.visible')

    cy.get('@searchInputField').should('have.value', '')
  })

  it('Тестирование работы кастомного select в подвале таблицы', () => {
    //Проверка отображения текста в кастомном select
    cy.get('@selectedOption').should('have.text', 'Выберите')

    //Проверка отображения списка в кастомном select
    cy.get('@selectedOption').scrollIntoView()
    cy.get('@selectedOption').realHover({
      position: 'center',
      force: true
    })

    cy.wait(1000)

    cy.get('@options').should('be.visible')
    cy.get('@options').find('li').should('have.length', 3)

    //Проверка работы кастомного select
    cy.get('@options')
      .find('li')
      .each(($option, $index) => {
        cy.log($option.text())
        cy.get('@selectedOption').scrollIntoView()
        cy.get('@selectedOption').realHover({
          position: 'center',
          force: true
        })

        cy.wait(1000)

        cy.wrap($option).scrollIntoView()
        cy.wrap($option).realHover({
          position: 'center',
          force: true
        })

        cy.wait(1000)

        cy.wrap($option).click({ force: true })
        cy.get('@selectedOption').should('have.text', $option.text())
        cy.wrap($option)
          .invoke('text')
          .then(text => {
            cy.wrap($option).should('have.attr', 'data-value', text)
          })
      })
  })
})

/*
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
*/

describe('Тесты плитки контента страницы Кабинета юзера', () => {
  beforeEach(() => {
    cy.visitCabinetPage()
    cy.tabContentFormat('title')
    cy.initTitleAliases()
  })
  it('Тестирование кнопки "Добавить запись" в плитку', () => {
    //Считываем количество строк до добавления записи
    cy.get('@titleItems').its('length').as('rowCount')
    cy.log('@rowCount')
    cy.get('@rowCount').then(rowCount => {
      cy.wrap(rowCount + 1).as('rowCount')
    })

    //Находим и жмём на кнопку добавить запись
    cy.get('@btnAddItem').then($btn => {
      cy.wrap($btn).click()
    })

    cy.wait(2000)

    //Проверка видимости модального окна добавления записи
    cy.get('@editModalContainer').should('be.visible')

    //Переменные для заполнения
    const date = '2025-03-25'
    const briefDescription = 'Вывезти людей из осаждённого города'
    const description = 'Необходимо сделать ближайшие 2 дня'

    //Заполняем элементы формы данными
    cy.get('@editFormInputFields').each(($el, $index, $list) => {
      cy.wrap($list.eq(0)).type(date)
      cy.wrap($list.eq(1)).type(briefDescription)
      cy.wrap($list.eq(2)).type(description)
      return false
    })

    // Блокируем перезагрузку страницы после добавления записи
    cy.get('@editModalSaveBtn').then($btn => {
      $btn.on('click', e => e.preventDefault())
    })
    //Жмём на кнопку сохранить
    cy.get('@editModalSaveBtn').click()

    //Проверка количества строк после добавления записи
    cy.get('@titleItems').its('length').as('executedRowCount')
    cy.get('@executedRowCount').then(executedRowCount => {
      cy.get('@rowCount').should('eq', executedRowCount)
    })

    cy.get('@titleItems').each(($el, $index, $list) => {
      if ($index === $list.length - 1) {
        cy.wrap($el).should('have.attr', 'obj-id', $list.length)

        cy.wrap($el).find('.title-data').eq(0).should('have.text', '25.03.2025')
        cy.wrap($el)
          .find('.title-data')
          .eq(1)
          .should('have.text', briefDescription)
        cy.wrap($el).find('.title-data').eq(2).should('have.text', description)
      }
    })
  })

  it('Тестирование чекбоксов мультивыбора плитки', () => {
    cy.get('@glLbCheckbox').click({ force: true })
    cy.wait(2000)

    //Проверка перехода главного чекбокса в заголовке плитки в активное состояние при клике
    cy.get('@glCheckbox').should('be.not.checked')
    cy.get('@glChecmark').should('have.class', 'active')
    cy.get('@titleChecmarks').each($el => {
      cy.wrap($el).should('have.css', 'opacity', '1')
    })

    //Проверка отображения галочки в дефолтном чекбоксе заголовка плитки после повторного клика
    cy.get('@glChecmark').click({ force: true })
    cy.wait(2000)

    cy.get('@glCheckbox').should('be.checked')
    cy.get('@glChecmark')
      .should('have.class', 'active')
      .then($el => {
        const after = window.getComputedStyle($el[0], '::after')
        expect(after).to.have.property('content', '""') // Проверяем, что content существует
        expect(after).to.have.property('display', 'block') // Проверяем видимость элемента
      })
    //Проверка отображения галочки в дефолтных чекбоксах плитки после повторного клика на главный чекбокс
    cy.get('@titleChecmarks').each($el => {
      const after = window.getComputedStyle($el[0], '::after')
      expect(after).to.have.property('content', '""') // Проверяем, что content существует
      expect(after).to.have.property('display', 'block') // Проверяем элемента
    })

    //Проверка состояния чекбоксов после повторного клика на главный чекбокс
    cy.get('@glCheckbox').should('be.checked')
    cy.get('@titleCheckboxes').each($el => {
      cy.wrap($el).should('be.checked')
    })

    cy.get('@glChecmark').click({ force: true })
    cy.wait(2000)

    //Проверка состояния чекбоксов после клика на главный чекбокс
    cy.get('@glCheckbox').should('be.not.checked')
    cy.get('@titleCheckboxes').each($el => {
      cy.wrap($el).should('be.not.checked')
    })

    //Проверка изменения состояния главного чекбокса при переводе всех чекбоксов плитки в активное состояние
    cy.get('@titleCheckboxes').each($el => {
      cy.wrap($el).click({ force: true })
    })

    cy.get('@glCheckbox').should('be.checked')

    //Проверка состояния главного чекбокса при снятия активного состояния у одного из чекбоксов плитки
    cy.get('@titleCheckboxes').eq(0).click({ force: true })

    cy.get('@glCheckbox').should('be.not.checked')
  })

  it('Тестирование стилей выбраной ячейки таблицы', () => {
    cy.get('@glCheckbox').click({ force: true })
    cy.get('@glCheckbox').click({ force: true })
    cy.wait(2000)

    //Проверка ячеек таблицы на наличие класса selected
    cy.get('@titleItems').each($row => {
      cy.wrap($row).should('have.class', 'selected')
    })

    //Последовательно убираем активность у всех чекбоксов таблицы и проверяем на отстутствие класса selected
    cy.get('@titleCheckboxes').each(($checkbox, $index) => {
      cy.wrap($checkbox).click({ force: true })

      cy.get('@titleItems').eq($index).should('have.not.class', 'selected')

      cy.wrap($checkbox).click({ force: true })
    })

    //Проверка ячеек таблицы на наличие класса selected
    cy.get('@titleItems').each($row => {
      cy.wrap($row).should('have.class', 'selected')
    })
  })

  it('Тестирование отображения кнопки "Удалить записи" и работы кнопки при всех отмеченных чекбоксах в плитке', () => {
    //Активируем главный чекбокс и отмечаем все чекбоксы в плитке
    cy.get('@glLbCheckbox').click({ force: true })
    cy.get('@glLbCheckbox').click({ force: true })

    cy.wait(2000)
    //Проверка видимости кнопки "Удалить записи"
    cy.get('@btnDltAll').should('be.visible')

    //Проверка работы кнопки
    cy.get('@btnDltAll').click()

    //Проверка наличия записей в плитке
    cy.get('#will-title')
      .find('.sb-cnt-title-container-item')
      .should('have.length', 0)
  })

  it('Тестирование отображения кнопки "Удалить записи" и работы кнопки при двух отмеченных чекбоксах в плитке', () => {
    //Считываем количество строк до удаления записей
    cy.get('@titleItems').its('length').as('rowCount')
    cy.log('@rowCount')
    cy.get('@rowCount').then(rowCount => {
      cy.wrap(rowCount - 2).as('rowCount')
    })

    //Активируем главный чекбокс и отмечаем все чекбоксы в плитке
    cy.get('@glLbCheckbox').click({ force: true })

    //Отмечаем один чекбокс в плитке
    cy.get('#will-title')
      .find('.sb-cnt-title-container-item')
      .eq(0)
      .find('.cnt-lb-checkbox')
      .click({ force: true })

    cy.wait(2000)

    //Проверка видимости кнопки "Удалить записи"
    cy.get('@btnDltAll').should('be.not.visible')

    cy.wait(2000)

    //Отмечаем ещё один чекбокс в плитке
    cy.get('#will-title')
      .find('.sb-cnt-title-container-item')
      .eq(1)
      .find('.cnt-lb-checkbox')
      .click({ force: true })

    cy.wait(2000)

    //Проверка работы кнопки
    cy.get('@btnDltAll').click()

    cy.wait(2000)

    //Считываем количество строк после удаления записи
    cy.get('#will-title')
      .find('.sb-cnt-title-container-item')
      .its('length')
      .as('executedRowCount')

    //Проверка наличия записей в плитке
    cy.get('@rowCount').then(rowCount => {
      cy.get('@executedRowCount').should('eq', rowCount)
    })
  })

  it('Тестирование скрытия отображения кнопки "Удалить записи" при отсутствии отмеченных чекбоксов', () => {
    cy.get('@glLbCheckbox').click({ force: true })
    cy.get('@glLbCheckbox').click({ force: true })

    cy.get('@btnDltAll').should('be.visible')

    //Снимаем отметку со всех чекбоксов в плитке
    cy.get('@glLbCheckbox').click({ force: true })

    //Проверка скрытия видимости кнопки
    cy.get('@btnDltAll').should('be.not.visible')
  })

  it('Тестирование работы иконки "Добавить в избранное"', () => {
    //Проверка видимости иконки "Добавить в избранное"
    cy.get('@favIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-star')
      cy.wrap($el).should('have.attr', 'title', 'Добавить в избранное')
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Удалить из избранного"
    cy.get('@favIcons').each($el => {
      cy.wrap($el).should('have.class', 'bxs-star')
      cy.wrap($el).should('have.attr', 'title', 'Удалить из избранного')
      cy.wrap($el).should('have.class', 'active')
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Добавить в избранное"
    cy.get('@favIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-star')
      cy.wrap($el).should('have.attr', 'title', 'Добавить в избранное')
      cy.wrap($el).click()
    })
  })

  it('Тестирование работы иконки "Редактировать" в плитке (сравнение значений плитки с значениями в модальном окне)', () => {
    //Сравниваем значения в плитке с значениями в модальном окне
    cy.get('@titleItems').each(($el, $index, $list) => {
      let expectedId = $list.eq($index).attr('obj-id')

      cy.wrap($el).find('.cnt-edit-icon').as('titleEditIcon')
      cy.wrap($el)
        .find('.title-data')
        .then($cells => {
          const date = $cells.eq(0).text().trim()
          const [day, month, year] = date.split('.')
          const expectedDate = `${year}-${month}-${day}`
          const expectedBriefDescription = $cells.eq(1).text().trim()
          const expectedDescription = $cells.eq(2).text().trim()

          // Сохраняем значения в alias
          cy.wrap(expectedId).as('expectedId')
          cy.wrap(expectedDate).as('expectedDate')
          cy.wrap(expectedBriefDescription).as('expectedBriefDescription')
          cy.wrap(expectedDescription).as('expectedDescription')

          // Кликаем на иконку редактирования
          cy.get('@titleEditIcon').click({ force: true })

          cy.get('.edit-modal-container').should('be.visible')

          cy.get('.edit-modal-container')
            .find('.edit-form')
            .should('have.attr', 'obj-id', expectedId)

          // Ожидаем появления модального окна и проверяем значения в формах
          cy.get('.edit-modal-input-field').each(($input, $index) => {
            switch ($index) {
              case 0:
                cy.wrap($input).should('have.value', expectedDate)
                break
              case 1:
                cy.wrap($input).should('have.value', expectedBriefDescription)
                break
              case 2:
                cy.wrap($input).should('have.value', expectedDescription)
                break
            }
          })

          //Закрываем модельное окно и проверяем его видимость
          cy.get('.edit-form').find('.edit-modal-close-icon').click()
          cy.get('.edit-modal-container').should('be.not.visible')
        })
    })
  })

  it('Тестирование работы иконки "Редактировать" в плитке (сравнение отредактированных значений плитки)', () => {
    const date = '2025-03-25'
    const expectedDate = '25.03.2025'
    const expectedBriefDescription = 'Краткое описание'
    const expectedDescription = 'Описание'

    //Кликаем на иконку редактирования
    cy.get('@titleItems')
      .eq(0)
      .then($cells => {
        // Сохраняем значения в alias
        cy.wrap(date).as('date')
        cy.wrap(expectedDate).as('expectedDate')
        cy.wrap(expectedBriefDescription).as('expectedBriefDescription')
        cy.wrap(expectedDescription).as('expectedDescription')

        cy.wrap($cells).find('.cnt-edit-icon').click({ force: true })

        cy.get('@editFormInputFields').eq(0).clear().type(date)
        cy.get('@editFormInputFields')
          .eq(1)
          .clear()
          .type(expectedBriefDescription)
        cy.get('@editFormInputFields').eq(2).clear().type(expectedDescription)

        // Блокируем перезагрузку страницы перед сохранением изменений
        cy.get('@editModalSaveBtn').then($btn => {
          $btn.on('click', e => e.preventDefault())
        })

        cy.get('@editModalSaveBtn').click()
      })

    cy.get('@titleItems')
      .eq(0)
      .then($cells => {
        cy.wrap($cells)
          .find('.title-data')
          .eq(0)
          .should('have.text', expectedDate)
        cy.wrap($cells)
          .find('.title-data')
          .eq(1)
          .should('have.text', expectedBriefDescription)
        cy.wrap($cells)
          .find('.title-data')
          .eq(2)
          .should('have.text', expectedDescription)
      })
  })

  it('Тестирование работы иконки "Удалить" в плитке', () => {
    cy.get('@titleItems').each(($row, $index, $list) => {
      if ($index == $list.length - 1) return false

      //Считываем количество строк до удаления записи
      cy.get('#will-title')
        .find('.sb-cnt-title-container-item')
        .its('length')
        .as('rowCount')
      cy.log('@rowCount')
      cy.get('@rowCount').then(rowCount => {
        cy.wrap(rowCount - 1).as('rowCount')
      })

      //Кликаем на иконку удаления
      cy.wrap($row).find('.cnt-dlt-icon').click({ force: true })

      //Проверка количества строк после удаления записи
      cy.get('#will-title')
        .find('.sb-cnt-title-container-item')
        .its('length')
        .as('executedRowCount')
      cy.get('@executedRowCount').then(executedRowCount => {
        cy.get('@rowCount').should('eq', executedRowCount)
      })
    })
  })

  it('Тестирование работы иконки "Сделать запись доступной куратору" в таблице', () => {
    //Проверка видимости иконки "Сделать запись не доступной куратору"
    cy.get('@curatorAccessIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-show')
      cy.wrap($el).should(
        'have.attr',
        'title',
        'Сделать запись не доступной куратору'
      )
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Сделать запись доступной куратору"
    cy.get('@curatorAccessIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-hide')
      cy.wrap($el).should(
        'have.attr',
        'title',
        'Сделать запись доступной куратору'
      )
      cy.wrap($el).click()
    })

    //Проверка видимости иконки "Сделать запись не доступной куратору"
    cy.get('@curatorAccessIcons').each($el => {
      cy.wrap($el).should('have.class', 'bx-show')
      cy.wrap($el).should(
        'have.attr',
        'title',
        'Сделать запись не доступной куратору'
      )
      cy.wrap($el).click()
    })
  })

  it('Тестирование отображения окна предупреждения при поиске без выбранного столбца поиска', () => {
    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')

    //Повторная проверка для кнопки поиска
    cy.visit('/cabinet.html')

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')

    //Повторная проверка для клавиши Enter
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Кликаем по кнопке поиска
    cy.get('@searchInputField').type('{enter}')
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска с текстом "Поиск не дал результатов" при пустой строке поиска', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии кнопки поиска
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии на клавишу Enter
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Кликаем по кнопке поиска
    cy.get('@searchInputField').type('{enter}')
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска с текстом "Поиск не дал результатов" при ложном запросе поиска', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('test')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии на кнопку поиска
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('test')

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')

    //Повторная проверка при нажатии на клавишу Enter
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('test')

    //Кликаем по кнопке поиска
    cy.get('@searchInputField').type('{enter}')
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .contains('Поиск не дал результатов')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.not.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(2)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('Сайт')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .should('have.text', 'Найдено 1 результат')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-number')
      .should('have.text', '1 из 1')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-cevrons')
      .should('be.visible')
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе поиска в столбце "Дата принятия"', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(1)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('2025')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Инициализация количества результатов поиска
    cy.get('#will-title').find('.highlight').as('highlights')
    cy.get('@highlights').its('length').as('highlightsCount')
    cy.get('@highlightsCount').should('be.gt', 1)

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .its('text')
      .as('searchResultCntText')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .invoke('text')
      .then(searchResultText => {
        cy.get('@highlightsCount').then(highlightsCount => {
          const expectedText = `Найдено ${highlightsCount} результатов`

          // Приводим строки к стандартной форме
          const normalizedSearchText = searchResultText.trim().normalize('NFC')
          const normalizedExpectedText = expectedText.normalize('NFC')

          expect(normalizedExpectedText).to.eq(normalizedSearchText)
        })
      })

    //Проверка работы кнопок навигации по результатам поиска и изменения значения текущего результата
    cy.get('@searchChevronsCnt').should('be.visible')

    cy.get('@searchChevronsCnt').find('.bx-chevron-up').as('prevBtn')
    cy.get('@searchChevronsCnt').find('.bx-chevron-down').as('nextBtn')

    //Перебор от первого результата к последнему
    cy.get('@highlights').each((highlight, i) => {
      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = i + 1
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })

      cy.get('@nextBtn').click()
    })

    //Перебор в обратном порядке
    cy.get('@highlights').each((highlight, i, $list) => {
      cy.get('@prevBtn').click()

      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = $list.length - i
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })
    })
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе поиска в столбце "Краткое описание"', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(2)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Инициализация количества результатов поиска
    cy.get('#will-title').find('.highlight').as('highlights')
    cy.get('@highlights').its('length').as('highlightsCount')
    cy.get('@highlightsCount').should('be.gt', 1)

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .its('text')
      .as('searchResultCntText')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .invoke('text')
      .then(searchResultText => {
        cy.get('@highlightsCount').then(highlightsCount => {
          const expectedText = `Найдено ${highlightsCount} результатов`

          // Приводим строки к стандартной форме
          const normalizedSearchText = searchResultText.trim().normalize('NFC')
          const normalizedExpectedText = expectedText.normalize('NFC')

          expect(normalizedExpectedText).to.eq(normalizedSearchText)
        })
      })

    //Проверка работы кнопок навигации по результатам поиска и изменения значения текущего результата
    cy.get('@searchChevronsCnt').should('be.visible')

    cy.get('@searchChevronsCnt').find('.bx-chevron-up').as('prevBtn')
    cy.get('@searchChevronsCnt').find('.bx-chevron-down').as('nextBtn')

    //Перебор от первого результата к последнему
    cy.get('@highlights').each((highlight, i) => {
      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = i + 1
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })

      cy.get('@nextBtn').click()
    })

    //Перебор в обратном порядке
    cy.get('@highlights').each((highlight, i, $list) => {
      cy.get('@prevBtn').click()

      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = $list.length - i
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })
    })
  })

  it('Тестирование отображения контейнера с результатами поиска при правильном запросе поиска в столбце "Описание"', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(3)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Инициализация количества результатов поиска
    cy.get('#will-title').find('.highlight').as('highlights')
    cy.get('@highlights').its('length').as('highlightsCount')
    cy.get('@highlightsCount').should('be.gt', 1)

    //Проверка наличия текста в контейнере с результатами поиска
    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .its('text')
      .as('searchResultCntText')

    cy.get('@searchResultCnt')
      .find('.cnt-search-result-count')
      .invoke('text')
      .then(searchResultText => {
        cy.get('@highlightsCount').then(highlightsCount => {
          const expectedText = `Найдено ${highlightsCount} результатов`

          // Приводим строки к стандартной форме
          const normalizedSearchText = searchResultText.trim().normalize('NFC')
          const normalizedExpectedText = expectedText.normalize('NFC')

          expect(normalizedExpectedText).to.eq(normalizedSearchText)
        })
      })

    //Проверка работы кнопок навигации по результатам поиска и изменения значения текущего результата
    cy.get('@searchChevronsCnt').should('be.visible')

    cy.get('@searchChevronsCnt').find('.bx-chevron-up').as('prevBtn')
    cy.get('@searchChevronsCnt').find('.bx-chevron-down').as('nextBtn')

    //Перебор от первого результата к последнему
    cy.get('@highlights').each((highlight, i) => {
      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = i + 1
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })

      cy.get('@nextBtn').click()
    })

    //Перебор в обратном порядке
    cy.get('@highlights').each((highlight, i, $list) => {
      cy.get('@prevBtn').click()

      cy.get('@searchResultCnt')
        .find('.cnt-search-result-number')
        .invoke('text')
        .then(searchResultText => {
          cy.get('@highlightsCount').then(highlightsCount => {
            const currentResult = $list.length - i
            const expectedText = `${currentResult} из ${highlightsCount}`

            // Приводим строки к стандартной форме
            const normalizedSearchText = searchResultText
              .trim()
              .normalize('NFC')
            const normalizedExpectedText = expectedText.normalize('NFC')

            expect(normalizedExpectedText).to.eq(normalizedSearchText)
          })
        })
    })
  })

  it('Тестирование работы кнопки очистки поиска (при нажатии на кнопку и клавишу Escape)', () => {
    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(3)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Очищаем поле поиска при помощи кнопки очистки
    cy.get('@clearInputField').click()

    cy.get('@searchResultCnt').should('be.not.visible')

    cy.get('@searchInputField').should('have.value', '')

    //Повторная проверка очистки поля с помощью клавиши Escape
    cy.visit('/cabinet.html')

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.visitCabinetPage()
    cy.tabContentFormat('title')

    //Выбираем столбец для поиска
    cy.get('@searchSelCol').select(3)

    //Вводим запрос в поле поиска
    cy.get('@searchInputField').type('а')

    //Кликаем по иконке поиска
    cy.get('@searchIcon').click()
    cy.wait(1000)

    //Проверяем видимость контейнера с результатами поиска
    cy.get('@searchResultCnt').should('be.visible')

    //Очищаем поле поиска при помощи кнопки очистки
    cy.get('@searchInputField').type('{esc}')

    cy.get('@searchResultCnt').should('be.not.visible')

    cy.get('@searchInputField').should('have.value', '')
  })

  it('Тестирование работы кастомного select в подвале плитки', () => {
    //Проверка отображения текста в кастомном select
    cy.get('@selectedOption').should('have.text', 'Выберите')

    //Проверка отображения списка в кастомном select
    cy.get('@selectedOption').scrollIntoView()
    cy.get('@selectedOption').realHover({
      position: 'center',
      force: true
    })

    cy.wait(1000)

    cy.get('@options').should('be.visible')
    cy.get('@options').find('li').should('have.length', 3)

    //Проверка работы кастомного select
    cy.get('@options')
      .find('li')
      .each(($option, $index) => {
        cy.log($option.text())
        cy.get('@selectedOption').scrollIntoView()
        cy.get('@selectedOption').realHover({
          position: 'center',
          force: true
        })

        cy.wait(1000)

        cy.wrap($option).scrollIntoView()
        cy.wrap($option).realHover({
          position: 'center',
          force: true
        })

        cy.wait(1000)

        cy.wrap($option).click({ force: true })
        cy.get('@selectedOption').should('have.text', $option.text())
        cy.wrap($option)
          .invoke('text')
          .then(text => {
            cy.wrap($option).should('have.attr', 'data-value', text)
          })
      })
  })
})

/*
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------
*/

describe('Тесты окна фильтрации', () => {
  beforeEach(() => {
    cy.visitCabinetPage()
    cy.tabContentFormat('title')
    cy.initFilterAliases()
  })

  it('Тесты отображения окна фильтрации', () => {
    //Открываем окно фильтрации
    cy.get('@filterLink').click()

    //Проверка отображения окна фильтрации
    cy.get('@filterFormContainer').should('be.visible')
    cy.get('@filterFormContainer').should('have.class', 'active')

    //Закрываем окно нажатием на ссылку "Фильтр"
    cy.get('@filterLink').click()

    //Проверка скрытия окна фильтрации
    cy.get('@filterFormContainer').should('be.not.visible')
    cy.get('@filterFormContainer').should('have.not.class', 'active')

    //Повторно открываем для теста закрытия окна по нажатию на иконку "закрыть окно"
    cy.get('@filterLink').click()
    cy.get('@filterFormCloseIcon').click()

    //Проверка скрытия окна фильтрации
    cy.get('@filterFormContainer').should('be.not.visible')
    cy.get('@filterFormContainer').should('have.not.class', 'active')
  })

  it('Тесты работы окна фильтрации', () => {
    //Открываем окно фильтрации
    cy.get('@filterLink').click()

    //Нажимаем на кнопку применить фильтр
    cy.get('@executeFilterButton').click()

    //Проверка отображения окна предупреждения
    cy.get('@selectColumnWarnWindow').should('have.class', 'active')
    cy.get('@selectColumnWarnWindow').should('be.visible')

    //Проверка скрытия окна предупреждения
    cy.get('@selectColumn').select(1)
    cy.get('@selectColumnWarnWindow').should('have.not.class', 'active')
    cy.get('@selectColumnWarnWindow').should('be.not.visible')
  })

  it('Тесты изменения элемента select при выборе колонки для фильтрации "Дата" и "Короткое описание"', () => {
    //Открываем окно фильтрации
    cy.get('@filterLink').click()
    //Выбираем колонку для фильтрации с форматом данных "Дата"
    cy.get('@selectColumn').select(1)
    //Проверка отображения окна ввода даты
    cy.get('@mainInputField').should('have.class', 'active')
    cy.get('@mainInputField').should('have.attr', 'type', 'date')
    cy.get('@mainInputField').should('be.visible')
    //Проверка наличия соответсвующего select
    cy.get('@selectDateOperator').should('have.class', 'active')
    cy.get('@selectDateOperator').should('be.visible')
    cy.get('@selectTextOperator').should('have.not.class', 'active')
    cy.get('@selectTextOperator').should('be.not.visible')
    //Изменяем колонку фильтрации
    cy.get('@selectColumn').select(2)
    //Проверка изменения type input
    cy.get('@mainInputField').should('have.class', 'active')
    cy.get('@mainInputField').should('have.attr', 'type', 'text')
    cy.get('@mainInputField').should('be.visible')
    //Проверка изменения select
    cy.get('@selectTextOperator').should('have.class', 'active')
    cy.get('@selectTextOperator').should('be.visible')
    cy.get('@selectDateOperator').should('have.not.class', 'active')
    cy.get('@selectDateOperator').should('be.not.visible')
  })

  it('Тесты отображения/скрытия дополнительного окна ввода даты при выборе оператора фильтрации "Между"', () => {
    //Открываем окно фильтрации
    cy.get('@filterLink').click()
    //Выбираем колонку для фильтрации с форматом данных "Дата"
    cy.get('@selectColumn').select(1)
    //Выбираем оператор фильтрации "Между"
    cy.get('@selectDateOperator').select(3)
    //Проверка наличия дополнительного окна ввода даты
    cy.get('@addInputField').should('have.class', 'active')
    cy.get('@addInputField').should('be.visible')
    cy.get('@addInputField').should('have.attr', 'type', 'date')
  })

  it('Тесты отображения/скрытия контейнера выбранного фильтра при правильном запросе фильтрации', () => {
    const dateFrom = '2025-04-09'
    const dateTo = '2026-04-09'

    //Открываем окно фильтрации
    cy.get('@filterLink').click()

    //Выбираем колонку для фильтрации с форматом данных "Дата"
    cy.get('@selectColumn').select(1).find(':selected').as('selectedColumnText')

    //Выбираем оператор фильтрации "Между"
    cy.get('@selectDateOperator').select(3)

    //Вводим данные
    cy.get('@mainInputField').type(dateFrom)
    cy.get('@addInputField').type(dateTo)

    // Блокируем перезагрузку страницы после добавления записи
    cy.get('@executeFilterButton').then($btn => {
      $btn.on('click', e => e.preventDefault())
    })

    //Нажимаем на кнопку применить фильтр
    cy.get('@executeFilterButton').click()

    //Проверка скрытия дефолтной записи
    cy.get('@filterZeroCountText').should('have.not.class', 'active')
    cy.get('@filterZeroCountText').should('be.not.visible')

    //Проверка наличия контейнера выбранного фильтра
    cy.get('@filterLink').find('span').as('selectedFilterCount')
    cy.get('@selectedFilterCount').its('length').should('eq', 1)
    cy.get('@selectedFilterCount')
      .invoke('text')
      .then($actualText => {
        const expectedText = '(1)'

        expect($actualText.trim().normalize('NFC')).to.equal(
          expectedText.trim().normalize('NFC')
        )
      })
    cy.get('@selectedFilteresContainer').should('have.class', 'active')
    cy.get('@selectedFilteresContainer').should('be.visible')
    cy.get('@selectedFilteresContainer')
      .find('.cnt-fltr-form-selected-filter')
      .its('length')
      .should('eq', 1)

    cy.get('@selectedColumnText').then($text => {
      //Проверка текста выбранного фильтра
      let [yearFrom, monthFrom, dayFrom] = dateFrom.split('-')
      const expectedDateFrom = `${dayFrom}.${monthFrom}.${yearFrom}`
      let [yearTo, monthTo, dayTo] = dateTo.split('-')
      const expectedDateTo = `${dayTo}.${monthTo}.${yearTo}`
      const expectedText = `${$text
        .text()
        .trim()
        .normalize('NFC')}: от ${expectedDateFrom
        .trim()
        .normalize('NFC')} до ${expectedDateTo.trim().normalize('NFC')}`
      cy.get('@selectedFilteresContainer')
        .find('.cnt-fltr-form-selected-filter')
        .as('selectedFilter')
      cy.get('@selectedFilter').should('be.visible')
      cy.get('@selectedFilter').as('actualText')

      cy.get('@actualText').then($actualText => {
        const actualText = $actualText.text().trim().normalize('NFC')
        expect(expectedText).eq(actualText)
      })
    })
  })

  it('Тесты отображения/скрытия контейнера выбранного фильтра при неправильном запросе фильтрации', () => {
    //Открываем окно фильтрации
    cy.get('@filterLink').click()

    //Выбираем колонку для фильтрации "Дата принятия"
    cy.get('@selectColumn')
      .select(1)
      .find(':selected')
      .invoke('text')
      .as('selectedColumnText')

    //Проверка теста выбранного фильтра при всех операторах
    cy.get('@selectDateOperator')
      .find('option')
      .each(($el, $index, $list) => {
        //Убираем из проверки оператор "Между"
        if ($index < $list.length - 1) {
          cy.get('@selectedColumnText').then($text => {
            const selectedColumnText = $text.trim().normalize('NFC')
            const selectedOperatorText = $el
              .attr('value')
              .trim()
              .normalize('NFC')
            const queryText = '2025-04-10'
            const queryForExpectedText = '10.04.2025'
            const expectedText = `${selectedColumnText} ${selectedOperatorText} ${queryForExpectedText}`
            cy.get('@mainInputField').type(queryText)

            // Блокируем перезагрузку страницы после добавления записи
            cy.get('@executeFilterButton').then($btn => {
              $btn.on('click', e => e.preventDefault())
            })
            cy.get('@executeFilterButton').click()

            cy.get('@selectedFilteresContainer')
              .find('.cnt-fltr-form-selected-filter')
              .eq($index)
              .then($selectedFilter => {
                const actualText = $selectedFilter
                  .text()
                  .trim()
                  .normalize('NFC')
                expect(expectedText).to.eq(actualText)

                cy.get('@filterLink').find('span').as('selectedFilterCount')
                cy.get('@selectedFilterCount')
                  .invoke('text')
                  .then($actualText => {
                    const expectedText = $index + 1

                    expect($actualText.trim().normalize('NFC')).to.contains(
                      expectedText
                    )
                  })
              })
          })

          cy.get('@selectDateOperator').select($index + 1)
        }
      })

    //Удаляем выбраные фильтры
    cy.get('@selectedFilteresContainer')
      .find('.cnt-fltr-form-selected-filter')
      .each($el => {
        cy.wrap($el).find('.fltr-form-selected-filter-close-icon').click()
      })

    cy.get('@selectedFilteresContainer').children().should('have.length', 0)

    //Выбираем колонку для фильтрации с форматом данных "Краткое описание"
    cy.get('@selectColumn')
      .select(2)
      .find(':selected')
      .invoke('text')
      .as('nextSelectedColumnText')
    //Проверка теста выбранного фильтра при всех операторах
    cy.get('@selectTextOperator')
      .find('option')
      .each(($el, $index, $list) => {
        cy.get('@nextSelectedColumnText').then($text => {
          cy.log($text)
          const selectedColumnText = $text.trim().normalize('NFC')
          const selectedOperatorText = $el.attr('value').trim().normalize('NFC')
          const queryText = 'Посещение'
          const expectedText = `${selectedColumnText} ${selectedOperatorText} ${queryText}`
          cy.get('@mainInputField').clear()
          cy.get('@mainInputField').type(queryText)

          // Блокируем перезагрузку страницы после добавления записи
          cy.get('@executeFilterButton').then($btn => {
            $btn.on('click', e => e.preventDefault())
          })
          cy.get('@executeFilterButton').click()

          cy.get('@selectedFilteresContainer')
            .find('.cnt-fltr-form-selected-filter')
            .eq($index)
            .then($selectedFilter => {
              const actualText = $selectedFilter.text().trim().normalize('NFC')
              expect(expectedText).to.eq(actualText)

              cy.get('@filterLink').find('span').as('selectedFilterCount')
              cy.get('@selectedFilterCount')
                .invoke('text')
                .then($actualText => {
                  const expectedText = $index + 1

                  expect($actualText.trim().normalize('NFC')).to.contains(
                    expectedText
                  )
                })
            })
        })

        if ($index < $list.length - 1) {
          cy.get('@selectTextOperator').select($index + 1)
        }
      })
  })
})
