export const todoItem = ({ id, completed, value}) => `
  <li id="li_${id}" class="${completed}">
    <div class="view">
      ${render('checkBox', { id: id, completed: completed })}
      <label ondblclick=editItem('${id}')>${value}</label>
      <button class="destroy" onclick="destroyItem('${id}')"></button>
    </div>
  </li>
`

export const checkBox = ({ id, completed }) => `
  <input class="toggle" type="checkbox" onclick="toggleCheck('${id}')" ${completed != '' ? 'checked' : ''}>
`
