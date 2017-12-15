import React from 'react'
import qs from 'query-string'
import styled from 'styled-components'
import { Button, CircularProgress, FormControl, InputLabel, MenuItem } from 'material-ui'
import { Select, TextField } from 'redux-form-material-ui'
// import Phrase from './Phrase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { calculateAuthorScores, calculateJournalScores, calculatePaperScores, calculatePhraseScores } from '../lib/score'
import { similar } from '../lib/fetch'
import { withRouter } from 'react-router-dom'

const Actions = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const ActionControl = styled(FormControl)`
  margin: 0 20px !important;
  width: 150px;
`

const Form = ({ handleSubmit, fetched, fetching, phrases }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name={'text'}
      // label={'Text'}
      component={TextField}
      fullWidth
      multiline
      autoFocus
      spellCheck={false}
      placeholder={'Enter an abstract…'}
      style={{whiteSpace:'pre-wrap', border: 'none'}}
    />

    <Actions>
      <Button type={'submit'} color={'primary'} disableRipple>
        {fetching ? <CircularProgress size={20} color={'inherit'}/> : 'Find Reviewers'}
      </Button>

      {fetched && (
        <ActionControl>
          <InputLabel>Published since</InputLabel>
          <Field name={'year'} component={Select}>
            <MenuItem value={0}>Any time</MenuItem>
            <MenuItem value={1}>&lt; 2 years ago</MenuItem>
            <MenuItem value={5}>&lt; 5 years ago</MenuItem>
            <MenuItem value={10}>&lt; 10 years ago</MenuItem>
          </Field>
        </ActionControl>
      )}

      {/*{!!phrases.length && (
        <ActionControl>
          <InputLabel>Phrases</InputLabel>
          <Field name={'keyPhrases'} component={Select} multiple>
            {phrases.map(item => (
              <MenuItem key={item.id} value={item.name}>
                <Phrase name={item.name} score={item.scorePercent}/>
              </MenuItem>
            ))}
          </Field>
        </ActionControl>
      )}*/}
    </Actions>
  </form>
)

export default compose(
  withRouter,
  connect(
    state => ({
      fetching: state.fetching,
      fetched: state.fetched,
      initialValues: state.query,
      phrases: state.phrases
    })
  ),
  reduxForm({
    form: 'input',
    enableReinitialize: true,
    onSubmit: async (data, dispatch, props) => {
      props.history.push('/?' + qs.stringify({ text: data.text }))

      dispatch({ type: 'SET_FETCHING', payload: true })
      dispatch({ type: 'SET_FETCHED', payload: false })

      const result = await similar({
        like: data.text,
        year: data.year,
        // keyPhrases: data.keyPhrases
      })

      const docs = calculatePaperScores(result.hits)
      dispatch({ type: 'SET_PAPERS', payload: docs })

      const authors = calculateAuthorScores(docs)
      dispatch({ type: 'SET_AUTHORS', payload: authors })

      const journals = calculateJournalScores(docs)
      dispatch({ type: 'SET_JOURNALS', payload: journals })

      const phrases = calculatePhraseScores(docs)
      dispatch({ type: 'SET_PHRASES', payload: phrases })

      dispatch({ type: 'SET_FETCHING', payload: false })
      dispatch({ type: 'SET_FETCHED', payload: true })
    }
  })
)(Form)
