import { loadTextFileAsElement } from './initFragments.js'

//Функция для вёрстки контента сайдбара
document.addEventListener('DOMContentLoaded', function () {
  //showOrHideSidebarContent('link-will')

  changeModalEditInformationHeight()

  changeFilterWindowHeight()
})

//Переменная-ключ для добавления контента активного меню сайдбара
const sidebarMenuActiveContentIdKey = 'sidebar-content-id'
//Показ/скрытие контента соответсвующего меню или подменю сайдбара
function showOrHideSidebarContent(itemId) {
  //ID соответствующего контейнера контента меню сайдбара
  const itemContent = document.getElementById(`${itemId}-sb-cnt`)
  //Скрываем текущий активный контент
  if (itemContent) {
    //ID текущего активного контента меню сайдбара
    const activeItemContentId = localStorage.getItem(
      sidebarMenuActiveContentIdKey
    )

    //Проверка на совпадение активного контента с выбранным
    //Если выбрано другое меню, отключаем текущий активный контент и отображаем выбранный
    if (activeItemContentId !== null) {
      if (!activeItemContentId.includes(itemContent.id)) {
        const activeItemContent = document.getElementById(activeItemContentId)

        if (activeItemContent) {
          activeItemContent.classList.remove('active')
        }
      }
    }

    //Включаем отображение контента
    itemContent.classList.add('active')
    document.querySelector('.cabinet-content').classList.add('show')
    //Записываем в localStorage текущий активный блок с контентом
    localStorage.setItem(sidebarMenuActiveContentIdKey, itemContent.id)
  }
}

//Переменная со всеми елементами главного меню сайдбара
const sidebarMenuItems = document.querySelectorAll('.sidebar-menu-item')
const sidebarActiveMenuIdKey = 'sidebar-menu-id'
const expandSidebarActiveMenuIdKey = 'sidebar-expand-menu-id'
const sidebarActiveSubmenuIdKey = 'sidebar-submenu-id'

//Прослушка главного меню сайдбара на клик
if (sidebarMenuItems.length > 0) {
  sidebarMenuItems.forEach(item => {
    //Елемент Li выбранного главного меню сайдбара
    const liItem = item.closest('li')
    const liItems = liItem.children

    //Показываем/скрываем контент при нажатии на меню или подменю
    item.addEventListener('click', event => {
      event.preventDefault()
      const activeMenuId = localStorage.getItem(sidebarActiveMenuIdKey)
      const activeSubMenu = document.getElementById(
        localStorage.getItem(sidebarActiveSubmenuIdKey)
      )

      //Снимаем класс active с активного подменю
      if (activeSubMenu) {
        activeSubMenu.classList.remove('active')
      }

      //Если выбрано уже активное меню просто добавляем класс active, если выбрано другое меню снимаем класс active с активного и активируем текущее
      if (activeMenuId !== null) {
        if (!activeMenuId.includes(item.id)) {
          localStorage.setItem(sidebarActiveMenuIdKey, item.id)

          //Снимаем класс active с активного меню
          document
            .getElementById(activeMenuId)
            .closest('li')
            .classList.remove('active')

          //Добавляем класс active к выбранному меню
          item.closest('li').classList.add('active')

          //Если сайдбар свёрнут, делаем ту же операцию для названия меню в выпадающем списке
          const activeSidebarMenuTitle =
            findActiveSidebarMenuTitleById(activeMenuId)

          if (activeSidebarMenuTitle)
            activeSidebarMenuTitle.classList.remove('active')

          const selectedSidebarMenu = findActiveSidebarMenuTitleById(item.id)

          if (selectedSidebarMenu) selectedSidebarMenu.classList.add('active')
        }
      }
      localStorage.setItem(sidebarActiveMenuIdKey, item.id)
      item.closest('li').classList.add('active')

      const selectedSidebarMenu = findActiveSidebarMenuTitleById(item.id)
      if (selectedSidebarMenu) selectedSidebarMenu.classList.add('active')

      showOrHideSidebarContent(item.id)
    })

    let ulSubMenuItem

    //Инициализация подменю
    for (let i = 0; i < liItems.length; i++) {
      if (liItems[i].tagName === 'UL') {
        // Проверяем, является ли элемент <ul>
        ulSubMenuItem = liItems[i] // Присваиваем значение
        break // Выходим из цикла, так как нашли нужный элемент
      }
    }

    if (ulSubMenuItem) {
      //Показываем название меню и подбемню при фокусе на елементе меню
      item.addEventListener('mouseenter', () => {
        //Сравнение текущего меню с активным
        const activeMenuId = localStorage.getItem(expandSidebarActiveMenuIdKey)

        if (activeMenuId) {
          if (!item.id.includes(activeMenuId)) {
            const activeMenu = document
              .getElementById(activeMenuId)
              .closest('li')
            const activeSubMenu = activeMenu.querySelector('.serv-show')
            if (activeMenu && activeSubMenu) {
              activeSubMenu.classList.remove('show-menu')
            }
          }
        }

        ulSubMenuItem.classList.add('show-menu')
        localStorage.setItem(expandSidebarActiveMenuIdKey, item.id)
        changeVisibilityOfSubMenuItems(ulSubMenuItem)
      })
      //Скрываем название меню и подбемню при отсутсвии фокуса на елементе меню
      item.addEventListener('mouseleave', () => {
        // Проверяем, находится ли курсор мыши на блоке item
        if (!item.matches(':hover') && !ulSubMenuItem.matches(':hover')) {
          ulSubMenuItem.classList.remove('show-menu')
          changeVisibilityOfSubMenuItems(ulSubMenuItem)
        }
      })
      //Скрываем название меню и подбемню при отсутсвии фокуса на елементе подменю
      ulSubMenuItem.addEventListener('mouseleave', () => {
        ulSubMenuItem.classList.remove('show-menu')
        changeVisibilityOfSubMenuItems(ulSubMenuItem)
      })
    }
  })
}

//Функция активации элемента подменю
const subMenuItems = document.querySelectorAll('.sidebar-submenu-item')
if (subMenuItems.length > 0) {
  subMenuItems.forEach(subMenuItem => {
    subMenuItem.addEventListener('click', () => {
      //Переменная названия подменю
      const selectedMenuOfSubMenu = subMenuItem
        .closest('ul')
        .closest('li')
        .querySelector('.sidebar-menu-item')
      const activeMenuId = localStorage.getItem(sidebarActiveMenuIdKey)
      const activeSubMenuId = localStorage.getItem(sidebarActiveSubmenuIdKey)

      //Проверка на совпадение активного меню и выбраного подменю. Если выбранное подменю относится к другому меню, деактивировать предидущее активное меню
      if (activeMenuId) {
        if (!selectedMenuOfSubMenu.id.includes(activeMenuId)) {
          findActiveSidebarMenuByTitleId(activeMenuId).classList.remove(
            'active'
          )
          findActiveSidebarMenuTitleById(activeMenuId).classList.remove(
            'active'
          )
          localStorage.setItem(sidebarActiveMenuIdKey, selectedMenuOfSubMenu.id)
        }
      }

      //Проверка на совпадение активного подменю. Если выбрано другое подменю деактивировать предидущее
      if (activeSubMenuId) {
        if (!subMenuItem.id.includes(activeSubMenuId)) {
          document.getElementById(activeSubMenuId).classList.remove('active')
        }
      }
      if (!subMenuItem.classList.contains('active')) {
        subMenuItem.classList.add('active')

        if (!subMenuItem.classList.contains('title')) {
          findActiveSidebarMenuTitleById(
            selectedMenuOfSubMenu.id
          ).classList.add('active')
        }

        selectedMenuOfSubMenu.closest('li').classList.add('active')

        localStorage.setItem(sidebarActiveMenuIdKey, selectedMenuOfSubMenu.id)
        localStorage.setItem(sidebarActiveSubmenuIdKey, subMenuItem.id)
      }

      showOrHideSidebarContent(subMenuItem.id)
    })
  })
}

//Функция возвращает при свёрнутом сайдбаре елемент <a> с названием меню
function findActiveSidebarMenuTitleById(activeMenuId) {
  let result
  const activeSideBarMenuLinks = document.querySelectorAll('#' + activeMenuId)

  for (let i = 0; i < activeSideBarMenuLinks.length; i++) {
    if (activeSideBarMenuLinks[i].classList.contains('title')) {
      result = activeSideBarMenuLinks[i]
    }
  }
  return result
}

//Функция возвращает при свёрнутом сайдбаре елемент <a> пункта меню
function findActiveSidebarMenuByTitleId(activeMenuId) {
  let result
  const activeSideBarMenuLinks = document.querySelectorAll('#' + activeMenuId)

  for (let i = 0; i < activeSideBarMenuLinks.length; i++) {
    if (activeSideBarMenuLinks[i].classList.contains('sidebar-menu-item')) {
      result = activeSideBarMenuLinks[i].closest('li')
    }
  }
  return result
}

//Функция включения/отключения видимости елементов подменю
function changeVisibilityOfSubMenuItems(item) {
  const links = item.querySelectorAll('.sidebar-submenu-item')
  const styleTransitionDelay = 100
  const styleTransformIfMenuHide = 'translateX(0)'
  const styleTransformIfMenuShow = 'translateX(-50%)'

  for (let i = 0; i < links.length; i++) {
    if (item.classList.contains('show-menu')) {
      if (!links[i].classList.contains('title')) {
        links[i].style.opacity = '1'
        links[i].style.visibility = 'visible'
        links[i].style.transform = styleTransformIfMenuHide
        links[i].style.transitionDelay = i * styleTransitionDelay + 'ms'
      } else {
        links[i].parentElement.style.visibility = 'visible'
        links[i].parentElement.style.opacity = '1'
        links[i].parentElement.style.lineHeight = '4vh'

        links[i].style.opacity = '1'
        links[i].style.visibility = 'visible'
        links[i].style.transform = styleTransformIfMenuHide
        links[i].style.transitionDelay = i * styleTransitionDelay + 'ms'
      }
    } else {
      links[i].style.opacity = '0'
      links[i].style.visibility = 'hidden'
      links[i].style.transform = styleTransformIfMenuShow
    }
  }
}

//-------------------------------------------------------------------------------------------------
//Секция контента сайдбара
const cntContainer = document.querySelector('.cabinet-content')

if (cntContainer) {
  const cntTables = document.getElementsByTagName('table')
  const cntTitles = document.querySelectorAll('.sb-cnt-title-container')

  //Общий слушатель клика для контента страницы "Кабинет Искателя"
  cntContainer.addEventListener('click', e => {
    const target = e.target

    //Переключения формата отображения контента
    if (target.classList.contains('cnt-tab')) {
      const cntItem = target.closest('.sb-cnt')
      const cntTabsContainer = target.closest('.cnt-tabs')
      const cntTab = target

      if (!cntTab.classList.contains('active')) {
        for (const tab of cntTabsContainer.children) {
          if (tab.classList.contains('active')) {
            tab.classList.remove('active')
          }
        }
        cntTab.classList.add('active')
      }
      toggleContentFormat(cntItem, cntTab.getAttribute('tab-id'))
    }

    //Функция изменения иконки "избранное"
    if (target.classList.contains('bx-star')) {
      target.classList.remove('bx-star')
      target.classList.add('bxs-star', 'active')
      target.title = 'Удалить из избранного'
    } else if (target.classList.contains('bxs-star')) {
      target.classList.remove('bxs-star', 'active')
      target.classList.add('bx-star')
      target.title = 'Добавить в избранное'
    }

    //Функция изменения иконки "показать/скрыть" запись куратору
    if (target.classList.contains('bx-show')) {
      target.classList.remove('bx-show')
      target.classList.add('bx-hide')
      target.title = 'Сделать запись доступной куратору'
    } else if (target.classList.contains('bx-hide')) {
      target.classList.add('bx-show')
      target.classList.remove('bx-hide')
      target.title = 'Сделать запись не доступной куратору'
    }

    //Вызов модального окна при нажатии на иконку редактирования записи контента
    if (target.classList.contains('cnt-edit-icon')) {
      if (target.classList.contains('title-edit-icon')) {
        showModalWillEditInformation(
          target.closest('.sb-cnt-title-container-item')
        )
      } else {
        showModalWillEditInformation(target.closest('tr'))
      }
    }

    //Функция удаления записи контента
    if (target.classList.contains('cnt-dlt-icon')) {
      let cntContainer
      let cell = target.closest('tr')

      if (target.classList.contains('tbl-dlt-icon')) {
        cntContainer = target.closest('table')
        cell = target.closest('tr')
      } else {
        cntContainer = target.closest('.sb-cnt-title-container')
        cell = target.closest('.sb-cnt-title-container-item')
      }

      if (cell) {
        cell.remove()
      } else {
        console.log('Cell not found')
      }
    }

    //--------------------------------------------------------------------------------
    //ФИЛЬТР
    //Отображения окна фильтрации контента
    if (target.classList.contains('cnt-fltr-link')) {
      const fltrLink = target
      const captionSelectEl = fltrLink
        .closest('.cnt-caption')
        .querySelector('.cnt-search-sl-col')
      const cntFilterContainer = document.querySelector(
        '.cnt-fltr-form-container'
      )
      const form = cntFilterContainer.querySelector('form')
      const filterSelectEl =
        cntFilterContainer.querySelector('.cnt-search-sl-col')
      console.log(
        `filterSelectEl.options.length = ${filterSelectEl.options.length}`
      )
      console.log(
        `captionSelectEl.options.length = ${captionSelectEl.options.length}`
      )
      if (
        filterSelectEl.options.length <= 1 &&
        filterSelectEl.options.length <= captionSelectEl.options.length
      ) {
        const options = captionSelectEl.options
        for (let i = 1; i < options.length; i++) {
          filterSelectEl.add(new Option(options[i].text, options[i].value))
        }
      }

      //Устанавливаем форме атрибут "cnt-id"
      let cntId

      if (isTable(cntContainer.id)) {
        cntId = fltrLink
          .closest('.sb-cnt-tbl-container')
          .querySelector('table').id

        form.setAttribute('cnt-id', cntId)
      } else {
        cntId = fltrLink.closest('.sb-cnt-title-container').id

        form.setAttribute('cnt-id', cntId)
      }

      setFilterContainerPosition(fltrLink)

      cntFilterContainer.classList.toggle('active')
    }
  })

  if (cntTables) {
    //Подключение сервисов и функций для работы с таблицами контента сайдбара
    for (let i = 0; i < cntTables.length; i++) {
      if (cntTables[i].closest('div').classList.contains('active')) {
        initTableServices(cntTables[i].id)
      }
    }
  }

  if (cntTitles) {
    //Подключение сервисов и функций для работы с плитками контента сайдбара
    for (let i = 0; i < cntTitles.length; i++) {
      initTitleService(cntTitles[i].id)
    }
  }

  const cntFiltrContainer = document.querySelector('.cnt-fltr-form-container')
  //Общий слушатель "клика" для окна фильтрования
  cntFiltrContainer.addEventListener('click', e => {
    const target = e.target
    const form = target.closest('form')
    const pathToSelectedFilterContainer =
      './partials/sidebarContent/filterContainer/selectedFilterContainer.txt'
    let cnt
    let cntFltrLink

    if (form) {
      cnt = document.getElementById(form.getAttribute('cnt-id'))
      cntFltrLink = cnt.querySelector('.cnt-fltr-link')
    }

    if (target.classList.contains('cnt-fltr-btn-execute')) {
      //Инициализация элементов формы
      const selectedFilteres = form.querySelector(
        '.cnt-fltr-form-selected-filteres'
      )
      const fltrFormColumnSelEl = form.querySelector('.cnt-fltr-sl-col')
      const fltrFormQuerySelElForText = form.querySelector(
        '.fltr-form-query-text-op'
      )
      const fltrFormQuerySelElForDate = form.querySelector(
        '.fltr-form-query-date-op'
      )
      const fltrFormQueryInputField = form.querySelector(
        '.fltr-form-query-field'
      )
      const fltrFormQuryInputAddField = form.querySelector(
        '.fltr-form-query-additional-field'
      )
      const fltrFormSelWarnWindow = form.querySelector('.fltr-sel-col-wrn')

      //Инициализация параметров фильтрования
      const selectedColForFiltering =
        fltrFormColumnSelEl.options[fltrFormColumnSelEl.selectedIndex].text

      //Проверка выбрана ли колонка для фильтрации
      if (fltrFormColumnSelEl.selectedIndex != 0) {
        //Проверка содержит ли выбранная колонка формат данных "Дата"
        if (!selectedColForFiltering.includes('Дата')) {
          //Инициализация теста для отображения в контейнере выбранных фильтров
          const fltrQueryText =
            selectedColForFiltering +
            ' ' +
            fltrFormQuerySelElForText.options[
              fltrFormQuerySelElForText.selectedIndex
            ].value +
            ' ' +
            fltrFormQueryInputField.value

          //Загружаем элемент selectedFilterContainer и добавляем его в окно фильтра
          loadTextFileAsElement(pathToSelectedFilterContainer).then(
            selectedFltrElement => {
              if (selectedFltrElement) {
                //Добавляем тест запроса фильтрации
                selectedFltrElement.querySelector('p').textContent =
                  fltrQueryText
                //Делаем видимым контейнер выбранных фильтров
                selectedFilteres.classList.add('active')

                //Убираем с контейнера выбранных фильтров текст "Список пуст"
                toggleVisibilityZeroCountTextElementSelectedFilter(form, false)

                selectedFilteres.appendChild(selectedFltrElement)

                //Изменяем отображения количества выбранных фильтров в тексте ссылки отображения окна фильтра
                changeCountSelectedFilteresInFltrLink(cntFltrLink)
              }
            }
          )
        } else {
          let fltrQueryText

          //Если выбранный оператор "между" датами создаём соответсвующий текст запроса
          if (fltrFormQuerySelElForDate.selectedIndex == 3) {
            fltrQueryText =
              selectedColForFiltering +
              ': от ' +
              convertDateForTbl(fltrFormQueryInputField.value) +
              ' до ' +
              convertDateForTbl(fltrFormQuryInputAddField.value)
          } else {
            //Для всех остальных опрераторов создаём стандартный текст запроса
            fltrQueryText =
              selectedColForFiltering +
              ' ' +
              fltrFormQuerySelElForDate.options[
                fltrFormQuerySelElForDate.selectedIndex
              ].value +
              ' ' +
              convertDateForTbl(fltrFormQueryInputField.value)
          }

          //Загружаем элемент selectedFilterContainer и добавляем его в окно фильтра
          loadTextFileAsElement(pathToSelectedFilterContainer).then(
            selectedFltrElement => {
              if (selectedFltrElement) {
                //Добавляем тест запроса фильтрации
                selectedFltrElement.querySelector('p').textContent =
                  fltrQueryText
                //Делаем видимым контейнер выбранных фильтров
                selectedFilteres.classList.add('active')

                //Убираем с контейнера выбранных фильтров текст "Список пуст"
                toggleVisibilityZeroCountTextElementSelectedFilter(form, false)

                selectedFilteres.appendChild(selectedFltrElement)

                //Изменяем отображения количества выбранных фильтров в тексте ссылки отображения окна фильтра
                changeCountSelectedFilteresInFltrLink(cntFltrLink)
              }
            }
          )
        }
      } else {
        fltrFormSelWarnWindow.classList.add('active')
      }
    }

    if (target.classList.contains('cnt-fltr-form-close-icon')) {
      cntFiltrContainer.classList.remove('active')
    }

    if (target.classList.contains('fltr-form-selected-filter-close-icon')) {
      const selectedFilterContainer = target.closest(
        '.cnt-fltr-form-selected-filter'
      )
      const selectedFilteres = selectedFilterContainer
        .closest('.cnt-fltr-form-selected-filteres')
        .querySelectorAll('.cnt-fltr-form-selected-filter')

      selectedFilterContainer.remove()

      changeCountSelectedFilteresInFltrLink(cntFltrLink)

      console.log(selectedFilteres.length)
      if (selectedFilteres.length <= 1) {
        toggleVisibilityZeroCountTextElementSelectedFilter(form, true)
      }
    }
  })

  //Общий слушатель изменения значения элемента select для контента страницы "Кабинет Искателя"
  cntFiltrContainer.addEventListener('change', e => {
    const target = e.target

    if (target.classList.contains('cnt-fltr-sl-col')) {
      const slElement = target
      const form = slElement.closest('form')
      const inputField = form
        ? form.querySelector('.fltr-form-query-field')
        : null
      const additionInputField = target
        .closest('form')
        .querySelector('.fltr-form-query-additional-field')
      const selElementForText = form.querySelector('.fltr-form-query-text-op')
      const selElementForDate = form.querySelector('.fltr-form-query-date-op')

      if (!inputField) {
        console.warn('inputField не найден!')
        return
      }

      if (slElement.selectedIndex > 0) {
        const fltrFormSelColWarnWindow =
          cntFiltrContainer.querySelector('.fltr-sel-col-wrn')
        const selectedText = slElement.options[slElement.selectedIndex].text

        if (fltrFormSelColWarnWindow.classList.contains('active'))
          fltrFormSelColWarnWindow.classList.remove('active')

        inputField.classList.add('active')
        if (selectedText.includes('Дата')) {
          inputField.type = 'date'
          selElementForDate.classList.add('active')
          selElementForText.classList.remove('active')
          toggleVisibilityFilterAddInputField()
        } else {
          inputField.type = 'text'
          selElementForDate.classList.remove('active')
          selElementForText.classList.add('active')
          additionInputField.classList.remove('active')
          toggleVisibilityFilterAddInputField()
        }
      }
    }

    if (target.classList.contains('fltr-form-query-date-op')) {
      toggleVisibilityFilterAddInputField()
    }
  })

  //Глобальный слушатель иконок закрытия модального окна
  const closeIcon = document.querySelector('.edit-modal-close-icon')

  if (closeIcon) {
    closeIcon.addEventListener('click', () => {
      closeModalWillEditInformation(closeIcon)
    })
  }

  //Функция сохранения отредактированных данных таблицы
  const editModalSaveBtn = document.querySelector('.edit-modal-save-btn')

  if (editModalSaveBtn) {
    editModalSaveBtn.addEventListener('click', () => {
      const form = editModalSaveBtn.closest('form')
      const objectId = form.getAttribute('obj-id')
      const inputFields = form.querySelectorAll('.edit-modal-input-field')
      const cntId = form.getAttribute('cnt-id')
      const cntItemContainer = document.getElementById(cntId)
      const cntTagName = cntItemContainer.tagName
      let cntData

      if (cntTagName == 'TABLE') {
        cntData = cntItemContainer.querySelectorAll('.tbl-body-row')
      } else {
        cntData = cntItemContainer.querySelectorAll(
          '.sb-cnt-title-container-item'
        )
      }

      let row
      let isNewRow = true

      cntData.forEach(cntRow => {
        if (cntRow.getAttribute('obj-id') == objectId) {
          isNewRow = false
          row = cntRow
        }
      })

      if (isNewRow) {
        if (cntTagName == 'TABLE') {
          row = getRowFromTable(cntId)
          row.setAttribute('obj-id', objectId)
          setTableRowValuesFromInputFields(row, inputFields)
          cntItemContainer.querySelector('tbody').appendChild(row)
        } else {
          const contentContainer = cntItemContainer.closest(
            '.sb-cnt-title-container'
          )
          const lastChild = contentContainer.lastElementChild

          row = getDataFromTitle(cntId)
          row.setAttribute('obj-id', objectId)
          setTitleItemValuesFromInputFields(row, inputFields)
          contentContainer.insertBefore(row, lastChild)
        }
      } else {
        if (cntTagName == 'TABLE') {
          setTableRowValuesFromInputFields(row, inputFields)
        } else {
          setTitleItemValuesFromInputFields(row, inputFields)
        }
      }
      editModalSaveBtn.closest('.edit-modal-container').style.display = 'none'
    })
  }
}

function toggleContentFormat(cntItem, tabId) {
  const cntTblContainer = cntItem.querySelector('.sb-cnt-tbl-container')
  const cntTbl = cntTblContainer.querySelector('table')
  const cntTitle = cntItem.querySelector('.sb-cnt-title-container')

  if (tabId == 'title') {
    cntTblContainer.classList.remove('active')
    cntTitle.classList.add('active')
    initTitleService(cntTitle.id)
  } else {
    cntTblContainer.classList.add('active')
    cntTitle.classList.remove('active')
    initTableServices(cntTbl.id)
  }
}

function deleteAllDataFromCntContainer(cntContainerId) {
  let btnDltAll
  //Кнопка удалить все записи
  if (isTable(cntContainerId)) {
    btnDltAll = document
      .getElementById(cntContainerId)
      .closest('div')
      .querySelector('.cnt-btn-dlt-all')
  } else {
    btnDltAll = document
      .getElementById(cntContainerId)
      .querySelector('.cnt-btn-dlt-all')
  }

  if (btnDltAll) {
    btnDltAll.addEventListener('click', () => {
      const cnt = document.getElementById(cntContainerId)
      let cntGlCheckbox
      let cntData

      if (cnt.tagName == 'TABLE') {
        const tblContainer = cnt.closest('div')
        cntGlCheckbox = tblContainer.querySelector('.cnt-gl-checkbox')
        cntData = cnt.querySelectorAll('.tbl-body-row')
      } else {
        cntGlCheckbox = cnt.querySelector('.cnt-gl-checkbox')
        cntData = cnt.querySelectorAll('.sb-cnt-title-container-item')
      }

      //Удаляем только те записи где чекбокс checked
      cntData.forEach(data => {
        if (data.querySelector('.cnt-checkbox').checked) {
          data.remove()
        }
      })

      //Если чекбокс в заголовке checked убрать флажёк
      if (cntGlCheckbox.checked) {
        cntGlCheckbox.checked = false
      }
      showOrHidePagginationContainer(cnt.id)

      if (cnt.tagName == 'TABLE') {
        if (cnt.querySelectorAll('.tbl-body-row').length == 0)
          showOrHideTblDeleteAllBtn(cnt.id, false)
      } else {
        if (cnt.querySelectorAll('.sb-cnt-title-container-item').length == 0)
          showOrHideTitleDeleteAllBtn(cnt.id, false)
      }
    })
  }
}

/*
--------------------------------------------------------------------------------------------------------------------
Секция функций таблиц контента сайдбара
*/
let matches = []
let matchesCells = []
function initTableServices(tblId) {
  const tbl = document.getElementById(tblId)

  const tblContainer = tbl.closest('div')

  tblMultiSlctService(tblId)
  addNewRowToTblService(tblId)
  searchTable(tblId)
  deleteAllDataFromCntContainer(tblId)
  tblPaggination(tblId)

  //Переключение иконки сортировки
  const tblHeaderCell = tbl.getElementsByTagName('th')

  for (let i = 0; i < tblHeaderCell.length; i++) {
    tblHeaderCell[i].addEventListener('click', event => {
      event.preventDefault() // Prevent the default action of the link

      //Поиск элемента <span> класса "fas fa-caret-down"
      const caretSpan = tblHeaderCell[i].querySelector('.fas')

      if (caretSpan) {
        caretSpan.classList.toggle('rotate')
      }
    })
  }
}

function isTable(cntId) {
  if (cntId.includes('tbl')) return true
}

//Функция изменения количества выбранных фильтров в названии ссылки
function changeCountSelectedFilteresInFltrLink(cntFltrLink) {
  const selectedFilteres = document.querySelectorAll(
    '.cnt-fltr-form-selected-filter'
  )
  const cntFiltrLinkContainer = cntFltrLink.closest('div')

  if (selectedFilteres.length > 0) {
    let countSelFltresSpan = cntFltrLink.querySelector('span')

    if (!countSelFltresSpan) {
      countSelFltresSpan = document.createElement('span')
      countSelFltresSpan.textContent =
        '(' +
        document.querySelectorAll('.cnt-fltr-form-selected-filter').length +
        ')'
      cntFiltrLinkContainer.classList.add('selected')
      cntFltrLink.appendChild(countSelFltresSpan)
    } else {
      countSelFltresSpan.textContent =
        '(' +
        document.querySelectorAll('.cnt-fltr-form-selected-filter').length +
        ')'
    }
  } else {
    const countSelFltresSpan = cntFltrLink.querySelector('span')

    if (countSelFltresSpan) {
      cntFiltrLinkContainer.classList.remove('selected')
      countSelFltresSpan.remove()
    }
  }
}
//Функция отображения/скрытия дополнительного инпута для фильтрации между датами
function toggleVisibilityFilterAddInputField() {
  const filterQueryItems = document.querySelectorAll('.fltr-form-query-item')
  const additionInputField = document.querySelector(
    '.fltr-form-query-additional-field'
  )
  const selEl = document.querySelector('.fltr-form-query-date-op')
  const selectedValue = selEl.options[selEl.selectedIndex].value

  //Проверка отображения элемента select для фильтрации дат
  if (selEl.classList.contains('active')) {
    //Проверка выбрано ли меню фильтрации "Между" датами
    if (selectedValue.includes('<>')) {
      additionInputField.classList.add('active')
      additionInputField.disabled = false

      //Изменение ширины основного input и select
      filterQueryItems.forEach(item => {
        item.style.width = '7.5vw'
      })
    } else {
      //Если меню фильтрации "Между" датами не выбрано убираем видимость дополнительного инпута
      additionInputField.classList.remove('active')
      additionInputField.disabled = true

      //Изменение стандартную ширину основного input и select
      filterQueryItems.forEach(item => {
        item.style.width = '11.5vw'
      })
    }
  } else {
    //Если выбран столбец не содержащий формат данных "Дата" убираем видимость дополнительного инпута
    additionInputField.classList.remove('active')
    additionInputField.disabled = true

    filterQueryItems.forEach(item => {
      item.style.width = '11.5vw'
    })
  }
}

//Функция отображения/скрытия текста "Список пуст" в списке выбранных фильтров
function toggleVisibilityZeroCountTextElementSelectedFilter(form, isShow) {
  const fltrFormSelectedFltrZeroCount = form.querySelector(
    '.cnt-fltr-form-zero-count'
  )

  if (fltrFormSelectedFltrZeroCount) {
    if (isShow) {
      fltrFormSelectedFltrZeroCount.classList.add('active')
    } else {
      fltrFormSelectedFltrZeroCount.classList.remove('active')
    }
  }
}

/*
  Функция работы с чекбокса в заголовке таблице
    - При клике на чекбокс в заголовке таблицы включаем видимость чекбоксов в таблице
    - При клике на чекбокс в заголовке таблицы делаем все чекбоксы в таблице checked и наоборот
*/
function tblMultiSlctService(tblId) {
  //Чекбокс в заголовке таблицы
  const tbl = document.getElementById(tblId)
  const tblContainer = tbl.closest('div')
  const tblGlLbCheckbox = tblContainer.querySelector('.tbl-gl-lb-checkbox')

  //Убираем с чекбокса свойство disabled при клике и отображаем чекбоксы в таблице
  if (tblGlLbCheckbox) {
    const glCheckbox = tblGlLbCheckbox.querySelector('.tbl-gl-checkbox')
    const glCheckboxSpan = tblGlLbCheckbox.querySelector('.tbl-gl-checkmark')

    const countCheckedboxes = {}
    countCheckedboxes[tblId] = 0

    /*
      Прослушка клика на lable чекбокса
      - Если чекбокс в заголовке таблицы не активирован, то активируем.
      - Включаем отображение всех чекбоксов в данной таблице
      - Если чекбокс в заголовке отмечен (checked), то делаем все чекбоксы в таблице checked и наоборот
      */
    tblGlLbCheckbox.addEventListener('click', () => {
      const tblLbCheckBoxes = tbl.querySelectorAll('.tbl-lb-checkbox')
      const tblCheckboxes = tbl.querySelectorAll('.tbl-checkbox')
      //Если чекбоксы не активированы, то активируем. И включаем отображение кнопки "Удалить записи"
      if (!glCheckboxSpan.classList.contains('active')) {
        glCheckboxSpan.classList.add('active')

        //Включаем видимость чекбоксов в таблице
        for (let i = 0; i < tblLbCheckBoxes.length; i++) {
          tblLbCheckBoxes[i].classList.add('active')
        }
      } else if (glCheckbox.checked) {
        //Делаем все чекбоксы в таблице checked
        for (let i = 0; i < tblLbCheckBoxes.length; i++) {
          const tblCheckBox = tblLbCheckBoxes[i].querySelector('.tbl-checkbox')
          const tblRow = tblLbCheckBoxes[i].closest('tr')
          tblCheckBox.checked = true
          tblRow.classList.add('selected')
        }

        if (tblCheckboxes.length > 0) {
          showOrHideTblDeleteAllBtn(tbl.id, true)
        }
      } else if (!glCheckbox.checked) {
        //Убираем checked со всех чекбоксов в таблице
        for (let i = 0; i < tblLbCheckBoxes.length; i++) {
          const tblCheckBox = tblLbCheckBoxes[i].querySelector('.tbl-checkbox')
          const tblRow = tblLbCheckBoxes[i].closest('tr')
          tblCheckBox.checked = false
          tblRow.classList.remove('selected')
        }
        countCheckedboxes[tblId] = 0
        showOrHideTblDeleteAllBtn(tbl.id, false)
      }
    })

    /*
    Функция работы с чекбоксами в таблице
      - Отслеживание количества отмеченных чекбоксов, если больше одного, то отображаем кнопку "Удалить записи", 
        если нет, то скрываем
  */
    //Посчёт количества отмеченых чекбоксов
    const tblCheckboxes = tbl.querySelectorAll('.tbl-checkbox')
    tblCheckboxes.forEach(checkbox => {
      const tblRow = checkbox.closest('tr')
      if (checkbox.checked) {
        countCheckedboxes[tblId]++
        tblRow.classList.add('selected')
      }

      //Меняем значение переменной countCheckedboxes при изменении состояния чекбокса
      checkbox.addEventListener('change', () => {
        const tblRow = checkbox.closest('tr')

        if (glCheckbox.checked) {
          countCheckedboxes[tblId] = tblCheckboxes.length
        }
        if (checkbox.checked) {
          countCheckedboxes[tblId]++
          tblRow.classList.add('selected')
        } else {
          if (countCheckedboxes[tblId] > 0) {
            countCheckedboxes[tblId]--
            tblRow.classList.remove('selected')
          }
          glCheckbox.checked = false
        }

        //Если все чекбоксы в таблице отмечены, то делаем чекбокс в заголовке checked
        if (countCheckedboxes[tblId] === tblCheckboxes.length) {
          glCheckbox.checked = true
        }

        //Если больше одного чекбокса отмечен, то отображаем кнопку "Удалить записи", иначе скрываем
        if (countCheckedboxes[tblId] > 1) {
          showOrHideTblDeleteAllBtn(tbl.id, true)
        } else {
          showOrHideTblDeleteAllBtn(tbl.id, false)
        }
      })
    })
  }
}

/*
  Переключаем отображение кнопки "Удалить записи".
  Аргументы:
    tblId - идентификатор таблицы
    isShow - true - отображать, false - скрыть
*/
function showOrHideTblDeleteAllBtn(tblId, isShow) {
  const tbl = document.getElementById(tblId)
  const tblContainer = tbl.closest('div')
  const btn = tblContainer.querySelector('.tbl-btn-dlt-all')

  if (btn) {
    if (isShow) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  }
}

//Получение названия меню сайдбара с id контейнера контента
function getContentNameById(cntId) {
  return cntId.substring(0, cntId.indexOf('-'))
}

//Функция создания новой строки в таблице
function addNewRowToTblService(tblId) {
  const tbl = document.getElementById(tblId)
  const tblContainer = tbl.closest('div')
  //Кнопка добавления новой записи
  const btn = tblContainer.querySelector('.tbl-btn-add')
  const objectId = tbl.querySelectorAll('.tbl-body-row').length + 1

  if (btn) {
    btn.addEventListener('click', () => {
      const modal = getModalWillEditElementByContentId(tblId)

      modal.querySelector('form').setAttribute('obj-id', objectId)
      modal.querySelector('form').setAttribute('cnt-id', tblId)

      const inputFields = modal.querySelectorAll('.edit-modal-input-field')

      inputFields.forEach(field => {
        field.value = ''
      })

      modal.style.display = 'block'
    })
  }
}

//Создание элемента tr переданного id таблицы c новым id
function getRowFromTable(tblId) {
  const tbl = document.getElementById(tblId)
  const tblRows = tbl.querySelectorAll('.tbl-body-row')
  const maxId = {}
  maxId[tblId] = 0

  tblRows.forEach(row => {
    if (row.getAttribute('obj-id') > maxId[tblId]) {
      maxId[tblId] = row.getAttribute('obj-id')
    }
  })
  maxId[tblId]++
  const newRow = tbl.querySelector('.tbl-body-row').cloneNode(true)
  const rowcells = newRow.getElementsByTagName('td')
  newRow.setAttribute('obj-id', maxId[tblId])

  //Убираем текст в элементе tr
  for (let i = 1; i < rowcells.length; i++) {
    if (rowcells[i].classList.contains('tbl-row-data')) {
      rowcells[i].textContent = ''
    }
  }
  return newRow
}

//-----------------------------------------------------------------
//Функция поиска по таблице
function searchTable(tblId) {
  const tbl = document.getElementById(tblId)
  const tblContainer = tbl.closest('div')
  const tblSearchColumnSelectList =
    tblContainer.querySelector('.tbl-search-sl-col')
  const tblSearchColumnsNames = tbl
    .querySelector('thead')
    .querySelectorAll('.tbl-title-link')
  const inputField = tblContainer.querySelector('.tbl-search-input')
  let searchResultContainer = tblContainer.querySelector('.cnt-search-result')
  const searchTblBtn = tblContainer.querySelector('.tbl-btn-search')
  const searchIcon = tblContainer.querySelector('.bx-search')
  const prevBtn = tblContainer.querySelector('.bx-chevron-up')
  const nextBtn = tblContainer.querySelector('.bx-chevron-down')
  const closeBtn = tblContainer.querySelector('.bx-x')
  let query = ''
  let tblMatches = []
  let currentIdex = 0
  let prevIndex = 0

  //Инициализация элемента select для строки поиска
  if (
    tblSearchColumnSelectList.options.length <= tblSearchColumnsNames.length
  ) {
    tblSearchColumnsNames.forEach(clmn => {
      const option = document.createElement('option')
      option.text = clmn.textContent.trim()

      tblSearchColumnSelectList.appendChild(option)
    })
  }

  tblSearchColumnSelectList.addEventListener('change', () => {
    if (tblSearchColumnSelectList.selectedIndex != 0) {
      showOrHideWarningSelectWindow(tblId, false)
    }
  })

  //Поиск при нажатии на кнопку поиска
  searchTblBtn.addEventListener('click', () => {
    const selectedOption = getSelectedOption(tblSearchColumnSelectList)

    //Обнуление переменных при повторном поиске
    addOrRemoveHighlightInTbl(query, tblId, selectedOption, false)
    tblMatches.length = 0
    currentIdex = 0

    query = getQueryFromInputField(tblId)
    tblMatches = addOrRemoveHighlightInTbl(query, tbl.id, selectedOption, true)

    searchQueryInTbl(tbl, tblMatches, searchResultContainer)
  })

  //Поиск при нажатии на иконку поиска
  searchIcon.addEventListener('click', () => {
    const selectedOption = getSelectedOption(tblSearchColumnSelectList)

    //Обнуление переменных при повторном поиске
    addOrRemoveHighlightInTbl(query, tblId, selectedOption, false)
    tblMatches.length = 0
    currentIdex = 0

    query = getQueryFromInputField(tblId)
    tblMatches = addOrRemoveHighlightInTbl(query, tbl.id, selectedOption, true)

    searchQueryInTbl(tbl, tblMatches, searchResultContainer)
  })

  //Поиск по нажатию на кнопку Enter
  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const selectedOption = getSelectedOption(tblSearchColumnSelectList)

      //Обнуление переменных при повторном поиске
      addOrRemoveHighlightInTbl(query, tblId, selectedOption, false)
      tblMatches.length = 0
      currentIdex = 0

      query = getQueryFromInputField(tblId)
      tblMatches = addOrRemoveHighlightInTbl(
        query,
        tbl.id,
        selectedOption,
        true
      )

      searchQueryInTbl(tbl, tblMatches, searchResultContainer)
    }
  })

  //Очистка поля ввода и результатов поиска при нажатии на кнопку Escape
  inputField.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      showOrHideSearchResultContainer(tblId, false)
      inputField.value = ''
      addOrRemoveHighlightInTbl(query, tblId, false)
      tblMatches.length = 0
      currentIdex = 0
    }
  })

  //Переход на предидущий резльутат поиска при нажатии на chevron-up
  prevBtn.addEventListener('click', () => {
    prevIndex = currentIdex
    currentIdex--
    if (currentIdex < 0) {
      currentIdex = tblMatches.length - 1
    }
    searchResultContainer.querySelector(
      '.tbl-search-result-number'
    ).textContent = addSearchResultNumber(currentIdex, tblMatches)
    const prevElement = tblMatches[prevIndex]
    const currentElement = tblMatches[currentIdex]

    if (prevElement || currentElement) {
      prevElement.classList.remove('active')
      currentElement.classList.add('active')
      currentElement.scrollIntoView()
    }
  })

  //Переход на следующий резльутат поиска при нажатии на chevron-down
  nextBtn.addEventListener('click', () => {
    prevIndex = currentIdex
    currentIdex++

    if (currentIdex > tblMatches.length - 1) {
      currentIdex = 0
    }
    searchResultContainer.querySelector(
      '.tbl-search-result-number'
    ).textContent = addSearchResultNumber(currentIdex, tblMatches)
    const prevElement = tblMatches[prevIndex]
    const currentElement = tblMatches[currentIdex]
    prevElement.classList.remove('active')
    currentElement.classList.add('active')
    currentElement.scrollIntoView()
  })

  //Очистка поля ввода и результатов поиска при нажатии на иконку - крестик
  closeBtn.addEventListener('click', () => {
    showOrHideSearchResultContainer(tblId, false)
    inputField.value = ''
    addOrRemoveHighlightInTbl(query, tblId, false)
    tblMatches.length = 0
    currentIdex = 0
  })
}

//Функция поиска текста в таблице
function searchQueryInTbl(tbl, matches, searchResultContainer) {
  const tblContainer = tbl.closest('div')
  const tblSearchColumnSelectList =
    tblContainer.querySelector('.tbl-search-sl-col')
  const tblSearchCevrons = tblContainer.querySelector(
    '.tbl-search-result-cevrons'
  )

  if (matches.length > 0) {
    //Включаем блок с иконками навигации по результатам поиска
    tblSearchCevrons.classList.add('active')
    //Если нашли совпадения в таблице меняем иконки и отображаем окно с количеством результатов поиска
    showOrHideSearchResultContainer(tbl.id, true)

    //Отображаем количество найденных результатов
    if (matches.length > 1) {
      searchResultContainer.querySelector(
        '.tbl-search-result-count'
      ).textContent = 'Найдено ' + matches.length + ' результатов'
    } else {
      searchResultContainer.querySelector(
        '.tbl-search-result-count'
      ).textContent = 'Найдено ' + matches.length + ' результат'
    }

    //Добавляем в строку текущий результат поиска
    searchResultContainer.querySelector(
      '.tbl-search-result-number'
    ).textContent = addSearchResultNumber(0, matches)

    const currentElement = matches[0]
    currentElement.classList.add('active')
    currentElement.scrollIntoView()
  } else if (
    matches.length == 0 &&
    tblSearchColumnSelectList.selectedIndex != 0
  ) {
    tblSearchCevrons.classList.remove('active')
    showOrHideSearchResultContainer(tbl.id, true)
    searchResultContainer.querySelector(
      '.tbl-search-result-count'
    ).textContent = 'Поиск не дал результатов'
    searchResultContainer.querySelector(
      '.tbl-search-result-number'
    ).textContent = ''
  }
}

//Функция поиска слова в таблице. Выделяет все найденные слова и возвращает их массив или убирает выделение
function addOrRemoveHighlightInTbl(query, tblId, selectedOption, isHighlight) {
  const tbl = document.getElementById(tblId)
  const tblBody = tbl.querySelector('tbody')
  //счётчик для количества пройденных ячеек в ряде таблицы
  let count = 1
  if (isHighlight) {
    //Если не выбран столбец для поиска, отображаем окно с уведомлением о необходимости выбора
    if (selectedOption.index != 0) {
      if (query.length > 0) {
        //Выбираем все ячейки из таблицы
        const cells = tblBody.querySelectorAll('.tbl-row-data')
        cells.forEach(cell => {
          if (count == selectedOption.index) {
            const regex = new RegExp(query, 'gi')
            const originalContent = cell.textContent
            let newContent = originalContent
            const tempSpans = []
            let match

            // Собираем все совпадения
            while ((match = regex.exec(originalContent)) !== null) {
              tempSpans.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0]
              })
            }

            // Заменяем совпадения в обратном порядке
            tempSpans.reverse().forEach(({ start, end, text }) => {
              newContent =
                newContent.slice(0, start) +
                `<span class="highlight">${text}</span>` +
                newContent.slice(end)
            })

            // Обновляем содержимое ячейки
            cell.innerHTML = newContent
            matchesCells.push(cell)
          }
          //Обнуляем счётчик при проходке каждого ряда таблицы или увеличиваем его
          if (count == selectedOption.length) {
            count = 1
          } else {
            count++
          }
        })
        // Добавляем все span элементы в массив
        const spans = tblBody.querySelectorAll('.highlight')
        spans.forEach(span => {
          matches.push(span)
        })
      }
    } else {
      showOrHideWarningSelectWindow(tblId, true)
    }
  } else {
    if (matchesCells) {
      //Заменяем все элементы span на текст запроса
      matchesCells.forEach(cell => {
        cell.innerHTML = cell.textContent.replace(
          /<span class="highlight">|<\/span>/g,
          query
        )
      })
      matches.length = 0
    }
  }
  return matches
}

/*
    Функция отображения/скрытия окна с результатов поиска
      - cntId - id таблицы/плитки
      - isShow - true - отображать, false - скрыть
*/

function showOrHideSearchResultContainer(cntId, isShow) {
  let cnt = document.getElementById(cntId)
  let cntContainer
  let searchIcon
  let clearSearchFieldIcon
  let searchResultContainer

  if (isTable(cntId)) {
    cntContainer = cnt.closest('div')
    searchIcon = cntContainer.querySelector('.bx-search')
    clearSearchFieldIcon = cntContainer.querySelector('.bx-x')
    searchResultContainer = cntContainer.querySelector('.cnt-search-result')
  } else {
    cntContainer = cnt
    searchIcon = cntContainer.querySelector('.bx-search')
    clearSearchFieldIcon = cntContainer.querySelector('.bx-x')
    searchResultContainer = cntContainer.querySelector('.cnt-search-result')
  }

  if (isShow) {
    searchIcon.classList.add('hide')
    clearSearchFieldIcon.classList.add('show')
    searchResultContainer.classList.add('active')
  } else {
    searchIcon.classList.remove('hide')
    clearSearchFieldIcon.classList.remove('show')
    searchResultContainer.classList.remove('active')
  }
}

function showOrHideWarningSelectWindow(cntId, isShow) {
  let cnt = document.getElementById(cntId)
  let cntContainer
  let slctWarLable

  if (isTable(cntId)) {
    cntContainer = cnt.closest('div')
    slctWarLable = cntContainer.querySelector('.cnt-search-wrn')
  } else {
    slctWarLable = cnt.querySelector('.cnt-search-wrn')
  }

  if (isShow) {
    slctWarLable.classList.add('active')
  } else {
    slctWarLable.classList.remove('active')
  }
}

//Функция определения положения окна фильтрования относительно контейнера "cnt-fltr-container"
function setFilterContainerPosition(fltrLink) {
  const cntContainer = document.querySelector('.cabinet-content')
  const cntCaption = fltrLink.closest('.cnt-caption')
  const fltrContainer = fltrLink.closest('.cnt-fltr-container')
  const fltrIcon = fltrContainer.querySelector('.bx-filter')

  const filtrFormContainer = document.querySelector('.cnt-fltr-form-container')
  const filtrContainerHeight =
    fltrIcon.getBoundingClientRect().top +
    fltrIcon.getBoundingClientRect().height +
    cntContainer.getBoundingClientRect().top +
    window.scrollY +
    20 -
    cntContainer.getBoundingClientRect().top
  filtrFormContainer.style.top = `${filtrContainerHeight}px`
  filtrFormContainer.style.left = `${
    cntCaption.getBoundingClientRect().left + 20
  }px`
}

function changeFilterWindowHeight() {
  const filterContainer = document.querySelector('.cnt-fltr-form-container')
  const filterForm = filterContainer?.querySelector('.cnt-fltr-form')

  if (
    !filterContainer ||
    !filterForm ||
    filterContainer.style.display === 'none'
  )
    return

  const observer = new ResizeObserver(() => {
    const contentHeight = filterForm.scrollHeight
    const containerHeight = filterContainer.clientHeight

    if (contentHeight > containerHeight) {
      filterContainer.style.height = contentHeight + 80 + 'px'
    }
  })

  observer.observe(filterForm) // наблюдаем за изменением контента внутри
}

//Функция вкл/выкл модального окна редактирования информации записей таблиц контента сайдбара
function showModalWillEditInformation(row) {
  let cntId

  if (row.tagName == 'TR') {
    cntId = row.closest('table').id
  } else {
    cntId = row.closest('.sb-cnt-title-container').id
  }
  const modal = getModalWillEditElementByContentId(cntId)
  const form = modal.querySelector('form')

  form.setAttribute('obj-id', row.getAttribute('obj-id'))
  form.setAttribute('cnt-id', cntId)

  modal.style.display = 'block'

  // Установка значений полей в модальном окне из текущей записи
  const willIncomingDate = convertDateForEditForm(
    row.querySelector('.will-incoming-date').textContent.trim()
  )

  const willDescription = row
    .querySelector('.will-brief-description')
    .textContent.trim()
  const willComment = row.querySelector('.will-comment').textContent.trim()

  document.getElementById('edit-will-incoming-date').value = willIncomingDate
  document.getElementById('edit-will-brief-description').value = willDescription
  document.getElementById('edit-will-comment').value = willComment
}

function closeModalWillEditInformation(icon) {
  const modal = icon.closest('section')

  const modalDialog = modal.querySelector('.edit-modal-dialog')
  const textAreas = modal.querySelectorAll('.edit-text-aria')
  modalDialog.style.height = '0px'

  for (let i = 0; i < textAreas.length; i++) {
    textAreas[i].style.height = '0px'
  }

  modal.style.display = 'none'
}

//Функция получения элемента модального окна создания/редактирования записи таблицы "Воля"
function getModalWillEditElementByContentId(cntId) {
  const modalId = cntId.substring(0, cntId.indexOf('-')) + '-edit-information'
  return document.getElementById(modalId)
}

//Функция конвертации даты с формата дд.мм.гггг в формат гггг-мм-дд
function convertDateForEditForm(date) {
  const [day, month, year] = date.split('.')
  return `${year}-${month}-${day}`
}

//Функция конвертации даты с формата гггг-мм-дд в формат дд.мм.гггг
function convertDateForTbl(date) {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

//Функция отслеживания высоты модального окна редактирования информации записей таблиц контента сайдбара
function changeModalEditInformationHeight() {
  const modalDialog = document.querySelector('.edit-modal-dialog')

  if (modalDialog == null) return
  if (modalDialog.style.display == 'none') return

  let resizeTimeout

  const observer = new ResizeObserver(() => {
    let modalBody = document.querySelector('.edit-modal-body')
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      modalDialog.style.height = modalBody.scrollHeight + 300 + 'px'
    }, 100)
  })

  observer.observe(document.querySelector('.edit-modal-body'))
}

//Функция записи введённых данных в строку таблицы
function setTableRowValuesFromInputFields(row, inputFields) {
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].type == 'date') {
      row.children[i].textContent = convertDateForTbl(inputFields[i].value)
    } else {
      row.children[i].textContent = inputFields[i].value
    }
  }
}

//Функции пагинации
function tblPaggination(tblId) {
  const tbl = document.getElementById(tblId)
  const tblCells = tbl.querySelectorAll('.tbl-body-row')
  const tblPaginationContainer = tbl
    .closest('div')
    .querySelector('.tbl-footer-container')
  const tblPagCurrentPageSpan =
    tblPaginationContainer.querySelector('.tbl-current-page')
  const tblPagTotalPagesSpan =
    tblPaginationContainer.querySelector('.tbl-total-pages')
  const tblPagTotalRecordCountSpan = tblPaginationContainer.querySelector(
    '.tbl-total-records-count'
  )

  if (showOrHidePagginationContainer(tblId)) {
    tblPagTotalRecordCountSpan.textContent = tblCells.length
    tblOffsetService(tblId)
  }
}

function showOrHidePagginationContainer(cntId) {
  const cntContainer = document.getElementById(cntId)
  let cntCells = cntContainer.querySelectorAll('.tbl-body-row')
  let tblPaginationContainer = cntContainer
    .closest('div')
    .querySelector('.tbl-footer-container')

  if (cntContainer.tagName == 'TABLE') {
    cntCells = cntContainer.querySelectorAll('.tbl-body-row')
    tblPaginationContainer = cntContainer
      .closest('div')
      .querySelector('.cnt-footer-container')
  } else {
    cntCells = cntContainer.querySelectorAll('.sb-cnt-title-container-item')
    tblPaginationContainer = cntContainer.querySelector('.cnt-footer-container')
  }

  if (cntCells.length >= 5) {
    tblPaginationContainer.classList.add('active')
    return true
  } else {
    tblPaginationContainer.classList.remove('active')
    return false
  }
}

function tblOffsetService(tblId) {
  const tbl = document.getElementById(tblId)
  const tblPagginationContainer = tbl
    .closest('div')
    .querySelector('.tbl-footer-container')
  const offsetSelect = tblPagginationContainer.querySelector('.selected')
  const offsetOptions = tblPagginationContainer
    .querySelector('.options')
    .querySelectorAll('li')

  for (let i = 0; i < offsetOptions.length; i++) {
    offsetOptions[i].addEventListener('click', () => {
      offsetSelect.textContent = offsetOptions[i].textContent
    })
  }
}

/*
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
Секция функций плитки контента сайдбара
*/
let matchesTitle = []
let matchesTitleItems = []
function initTitleService(titleId) {
  searchTitle(titleId)
  titleMultiSlctService(titleId)
  addNewDataToTitleService(titleId)
  deleteAllDataFromCntContainer(titleId)
  titlePaggination(titleId)
}
/*
  Функция работы с чекбокса в заголовке таблице
    - При клике на чекбокс в заголовке таблицы включаем видимость чекбоксов в таблице
    - При клике на чекбокс в заголовке таблицы делаем все чекбоксы в таблице checked и наоборот
*/
function titleMultiSlctService(titleId) {
  //Чекбокс в заголовке таблицы
  const title = document.getElementById(titleId)
  const titleGlLbCheckbox = title.querySelector('.title-gl-lb-checkbox')

  //Убираем с чекбокса свойство disabled при клике и отображаем чекбоксы в таблице
  if (titleGlLbCheckbox) {
    const glCheckbox = titleGlLbCheckbox.querySelector('.title-gl-checkbox')
    const glCheckboxSpan = titleGlLbCheckbox.querySelector(
      '.title-gl-checkmark'
    )

    const countCheckedboxes = {}
    countCheckedboxes[titleId] = 0

    /*
      Прослушка клика на lable чекбокса
      - Если чекбокс в заголовке таблицы не активирован, то активируем.
      - Включаем отображение всех чекбоксов в данной таблице
      - Если чекбокс в заголовке отмечен (checked), то делаем все чекбоксы в таблице checked и наоборот
      */
    titleGlLbCheckbox.addEventListener('click', () => {
      const titleLbCheckBoxes = title.querySelectorAll('.title-lb-checkbox')
      const titleCheckboxes = title.querySelectorAll('.title-checkbox')
      //Если чекбоксы не активированы, то активируем. И включаем отображение кнопки "Удалить записи"
      if (!glCheckboxSpan.classList.contains('active')) {
        glCheckboxSpan.classList.add('active')

        //Включаем видимость чекбоксов в таблице
        for (let i = 0; i < titleLbCheckBoxes.length; i++) {
          titleLbCheckBoxes[i].classList.add('active')
        }
      } else if (glCheckbox.checked) {
        //Делаем все чекбоксы в таблице checked
        for (let i = 0; i < titleLbCheckBoxes.length; i++) {
          const titleCheckBox =
            titleLbCheckBoxes[i].querySelector('.title-checkbox')
          const titleItem = titleLbCheckBoxes[i].closest(
            '.sb-cnt-title-container-item'
          )
          titleCheckBox.checked = true
          titleItem.classList.add('selected')
        }

        countCheckedboxes[titleId] = titleLbCheckBoxes.length

        if (titleCheckboxes.length > 0) {
          showOrHideTitleDeleteAllBtn(title.id, true)
        }
      } else if (!glCheckbox.checked) {
        //Убираем checked со всех чекбоксов в таблице
        for (let i = 0; i < titleLbCheckBoxes.length; i++) {
          const titleCheckBox =
            titleLbCheckBoxes[i].querySelector('.title-checkbox')
          const titleItem = titleLbCheckBoxes[i].closest(
            '.sb-cnt-title-container-item'
          )
          titleCheckBox.checked = false
          titleItem.classList.remove('selected')
        }
        countCheckedboxes[titleId] = 0
        showOrHideTitleDeleteAllBtn(title.id, false)
      }
    })

    /*
    Функция работы с чекбоксами в таблице
      - Отслеживание количества отмеченных чекбоксов, если больше одного, то отображаем кнопку "Удалить записи", 
        если нет, то скрываем
  */
    //Посчёт количества отмеченых чекбоксов
    const titleCheckboxes = title.querySelectorAll('.title-checkbox')
    titleCheckboxes.forEach(checkbox => {
      const titleItem = checkbox.closest('.sb-cnt-title-container-item')
      if (checkbox.checked) {
        countCheckedboxes[titleId]++
        titleItem.classList.add('selected')
      }

      //Меняем значение переменной countCheckedboxes при изменении состояния чекбокса
      checkbox.addEventListener('change', () => {
        const titleItem = checkbox.closest('.sb-cnt-title-container-item')

        if (checkbox.checked) {
          countCheckedboxes[titleId]++
          titleItem.classList.add('selected')
        } else {
          if (countCheckedboxes[titleId] > 0) {
            countCheckedboxes[titleId]--
            titleItem.classList.remove('selected')
          }
          glCheckbox.checked = false
        }

        if (glCheckbox.checked) {
          countCheckedboxes[titleId] = titleCheckboxes.length
        }

        console.log(
          `Количество отмеченых чекбоксов - ${countCheckedboxes[titleId]}`
        )
        console.log(`Количество чекбоксов - ${titleCheckboxes.length}`)
        //Если все чекбоксы в таблице отмечены, то делаем чекбокс в заголовке checked
        if (countCheckedboxes[titleId] === titleCheckboxes.length) {
          glCheckbox.checked = true
        }

        //Если больше одного чекбокса отмечен, то отображаем кнопку "Удалить записи", иначе скрываем
        if (countCheckedboxes[titleId] > 1) {
          showOrHideTitleDeleteAllBtn(title.id, true)
        } else {
          showOrHideTitleDeleteAllBtn(title.id, false)
        }
      })
    })
  }
}

function showOrHideTitleDeleteAllBtn(titlelId, isShow) {
  const title = document.getElementById(titlelId)
  const btn = title.querySelector('.title-btn-dlt-all')

  if (btn) {
    if (isShow) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  }
}

//Функции пагинации
function titlePaggination(titlelId) {
  const title = document.getElementById(titlelId)
  const titleCells = title.querySelectorAll('.sb-cnt-title-container-item')
  const titlePaginationContainer = title.querySelector(
    '.title-footer-container'
  )
  const tblPagCurrentPageSpan = titlePaginationContainer.querySelector(
    '.title-current-page'
  )
  const titlePagTotalPagesSpan =
    titlePaginationContainer.querySelector('.title-total-pages')
  const titlePagTotalRecordCountSpan = titlePaginationContainer.querySelector(
    '.title-total-records-count'
  )

  if (showOrHidePagginationContainer(titlelId)) {
    titlePagTotalRecordCountSpan.textContent = titleCells.length
    titleOffsetService(titlelId)
  }
}

function titleOffsetService(titleId) {
  const title = document.getElementById(titleId)
  const titlePagginationContainer = title.querySelector(
    '.title-footer-container'
  )
  const offsetSelect = titlePagginationContainer.querySelector('.selected')
  const offsetOptions = titlePagginationContainer
    .querySelector('.options')
    .querySelectorAll('li')

  for (let i = 0; i < offsetOptions.length; i++) {
    offsetOptions[i].addEventListener('click', () => {
      offsetSelect.textContent = offsetOptions[i].textContent
    })
  }
}

//Функция создания новой строки в таблице
function addNewDataToTitleService(titleId) {
  const title = document.getElementById(titleId)
  //Кнопка добавления новой записи
  const btn = title.querySelector('.cnt-btn-add')
  const objectId =
    title.querySelectorAll('.sb-cnt-title-container-item').length + 1

  if (btn) {
    btn.addEventListener('click', () => {
      const modal = getModalWillEditElementByContentId(titleId)

      modal.querySelector('form').setAttribute('obj-id', objectId)
      modal.querySelector('form').setAttribute('cnt-id', titleId)

      const inputFields = modal.querySelectorAll('.edit-modal-input-field')

      inputFields.forEach(field => {
        field.value = ''
      })

      modal.style.display = 'block'
    })
  }
}

//Создание новой записи в стиле плитки по titleId
function getDataFromTitle(titleId) {
  const titleContainer = document.getElementById(titleId)
  const titleDataItem = titleContainer.querySelectorAll(
    '.sb-cnt-title-container-item'
  )
  const maxId = {}
  maxId[titleId] = 0

  titleDataItem.forEach(row => {
    if (row.getAttribute('obj-id') > maxId[titleId]) {
      maxId[titleId] = row.getAttribute('obj-id')
    }
  })
  maxId[titleId]++
  const newDataItem = titleContainer
    .querySelector('.sb-cnt-title-container-item')
    .cloneNode(true)
  const titles = newDataItem.querySelectorAll('.title-data')
  newDataItem.setAttribute('obj-id', maxId[titleId])

  //Убираем текст в элементе tr
  for (let i = 1; i < titles.length; i++) {
    titles[i].textContent = ''
  }
  return newDataItem
}

//Функция создания новой плитки
function setTitleItemValuesFromInputFields(item, inputFields) {
  const dataItem = item.querySelectorAll('.title-data')
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].type == 'date') {
      dataItem[i].textContent = convertDateForTbl(inputFields[i].value)
    } else {
      dataItem[i].textContent = inputFields[i].value
    }
  }
}

//-----------------------------------------------------------------
//Функция поиска по плитке

function searchTitle(titleId) {
  const title = document.getElementById(titleId)
  const titleSearchColumnSelectList = title.querySelector('.cnt-search-sl-col')
  const titleSearchColumnsNames = title
    .querySelectorAll('.sb-cnt-title-container-item')[0]
    .getElementsByTagName('h4')
  const inputField = title.querySelector('.cnt-search-input')
  let searchResultContainer = title.querySelector('.cnt-search-result')
  const searchTitleBtn = title.querySelector('.cnt-btn-search')
  const searchIcon = title.querySelector('.bx-search')
  const prevBtn = title.querySelector('.bx-chevron-up')
  const nextBtn = title.querySelector('.bx-chevron-down')
  const closeBtn = title.querySelector('.bx-x')
  let query = ''
  let titleMatches = []
  let currentIdex = 0
  let prevIndex = 0

  //Инициализация элемента select для строки поиска
  if (
    titleSearchColumnSelectList.options.length <= titleSearchColumnsNames.length
  ) {
    for (let i = 0; i < titleSearchColumnsNames.length; i++) {
      const option = document.createElement('option')
      option.text = titleSearchColumnsNames[i].textContent.trim()

      titleSearchColumnSelectList.appendChild(option)
    }
  }

  titleSearchColumnSelectList.addEventListener('change', () => {
    if (titleSearchColumnSelectList.selectedIndex != 0) {
      showOrHideWarningSelectWindow(titleId, false)
    }
  })

  //Поиск при нажатии на кнопку поиска
  searchTitleBtn.addEventListener('click', () => {
    const selectedOption = getSelectedOption(titleSearchColumnSelectList)

    //Обнуление переменных при повторном поиске
    addOrRemoveHighlightInTitle(query, titleId, selectedOption, false)
    titleMatches.length = 0
    currentIdex = 0

    query = getQueryFromInputField(titleId)
    titleMatches = addOrRemoveHighlightInTitle(
      query,
      title.id,
      selectedOption,
      true
    )

    searchQueryInTitle(title, titleMatches, searchResultContainer)
  })

  //Поиск при нажатии на иконку поиска
  searchIcon.addEventListener('click', () => {
    const selectedOption = getSelectedOption(titleSearchColumnSelectList)

    //Обнуление переменных при повторном поиске
    addOrRemoveHighlightInTitle(query, titleId, selectedOption, false)
    titleMatches.length = 0
    currentIdex = 0

    query = getQueryFromInputField(titleId)
    titleMatches = addOrRemoveHighlightInTitle(
      query,
      title.id,
      selectedOption,
      true
    )

    searchQueryInTitle(title, titleMatches, searchResultContainer)
  })

  //Поиск по нажатию на кнопку Enter
  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const selectedOption = getSelectedOption(titleSearchColumnSelectList)

      //Обнуление переменных при повторном поиске
      addOrRemoveHighlightInTitle(query, titleId, selectedOption, false)
      titleMatches.length = 0
      currentIdex = 0

      query = getQueryFromInputField(titleId)
      titleMatches = addOrRemoveHighlightInTitle(
        query,
        title.id,
        selectedOption,
        true
      )

      searchQueryInTitle(title, titleMatches, searchResultContainer)
    }
  })

  //Очистка поля ввода и результатов поиска при нажатии на кнопку Escape
  inputField.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      showOrHideSearchResultContainer(titleId, false)
      inputField.value = ''
      addOrRemoveHighlightInTitle(query, titleId, false)
      titleMatches.length = 0
      currentIdex = 0
    }
  })

  //Переход на предидущий резльутат поиска при нажатии на chevron-up
  prevBtn.addEventListener('click', () => {
    prevIndex = currentIdex
    currentIdex--
    if (currentIdex < 0) {
      currentIdex = titleMatches.length - 1
    }
    searchResultContainer.querySelector(
      '.cnt-search-result-number'
    ).textContent = addSearchResultNumber(currentIdex, titleMatches)
    const prevElement = titleMatches[prevIndex]
    const currentElement = titleMatches[currentIdex]

    if (prevElement || currentElement) {
      prevElement.classList.remove('active')
      currentElement.classList.add('active')
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })

  //Переход на следующий резльутат поиска при нажатии на chevron-down
  nextBtn.addEventListener('click', () => {
    prevIndex = currentIdex
    currentIdex++

    if (currentIdex > titleMatches.length - 1) {
      currentIdex = 0
    }
    searchResultContainer.querySelector(
      '.cnt-search-result-number'
    ).textContent = addSearchResultNumber(currentIdex, titleMatches)
    const prevElement = titleMatches[prevIndex]
    const currentElement = titleMatches[currentIdex]
    prevElement.classList.remove('active')
    currentElement.classList.add('active')
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })

  //Очистка поля ввода и результатов поиска при нажатии на иконку - крестик
  closeBtn.addEventListener('click', () => {
    showOrHideSearchResultContainer(titleId, false)
    inputField.value = ''
    addOrRemoveHighlightInTitle(query, titleId, false)
    titleMatches.length = 0
    currentIdex = 0
  })
}

//Функция поиска текста в таблице
function searchQueryInTitle(title, matches, searchResultContainer) {
  const titleSearchColumnSelectList = title.querySelector('.cnt-search-sl-col')
  const cntSearchCevrons = title.querySelector('.cnt-search-result-cevrons')

  if (matches.length > 0) {
    //Включаем блок с иконками навигации по результатам поиска
    cntSearchCevrons.classList.add('active')
    //Если нашли совпадения в таблице меняем иконки и отображаем окно с количеством результатов поиска
    showOrHideSearchResultContainer(title.id, true)

    //Отображаем количество найденных результатов
    if (matches.length > 1) {
      searchResultContainer.querySelector(
        '.cnt-search-result-count'
      ).textContent = 'Найдено ' + matches.length + ' результатов'
    } else {
      searchResultContainer.querySelector(
        '.cnt-search-result-count'
      ).textContent = 'Найдено ' + matches.length + ' результат'
    }

    //Добавляем в строку текущий результат поиска
    searchResultContainer.querySelector(
      '.cnt-search-result-number'
    ).textContent = addSearchResultNumber(0, matches)

    const currentElement = matches[0]
    currentElement.classList.add('active')
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else if (
    matches.length == 0 &&
    titleSearchColumnSelectList.selectedIndex != 0
  ) {
    cntSearchCevrons.classList.remove('active')
    showOrHideSearchResultContainer(title.id, true)
    searchResultContainer.querySelector(
      '.cnt-search-result-count'
    ).textContent = 'Поиск не дал результатов'
    searchResultContainer.querySelector(
      '.cnt-search-result-number'
    ).textContent = ''
  }
}

//Функция поиска слова в таблице. Выделяет все найденные слова и возвращает их массив или убирает выделение
function addOrRemoveHighlightInTitle(
  query,
  titleId,
  selectedOption,
  isHighlight
) {
  const title = document.getElementById(titleId)
  //счётчик для количества пройденных плиток
  let count = 1
  if (isHighlight) {
    //Если не выбран столбец для поиска, отображаем окно с уведомлением о необходимости выбора
    if (selectedOption.index != 0) {
      if (query.length > 0) {
        //Выбираем все ячейки из таблицы
        const items = title.querySelectorAll('.title-data')
        items.forEach(item => {
          if (count == selectedOption.index) {
            const regex = new RegExp(query, 'gi')
            const originalContent = item.textContent
            let newContent = originalContent
            const tempSpans = []
            let match

            // Собираем все совпадения
            while ((match = regex.exec(originalContent)) !== null) {
              tempSpans.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0]
              })
            }

            // Заменяем совпадения в обратном порядке
            tempSpans.reverse().forEach(({ start, end, text }) => {
              newContent =
                newContent.slice(0, start) +
                `<span class="highlight">${text}</span>` +
                newContent.slice(end)
            })

            // Обновляем содержимое ячейки
            item.innerHTML = newContent
            matchesTitleItems.push(item)
          }
          //Обнуляем счётчик при проходке каждого ряда таблицы или увеличиваем его
          if (count == selectedOption.length) {
            count = 1
          } else {
            count++
          }
        })
        // Добавляем все span элементы в массив
        const spans = title.querySelectorAll('.highlight')
        spans.forEach(span => {
          matchesTitle.push(span)
        })
      }
    } else {
      showOrHideWarningSelectWindow(titleId, true)
    }
  } else {
    //Заменяем все элементы span на текст запроса
    matchesTitleItems.forEach(item => {
      item.innerHTML = item.textContent.replace(
        /<span class="highlight">|<\/span>/g,
        query
      )
    })
    matchesTitle.length = 0
  }
  return matchesTitle
}

//Получения индекса выбранной колонки, названия колонки и ёё текста
function getSelectedOption(selectElement) {
  const selectedIndex = selectElement.selectedIndex
  const selectedOption = selectElement.options[selectedIndex]
  return {
    index: selectedIndex,
    text: selectedOption.text,

    //Убираем самую первую опцию - "Искать по столбцу"
    length: selectElement.length - 1
  }
}

//Получение строки запроса со строки поиска
function getQueryFromInputField(cntId) {
  const cnt = document.getElementById(cntId)
  let cntContainer

  if (isTable(cntId)) {
    cntContainer = cnt.closest('div')
  } else {
    cntContainer = cnt
  }

  return cntContainer.querySelector('.cnt-search-input').value
}

//Добавляем количество найденных результатов в строку
function addSearchResultNumber(currentIdex, matches) {
  let resultNumberQuery = '{result-number} из {matches.length}'

  let result = resultNumberQuery.replace('{matches.length}', matches.length)

  if (matches.length > 0) {
    result = result.replace('{result-number}', currentIdex + 1)
  }

  return result
}
