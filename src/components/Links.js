import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { LinearProgress } from 'material-ui'

export const StyledExternalLink = styled.a`
  display: block;
  padding: 0.5rem;
`

export const StyledBlock = styled.div`
  padding: 0.5rem;
`

const FlexLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
`

const Score = styled(LinearProgress)`
  display: inline-block;
  width: 20px;
  height: 1em !important;
  margin-right: 10px;
`

export const AuthorLink = ({ id, name, score }) => (
  <FlexLink to={`/author/${id}`}>
    {score && <Score mode={'determinate'} color={'primary'} value={score}/>}
    {name}
  </FlexLink>
)

export const PaperLink = ({ id, name, year, score }) => (
  <FlexLink to={`/paper/${id}`}>
    {/*{score && <Score mode={'determinate'} color={'primary'} value={score}/>}*/}

    <span style={{flex:1}}>
      {year && <span>{year} / </span>} {name}
    </span>
  </FlexLink>
)