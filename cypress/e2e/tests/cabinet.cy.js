const { DateTime } = require('luxon')

describe('Тесты сайдбара страницы "Кабинет искателя" ', () => {
  it('Тестирование отображение контента при нажатии на меню сайдбара', () => {
    cy.visit('/cabinet.html')

    cy.wait(3000)

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

    cy.wait(3000)

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

  it('Тестирование кнопки "Добавить запись" в таблицу', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(2000)
    cy.get('#link-will').click()

    //Находим и жмём на кнопку добавить запись
    cy.get('#will-tbl')
      .find('.tbl-btn-add')
      .then($btn => {
        cy.wrap($btn).click()
      })

    //Считываем количество строк до добавления записи
    cy.get('#will-tbl').find('tbody tr').its('length').as('rowCount')
    cy.log('@rowCount')
    cy.get('@rowCount').then(rowCount => {
      cy.wrap(rowCount + 1).as('rowCount')
    })

    cy.wait(2000)

    //Проверка видимости модального окна добавления записи
    cy.get('.edit-modal-container').should('be.visible')

    //Переменные для заполнения
    const date = '2025-03-25'
    const briefDescription = 'Вывезти людей из осаждённого города'
    const description = 'Необходимо сделать ближайшие 2 дня'

    //Заполняем элементы формы данными
    cy.get('.edit-modal-container')
      .find('.input-field')
      .each(($el, $index, $list) => {
        cy.wrap($list.eq(0)).type(date)
        cy.wrap($list.eq(1)).type(briefDescription)
        cy.wrap($list.eq(2)).type(description)
        return false
      })

    // Блокируем перезагрузку страницы после добавления записи
    cy.get('.edit-modal-save-btn').then($btn => {
      $btn.on('click', e => e.preventDefault())
    })
    //Жмём на кнопку сохранить
    cy.get('.edit-modal-container').find('.edit-modal-save-btn').click()

    //Проверка количества строк после добавления записи
    cy.get('#will-tbl').find('tbody tr').its('length').as('executedRowCount')
    cy.get('@executedRowCount').then(executedRowCount => {
      cy.get('@rowCount').should('eq', executedRowCount)
    })

    cy.get('#will-tbl')
      .find('tbody tr')
      .each(($el, $index, $list) => {
        if ($index === $list.length - 1) {
          cy.wrap($el).should('have.attr', 'obj-id', $list.length)

          cy.wrap($el).find('td').eq(0).should('have.text', '25.03.2025')
          cy.wrap($el).find('td').eq(1).should('have.text', briefDescription)
          cy.wrap($el).find('td').eq(2).should('have.text', description)
        }
      })
  })

  it('Тестирование чекбоксов мультивыбора таблицы', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(2000)
    cy.get('#link-will').click()

    cy.get('#will-tbl').find('.tbl-gl-lb-checkbox').as('glLbCheckbox')
    cy.get('#will-tbl').find('.tbl-gl-checkbox').as('glCheckbox')
    cy.get('#will-tbl').find('.tbl-gl-checkmark').as('glChecmark')
    cy.get('#will-tbl').find('.tbl-checkmark').as('tblChecmarks')

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
        expect(after).to.have.property('display', 'block') // Проверяем границы
      })
    //Проверка отображения галочки в дефолтных чекбоксах таблицы после повторного клика на главный чекбокс
    cy.get('@tblChecmarks').each($el => {
      const after = window.getComputedStyle($el[0], '::after')
      expect(after).to.have.property('content', '""') // Проверяем, что content существует
      expect(after).to.have.property('display', 'block') // Проверяем границы
    })
  })

  it('Тестирование отображения кнопки "Удалить записи" и работы кнопки при всех отмеченных чекбоксах в таблице', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(2000)
    cy.get('#link-will').click()

    cy.get('#will-tbl').find('.tbl-gl-lb-checkbox').as('glLbCheckbox')
    cy.get('#will-tbl').find('.tbl-btn-dlt-all').as('btnDltAll')

    //Активируем главный чекбокс и отмечаем все чекбоксы в таблице
    cy.get('@glLbCheckbox').click({ force: true })
    cy.get('@glLbCheckbox').click({ force: true })

    cy.wait(2000)
    //Проверка видимости кнопки "Удалить записи"
    cy.get('@btnDltAll').should('be.visible')

    //Проверка работы кнопки
    cy.get('@btnDltAll').click()

    //Проверка наличия записей в таблице
    cy.get('#will-tbl').find('.tbl-row').should('have.length', 0)
  })

  it('Тестирование отображения кнопки "Удалить записи" и работы кнопки при двух отмеченных чекбоксах в таблице', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(2000)
    cy.get('#link-will').click()

    cy.get('#will-tbl').find('.tbl-gl-lb-checkbox').as('glLbCheckbox')
    cy.get('#will-tbl').find('.tbl-btn-dlt-all').as('btnDltAll')

    //Считываем количество строк до удаления записей
    cy.get('#will-tbl').find('tbody tr').its('length').as('rowCount')
    cy.log('@rowCount')
    cy.get('@rowCount').then(rowCount => {
      cy.wrap(rowCount - 2).as('rowCount')
    })

    //Активируем главный чекбокс и отмечаем все чекбоксы в таблице
    cy.get('@glLbCheckbox').click({ force: true })

    //Отмечаем один чекбокс в таблице
    cy.get('#will-tbl')
      .find('.tbl-body-row')
      .eq(0)
      .find('.tbl-lb-checkbox')
      .click({ force: true })

    cy.wait(2000)

    //Проверка видимости кнопки "Удалить записи"
    cy.get('@btnDltAll').should('be.not.visible')

    cy.wait(2000)

    //Отмечаем ещё один чекбокс в таблице
    cy.get('#will-tbl')
      .find('.tbl-body-row')
      .eq(1)
      .find('.tbl-lb-checkbox')
      .click({ force: true })

    cy.wait(2000)

    //Проверка работы кнопки
    cy.get('@btnDltAll').click()

    cy.wait(2000)

    //Считываем количество строк после удаления записи
    cy.get('#will-tbl').find('tbody tr').its('length').as('executedRowCount')

    //Проверка наличия записей в таблице
    cy.get('@rowCount').then(rowCount => {
      cy.get('@executedRowCount').should('eq', rowCount)
    })
  })

  it('Тестирование скрытия отображения кнопки "Удалить записи" при отсутствии отмеченных чекбоксов', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(2000)
    cy.get('#link-will').click()

    cy.get('#will-tbl').find('.tbl-gl-lb-checkbox').as('glLbCheckbox')
    cy.get('#will-tbl').find('.tbl-checkmark').as('tblChecmarks')
    cy.get('#will-tbl').find('.tbl-btn-dlt-all').as('btnDltAll')

    cy.get('@glLbCheckbox').click({ force: true })
    cy.get('@glLbCheckbox').click({ force: true })

    cy.get('@btnDltAll').should('be.visible')

    //Снимаем отметку со всех чекбоксов в таблице
    cy.get('@glLbCheckbox').click({ force: true })

    //Проверка скрытия видимости кнопки
    cy.get('@btnDltAll').should('be.not.visible')
  })

  it('Тестирование работы иконки "Редактировать" в таблице (сравнение значений таблицы с значениями в модальном окне)', () => {
    cy.visit('/cabinet.html')

    cy.wait(2000)

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(1000)
    cy.get('#link-will').click()

    //Сравниваем значения в таблице с значениями в модальном окне
    cy.get('#will-tbl')
      .find('.tbl-body-row')
      .each(($el, $index, $list) => {
        let expectedId = $list.eq($index).attr('obj-id')
        cy.log(expectedId)

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

            cy.get('.edit-modal-container')
              .find('.edit-from')
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
            cy.get('.edit-from').find('.edit-modal-close-icon').click()
            cy.get('.edit-modal-container').should('be.not.visible')
          })
      })
  })

  it('Тестирование работы иконки "Редактировать" в таблице (сравнение отредактированных значений таблицы)', () => {
    cy.visit('/cabinet.html')

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(1000)
    cy.get('#link-will').click()

    cy.get('.edit-modal-container').find('.edit-from').as('editFrom')
    const date = '2025-03-25'
    const expectedDate = '25.03.2025'
    const expectedBriefDescription = 'Краткое описание'
    const expectedDescription = 'Описание'

    //Кликаем на иконку редактирования
    cy.get('#will-tbl')
      .find('.tbl-body-row')
      .eq(0)
      .then($cells => {
        // Сохраняем значения в alias
        cy.wrap(date).as('date')
        cy.wrap(expectedDate).as('expectedDate')
        cy.wrap(expectedBriefDescription).as('expectedBriefDescription')
        cy.wrap(expectedDescription).as('expectedDescription')

        cy.wrap($cells).find('.tbl-edit-icon').click({ force: true })

        cy.get('@editFrom')
          .find('.edit-modal-input-field')
          .eq(0)
          .clear()
          .type(date)
        cy.get('@editFrom')
          .find('.edit-modal-input-field')
          .eq(1)
          .clear()
          .type(expectedBriefDescription)
        cy.get('@editFrom')
          .find('.edit-modal-input-field')
          .eq(2)
          .clear()
          .type(expectedDescription)

        // Блокируем перезагрузку страницы перед сохранением изменений
        cy.get('.edit-modal-save-btn').then($btn => {
          $btn.on('click', e => e.preventDefault())
        })

        cy.get('@editFrom').find('.edit-modal-save-btn').click()
      })

    cy.get('#will-tbl')
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
    cy.visit('/cabinet.html')

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(1000)
    cy.get('#link-will').click()

    cy.get('#will-tbl')
      .find('.tbl-body-row')
      .each(($row, $index, $list) => {
        if ($index == $list.length - 1) return false

        //Считываем количество строк до удаления записи
        cy.get('#will-tbl').find('tbody tr').its('length').as('rowCount')
        cy.log('@rowCount')
        cy.get('@rowCount').then(rowCount => {
          cy.wrap(rowCount - 1).as('rowCount')
        })

        //Кликаем на иконку удаления
        cy.wrap($row).find('.tbl-dlt-icon').click({ force: true })

        //Проверка количества строк после удаления записи
        cy.get('#will-tbl')
          .find('tbody tr')
          .its('length')
          .as('executedRowCount')
        cy.get('@executedRowCount').then(executedRowCount => {
          cy.get('@rowCount').should('eq', executedRowCount)
        })
      })
  })

  it('Тестирование отображения окна предупреждения при поиске без выбранного столбца поиска', () => {
    cy.visit('/cabinet.html')

    //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(1000)
    cy.get('#link-will').click()

    //Инициализация элементов поиска в alias
    cy.get('#will-tbl').find('.bx-search').as('searchIcon')
    cy.get('#will-tbl').find('.tbl-btn-search').as('searchBtn')
    cy.get('#will-tbl').find('.tbl-search-input').as('searchInputField')
    cy.get('#will-tbl').find('.tbl-search-sl-col').as('searchSelCol')
    cy.get('#will-tbl').find('.tbl-search-wrn').as('searchWrnCnt')

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
    cy.get('#God').scrollIntoView()
    cy.get('#God').realHover({
      position: 'center',
      force: true
    })
    cy.wait(1000)
    cy.get('#link-will').click()

    //Кликаем по кнопке поиска
    cy.get('@searchBtn').click()
    cy.wait(1000)

    //Проверяем видимость окна предупреждения
    cy.get('@searchWrnCnt').should('be.visible')

    //Выбираем столбец поиска
    cy.get('@searchSelCol').select(1)

    //Проверка скрытия окна предупреждения
    cy.get('@searchWrnCnt').should('be.not.visible')
  })
  /*
      TODO
      1. Проверка отображения контейнера с результатами поиска с текстов "Поиск не дал результатов" при пустой строке поиска 
      2. Проверка отображения контейнера с результатами поиска с текстов "Поиск не дал результатов" при ложном запросе поиска
      3. Проверка отображения контейнера с результатами поиска при правильном запросе поиска
        3.1 Проверка соответсвия количества результатов поиска с количеством выделенных строк в таблице в элемент span класса highlight (для всех столбцов)
        3.2 Проверка работы кнопок перемещения между результатами поиска
        3.3 Проверка работы кнопки очистки поиска
  */
})
