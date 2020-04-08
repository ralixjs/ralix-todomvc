export default class Storage {
  constructor(name = 'todos') {
    this.db = name
  }

  get() {
    return JSON.parse(localStorage.getItem(this.db)) || []
  }

  set(list) {
    localStorage.setItem(this.db, JSON.stringify(list))
  }
}
