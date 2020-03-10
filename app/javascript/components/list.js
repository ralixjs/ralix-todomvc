export default class List {
  constructor() {}

  load(list, name) {
    removeClass('.selected', 'selected')
    insertHTML('ul', '')
    addClass(`a[onclick="loadList('${name}')"]`, 'selected')

    list.forEach((obj) => {
      this.addItem(obj.id, obj.class, obj.value)
    })
  }

  addItem(id, completed, value) {
    insertHTML('ul', `<li id="li_${id}" class="${completed}"><div class="view">${this.checkBox(id, completed)}<label ondblclick=editItem('${id}')>${value}</label><button class="destroy" onclick="destroyItem('${id}')"></button></div></li>`, 'end')
  }

  removeItem(id) {
    find(`#li_${id}`).remove()
  }

  updateCounter(items) {
    if (items)
      insertHTML('.todo-count', `<strong>${items} items left</strong>`)
    else
      insertHTML('.todo-count', '')
  }

  removeCompleted() {
    iterate(findAll('.completed'), (obj) => { obj.remove() })
  }

  checkBox(id, completed) {
    const checked = completed != '' ? 'checked' : ''
    return `<input class="toggle" type="checkbox" onclick="toggleCheck('${id}')" ${checked}>`
  }

  toggleElement(id) {
    toggleClass(`#li_${id}`, 'completed')
    find(`#li_${id} input`).remove()
    insertHTML(`#li_${id} div`, this.checkBox(id, find(`#li_${id}`).className), 'begin')
  }
}
