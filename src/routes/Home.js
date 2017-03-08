import React, { Component } from 'react'
import { Card, CardHeader, CardActions } from 'material-ui/Card'
import Cropper from 'components/Cropper'
import styles from './Home.sass'

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
