# React Image Cropper

### Demo
[View Live Demo](https://react-image-cropper-mlaeyifgqa.now.sh/)

### Usage example with webpack
```javascript
import React, { Component } from 'react'
import { Card, CardHeader } from 'material-ui/Card'
import Cropper from 'components/Cropper'
/**
 * include CSS file from cropperjs
 */
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
```
### Installation
```
npm install https://github.com/pedroposada/react-image-cropper.git
```


### Dependencies
- React
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
- [material-ui](http://www.material-ui.com/)