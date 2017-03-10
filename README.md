# React Image Cropper

### Demo
[View Live Demo](https://pedroposada.github.io/react-image-cropper/)

### Usage example with webpack
```javascript
import React, { Component } from 'react'
import { Card, CardHeader } from 'material-ui/Card'
import Cropper from 'react-image-cropper'
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
yarn add https://github.com/pedroposada/react-image-cropper.git
```
or
```
npm install https://github.com/pedroposada/react-image-cropper.git
```


### Dependencies
- React
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
- [material-ui](http://www.material-ui.com/)