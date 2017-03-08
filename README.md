# React Image Cropper

### Demo
[View Live Demo](https://react-image-cropper-mlaeyifgqa.now.sh/)

### Usage example
```javascript
import React, { Component } from 'react'
import { Card, CardHeader } from 'material-ui/Card'
import Cropper from 'components/Cropper'

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
```

### Notes
- Uses [Cropper.js](https://fengyuanchen.github.io/cropperjs/)