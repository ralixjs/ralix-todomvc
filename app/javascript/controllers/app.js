export default class AppCtrl {
  constructor() {
    this.loadList('all')
  }

  enterSubmit() {
    if (currentEvent().keyCode === 13 && currentElement().value != '') {
      let todo = getList('all')
      addItem(todo.length, '', currentElement().value)
      const obj = { id: `${todo.length}`, class: '', value: currentElement().value }
      todo.push(obj)
      setList(todo)
      currentElement().value = ''
      reloadLeft()
    }
  }

  checkTask(id){
    const li = find(`#li_${id}`)
    addClass(li, 'completed' )

    let input = find(`#li_${id} input`)

    if (input.checked)
    input.checked = false
    else
    input.checked = true

    let todo = getList('all')
    todo[li.id.replace('li_', '')]['class'] = 'completed'
    setList(todo)
    reloadLeft()
  }

  destroy(id) {
    find(`#li_${id}`).remove()
    let todo = getList('all')
    todo.forEach((obj, index) => {
      if (obj.id == id.replace('li_', ''))
      todo.splice(index, 1)
    })
    setList(todo)
    reloadLeft()
  }

  addItem(id, completed, value) {
    const checked = completed != '' ? 'checked' : ''
    insertHTML('ul', `<li id="li_${id}" class="${completed}"><div class="view"><input class="toggle" type="checkbox" onclick="checkTask('${id}')" ${checked}><label>${value}</label><button class="destroy" onclick="destroy('${id}')"></button></div></li>`, 'end')
  }

  clearCompleted() {
    insertHTML('ul', '')
    const todo = getList('active')
    setList(todo)
    todo.forEach((obj) => {
      this.addItem(obj.id, obj.class, obj.value)
    })
  }

  loadList(list) {
    removeClass('.selected', 'selected')
    insertHTML('ul', '')
    addClass(`a[onclick="loadList('${list}')"]`, 'selected')
    this.getList(list).forEach((obj) => {
      this.addItem(obj.id, obj.class, obj.value)
    })
    this.reloadLeft()
  }

  reloadLeft() {
    const left = this.getList('active').length
    if (left)
    insertHTML('.todo-count', `${left} items left`)
    else
    insertHTML('.todo-count', '')
  }

  getList(list) {
    const todo = JSON.parse(sessionStorage.getItem("todo")) || []

    if (list == 'active')    return todo.filter(li => li['class'] == '')
    if (list == 'completed') return todo.filter(li => li['class'] != '')

    return todo
  }

  setList(list) {
    sessionStorage.setItem('todo', JSON.stringify(list))
  }
}
