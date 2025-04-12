// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('visitCabinetPage', () => {
  cy.visit('/cabinet.html')

  cy.wait(1000)

  //Наводим мышь на меню "Господь" и кликаем по подменю "Воля"
  cy.get('#God').scrollIntoView()
  cy.get('#God').realHover({
    position: 'center',
    force: true
  })
  cy.wait(1000)
  cy.get('#link-will').click()
  cy.wait(1000)
})

Cypress.Commands.add('initCntContainerAliases', () => {
  cy.get('#link-will-sb-cnt').as('contentContainer')
})

Cypress.Commands.add('tabContentFormat', tabContent => {
  cy.initCntContainerAliases()
  if (tabContent === 'table') {
    cy.get('@contentContainer').find('.cnt-tab').eq(0).click()
  } else if (tabContent === 'title') {
    cy.get('@contentContainer').find('.cnt-tab').eq(1).click()
  }
})

Cypress.Commands.add('initTableAliases', () => {
  cy.initCntContainerAliases()
  //Таблица
  cy.get('@contentContainer')
    .find('.sb-cnt-tbl-container')
    .as('willTableContainer')
  cy.get('@willTableContainer').find('table').as('willTable')
  //Чекбоксы с дефолтными чекбоксами
  cy.get('@willTableContainer').find('.cnt-gl-lb-checkbox').as('glLbCheckbox')
  cy.get('@willTableContainer').find('.cnt-gl-checkbox').as('glCheckbox')
  cy.get('@willTableContainer').find('.cnt-gl-checkmark').as('glChecmark')
  cy.get('@willTableContainer').find('.cnt-checkmark').as('tblChecmarks')
  cy.get('@willTableContainer').find('.cnt-checkbox').as('tblCheckboxes')
  cy.get('@willTableContainer').find('.cnt-btn-add').as('btnAddCell')
  cy.get('@willTableContainer').find('.cnt-btn-dlt-all').as('btnDltAll')
  //Элементы сортировки
  cy.get('@willTableContainer').find('.cnt-caption').as('caption')
  cy.get('@caption').find('.cnt-btn-search').as('searchBtn')
  cy.get('@caption').find('.cnt-search-sl-col').as('searchSelCol')
  cy.get('@caption').find('.cnt-search-field').as('searchContainer')
  cy.get('@searchContainer').find('.bx-search').as('searchIcon')
  cy.get('@searchContainer').find('.cnt-search-input').as('searchInputField')
  cy.get('@searchContainer').find('.bx-x').as('clearInputField')
  cy.get('@searchContainer').find('.cnt-search-result').as('searchResultCnt')
  cy.get('@searchContainer')
    .find('.cnt-search-result-cevrons')
    .as('searchChevronsCnt')
  cy.get('@willTableContainer').find('.cnt-search-wrn').as('searchWrnCnt')
  //Контент таблицы
  cy.get('@willTableContainer').find('.tbl-body-row').as('tblRows')
  cy.get('@willTable').find('.favicon').as('favIcons')
  cy.get('@willTable').find('.curator-access-icon').as('curatorAccessIcons')
  //Футер Таблицы
  cy.get('@willTableContainer').find('.tbl-footer-container').as('tblFooter')
  cy.get('@tblFooter').find('.custom-select').as('customSelect')
  cy.get('@tblFooter').find('.selected').as('selectedOption')
  cy.get('@tblFooter').find('.options').as('options')
  //Модальное окно редактирования контента таблицы
  cy.get('.edit-modal-container').as('editModalContainer')
  cy.get('@editModalContainer').find('.edit-form').as('editForm')
  cy.get('@editForm').find('.input-field').as('editFormInputField')
  cy.get('@editForm').find('.edit-modal-save-btn').as('editModalSaveBtn')
})

Cypress.Commands.add('initTitleAliases', () => {
  cy.initCntContainerAliases()
  cy.tabContentFormat('title')
  cy.get('@contentContainer').find('.sb-cnt-title-container').as('willTitle')

  //Чекбоксы с дефолтными чекбоксами
  cy.get('@willTitle').find('.cnt-gl-lb-checkbox').as('glLbCheckbox')
  cy.get('@willTitle').find('.cnt-gl-checkbox').as('glCheckbox')
  cy.get('@willTitle').find('.cnt-gl-checkmark').as('glChecmark')
  cy.get('@willTitle').find('.cnt-checkmark').as('titleChecmarks')
  cy.get('@willTitle').find('.cnt-checkbox').as('titleCheckboxes')
  //Элементы шапки плитки
  cy.get('@willTitle').find('.cnt-caption').as('caption')
  cy.get('@caption').find('.cnt-btn-search').as('searchBtn')
  cy.get('@caption').find('.cnt-search-sl-col').as('searchSelCol')
  cy.get('@caption').find('.cnt-btn-add').as('btnAddItem')
  cy.get('@caption').find('.cnt-btn-dlt-all').as('btnDltAll')
  cy.get('@caption').find('.cnt-search-field').as('searchContainer')
  cy.get('@searchContainer').find('.cnt-search-input').as('searchInputField')
  cy.get('@searchContainer').find('.bx-x').as('clearInputField')
  cy.get('@searchContainer').find('.bx-search').as('searchIcon')
  cy.get('@searchContainer').find('.cnt-search-result').as('searchResultCnt')
  cy.get('@searchContainer')
    .find('.cnt-search-result-cevrons')
    .as('searchChevronsCnt')
  cy.get('@searchContainer').find('.cnt-search-wrn').as('searchWrnCnt')

  //Контент
  cy.get('@willTitle').find('.sb-cnt-title-container-item').as('titleItems')
  cy.get('@willTitle').find('.favicon').as('favIcons')
  cy.get('@willTitle').find('.curator-access-icon').as('curatorAccessIcons')
  //Футер плитки
  cy.get('@contentContainer').find('.title-footer-container').as('titleFooter')
  cy.get('@titleFooter').find('.custom-select').as('customSelect')
  cy.get('@titleFooter').find('.selected').as('selectedOption')
  cy.get('@titleFooter').find('.options').as('options')
  //Модальное окно редактирования контента плитки
  cy.get('.edit-modal-container').as('editModalContainer')
  cy.get('@editModalContainer').find('.edit-form').as('editForm')
  cy.get('@editForm').find('.edit-modal-input-field').as('editFormInputFields')
  cy.get('@editForm').find('.edit-modal-save-btn').as('editModalSaveBtn')
})

Cypress.Commands.add('initFilterAliases', () => {
  //Инициализация переменных для тестов окна фильтр
  cy.initCntContainerAliases()
  //Основные контейнеры
  cy.get('@contentContainer').find('.sb-cnt-title-container').as('title')
  cy.get('@title').find('.cnt-fltr-container').as('filterContainer')
  cy.get('.cnt-fltr-form-container').as('filterFormContainer')
  //Ссылка на фильтр
  cy.get('@title').find('.cnt-fltr-link').as('filterLink')
  //Элементы окна фильтр
  cy.get('@filterFormContainer').find('.cnt-fltr-form').as('filterForm')
  cy.get('@filterFormContainer')
    .find('.cnt-fltr-form-close-icon')
    .as('filterFormCloseIcon')
  //Элементы списка выбранных фильтров
  cy.get('@filterForm')
    .find('.cnt-fltr-form-zero-count')
    .as('filterZeroCountText')
  cy.get('@filterForm')
    .find('.cnt-fltr-form-selected-filteres')
    .as('selectedFilteresContainer')
  //Элементы Select
  cy.get('@filterForm').find('.cnt-fltr-sl-col').as('selectColumn')
  cy.get('@filterForm').find('.fltr-sel-col-wrn').as('selectColumnWarnWindow')
  cy.get('@filterForm')
    .find('.fltr-form-query-text-op')
    .as('selectTextOperator')
  cy.get('@filterForm')
    .find('.fltr-form-query-date-op')
    .as('selectDateOperator')
  cy.get('@filterForm').find('.fltr-sel-col-wrn').as('selectColumnWarnWindow')
  //Элементы Input
  cy.get('@filterForm').find('.fltr-form-query-field').as('mainInputField')
  cy.get('@filterForm')
    .find('.fltr-form-query-additional-field')
    .as('addInputField')
  //Кнопка применить фильтр
  cy.get('@filterForm').find('.cnt-fltr-btn-execute').as('executeFilterButton')
})
