## Алгебраические методы для 2d и 3d графики

### Установка
```bash
$ npm install javascript-algebra
```

### Использование (node.js)
```javascript
import {Vector, Quatern, Matrix} from 'javascript-algebra';

Vector.from(1, 0, 0); // -> Vector @3d{x:1, y:0, z:0}
```

### Использование (browser)
```javascript
import {Vector, Quatern, Matrix} from '/javascript-algebra/index.js';

Matrix.identity(10); // -> Matrix {height: 10, width: 10}
```
