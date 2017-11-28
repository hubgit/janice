// export const scholar = path => window.fetch(`https://www.semanticscholar.org/api/1/${path}`)

export const scholar = path => window.fetch(`https://api.semanticscholar.org/v1/${path}`)
  .then(res => res.json())