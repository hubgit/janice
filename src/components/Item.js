import React from 'react'
import styled from 'styled-components'
import Paper from './Paper'
import { Link } from 'react-router-dom'

const Title = styled.h2`
  padding: 5px;
`

const Container = styled.div`
  margin: 20px 0;
`

const Item = ({ item, to, score }) => (
  <Container>
    <Title>
      {to
        ? <Link to={to}>{item.name}</Link>
        : <span>{item.name}</span>}
    </Title>

    {item.docs.map(({ _id, _scorePercent, _source }) => (
      <Paper key={_id} paper={_source} score={_scorePercent}/>
    ))}
  </Container>
)

export default Item