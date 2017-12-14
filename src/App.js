import React from 'react'
import { Route } from 'react-router-dom'
import Jane from './pages/Jane'
import Author from './pages/Author'
import Paper from './pages/Paper'
import Network from './pages/Network'

const App = () => (
  <div>
    <Route path={'/'} exact component={Jane}/>
    <Route path={'/author/:id'} exact component={Author}/>
    <Route path={'/paper/:id'} exact component={Paper}/>
    <Route path={'/network/'} exact component={Network}/>
  </div>
)

export default App
