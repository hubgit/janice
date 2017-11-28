import { combineReducers, createStore } from 'redux'
import { reducer as formReducer } from 'redux-form'

const reducers = combineReducers({
  form: formReducer,
  section: (state = 'authors', action) => action.type === 'SET_SECTION' ? action.payload : state,
  fetching: (state = false, action) => action.type === 'SET_FETCHING' ? action.payload : state,
  fetched: (state = false, action) => action.type === 'SET_FETCHED' ? action.payload : state,
  query: (state = {}, action) => action.type === 'SET_QUERY' ? action.payload : state,
  papers: (state = [], action) => action.type === 'SET_PAPERS' ? action.payload : state,
  authors: (state = [], action) => action.type === 'SET_AUTHORS' ? action.payload : state,
  journals: (state = [], action) => action.type === 'SET_JOURNALS' ? action.payload : state,
  phrases: (state = [], action) => action.type === 'SET_PHRASES' ? action.payload : state
})

export default createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

