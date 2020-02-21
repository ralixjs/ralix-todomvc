export default class AppCtrl {
  constructor(){
    const todo = JSON.parse(sessionStorage.getItem("todo")) || []
    todo.forEach((value) => {
      insertHTML('ul', `<li><div class="view"><input class="toggle" type="checkbox"><label>${value}</label><button class="destroy"></button></div></li>`, 'end')
    })
  }

  enterSubmit(){
    if (currentEvent().keyCode === 13){
      insertHTML('ul', `<li><div class="view"><input class="toggle" type="checkbox"><label>${currentElement().value}</label><button class="destroy"></button></div></li>`, 'end')
      let todo = JSON.parse(sessionStorage.getItem("todo")) || []
      todo.push(currentElement().value)
      sessionStorage.setItem('todo', JSON.stringify(todo))
      currentElement().value = ''
    }
  }
}
