import React from 'react'
import { Column, Columns } from '../components/Columns'
import { AuthorLink, PaperLink, StyledBlock, StyledExternalLink } from '../components/Links'
import { newestFirst } from '../lib/sort'
import { scholar } from '../lib/scholar'
import { similar } from '../lib/fetch'
import Title from '../components/Title'
import { calculateAuthorScores, calculatePaperScores } from '../lib/score'
import { Link } from 'react-router-dom'

class Paper extends React.Component {
  state = {
    paper: null,
    similarPapers: null,
    similarAuthors: null
  }

  componentDidMount () {
    this.fetch(this.props.match.params.id)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetch(nextProps.match.params.id)
    }
  }

  async fetch (id) {
    this.setState({
      paper: null,
      similarPapers: null,
      similarAuthors: null,
    })

    const paper = await scholar(`paper/${id}`)

    if (this.props.match.params.id !== id) return

    this.setState({ paper })

    const result = await similar({
      like: { _id: id },
      size: 25
    })

    const similarPapers = calculatePaperScores(result.hits)
    const similarAuthors = calculateAuthorScores(similarPapers)

    // TODO: filter out similarAuthors that are in paper.authors

    if (this.props.match.params.id !== id) return

    this.setState({ similarPapers, similarAuthors })
  }

  render () {
    const { paper, similarPapers, similarAuthors } = this.state

    return (
      <div>
        {paper && (
          <Title dense>
            <StyledExternalLink href={paper.url} target={'_blank'}>
              {paper.year && <span>{paper.year} / </span>} {paper.title}
            </StyledExternalLink>

            {paper && <Link to={{
              pathname: '/',
              search: '?id=' + paper.paperId
            }}><span role={'img'} aria-label={'thinking face'}>🤔</span></Link>}
          </Title>
        )}


        <Columns>
          <Column>
            <div style={{whiteSpace: 'nowrap'}}>
              {paper && (
                <div>
                  <h2>Authors</h2>

                  {paper.authors.map(author => (
                    author.authorId
                      ? <AuthorLink key={author.authorId} id={author.authorId} name={author.name}/>
                      : <StyledBlock key={author.authorId} style={{whiteSpace:'nowrap'}}>{author.name}</StyledBlock>
                  ))}
                </div>
              )}

              {similarAuthors && !!similarAuthors.length && (
                <div>
                  <h2>Similar Authors</h2>

                  {similarAuthors.map(author => (
                    <AuthorLink key={author.id} id={author.id} name={author.name} score={author.scorePercent}/>
                  ))}
                </div>
              )}
            </div>
          </Column>

          <Column flex={1}>
            {paper && !!paper.citations.length && (
              <div>
                <h2>Cited By</h2>

                {paper.citations.sort(newestFirst).map(paper => (
                  <PaperLink key={paper.paperId} id={paper.paperId} name={paper.title} year={paper.year}/>
                ))}
              </div>
            )}

            {paper && !!paper.references.length && (
              <div>
                <h2>References</h2>

                {paper.references.sort(newestFirst).map(paper => (
                  <PaperLink key={paper.paperId} id={paper.paperId} name={paper.title} year={paper.year}/>
                ))}
              </div>
            )}
          </Column>

          <Column flex={1}>
            {similarPapers && !!similarPapers.length && (
              <div>
                <h2>Similar Papers</h2>

                {similarPapers.map(({ _source: paper, _scorePercent: score }) => (
                  <PaperLink key={paper.id} id={paper.id} name={paper.title} year={paper.year} score={score}/>
                ))}
              </div>
            )}
          </Column>
        </Columns>
      </div>
    )
  }
}

export default Paper