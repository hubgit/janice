import { scholar } from './scholar'

const recent = paper => paper.year > 2014

class Graph {
  linkDistance = 200
  charge = -100
  friction = 0.9
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
      .force('charge', this.d3.forceManyBody()
        .strength(d => d.strength || this.charge))
      .force('collision', this.d3.forceCollide(60))
      .force('center', this.d3.forceCenter(offsetWidth / 2, offsetHeight / 2))
      .velocityDecay(this.friction)
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
        .distance(d => d.distance || this.linkDistance)
        .strength(d => d.strength || 0.5)
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

    switch (d.type) {
      case 'paper':
      default:
        this.expand(d.paperId, 'paper')
        break

      case 'author':
        this.expand(d.authorId, 'author')
        break
    }
  }

  addNode = (item, type, id) => {
    id = `${type}-${id}`

    if (!this.index[id]) {
      this.index[id] = { ...item, id, type, inDegree: 0 }
      this.nodes.push(this.index[id])
    }

    return this.index[id]
  }

  addLink = ({ source, target, modifier }) => {
    target.inDegree += modifier

    this.links.push({ source, target })
  }

  expand = async (id, type) => {
    this.simulation.stop()

    switch (type) {
      case 'paper':
      default:
        const paper = await scholar(`paper/${id}`)
        const node = this.addNode(paper, 'paper', paper.paperId)

        paper.citations.filter(recent).forEach(item => {
          this.addLink({
            source: this.addNode(item, 'paper', item.paperId),
            target: node,
            modifier: 0
          })
        })

        paper.references.filter(recent).forEach(item => {
          this.addLink({
            source: node,
            target: this.addNode(item, 'paper', item.paperId),
            modifier: 1
          })
        })

        paper.authors.forEach(item => {
          this.addLink({
            source: node,
            target: this.addNode(item, 'author', item.authorId),
            modifier: 1
          })
        })
        break

      case 'author':
        const author = await scholar(`author/${id}`)
        const authorNode = this.addNode(author, 'author', author.authorId)

        if (!author.papers) return

        await Promise.all(author.papers.slice(0, 25).map(async item => {
          const paper = await scholar(`paper/${item.paperId}`)

          if (paper.year <= 2014) return

          const paperNode = this.addNode(paper, 'paper', paper.paperId)

          this.addLink({
            source: paperNode,
            target: authorNode,
            modifier: 0
          })

          paper.authors.forEach(item => {
            this.addLink({
              source: authorNode,
              target: this.addNode(item, 'author', item.authorId),
              modifier: 5
            })
          })
        }))
        break;
    }

    this.run()
  }
}

export default Graph
