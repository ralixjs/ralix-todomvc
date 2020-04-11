import { RalixApp } from 'ralix'

import AppCtrl from 'controllers/app'
import * as Templates from 'templates'

const App = new RalixApp({
  routes: {
    '/.*': AppCtrl
  },
  templates: Templates
})

App.start()
