import React, { Component } from 'react'
import { Card, CardHeader } from 'material-ui/Card'
// import Cropper from '../../lib/react-image-cropper'
import Cropper from 'react-image-cropper'
import 'cropperjs/dist/cropper.css'

class Home extends Component {
  state = {
    predefinedImage: null
  }
  onCrop = (dataUrl) => {
    this.setState({
      predefinedImage: dataUrl
    })
  }
  render () {
    return (
      <Card style={{
        margin: 'auto',
        width: '500px'
      }}>
        <CardHeader title={'React Image Cropper'} />
        <Cropper
          predefinedImage={this.state.predefinedImage}
          onCrop={this.onCrop}
          width={500}
          height={500}
          />
      </Card>
    )
  }
}

export default Home
