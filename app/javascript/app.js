// Dependencies
import { RalixApp } from 'ralix'

// Controllers
import AppCtrl      from 'controllers/app'

const App = new RalixApp({
  routes: {
    '/.*': AppCtrl
  }
})

App.start()
