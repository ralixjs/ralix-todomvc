import Storage from 'components/storage'
import List    from 'components/list'

export default class AppCtrl {
  constructor() {
    this.storage = new Storage()
    this.list    = new List()
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

    if (value == '') {
      this.destroyItem(id)
    } else {
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

    if (find('.selected').text != 'Completed')
      this.list.addItem(id, '', value)

    this.storage.set(todo)
    this.list.updateCounter(this.getList('active').length)
  }

  destroyItem(id) {
    this.list.removeItem(id)
    const todo = iterate(getList(), (obj, index, list) => {
      if (obj.id == id.replace('li_', ''))
        list.splice(index, 1)
    })

    this.storage.set(todo)
    this.list.updateCounter(this.getList('active').length)
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
        this.destroyItem(id.replace('li_', ''))
      } else {
        removeClass(`#li_${id}`, 'editing')
        find(`#li_${id} label`).textContent = input.value
        input.remove()
        updateItem(id)
      }
    })
  }

  toggleCheck(id = '') {
    if (id == '') {
      let all
      if (find('.todo-list li:not(.completed)'))
        all = findAll('.todo-list li:not(.completed)')
      else
        all = findAll('.todo-list li.completed')

      iterate(all, (obj) => { this.list.toggleElement(obj.id.replace('li_', '')) })
    } else {
      this.list.toggleElement(id)
    }

    const todo = iterate(getList(), (obj, index, list) => {
      list[index]['class'] = find(`#li_${obj.id}`).className
    })

    this.storage.set(todo)
    this.list.updateCounter(this.getList('active').length)
  }

  clearCompleted() {
    this.list.removeCompleted()
    this.storage.set(getList('active'))
  }

  loadList(list) {
    this.list.load(this.getList(list), list)
    this.list.updateCounter(this.getList('active').length)
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
