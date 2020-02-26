export default class AppCtrl {
  constructor() {
    this.loadList('all')

    window.addEventListener('keyup', function(e) {
      if (e.keyCode !== 13) return

      if ((find('.new-todo') == e.target) || (find('.edit') == e.target)) {
        const edit = find('input.edit')
        let id     = edit ? edit.parentElement.id : ''

        if (e.target.value == '') {
          if (edit == e.target) destroy(id.replace('li_', ''))
        } else {
          let todo = getList('all')

          if (edit == e.target) {
            const value = edit.value
            removeClass(`#${id}`, 'editing')
            edit.remove()
            todo.forEach((obj, index) => {
              if (obj.id == id.replace('li_', '')) {
                todo[index]['value'] = value
                find(`#${id} label`).textContent = value
              }
           })
          } else {
            id = Date.now().toString()
            const value = e.target.value
            todo.push({ id: `${id}`, class: '', value: value })
            e.target.value = ''
            if (find('.selected').text != 'Completed') addItem(id, '', value)
          }

          setList(todo)
          reloadLeft()
        }
      }
    })

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
