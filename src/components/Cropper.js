import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CropperJS from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import styles from './Cropper.sass'
import Slider from 'material-ui/Slider'
import IconButton from 'material-ui/IconButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import Reset from 'material-ui/svg-icons/action/restore'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FileDownload from 'material-ui/svg-icons/file/file-download'
import FileEdit from 'material-ui/svg-icons/editor/mode-edit'

class Cropper extends Component {
  state = {
    zoom: 1,
    originalImage: null,
    scaledRatio: null,
    editing: false
  }

  static defaultProps = {
    height: 400, // canvas height
    width: 400, // canvas width,
    onCrop: (dataURL) => dataURL // default callback
  }

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    predefinedImage: PropTypes.string,
    onCrop: PropTypes.func
  }

  cropper = null // global object to be used in helper methods

  initCropper = (options) => {
    if (this.cropper) this.cropper.destroy()
    const image = ReactDOM.findDOMNode(this.refs.imageContainer)
    this.cropper = new CropperJS(image, {
      aspectRatio: 1,
      zoomOnWheel: false,
      zoomOnTouch: false,
      rotatable: false,
      cropBoxResizable: false,
      cropBoxMovable: false,
      minCropBoxWidth: this.props.width,
      dragMode: 'none',
      toggleDragModeOnDblclick: false,
      guides: false,
      viewMode: 3, // zoom image to fill canvas
      ...options
    })
  }

  prepareImage = (dataURL) => new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const {
        scaledRatio
      } = this.fitImageToCanvas(img.width, img.height)
      resolve({
        scaledRatio,
        dataURL
      })
    }
    img.src = dataURL
  })

  fitImageToCanvas (width, height) {
    let scaledHeight, scaledWidth, scaledRatio

    const canvasAspectRatio = this.props.width / this.props.height
    const imageAspectRatio = width / height

    if (canvasAspectRatio > imageAspectRatio) {
      scaledHeight = this.props.height
      scaledRatio = scaledHeight / height
      scaledWidth = width * scaledRatio
    } else {
      scaledWidth = this.props.width
      scaledRatio = scaledWidth / width
      scaledHeight = height * scaledRatio
    }

    return {
      naturalWidth: width,
      naturalHeight: height,
      scaledWidth,
      scaledHeight,
      scaledRatio,
      imageAspectRatio,
      canvasAspectRatio
    }
  }

  onFileSelected = (e) => {
    if (this.cropper) this.cropper.destroy()

    const file = e.target && e.target.files[0]
    if (!file) return

    const p = new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = ({ target: { result: dataURL } }) => {
        resolve(dataURL)
      }
      reader.readAsDataURL(file)
    })
    p.then((dataURL) => {
      return this.prepareImage(dataURL)
    }).then(({
      scaledRatio,
      dataURL
    }) => {
      this.setState({
        originalImage: dataURL,
        editing: true,
        scaledRatio,
        zoom: 1
      })
      this.initCropper({ dragMode: 'move' })
    }).catch((error) => log.debug('onFileSelected failed', error))
  }

  zoomControl = (event, newValue) => {
    if (this.cropper) {
      this.cropper.zoomTo(newValue * this.state.scaledRatio)
      const p = new Promise((resolve) => {
        const image = ReactDOM.findDOMNode(this.refs.imageContainer)
        image.addEventListener('zoom', resolve)
      })
      p.then(() => {
        this.setState((prevState, props) => ({
          zoom: newValue
        }))
      }).catch((error) => log.debug('zoomControl', error))
    }
  }

  onCropImage = () => {
    const imageDataUrl = this.cropper.getCroppedCanvas().toDataURL()
    this.prepareImage(imageDataUrl)
      .then(({
        scaledRatio,
        dataURL
      }) => {
        this.props.onCrop(imageDataUrl)
        this.setState({
          originalImage: dataURL,
          editing: false,
          scaledRatio,
          zoom: 1
        })
        this.initCropper()
      })
      .catch((error) => log.debug('onCropImage failed', error))
  }

  onEdit = () => {
    this.setState({
      editing: true
    })
    this.cropper.setDragMode('move')
  }

  onCancel = () => {
    this.setState({
      zoom: 1
    })
    this.cropper.reset()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.predefinedImage !== nextProps.predefinedImage) {
      if (this.cropper) {
        this.cropper.destroy()
      }
      this.setState({
        editing: false,
        zoom: 1,
        scaledRatio: null,
        originalImage: nextProps.predefinedImage
      })
    }
  }

  componentDidMount () {
    if (this.props.predefinedImage) {
      this.prepareImage(this.props.predefinedImage)
        .then(({
          scaledRatio,
          dataURL
        }) => {
          this.setState({
            originalImage: dataURL,
            scaledRatio
          })
          this.initCropper()
        })
        .catch((error) => log.debug('prepareImage failed', error))
    }
  }

  componentWillUnmount () {
    if (this.cropper) {
      this.cropper.destroy()
    }
  }

  render () {
    const {
      state: {
        zoom,
        originalImage,
        editing
      },
      props: {
        height,
        width
      },
      onFileSelected,
      zoomControl,
      onCropImage,
      onCancel,
      onEdit
    } = this
    return (
      <div
        style={{width: `${width}px`}}
        >
        <div
          className={styles.bgContainer}
          style={{
            height: `${height}px`,
            width: `${width}px`
          }}
        >
          <img
            src={originalImage}
            ref={'imageContainer'}
          />
        </div>
        { editing &&
        <Slider
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={zoomControl}
          disabled={!originalImage}
          className={styles.zoomControl}
          sliderStyle={{ marginTop: 0, marginBottom: 0 }}
        />
        }
        <div
          className={styles.actions}
          >
          <IconButton tooltip={'Select new image file'}>
            <input
              ref='in'
              type='file'
              accept='image/*'
              onChange={onFileSelected}
              value={''}
              className={styles.fileField}
            />
            <FileUpload />
          </IconButton>
          { editing &&
          <IconButton tooltip={'Crop image'} onClick={onCropImage}>
            <ActionDone />
          </IconButton>
          }
          { editing &&
          <IconButton tooltip={'Reset zoom and center'} onClick={onCancel}>
            <Reset />
          </IconButton>
          }
          {
            !editing && originalImage &&
            <IconButton tooltip={'Edit image'} onClick={onEdit}><FileEdit /></IconButton>
          }
          {
            !editing && originalImage &&
            <a href={originalImage} target='_blank'>
              <IconButton tooltip={'Open image in new window'}><FileDownload /></IconButton>
            </a>
          }
        </div>
      </div>
    )
  }
}

export default Cropper
