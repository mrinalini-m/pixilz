import React, { Component } from 'react'
import test01 from '../images/test01.jpg'
import test02 from '../images/test02.jpg'

export default class Canvas extends Component {
  canvasRefs = {}
  divRef = React.createRef()
  state = { canvases: [] }

  createCanvas = () => {
    const images = [...this.divRef.current.children]
    const canvases = images.map((img, i) => {
      return (
        <canvas
          key={i}
          width={img.width}
          height={img.height}
          className='canvas'
          ref={ref => {
            this.canvasRefs[`canvas${i}`] = ref
          }}
        />
      )
    })
    this.setState({ canvases })
  }

  componentDidMount() {
    this.createCanvas()
  }

  componentDidUpdate() {
    const images = [...this.divRef.current.children]
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      img.onload = () => {
        this.drawCanvas(img, i)
      }
    }
  }

  drawCanvas = (img, i) => {
    const canvas = this.canvasRefs[`canvas${i}`]
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }

  render() {
    return (
      <div>
        <div className='canvas-wrapper'>{this.state.canvases}</div>
        <div className='images' ref={this.divRef} style={{ display: 'none' }}>
          <img id='test1' src={test01} alt='test01' />
          <img id='test2' src={test02} alt='test02' />
        </div>
      </div>
    )
  }
}
