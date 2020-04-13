export default class List {
  load(list, name) {
    removeClass('.selected', 'selected')
    insertHTML('ul', '')
    addClass(`a[onclick="loadList('${name}')"]`, 'selected')

    list.forEach((obj) => {
      this.addItem(obj.id, obj.class, obj.value)
    })
  }

  addItem(id, completed, value) {
    insertHTML(
      'ul',
      render('todoItem', { id: id, completed: completed, value: value }),
      'end'
    )
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

  toggleElement(id) {
    toggleClass(`#li_${id}`, 'completed')
    find(`#li_${id} input`).remove()
    insertHTML(
      `#li_${id} div`,
      render('checkBox', { id: id, completed: find(`#li_${id}`).className }),
      'begin'
    )
  }
}
