import { scholar } from './scholar'
import { similar } from './fetch'
import { calculateAuthorScores, calculatePaperScores } from './score'

// const recent = paper => paper.year > 2014

class Graph {
  index = {}
  nodes = []
  links = []

  constructor (container) {
    this.container = container
  }

  renderLabels = () =>  {
    this.labels
      .style('transform', d => `translate3d(${d.x}px, ${d.y}px, 0px)`)
      .style('font-size', d => (100 + (d.inDegree * 2)) + '%')
      .attr('data-type', d => d.type)
      .attr('data-expanded', d => d.expanded ? 'true' : 'false')
      .attr('data-selected', d => d.selected ? 'true' : 'false')
      .attr('data-type', d => d.type)
  }

  tick = () => {
    window.requestAnimationFrame(this.renderLabels)

    if (this.simulation.alpha() > 0.0001) {
      window.requestAnimationFrame(() => {
        this.simulation.tick()
        this.tick()
      })
    }
  }

  zoom = () => {
    const transform = this.d3.event.transform

    this.labelsContainer.style('transform', `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`)
  }

  draw = async () => {
    const { offsetWidth, offsetHeight } = this.container

    this.d3 = await import(/* webpackChunkName: "d3" */ 'd3')

    this.simulation = this.d3.forceSimulation()
      .force('charge', this.d3.forceManyBody().strength(-0.1))
      .force('collision', this.d3.forceCollide().radius(100).strength(0.1))
      .force('center', this.d3.forceCenter(offsetWidth / 2, offsetHeight / 2))
      .velocityDecay(0.9)
      .stop()

    const frame = this.d3.select(this.container)

    this.labelsContainer = frame
      .append('div')
      .attr('class', 'labels')

    frame.call(this.d3.zoom().on('zoom', this.zoom));

    this.run()
  }

  run = () => {
    this.labelsContainer
      .selectAll('.label')
      .data(this.nodes, d => d.id)
      .enter()
      .append(d => {
        const node = document.createElement('span')
        node.setAttribute('class', 'label')

        const span = document.createElement('span')
        span.textContent = (d.year ? (d.year + ' / ') : '') + (d.title || d.name)
        node.appendChild(span)

        return node
      })
      .on('click', this.click)

    this.labels = this.labelsContainer
      .selectAll('.label')

    this.simulation
      .nodes(this.nodes)
      .force('link', this.d3.forceLink(this.links)
        .distance(d => d.distance)
        .strength(d => d.strength)
        .iterations(5)
      )
      .alpha(1)
      .restart()

    this.tick()
  }

  click = d => {
    if (this.d3.event && this.d3.event.defaultPrevented) return // ignore drag

    if (d.selected) return

    d.selected = true

    this.labels.attr('data-selected', d => d.selected ? 'true' : 'false')

    console.log(d)

    switch (d.type) {
      case 'paper':
      default:
        this.expand(d._id, 'paper')
        break

      case 'author':
        this.expand(d._id, 'author')
        break
    }
  }

  addNode = (item, type, id) => {
    id = `${type}-${id}`

    if (!this.index[id]) {
      this.index[id] = { ...item, _id: item.id, id, type, inDegree: 0 }
      this.nodes.push(this.index[id])
    }

    return this.index[id]
  }

  addLink = ({ source, target, modifier, distance, strength }) => {
    target.inDegree += modifier

    this.links.push({ source, target, distance, strength })
  }

  expand = async (id, type) => {
    this.simulation.stop()

    switch (type) {
      case 'paper':
      default:
        const paper = await scholar(`paper/${id}`)
        paper.selected = true
        const node = this.addNode(paper, 'paper', paper.paperId)

        const result = await similar({
          like: { _id: id },
          size: 100,
          year: 0
        })

        const papers = calculatePaperScores(result.hits)
        const authors = calculateAuthorScores(papers)

        authors.slice(0, 20).forEach(author => {
          // author.name += ` (${Math.round(author.scorePercent)})`
          // author.name += ` (${author.docs.length})`
          const authorNode = this.addNode(author, 'author', author.id)

          this.addLink({
            source: node,
            target: authorNode,
            modifier: author.docs.length * 10,
            distance: (100 - author.scorePercent) * 2,
            strength: 1
          })

          // author.docs.forEach(paper => {
          //   const paperNode = this.addNode(paper._source, 'paper', paper._source.id)
          //
          //   this.addLink({
          //     source: paperNode,
          //     target: authorNode,
          //     modifier: 10,
          //     distance: 100,
          //     strength: 0.1
          //   })
          // })
        })

        break

      case 'author':
        return;
    }

    this.run()
  }
}

export default Graph
