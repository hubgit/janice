import React from 'react'
import styled from 'styled-components'
import { Tab, Tabs } from 'material-ui'
import Paper from './Paper'
import Item from './Item'
import { compose } from 'redux'
import { connect } from 'react-redux'

const Container = styled.div`
  margin-top: 20px;
`

const Results = ({ section, setSection, authors, papers, journals, phrases }) => (
  <Container>
    <Tabs
      value={section}
      onChange={(event, value) => setSection(value)}
      indicatorColor={'primary'}
      textColor={'primary'}
      centered
     >
      <Tab label={'Similar Papers'} value={'papers'} disableRipple/>
      <Tab label={'Suggested Reviewers'} value={'authors'} disableRipple/>
      <Tab label={'Suggested Journals'} value={'journals'} disableRipple/>
      <Tab label={'Key Phrases'} value={'phrases'} disableRipple/>
    </Tabs>

    <div style={{marginTop: 40}}>
      {section === 'papers' && papers.map(item => (
        <Paper key={item._id} paper={item._source} score={item._scorePercent}/>
      ))}

      {section === 'authors' && authors.map(item => (
        <Item key={item.id} item={item} to={`/author/${item.id}`}/>
      ))}

      {section === 'journals' && journals.map(item => (
        <Item key={item.id} item={item}/>
      ))}

      {section === 'phrases' && phrases.map(item => (
        <Item key={item.id} item={item}/>
      ))}
    </div>
  </Container>
)

export default compose(
  connect(
    state => ({
      fetched: state.fetched,
      section: state.section,
      papers: state.papers,
      authors: state.authors,
      journals: state.journals,
      phrases: state.phrases,
    }),
    dispatch => ({
      setSection: payload => dispatch({ type: 'SET_SECTION', payload})
    })
  )
)(Results)