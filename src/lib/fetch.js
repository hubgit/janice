import qs from 'query-string'
import { DateTime } from 'luxon'

const server = 'https://citable.today/janice/'

export const getPaper = id => {
  const url = server + 'paper/?' + qs.stringify({ id })

  return window.fetch(url).then(res => res.json())
}

export const search = (body, params) => {
  const url = server + 'search/?' + qs.stringify(params)

  return window.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())
}

export const similar = ({ like, keyPhrases, year, size = 100 }) => {
  const query = {
    bool: {
      must: [],
      should: [],
      filter: [],
    }
  }

  query.bool.must.push({
    more_like_this: {
      fields: [
        'title',
        'paperAbstract'
      ],
      like,
      min_term_freq: 1,
      analyzer: 'stop',
      // boost_terms: 5,
      max_query_terms: 7
    }
  })

  if (keyPhrases && keyPhrases.length) {
    query.bool.filter.push({
      terms: {
        'keyPhrases.keyword': keyPhrases
      }
    })
  }

  if (year) {
    query.bool.filter.push({
      range: {
        year: {
          gte: DateTime.local().minus({ years: year }).get('year')
        }
      }
    })
  }

  const _source = [
    'id',
    'title',
    'authors',
    'year',
    'venue',
    'journalName',
    'keyPhrases'
  ]

  // const explain = true

  return search({ query, _source }, { size })
}

export const authored = id => {
  const query = {
    term: {
      'authors.ids': id
    }
  }

  return search({ query }, { size: 1000 })
}
