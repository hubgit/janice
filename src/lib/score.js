const highestScoreFirst = (a, b) => b.scorePercent - a.scorePercent

const normalizeScore = docs => {
  const maxScore = docs.reduce((output, item) => output + item._score, 0)

  return item => {
    item.scorePercent = (item.score / maxScore) * 100
  }
}

const normalizeDocScore = maxScore => doc => {
  doc._scorePercent = (doc._score / maxScore) * 100
}

export const calculatePaperScores = hits => {
  const docs = hits.hits

  docs.forEach(normalizeDocScore(hits.max_score))

  return docs
}

export const calculateAuthorScores = docs => {
  const items = docs.reduce((output, doc) => {
    const { _score, _source: paper } = doc

    paper.authors.forEach(author => {
      const { ids, name } = author

      const id = ids[0]

      if (!id) return

      if (!output[id]) {
        output[id] = {
          id,
          name,
          score: 0,
          docs: []
        }
      }

      // some papers have duplicate authors :(
      if (output[id].docs.some(doc => doc._source.id === paper.id)) return

      output[id].score += _score
      output[id].docs.push(doc)
    })

    return output
  }, {})

  const authors = Object.values(items)
  authors.forEach(normalizeScore(docs))
  authors.sort(highestScoreFirst)

  return authors
}

export const calculateJournalScores = docs => {
  const items = docs.reduce((output, doc) => {
    const { _score, _source: paper } = doc

    const id = paper.journalName || paper.venue

    if (id) {
      if (!output[id]) {
        output[id] = {
          id,
          name: id,
          score: 0,
          docs: []
        }
      }

      output[id].score += _score
      output[id].docs.push(doc)
    }

    return output
  }, {})

  const journals = Object.values(items)
  journals.forEach(normalizeScore(docs))
  journals.sort(highestScoreFirst)

  return journals
}

export const calculatePhraseScores = docs => {
  const items = docs.reduce((output, doc) => {
    const { _score, _source: paper } = doc

    paper.keyPhrases.forEach(phrase => {
      const id = phrase

      if (!id) return

      if (!output[id]) {
        output[id] = {
          id,
          name: phrase,
          score: 0,
          docs: []
        }
      }

      output[id].score += _score
      output[id].docs.push(doc)
    })

    return output
  }, {})

  const phrases = Object.values(items)
  phrases.forEach(normalizeScore(docs))
  phrases.sort(highestScoreFirst)

  return phrases
}