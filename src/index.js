import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider as StoreProvider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui'
import './index.css'
import App from './App'
import theme from './theme'
import store from './store'

ReactDOM.render(
  <StoreProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </MuiThemeProvider>
  </StoreProvider>,
  document.getElementById('root')
)
