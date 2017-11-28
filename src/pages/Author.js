import React from 'react'
import { Column, Columns } from '../components/Columns'
import { AuthorLink, PaperLink, StyledExternalLink } from '../components/Links'
import Title from '../components/Title'
import { authored } from '../lib/fetch'
import { scholar } from '../lib/scholar'
import { newestFirst } from '../lib/sort'
import { calculateAuthorScores, calculatePaperScores } from '../lib/score'

class Author extends React.Component {
  state = {
    author: null,
    papers: null,
    coAuthors: null
  }

  componentDidMount () {
    const { match } = this.props

    this.fetch(match.params.id)
  }

  componentWillReceiveProps (nextProps) {
    const { match } = nextProps

    if (match.params.id !== this.props.match.params.id) {
      this.fetch(match.params.id)
    }
  }

  async fetch (id) {
    this.setState({
      author: null,
      papers: null,
      coAuthors: null
    })

    const author = await scholar(`author/${id}`)

    if (this.props.match.params.id !== id) return

    this.setState({ author })

    const result = await authored(id)

    const papers = calculatePaperScores(result.hits)

    if (this.props.match.params.id !== id) return

    const coAuthors = calculateAuthorScores(papers)

    this.setState({ papers, coAuthors })
  }

  render () {
    const { author, papers, coAuthors } = this.state

    return (
      <div>
        <Title dense>
          {author && (
            <StyledExternalLink href={author.url} target={'_blank'}>
              {author.name}
            </StyledExternalLink>
          )}
        </Title>

        <Columns>
          <Column style={{whiteSpace:'nowrap'}}>
            <h2>Co-authors</h2>

            {coAuthors ? coAuthors.map(author => (
              <AuthorLink key={author.id} id={author.id} name={author.name} score={author.scorePercent}/>
            )) : '…'}
          </Column>

          <Column flex={1}>
            <h2>Papers</h2>

            {papers ? papers.map(item => item._source).sort(newestFirst).map(paper => (
              <PaperLink key={paper.id} id={paper.id} name={paper.title} year={paper.year}/>
            )) : '…'}
          </Column>
        </Columns>
      </div>
    )
  }
}

export default Author