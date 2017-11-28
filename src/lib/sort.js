export const alphabetical = (a, b) => a.title === b.title ? 0 : (a.title > b.title ? 1 : -1)

export const newestFirst = (a, b) => a.year === b.year ? alphabetical(a, b) : b.year - a.year
