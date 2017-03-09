'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _cropperjs = require('cropperjs');

var _cropperjs2 = _interopRequireDefault(_cropperjs);

var _Slider = require('material-ui/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _done = require('material-ui/svg-icons/action/done');

var _done2 = _interopRequireDefault(_done);

var _restore = require('material-ui/svg-icons/action/restore');

var _restore2 = _interopRequireDefault(_restore);

var _fileUpload = require('material-ui/svg-icons/file/file-upload');

var _fileUpload2 = _interopRequireDefault(_fileUpload);

var _fileDownload = require('material-ui/svg-icons/file/file-download');

var _fileDownload2 = _interopRequireDefault(_fileDownload);

var _modeEdit = require('material-ui/svg-icons/editor/mode-edit');

var _modeEdit2 = _interopRequireDefault(_modeEdit);

var _reactInlineCss = require('react-inline-css');

var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cropper = function (_Component) {
  _inherits(Cropper, _Component);

  function Cropper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Cropper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Cropper.__proto__ || Object.getPrototypeOf(Cropper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      zoom: 1,
      originalImage: null,
      scaledRatio: null,
      editing: false
    }, _this.cropper = null, _this.initCropper = function (options) {
      if (_this.cropper) _this.cropper.destroy();
      var image = _reactDom2.default.findDOMNode(_this.refs.imageContainer);
      _this.cropper = new _cropperjs2.default(image, _extends({
        aspectRatio: 1,
        zoomOnWheel: false,
        zoomOnTouch: false,
        rotatable: false,
        cropBoxResizable: false,
        cropBoxMovable: false,
        minCropBoxWidth: _this.props.width,
        dragMode: 'none',
        toggleDragModeOnDblclick: false,
        guides: false,
        viewMode: 3 }, options));
    }, _this.prepareImage = function (dataURL) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
          var _this$fitImageToCanva = _this.fitImageToCanvas(img.width, img.height),
              scaledRatio = _this$fitImageToCanva.scaledRatio;

          resolve({
            scaledRatio: scaledRatio,
            dataURL: dataURL
          });
        };
        img.src = dataURL;
      });
    }, _this.onFileSelected = function (e) {
      if (_this.cropper) _this.cropper.destroy();

      var file = e.target && e.target.files[0];
      if (!file) return;

      var p = new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function (_ref2) {
          var dataURL = _ref2.target.result;

          resolve(dataURL);
        };
        reader.readAsDataURL(file);
      });
      p.then(function (dataURL) {
        return _this.prepareImage(dataURL);
      }).then(function (_ref3) {
        var scaledRatio = _ref3.scaledRatio,
            dataURL = _ref3.dataURL;

        _this.setState({
          originalImage: dataURL,
          editing: true,
          scaledRatio: scaledRatio,
          zoom: 1
        });
        _this.initCropper({ dragMode: 'move' });
      }).catch(function (error) {
        return console.log('onFileSelected failed', error);
      });
    }, _this.zoomControl = function (event, newValue) {
      if (_this.cropper) {
        _this.cropper.zoomTo(newValue * _this.state.scaledRatio);
        var p = new Promise(function (resolve) {
          var image = _reactDom2.default.findDOMNode(_this.refs.imageContainer);
          image.addEventListener('zoom', resolve);
        });
        p.then(function () {
          _this.setState(function (prevState, props) {
            return {
              zoom: newValue
            };
          });
        }).catch(function (error) {
          return console.log('zoomControl', error);
        });
      }
    }, _this.onCropImage = function () {
      var imageDataUrl = _this.cropper.getCroppedCanvas().toDataURL();
      _this.prepareImage(imageDataUrl).then(function (_ref4) {
        var scaledRatio = _ref4.scaledRatio,
            dataURL = _ref4.dataURL;

        _this.props.onCrop(imageDataUrl);
        _this.setState({
          originalImage: dataURL,
          editing: false,
          scaledRatio: scaledRatio,
          zoom: 1
        });
        _this.initCropper();
      }).catch(function (error) {
        return console.log('onCropImage failed', error);
      });
    }, _this.onEdit = function () {
      _this.setState({
        editing: true
      });
      _this.cropper.setDragMode('move');
    }, _this.onCancel = function () {
      _this.setState({
        zoom: 1
      });
      _this.cropper.reset();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  } // global object to be used in helper methods

  _createClass(Cropper, [{
    key: 'fitImageToCanvas',
    value: function fitImageToCanvas(width, height) {
      var scaledHeight = void 0,
          scaledWidth = void 0,
          scaledRatio = void 0;

      var canvasAspectRatio = this.props.width / this.props.height;
      var imageAspectRatio = width / height;

      if (canvasAspectRatio > imageAspectRatio) {
        scaledHeight = this.props.height;
        scaledRatio = scaledHeight / height;
        scaledWidth = width * scaledRatio;
      } else {
        scaledWidth = this.props.width;
        scaledRatio = scaledWidth / width;
        scaledHeight = height * scaledRatio;
      }

      return {
        naturalWidth: width,
        naturalHeight: height,
        scaledWidth: scaledWidth,
        scaledHeight: scaledHeight,
        scaledRatio: scaledRatio,
        imageAspectRatio: imageAspectRatio,
        canvasAspectRatio: canvasAspectRatio
      };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.predefinedImage !== nextProps.predefinedImage) {
        if (this.cropper) {
          this.cropper.destroy();
        }
        this.setState({
          editing: false,
          zoom: 1,
          scaledRatio: null,
          originalImage: nextProps.predefinedImage
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.predefinedImage) {
        this.prepareImage(this.props.predefinedImage).then(function (_ref5) {
          var scaledRatio = _ref5.scaledRatio,
              dataURL = _ref5.dataURL;

          _this2.setState({
            originalImage: dataURL,
            scaledRatio: scaledRatio
          });
          _this2.initCropper();
        }).catch(function (error) {
          return console.log('prepareImage failed', error);
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.cropper) {
        this.cropper.destroy();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          zoom = _state.zoom,
          originalImage = _state.originalImage,
          editing = _state.editing,
          _props = this.props,
          height = _props.height,
          width = _props.width,
          onFileSelected = this.onFileSelected,
          zoomControl = this.zoomControl,
          onCropImage = this.onCropImage,
          onCancel = this.onCancel,
          onEdit = this.onEdit;

      return _react2.default.createElement(
        _reactInlineCss2.default,
        { stylesheet: '\n          & .bgContainer {\n            background-color: #a8a8a8;\n          }\n          & .actions {\n            float: right;\n          }\n          & .wrapActions {\n            height: 3rem;\n          }\n          & .fileField {\n            opacity: 0;\n            height: 40px;\n            width: 40px;\n            position: absolute;\n            top: 0;\n            right: 0;\n          }\n          & .zoomControl {\n            padding: 0 1rem;\n          }\n        ' },
        _react2.default.createElement(
          'div',
          {
            style: { width: width + 'px' }
          },
          _react2.default.createElement(
            'div',
            {
              className: 'bgContainer',
              style: {
                height: height + 'px',
                width: width + 'px'
              }
            },
            _react2.default.createElement('img', {
              src: originalImage,
              ref: 'imageContainer'
            })
          ),
          editing && _react2.default.createElement(_Slider2.default, {
            min: 1,
            max: 3,
            step: 0.01,
            value: zoom,
            onChange: zoomControl,
            disabled: !originalImage,
            className: 'zoomControl',
            sliderStyle: { marginTop: 0, marginBottom: 0 }
          }),
          _react2.default.createElement(
            'div',
            { className: 'wrapActions' },
            _react2.default.createElement(
              'div',
              {
                className: 'actions'
              },
              _react2.default.createElement(
                _IconButton2.default,
                { tooltip: 'Select new image file' },
                _react2.default.createElement('input', {
                  ref: 'in',
                  type: 'file',
                  accept: 'image/*',
                  onChange: onFileSelected,
                  value: '',
                  className: 'fileField'
                }),
                _react2.default.createElement(_fileUpload2.default, null)
              ),
              editing && _react2.default.createElement(
                _IconButton2.default,
                { tooltip: 'Crop image', onClick: onCropImage },
                _react2.default.createElement(_done2.default, null)
              ),
              editing && _react2.default.createElement(
                _IconButton2.default,
                { tooltip: 'Reset zoom and center', onClick: onCancel },
                _react2.default.createElement(_restore2.default, null)
              ),
              !editing && originalImage && _react2.default.createElement(
                _IconButton2.default,
                { tooltip: 'Edit image', onClick: onEdit },
                _react2.default.createElement(_modeEdit2.default, null)
              ),
              !editing && originalImage && _react2.default.createElement(
                'a',
                { href: originalImage, target: '_blank' },
                _react2.default.createElement(
                  _IconButton2.default,
                  { tooltip: 'Open image in new window' },
                  _react2.default.createElement(_fileDownload2.default, null)
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Cropper;
}(_react.Component);

Cropper.defaultProps = {
  height: 400, // canvas height
  width: 400, // canvas width,
  onCrop: function onCrop(dataURL) {
    return dataURL;
  } // default callback
};
Cropper.propTypes = {
  height: _react.PropTypes.number,
  width: _react.PropTypes.number,
  predefinedImage: _react.PropTypes.string,
  onCrop: _react.PropTypes.func
};
exports.default = Cropper;
module.exports = exports['default'];

