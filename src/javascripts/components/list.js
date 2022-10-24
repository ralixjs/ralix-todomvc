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
    find(`#item_${id}`).remove()
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
    toggleClass(`#item_${id}`, 'completed')
    find(`#item_${id} input`).remove()
    insertHTML(
      `#item_${id} div`,
      render('checkBox', { id: id, completed: find(`#item_${id}`).className }),
      'begin'
    )
  }
}
