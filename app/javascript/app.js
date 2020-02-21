// Dependencies
import Rails         from '@rails/ujs'
import { RalixApp }  from 'ralix'

// Controllers
import AppCtrl       from 'controllers/app'

const App = new RalixApp({
  rails_ujs: Rails,
  routes: {
    '/.*': AppCtrl
  }
})

Rails.start()
App.start()
