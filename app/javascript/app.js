// Dependencies
import Rails         from '@rails/ujs'
import Turbolinks    from 'turbolinks'
import { RalixApp }  from 'ralix'

// Controllers
import AppCtrl       from 'controllers/app'

const App = new RalixApp({
  rails_ujs: Rails,
  routes: {
    '/.*':        AppCtrl
  }
})

Rails.start()
Turbolinks.start()
App.start()
