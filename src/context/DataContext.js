import React, { Component } from 'react'

export const defaultState = {
  dataUrls: [],
  uploadStatus: false,
  loadStatus: false,
  canvasLoadStatus: false,
  imgRef: null,
  canvasDivRef: null,
  setData: () => {},
  setImgsLoadStatus: () => {},
  setCanvasLoadStatus: () => {}
}

const DataContext = React.createContext(defaultState)

class DataProvider extends Component {
  state = {
    dataUrls: [],
    uploadStatus: false,
    imgsLoadStatus: false,
    canvasLoadStatus: false,
    canvasDivRef: null,
    imgRef: React.createRef()
  }

  setData = ({ dataUrls, uploadStatus }) => {
    this.setState({ dataUrls })
    this.setState({ uploadStatus })
  }

  setImgsLoadStatus = ({ imgsLoadStatus }) => {
    this.setState({ imgsLoadStatus })
  }

  setCanvasLoadStatus = ({ canvasLoadStatus }) => {
    this.setState({ canvasLoadStatus })
  }

  render() {
    const { children } = this.props
    const {
      dataUrls,
      uploadStatus,
      imgsLoadStatus,
      canvasLoadStatus,
      canvasDivRef
    } = this.state

    return (
      <DataContext.Provider
        value={{
          dataUrls,
          uploadStatus,
          imgsLoadStatus,
          canvasLoadStatus,
          canvasDivRef,
          setData: this.setData,
          setImgsLoadStatus: this.setImgsLoadStatus,
          setCanvasLoadStatus: this.setCanvasLoadStatus
        }}>
        {children}
      </DataContext.Provider>
    )
  }
}

export default DataContext
export { DataProvider }
