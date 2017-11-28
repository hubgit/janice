import React from 'react'
import styled from 'styled-components'
import { LinearProgress } from 'material-ui'
import { Link } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
  margin-left: 10px;
`

const Score = styled(LinearProgress)`
  width: 50px;
  height: 1em !important;
  margin-right: 20px;
`

const PaperInfo = styled.div`
  flex: 1;
  display: flex;
`

const PaperLink = styled(Link)`
  display: inline-block;
`

const Separator = styled.span`
  display: inline-block;
  margin: 0 0.5em;
`

const Paper = ({ paper, score }) => (
  <Container>
    <Score mode={'determinate'} color={'primary'} value={score}/>

    <PaperInfo>
      {paper.year && <span>{paper.year}</span>}

      {paper.year && <Separator>/</Separator>}

      <PaperLink to={`/paper/${paper.id}`}>
        {paper.title}
      </PaperLink>
    </PaperInfo>
  </Container>
)

export default Paper

/*
{
  pathname: '/',
    search: qs.stringify({ id: paper.id })
}*/
