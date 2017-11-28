import styled from 'styled-components'

export const Columns = styled.div`
  display: flex;
`

export const Column = styled.div`
  flex: ${props => props.flex || 0};
  padding: 1rem;
`