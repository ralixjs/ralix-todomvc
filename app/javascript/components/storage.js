export default class Storage {
  constructor(name = 'todos') {
    this.db = name
  }

  get() {
    return JSON.parse(sessionStorage.getItem(this.db)) || []
  }

  set(list) {
    sessionStorage.setItem(this.db, JSON.stringify(list))
  }
}
