document.addEventListener('DOMContentLoaded', function () {
  changeModalEditInformationHeight()
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
          activeItemContent.style.display = 'none'
        }
      }
    }

    //Включаем отображение контента
    itemContent.style.display = 'flex'
    document.querySelector('.cabinet-content').style.visibility = 'visible'
    document.querySelector('.cabinet-content').style.opacity = '1'
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

/*
--------------------------------------------------------------------------------------------------------------------
Секция для работы с таблицами контента сайдбара
*/
const cntContainer = document.querySelector('.cabinet-content')

if (cntContainer) {
  const cntTables = document.getElementsByTagName('table')

  if (cntTables.length > 0) {
    //Подключение сервисов и функций для работы с таблицами контента сайдбара
    for (let i = 0; i < cntTables.length; i++) {
      tblMultiSlctService(cntTables[i].id)
      addNewRow(cntTables[i].id)
      searchTable(cntTables[i].id)
      tblPaggination(cntTables[i].id)
    }
  }

  //Переключение иконки сортировки
  for (let i = 0; i < cntTables.length; i++) {
    const tblHeaderCell = cntTables[i].getElementsByTagName('th')

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

  //Кнопка удалить все записи
  const tblBtnDltAll = document.querySelectorAll('.tbl-btn-dlt-all')

  if (tblBtnDltAll.length > 0) {
    tblBtnDltAll.forEach(btn => {
      btn.addEventListener('click', () => {
        const tbl = btn.closest('table')
        const tblGlCheckbox = tbl.querySelector('.tbl-gl-checkbox')
        const tblData = tbl.querySelectorAll('.tbl-body-row')

        //Удаляем только те записи где чекбокс checked
        tblData.forEach(row => {
          if (row.querySelector('.tbl-checkbox').checked) {
            row.remove()
          }
        })

        //Если чекбокс в заголовке checked убрать флажёк
        if (tblGlCheckbox.checked) {
          tblGlCheckbox.checked = false
        }
        showOrHidePagginationContainer(tbl.id)

        if (tbl.querySelectorAll('.tbl-body-row').length == 0)
          showOrHideTblDeleteAllBtn(tbl.id, false)
      })
    })
  }
  //Иконка редактирования записи таблицы
  const editIcon = document.querySelectorAll('.tbl-edit-icon')

  if (editIcon.length > 0) {
    //Функция отображения модальных окон при клике на иконку редактирования
    editIcon.forEach(icon => {
      icon.addEventListener('click', () => {
        showModalWillEditInformation(icon.closest('.tbl-body-row'))
      })
    })
  }

  //Закрытие модального окна
  const closeIcon = document.querySelectorAll('.edit-modal-close-icon')

  if (closeIcon.length > 0) {
    closeIcon.forEach(icon => {
      icon.addEventListener('click', () => {
        const modal = icon.closest('section')

        const modalDialog = modal.querySelector('.edit-modal-dialog')
        const textAreas = modal.querySelectorAll('.edit-text-aria')
        modalDialog.style.height = '0px'

        for (let i = 0; i < textAreas.length; i++) {
          textAreas[i].style.height = '0px'
        }

        modal.style.display = 'none'
      })
    })
  }

  //Функция изменения иконки "избранное" при нажатии на нее
  const favIcons = document.querySelectorAll('.bx-star')
  const favSelectedIcons = document.querySelectorAll('.bxs-star')

  if (favIcons.length > 0) {
    favIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.remove('bx-star')
        icon.classList.add('bxs-star')
        icon.classList.add('active')
        icon.title = 'Удалить из избранного'
      })
    })
  }

  if (favSelectedIcons.length > 0) {
    favSelectedIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.remove('bxs-star')
        icon.classList.add('bx-star')
        icon.classList.remove('active')
        icon.title = 'Добавить в избранное'
      })
    })
  }

  //Функция изменения иконки "показать/скрыть" запись куратору
  const tblRowDataShowIcons = document.querySelectorAll('.bx-show')
  const tblRowDataHideIcons = document.querySelectorAll('.bx-hide')

  if (tblRowDataShowIcons.length > 0) {
    tblRowDataShowIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.remove('bx-show')
        icon.classList.add('bx-hide')
        icon.title = 'Сделать запись доступной куратору'
      })
    })
  }

  if (tblRowDataHideIcons.length > 0) {
    tblRowDataHideIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.add('bx-show')
        icon.classList.remove('bx-hide')
        icon.title = 'Сделать запись не доступной куратору'
      })
    })
  }

  //Функция сохранения отредактированных данных таблицы
  const editModalSaveBtn = document.querySelectorAll('.edit-modal-save-btn')

  if (editModalSaveBtn.length > 0) {
    editModalSaveBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        const form = btn.closest('form')
        const objectId = form.getAttribute('obj-id')
        const inputFields = form.querySelectorAll('.edit-modal-input-field')
        const tblId = form.getAttribute('tbl-name') + '-tbl'
        const tbl = document.getElementById(tblId)
        const rows = tbl.querySelectorAll('.tbl-body-row')
        let row
        let isNewRow = true

        rows.forEach(tblRow => {
          if (tblRow.getAttribute('obj-id') == objectId) {
            isNewRow = false
            row = tblRow
          }
        })

        if (isNewRow) {
          const row = getRowFromTable(tblId)
          row.setAttribute('obj-id', objectId)
          setTblRowValuesFromInputFields(row, inputFields)
          tbl.querySelector('tbody').appendChild(row)
        } else {
          setTblRowValuesFromInputFields(row, inputFields)
        }
        btn.closest('.edit-modal-container').style.display = 'none'
      })
    })
  }

  //Функция удаления записи с таблицы
  const deleteTblIcon = document.querySelectorAll('.tbl-dlt-icon')

  if (deleteTblIcon.length > 0) {
    deleteTblIcon.forEach(icon => {
      icon.addEventListener('click', () => {
        const cell = icon.closest('tr')
        if (cell) {
          cell.remove()
        } else {
          console.log('Cell not found')
        }
      })
    })
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
  const tblGlLbCheckboxes = tbl.querySelectorAll('.tbl-gl-lb-checkbox')

  //Убираем с чекбокса свойство disabled при клике и отображаем чекбоксы в таблице
  if (tblGlLbCheckboxes.length > 0) {
    tblGlLbCheckboxes.forEach(checkbox => {
      const glCheckbox = checkbox.querySelector('.tbl-gl-checkbox')
      const tbl = checkbox.closest('table')
      const glCheckboxSpan = checkbox.querySelector('.tbl-gl-checkmark')

      const countCheckedboxes = {}
      countCheckedboxes[tblId] = 0

      /*
      Прослушка клика на lable чекбокса
      - Если чекбокс в заголовке таблицы не активирован, то активируем.
      - Включаем отображение всех чекбоксов в данной таблице
      - Если чекбокс в заголовке отмечен (checked), то делаем все чекбоксы в таблице checked и наоборот
      */
      checkbox.addEventListener('click', () => {
        const tblLbCheckBoxes = tbl.querySelectorAll('.tbl-lb-checkbox')
        const tblCheckboxes = tbl.querySelectorAll('.tbl-checkbox')
        //Если чекбоксы не активированы, то активируем. И включаем отображение кнопки "Удалить записи"
        if (!glCheckboxSpan.classList.contains('active')) {
          glCheckboxSpan.classList.add('active')

          //Включаем видимость чекбоксов в таблице
          for (let i = 0; i < tblLbCheckBoxes.length; i++) {
            tblLbCheckBoxes[i].style.display = 'block'
          }
        } else if (glCheckbox.checked) {
          //Делаем все чекбоксы в таблице checked
          for (let i = 0; i < tblLbCheckBoxes.length; i++) {
            const tblCheckBox =
              tblLbCheckBoxes[i].querySelector('.tbl-checkbox')
            tblCheckBox.checked = true
          }

          if (tblCheckboxes.length > 0) {
            showOrHideTblDeleteAllBtn(tbl.id, true)
          }
        } else if (!glCheckbox.checked) {
          //Убираем checked со всех чекбоксов в таблице
          for (let i = 0; i < tblLbCheckBoxes.length; i++) {
            const tblCheckBox =
              tblLbCheckBoxes[i].querySelector('.tbl-checkbox')
            tblCheckBox.checked = false
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
        if (checkbox.checked) {
          countCheckedboxes[tblId]++
        }

        //Меняем значение переменной countCheckedboxes при изменении состояния чекбокса
        checkbox.addEventListener('change', () => {
          if (glCheckbox.checked) {
            countCheckedboxes[tblId] = tblCheckboxes.length
          }
          if (checkbox.checked) {
            countCheckedboxes[tblId]++
          } else {
            if (countCheckedboxes[tblId] > 0) countCheckedboxes[tblId]--
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
  const btn = tbl.querySelector('.tbl-btn-dlt-all')

  if (isShow) {
    btn.classList.add('active')
  } else {
    btn.classList.remove('active')
  }
}

//Получение названия меню сайдбара с table.id
function getTblNameById(tableId) {
  return tableId.substring(0, tableId.indexOf('-'))
}

//Функция создания новой строки в таблице
function addNewRow(tblId) {
  const tbl = document.getElementById(tblId)
  //Кнопка добавления новой записи
  const btn = tbl.querySelector('.tbl-btn-add')
  const objectId = tbl.querySelectorAll('.tbl-body-row').length + 1

  btn.addEventListener('click', () => {
    const modal = getModalWillEditInformationByTblId(tblId)

    modal.querySelector('form').setAttribute('obj-id', objectId)

    const inputFields = modal.querySelectorAll('.edit-modal-input-field')

    inputFields.forEach(field => {
      field.value = ''
    })

    modal.style.display = 'block'
  })
}

//Создание элемента tr переданного id таблицы c новым id
function getRowFromTable(tblId) {
  const tbl = document.getElementById(tblId)
  const tblRows = tbl.querySelectorAll('.tbl-body-row')
  const maxId = {}
  maxId[tblId] = 0

  tblRows.forEach(row => {
    if (row.getAttribute('data-id') > maxId[tblId]) {
      maxId[tblId] = row.getAttribute('data-id')
    }
  })
  maxId[tblId]++
  const newRow = tbl.querySelector('.tbl-body-row').cloneNode(true)
  const rowcells = newRow.getElementsByTagName('td')
  newRow.setAttribute('data-id', maxId[tblId])

  //Убираем текст в элементе tr
  for (let i = 1; i < rowcells.length; i++) {
    if (rowcells[i].classList.contains('tbl-row-data')) {
      rowcells[i].textContent = ''
    }
  }
  return newRow
}

//Функция поиска по таблице
function searchTable(tblId) {
  const tbl = document.getElementById(tblId)
  const tblSearchColumnSelectList = tbl.querySelector('.tbl-search-sl-col')
  const tblSearchColumnsNames = tbl
    .querySelector('thead')
    .querySelectorAll('.tbl-title-link')
  const inputField = tbl.querySelector('.tbl-search-input')
  let searchResultContainer = tbl.querySelector('.tbl-search-result')
  const searchTblBtn = tbl.querySelector('.tbl-btn-search')
  const searchIcon = tbl.querySelector('.bx-search')
  const prevBtn = tbl.querySelector('.bx-chevron-up')
  const nextBtn = tbl.querySelector('.bx-chevron-down')
  const closeBtn = tbl.querySelector('.bx-x')
  let query = ''
  let matches = []
  let currentIdex = 0
  let prevIndex = 0

  //Инициализация элемента select для строки поиска
  tblSearchColumnsNames.forEach(clmn => {
    const option = document.createElement('option')
    option.text = clmn.textContent.trim()

    tblSearchColumnSelectList.appendChild(option)
  })

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
    matches.length = 0
    currentIdex = 0

    query = getQueryFromInputField(tblId)
    matches = addOrRemoveHighlightInTbl(query, tbl.id, selectedOption, true)

    searchQueryInTbl(tbl, matches, searchResultContainer)
  })

  //Поиск при нажатии на иконку поиска
  searchIcon.addEventListener('click', () => {
    const selectedOption = getSelectedOption(tblSearchColumnSelectList)

    //Обнуление переменных при повторном поиске
    addOrRemoveHighlightInTbl(query, tblId, selectedOption, false)
    matches.length = 0
    currentIdex = 0

    query = getQueryFromInputField(tblId)
    matches = addOrRemoveHighlightInTbl(query, tbl.id, selectedOption, true)

    searchQueryInTbl(tbl, matches, searchResultContainer)
  })

  //Поиск по нажатию на кнопку Enter
  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const selectedOption = getSelectedOption(tblSearchColumnSelectList)

      //Обнуление переменных при повторном поиске
      addOrRemoveHighlightInTbl(query, tblId, selectedOption, false)
      matches.length = 0
      currentIdex = 0

      query = getQueryFromInputField(tblId)
      matches = addOrRemoveHighlightInTbl(query, tbl.id, selectedOption, true)

      searchQueryInTbl(tbl, matches, searchResultContainer)
    }
  })

  //Очистка поля ввода и результатов поиска при нажатии на кнопку Escape
  inputField.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      showOrHideSearchResultContainer(tblId, false)
      inputField.value = ''
      addOrRemoveHighlightInTbl(query, tblId, false)
      matches.length = 0
      currentIdex = 0
    }
  })

  //Переход на предидущий резльутат поиска при нажатии на chevron-up
  prevBtn.addEventListener('click', () => {
    prevIndex = currentIdex
    currentIdex--
    if (currentIdex < 0) {
      currentIdex = matches.length - 1
    }
    searchResultContainer.querySelector('.tbl-srch-rslt-number').textContent =
      addSearchResultNumber(currentIdex, matches)
    const prevElement = matches[prevIndex]
    const currentElement = matches[currentIdex]

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

    if (currentIdex > matches.length - 1) {
      currentIdex = 0
    }
    searchResultContainer.querySelector('.tbl-srch-rslt-number').textContent =
      addSearchResultNumber(currentIdex, matches)
    const prevElement = matches[prevIndex]
    const currentElement = matches[currentIdex]
    prevElement.classList.remove('active')
    currentElement.classList.add('active')
    currentElement.scrollIntoView()
  })

  //Очистка поля ввода и результатов поиска при нажатии на иконку - крестик
  closeBtn.addEventListener('click', () => {
    showOrHideSearchResultContainer(tblId, false)
    inputField.value = ''
    addOrRemoveHighlightInTbl(query, tblId, false)
    matches.length = 0
    currentIdex = 0
  })
}

//Функция поиска текста в таблице
function searchQueryInTbl(tbl, matches, searchResultContainer) {
  const tblSearchColumnSelectList = tbl.querySelector('.tbl-search-sl-col')
  const tblSearchCevrons = tbl.querySelector('.tbl-search-rslt-cevrons')

  if (matches.length > 0) {
    //Включаем блок с иконками навигации по результатам поиска
    tblSearchCevrons.classList.add('active')
    //Если нашли совпадения в таблице меняем иконки и отображаем окно с количеством результатов поиска
    showOrHideSearchResultContainer(tbl.id, true)

    //Отображаем количество найденных результатов
    if (matches.length > 1) {
      searchResultContainer.querySelector('.tbl-srch-rslt-count').textContent =
        'Найдено ' + matches.length + ' результатов'
    } else {
      searchResultContainer.querySelector('.tbl-srch-rslt-count').textContent =
        'Найдено ' + matches.length + ' результат'
    }

    //Добавляем в строку текущий результат поиска
    searchResultContainer.querySelector('.tbl-srch-rslt-number').textContent =
      addSearchResultNumber(0, matches)

    const currentElement = matches[0]
    currentElement.classList.add('active')
    currentElement.scrollIntoView()
  } else if (
    matches.length == 0 &&
    tblSearchColumnSelectList.selectedIndex != 0
  ) {
    tblSearchCevrons.classList.remove('active')
    showOrHideSearchResultContainer(tbl.id, true)
    searchResultContainer.querySelector('.tbl-srch-rslt-count').textContent =
      'Поиск не дал результатов'
    searchResultContainer.querySelector('.tbl-srch-rslt-number').textContent =
      ''
  }
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
function getQueryFromInputField(tblId) {
  const tbl = document.getElementById(tblId)

  return tbl.querySelector('.tbl-search-input').value
}

//Добавляем количество найденных результатов в строку
function addSearchResultNumber(currentIdex, matches) {
  console.log(`current.index ${currentIdex}`)
  console.log(`matches.length ${matches.length}`)
  let resultNumberQuery = '{result-number} из {matches.length}'

  let result = resultNumberQuery.replace('{matches.length}', matches.length)

  if (matches.length > 0) {
    result = result.replace('{result-number}', currentIdex + 1)
  }

  return result
}

//Функция поиска слова в таблице. Выделяет все найденные слова и возвращает их массив или убирает выделение
const matches = []
const matchesCells = []
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
    //Заменяем все элементы span на текст запроса
    matchesCells.forEach(cell => {
      cell.innerHTML = cell.textContent.replace(
        /<span class="highlight">|<\/span>/g,
        query
      )
    })
    matches.length = 0
  }
  return matches
}

/*
    Функция отображения/скрытия окна с результатов поиска
      - tblId - id таблицы
      - isShow - true - отображать, false - скрыть
*/
function showOrHideSearchResultContainer(tblId, isShow) {
  const tbl = document.getElementById(tblId)
  const searchIcon = tbl.querySelector('.bx-search')
  const clearSearchFieldIcon = tbl.querySelector('.bx-x')
  const searchResultContainer = tbl.querySelector('.tbl-search-result')

  if (isShow) {
    searchIcon.style.display = 'none'
    clearSearchFieldIcon.style.display = 'block'
    searchResultContainer.classList.add('active')
  } else {
    searchIcon.style.display = 'block'
    clearSearchFieldIcon.style.display = 'none'
    searchResultContainer.classList.remove('active')
  }
}

function showOrHideWarningSelectWindow(tblId, isShow) {
  const tbl = document.getElementById(tblId)
  const slctWarLable = tbl.querySelector('.tbl-search-wrn')
  if (isShow) {
    slctWarLable.style.visibility = 'visible'
    slctWarLable.style.opacity = '1'
  } else {
    slctWarLable.style.visibility = 'hidden'
    slctWarLable.style.opacity = '0'
  }
}

//Функция вкл/выкл модального окна редактирования информации записей таблиц контента сидбара
function showModalWillEditInformation(tblRow) {
  const tblId = tblRow.closest('table').id
  const modal = getModalWillEditInformationByTblId(tblId)
  const form = modal.querySelector('form')

  form.setAttribute('obj-id', tblRow.getAttribute('obj-id'))
  form.setAttribute('tbl-name', getTblNameById(tblId))

  modal.style.display = 'block'

  // Установка значений полей в модальном окне из текущей записи
  const willIncomingDate = convertDateForEditForm(
    tblRow.querySelector('.will-incoming-date').textContent.trim()
  )

  const willDescription = tblRow
    .querySelector('.will-brief-description')
    .textContent.trim()
  const willComment = tblRow.querySelector('.will-comment').textContent.trim()

  document.getElementById('edit-will-incoming-date').value = willIncomingDate
  document.getElementById('edit-will-brief-description').value = willDescription
  document.getElementById('edit-will-comment').value = willComment
}

//Функция получения элемента модального окна создания/редактирования записи таблицы "Воля"
function getModalWillEditInformationByTblId(tblId) {
  const modalId = tblId.substring(0, tblId.indexOf('-')) + '-edit-information'
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

  if (!modalDialog) return

  const observer = new ResizeObserver(() => {
    let modalBody = document.querySelector('.edit-modal-body')
    resizeTimeout = setTimeout(() => {
      modalDialog.style.height = modalBody.scrollHeight + 300 + 'px'
    }, 100)
  })

  observer.observe(document.querySelector('.edit-modal-body'))
}

//Функция записи введённых данных в строку таблицы
function setTblRowValuesFromInputFields(row, inputFields) {
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
    .querySelector('.tbl-pagination-container')
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

function showOrHidePagginationContainer(tblId) {
  const tbl = document.getElementById(tblId)
  const tblCells = tbl.querySelectorAll('.tbl-body-row')
  const tblPaginationContainer = tbl
    .closest('div')
    .querySelector('.tbl-pagination-container')

  if (tblCells.length >= 5) {
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
    .querySelector('.tbl-pagination-container')
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
//Функция для вёрстки контента сайдбара
document.addEventListener('DOMContentLoaded', function () {
  const activeMenuId = localStorage.getItem(expandSidebarActiveMenuIdKey)
  const activeSubMenuId = localStorage.getItem(sidebarActiveSubmenuIdKey)

  document.getElementById(activeMenuId).closest('li').classList.add('active')
  document.getElementById(activeSubMenuId).classList.add('active')

  showOrHideSidebarContent(activeSubMenuId)
})
*/
