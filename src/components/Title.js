import styled from 'styled-components'

export default styled.h1`
  padding: ${props => props.dense ? '0.5rem' : '1rem'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.1;
  letter-spacing: -1px;
`