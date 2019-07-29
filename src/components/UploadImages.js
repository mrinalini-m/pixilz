import React, { Component, Fragment } from 'react'
import DataContext from '../context/DataContext'
import { withRouter } from 'react-router'
import Form from '../common/Form'
import sortFiles from '../utils/sortFiles'
class Main extends Component {
  static contextType = DataContext

  state = { dataUrls: [], uploadStatus: false, checked: true }

  readFile = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = evt => {
        resolve(evt.target.result)
      }
      reader.onerror = err => {
        console.error('Failed to read', file.name, 'due to', err)
        reject(err)
      }
      reader.readAsDataURL(file)
    })
  }

  readMultipleFiles = async files => {
    const filesArr = Array.from(files)
    const filesToProcess = this.state.checked ? sortFiles(filesArr) : filesArr
    const promises = filesToProcess.map(async file => {
      const data = await this.readFile(file)
      return data
    })
    return Promise.all(promises).then(results => {
      return results
    })
  }

  uploadFiles = (e, history) => {
    const dataContext = this.context
    this.readMultipleFiles(e.target.files)
      .then(results => {
        this.setState(prevState => ({
          dataUrls: results,
          uploadStatus: !prevState.uploadStatus
        }))
        dataContext.setContextState({
          dataUrls: this.state.dataUrls,
          uploadStatus: this.state.uploadStatus
        })
        history.push('/options')
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }
  handleCheckboxChange = checked => {
    this.setState({ checked })
  }
  render() {
    const { history } = this.props
    return (
      <Fragment>
        <Form handleCheckboxChange={this.handleCheckboxChange} />
        <input
          id='upload-images'
          type='file'
          multiple='multiple'
          onChange={e => {
            this.uploadFiles(e, history)
          }}
        />
      </Fragment>
    )
  }
}

export default withRouter(Main)
