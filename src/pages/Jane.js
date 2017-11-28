import React from 'react'
import qs from 'query-string'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Form from '../components/Form'
import Results from '../components/Results'
import { getPaper } from '../lib/fetch'

const Container = styled.div`
  max-width: 60rem;
  margin: 40px auto;
`

class Jane extends React.Component {
  componentDidMount () {
    const { location } = this.props

    this.prepare(location)
  }

  componentWillReceiveProps (nextProps) {
    const { location } = nextProps

    if (location !== this.props.location) {
      this.prepare(location)
    }
  }

  async prepare (location) {
    const query = qs.parse(location.search)

    if (query.id) {
      const { _source: { title, paperAbstract } } = await getPaper(query.id)
      query.text = title + '\n\n' + paperAbstract
    }

    this.props.dispatch({ type: 'SET_FETCHED', payload: false })

    this.props.dispatch({ type: 'SET_QUERY', payload: {
      id: query.id,
      text: query.text,
      year: Number(query.year || 0),
      keyPhrases: []
    }})
  }

  render () {
    const { fetched } = this.props

    return (
      <Container>
        <Form/>
        {fetched && <Results/>}
      </Container>
    )
  }
}

export default compose(
  connect(state => ({
    fetched: state.fetched
  }))
)(Jane)
