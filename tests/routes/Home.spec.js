import React from 'react'
import Home from 'routes/Home'
import { render } from 'enzyme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Provider } from 'react-redux'
import {
  default as createStore
} from 'store/createStore'
import injectTapEventPlugin from 'react-tap-event-plugin'

describe('(View) Home', () => {
  let _component
  let store

  before(() => {
    store = createStore()
    try {
      injectTapEventPlugin()
    } catch (e) {
      // avoid error:
      // injectTapEventPlugin(): Can only be called once per application lifecycle
    }
    _component = render(<Provider store={store}><MuiThemeProvider><Home /></MuiThemeProvider></Provider>)
  })

  it('Renders a title', () => {
    const title = _component.find('span').first().text()
    expect(title).to.match(/React Image Cropper/)
  })
})
