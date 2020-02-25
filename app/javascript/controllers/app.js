export default class AppCtrl {
  constructor() {
    this.loadList('all')

    window.addEventListener('click', function(e) {
      const edit = find('input.edit')
      if (edit && !edit.contains(e.target)) {
        const id    = edit.parentElement.id
        const value = edit.value
        let todo    = getList('all')
        removeClass(`#${id}`, 'editing')
    		edit.remove()

        if (value == '') {
          destroy(id.replace('li_', ''))
        } else {
          todo.forEach((obj, index) => {
            if (obj.id == id.replace('li_', '')) {
              todo[index]['value'] = value
              find(`#${id} label`).textContent = value
              setList(todo)
              reloadLeft()
            }
          })
        }
      }
    })
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

  toggleCheckAll() {
    let all

    if (find('.todo-list li:not(.completed)'))
      all = findAll('.todo-list li:not(.completed)')
    else
      all = findAll('.todo-list li.completed')

    all.forEach((item, i) => {
      toggleClass(`#${item.id}`, 'completed')
      find(`#${item.id} input`).remove()
      insertHTML(`#${item.id} div`, checkBox(item.id, find(`#${item.id}`).className), 'begin')
    })

    let todo = getList('all')
    todo.forEach((obj, index) => {
      todo[index]['class'] = find('.todo-list li:not(.completed)') ? '' : 'completed'
    })
    setList(todo)
    reloadLeft()
  }

  toggleCheck(id) {
    toggleClass(`#li_${id}`, 'completed')
    find(`#li_${id} input`).remove()
    insertHTML(`#li_${id} div`, checkBox(id, find(`#li_${id}`).className), 'begin')
    let todo = getList('all')

    todo.forEach((obj, index) => {
      if (obj.id == id.replace('li_', '')) {
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

  editItem(id) {
    const value = find(`#li_${id} label`).textContent
    const input = document.createElement('input');

    addClass(`#li_${id}`, 'editing')
		input.className = 'edit'
    input.value = value
    find(`#li_${id}`).appendChild(input)
		input.focus();
  }

  addItem(id, completed, value) {
    insertHTML('ul', `<li id="li_${id}" class="${completed}"><div class="view">${this.checkBox(id, completed)}<label ondblclick=editItem('${id}')>${value}</label><button class="destroy" onclick="destroy('${id}')"></button></div></li>`, 'end')
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
