import React from 'react'
import styled from 'styled-components'
import { LinearProgress } from 'material-ui'

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  
  :hover {
    color: #3f51b5;
  }
`

const Score = styled(LinearProgress)`
  width: 20px;
  height: 1em !important;
  margin-right: 5px;
`

const Phrase = ({ name, score }) => (
  <Container>
    <Score mode={'determinate'} color={'primary'} value={score}/>
    {name}
  </Container>
)

export default Phrase