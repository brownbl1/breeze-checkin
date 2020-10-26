type Stringable = {
  toString(): string
}

export const mapData = (a: Stringable[], index?: number) =>
  a.map((n, i) => {
    const name = n.toString()
    if (index === i) return { name, selected: true }
    return { name, selected: false }
  })
