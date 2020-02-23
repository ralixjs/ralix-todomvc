export default class AppCtrl {
  constructor() {
    this.loadList('all')
  }

  enterSubmit() {
    if (currentEvent().keyCode === 13 && currentElement().value != '') {
      let todo    = getList('all')
      const id    = Date.now().toString()
      const value = currentElement().value
      const obj   = { id: `${id}`, class: '', value: value }

      todo.push(obj)
      setList(todo)
      currentElement().value = ''
      reloadLeft()

      if (find('.selected').text != 'Completed')
        addItem(id, '', value)
    }
  }

  toggleCheck(id){
    toggleClass(`#li_${id}`, 'completed')
    find(`#li_${id} input`).remove()
    insertHTML(`#li_${id} div`, checkBox(id, find(`#li_${id}`).className), 'begin')
    let todo = getList('all')

    todo.forEach((obj, index) => {
      if (obj.id == id.replace('li_', '')){
        todo[index]['class'] = find(`#li_${id}`).className
        setList(todo)
        reloadLeft()
      }
    })
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
    insertHTML('ul', `<li id="li_${id}" class="${completed}"><div class="view">${this.checkBox(id, completed)}<label>${value}</label><button class="destroy" onclick="destroy('${id}')"></button></div></li>`, 'end')
  }

  checkBox(id, completed) {
    const checked = completed != '' ? 'checked' : ''
    return `<input class="toggle" type="checkbox" onclick="toggleCheck('${id}')" ${checked}>`
  }

  clearCompleted() {
    findAll('.completed').forEach((obj) => { obj.remove() })
    setList(getList('active'))
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
      insertHTML('.todo-count', `<strong>${left} items left</strong>`)
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
