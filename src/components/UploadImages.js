import React, { useContext, useEffect, useState } from 'react'
import { useHistory, withRouter } from 'react-router-dom'
import DataContext from '../context/DataContext'
import UploadForm from '../smallComponents/UploadForm'
import { filterAndConvertToArr, sortFiles } from '../utils/'

const UploadImages = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(DataContext)
  const { sort, uploadFolder } = state
  const [dataUrls, setDataUrls] = useState([])
  const [imgsUploaded, setImgsUploaded] = useState(false)

  useEffect(() => {
    if (!state.dataUrls.length) {
      dispatch({ type: 'SET_DATA_URLS', payload: dataUrls })
    }
    if (!state.imgsUploaded) {
      dispatch({ type: 'UPDATE_UPLOAD_STATUS', payload: imgsUploaded })
    }
  }, [dataUrls, state.dataUrls, state.imgsUploaded, imgsUploaded, dispatch])

  const readFile = file => {
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

  const readMultipleFiles = async files => {
    const filesArr = uploadFolder
      ? filterAndConvertToArr(files)
      : Array.from(files)
    const filesToProcess = sort ? sortFiles(filesArr) : filesArr
    const promises = filesToProcess.map(async file => {
      const data = await readFile(file)
      return data
    })
    return Promise.all(promises).then(results => {
      return results
    })
  }

  const uploadFiles = (e, history) => {
    const { name, webkitRelativePath } = e.target.files[0]
    if (uploadFolder)
      dispatch({
        type: 'UPDATE_FOLDER_NAME',
        payload: webkitRelativePath.slice(
          0,
          webkitRelativePath.indexOf(name) - 1
        )
      })
    readMultipleFiles(e.target.files)
      .then(results => {
        setDataUrls(results)
        setImgsUploaded(true)

        history.push('/options')
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }

  return (
    <UploadForm
      uploadFiles={e => {
        uploadFiles(e, history)
      }}
    />
  )
}

export default withRouter(UploadImages)
