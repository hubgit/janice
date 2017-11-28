import React from 'react'
import { Route } from 'react-router-dom'
import Jane from './pages/Jane'
import Author from './pages/Author'
import Paper from './pages/Paper'

const App = () => (
  <div>
    <Route path={'/'} exact component={Jane}/>
    <Route path={'/author/:id'} exact component={Author}/>
    <Route path={'/paper/:id'} exact component={Paper}/>
  </div>
)

export default App