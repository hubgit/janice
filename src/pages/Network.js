import React from 'react'
import qs from 'query-string'
import Graph from '../lib/graph'
import './Network.css'

class Network extends React.Component {
  mounted = async container => {
    const { location } = this.props

    const query = qs.parse(location.search)

    const graph = new Graph(container)

    await graph.draw()

    if (query.paper) {
      graph.expand(query.paper, 'paper')
    } else if (query.author) {
      graph.expand(query.author, 'author')
    }
  }

  render () {
    return (
      <div className={'container'} ref={this.mounted} />
    )
  }
}

export default Network
