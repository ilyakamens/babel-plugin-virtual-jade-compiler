# babel-plugin-virtual-jade-compiler

Compiles .jade files into JavaScript for Virtual DOM
```js
import template from './button.jade';
```

## Install

```
npm i babel-plugin-virtual-jade-compiler --save-dev
```

## Usage
### Babel config
```
{
  "plugins": ["babel-plugin-virtual-jade-compiler"]
}
```

### CLI
```
babel --plugins babel-plugin-virtual-jade-compiler src/ --out-dir build
```

### 1.0.0
* Initial release
