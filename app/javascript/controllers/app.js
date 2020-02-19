export default class AppCtrl {
  constructor(){}

  enterSubmit(){
    if (currentEvent().keyCode === 13){
      insertHTML('ul', `<li>${currentElement().value}</li>`, 'end')
      currentElement().value = ''
    }
  }
}
