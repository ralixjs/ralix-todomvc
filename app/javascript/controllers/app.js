import Storage from 'components/storage'

export default class AppCtrl {
  constructor() {
    this.storage = new Storage()
    this.loadList('all')

    on('.new-todo', 'keyup', (e) => {
      if (e.code !== 'Enter' || e.target.value == '')  return

      createItem(e.target.value)
      e.target.value = ''
    })

    on(window, 'click', (e) => {
      const edit = find('input.edit')
      if (edit && !edit.contains(e.target))
        saveItem(edit)
    })
  }

  saveItem(edit) {
    const id    = edit.parentElement.id.replace('li_', '')
    const value = edit.value
    removeClass(`#li_${id}`, 'editing')
    edit.remove()

    if (value == '')
      destroyItem(id)
    else {
      find(`#li_${id} label`).textContent = value
      updateItem(id)
    }
  }

  updateItem(id) {
    const todo = iterate(this.getList(), (obj, index, list) => {
      if (obj.id == id) {
        list[index]['value'] = find(`#li_${id} label`).textContent
        list[index]['class'] = find(`#li_${id}`).className
      }
    })
    this.storage.set(todo)
  }

  createItem(value) {
    const id = Date.now().toString()
    let todo = getList()

    todo.push({ id: `${id}`, class: '', value: value })
    if (find('.selected').text != 'Completed') addItem(id, '', value)

    this.storage.set(todo)
    updateCounter()
  }

  toggleCheckAll() {
    let all

    if (find('.todo-list li:not(.completed)'))
      all = findAll('.todo-list li:not(.completed)')
    else
      all = findAll('.todo-list li.completed')

    iterate(all, (obj) => { toggleElement(obj.id.replace('li_', '')) })

    const todo = iterate(getList(), (obj, index, list) => {
      list[index]['class'] = find('.todo-list li:not(.completed)') ? '' : 'completed'
    })

    this.storage.set(todo)
    updateCounter()
  }

  toggleElement(id) {
    toggleClass(`#li_${id}`, 'completed')
    find(`#li_${id} input`).remove()
    insertHTML(`#li_${id} div`, this.checkBox(id, find(`#li_${id}`).className), 'begin')
  }

  toggleCheck(id) {
    toggleElement(id)
    const todo = iterate(getList(), (obj, index, list) => {
      if (obj.id == id.replace('li_', '')) {
        list[index]['class'] = find(`#li_${id}`).className
      }
    })

    this.storage.set(todo)
    updateCounter()
  }

  destroyItem(id) {
    find(`#li_${id}`).remove()

    const list = iterate(getList(), (obj, index, list) => {
      if (obj.id == id.replace('li_', ''))
        list.splice(index, 1)
    })

    this.storage.set(list)
    updateCounter()
  }

  editItem(id) {
    const value = find(`#li_${id} label`).textContent
    const input = document.createElement('input')

    addClass(`#li_${id}`, 'editing')
    input.className = 'edit'
    input.value = value
    find(`#li_${id}`).appendChild(input)
    input.focus()

    on(input, 'keyup', (e) => {
      if (e.code !== 'Enter') return

      if (input.value == '') {
        destroyItem(id.replace('li_', ''))
      } else {
        removeClass(`#li_${id}`, 'editing')
        find(`#li_${id} label`).textContent = input.value
        input.remove()
        updateItem(id)
      }
    })
  }

  addItem(id, completed, value) {
    insertHTML('ul', `<li id="li_${id}" class="${completed}"><div class="view">${this.checkBox(id, completed)}<label ondblclick=editItem('${id}')>${value}</label><button class="destroy" onclick="destroyItem('${id}')"></button></div></li>`, 'end')
  }

  checkBox(id, completed) {
    const checked = completed != '' ? 'checked' : ''
    return `<input class="toggle" type="checkbox" onclick="toggleCheck('${id}')" ${checked}>`
  }

  clearCompleted() {
    iterate(findAll('.completed'), (obj) => { obj.remove() })
    this.storage.set(getList('active'))
  }

  loadList(list) {
    removeClass('.selected', 'selected')
    insertHTML('ul', '')
    addClass(`a[onclick="loadList('${list}')"]`, 'selected')

    this.iterate(this.getList(list), (obj) => {
      this.addItem(obj.id, obj.class, obj.value)
    })

    this.updateCounter()
  }

  updateCounter() {
    const left = this.getList('active').length

    if (left)
      insertHTML('.todo-count', `<strong>${left} items left</strong>`)
    else
      insertHTML('.todo-count', '')
  }

  iterate(list, callback) {
    list.forEach((obj, index) => {
      callback(obj, index, list)
    })

    return list
  }

  getList(list = 'all') {
    const todo = this.storage.get()

    if (list == 'active')    return todo.filter(li => li['class'] == '')
    if (list == 'completed') return todo.filter(li => li['class'] != '')

    return todo
  }
}
