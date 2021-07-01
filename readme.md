## Алгебраические методы для 2d и 3d графики и так далее
Векторы, Кватернионы и Матрицы @chainable

## Установка
```shell
$ npm install javascript-algebra
```

## Настройка
> importmaps
```html
<script type="importmap">
{
  "imports": {
    "javascript-algebra": "/javascript-algebra/index.js",
    "javascript-algebra/": "/javascript-algebra/library/"
  }
}
</script>
```

### Дополнительно
Если вы используете vscode, можно настроить резолв для корректной работы самого редактора с помощью файла `jsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": "../node_modules/",
    "paths": {
      "javascript-algebra/*": ["./javascript-algebra/library/*"]
    }
  }
}
```

## Использование

```javascript
import { Vector, Quatern, Matrix } from 'javascript-algebra';

Vector
  .from(1, 2, 3) // -> Vector @3d {x: 1,  y: 0,  z: 0}
  .scale(10);    //    Vector @3d {x: 10, y: 20, z: 30}
...

Matrix.identity(10) // -> Matrix {height: 10, width: 10}
...
```

## Список методов
### `Vector` класс для работы с векторами
Векторы могут быть любой размерности, хотя многие штуки дополнительно удобно сделаны для 2D / 3D / 4D

```javascript
/** Создание вектора */
const vector = new Vector([1, 2, 3, ..., n])
const vector = Vector.from(1, 2, 3, ..., n) // то же самое

const empty    = Vector.empty(n)           // нулевой вектор размерности n
const identity = Vector.identity(n, value) // вектор размерности n, все элементы = value
const basis    = Vector.basis(n, index)    // вектор размерности n, все элементы кроме index, = 0

// значения по осям
// get / set: x, y, z, w;

/** Частые значения (статические значения) */
/** 2D */
Vector.x        = Vector.basis(2, 0)
Vector.y        = Vector.basis(2, 1)
Vector.zero     = Vector.empty(2)
Vector.flipX    = Vector.from(-1,  1)
Vector.flipY    = Vector.from( 1, -1)
Vector.one      = Vector.identity(2)
Vector.half     = Vector.from(0.5, 0.5)
Vector.infinity = Vector.from(Infinity, Infinity)

/** 3D */
Vector.X        = Vector.basis(3, 0)
Vector.Y        = Vector.basis(3, 1)
Vector.Z        = Vector.basis(3, 2)
Vector.ZERO     = Vector.empty(3)
Vector.FlipX    = Vector.from(-1,  1,  1)
Vector.FlipY    = Vector.from( 1, -1,  1)
Vector.FlipZ    = Vector.from( 1,  1, -1)
Vector.ONE      = Vector.identity(3)
Vector.HALF     = Vector.from(0.5, 0.5, 0.5)
Vector.INFINITY = Vector.from(Infinity, Infinity, Infinity)

/** Создание вектора для частых задач */
const vector = Vector.to(A, B)        // Вектор из точки A в B; A и B элементы Vector // B - A
const vector = Vector.distance(A, B)  // Расстояние между двумя точками
const vector = Vector.relation(A, B)  // Вектор отношения двух векторов (одинаковых размерностей)
const normal = Vector.normal(A, B, C) // Единичный вектор нормали к плоскости, заданной тремя точками
const random   = Vector.random(3) // вектор с случайными значениями

/** Ортогональные векторы */
const ortho = Vector.ortho2(vector) // {x, y} -> {-y, x}
const ortho = Vector.ortho3(A, B)   // A multiply B

/** Методы (const vector = new Vector(...)) */
const empty    = vector.empty()     // true, если все компоненты нулевые
const basis    = vector.basis()     // true, если все компоненты нулевые кроме одной
const basis    = vector.axis(index) // true, если все компоненты нулевые кроме index
const number   = vector.index()     // номер ненулевой (единичной) оси\
const identity = vector.identity()  // TODO: true, если все компоненты = 1

const number = vector.length() // Длина вектора
const number = vector.norm()   // Норма вектора

const vec = vector.normalize() // Нормализация вектора
const vec = vector.link()      // Сопряжённый вектор, 1 / vector
const vec = vector.reverse()   // Обратный вектор, все компоненты e => -e
const vec = vector.inverse()   // Вектор из компонент в обратном порядке
const vec = vector.half()      // Половина исходного вектора

/** Аггрегирующие функции */
const number = vector.max()     // Максимальная компонента вектора
const number = vector.min()     // Минимальная компонента вектора
const number = vector.average() // Среднее всех компонент вектора

const vector = vector.level(level = 1) // Приведение покомпонентного максимума (выравнивание) к значению
const vector = vector.align(level = 1) // Приведение покомпонентного максимума (выравнивание) к отношению

/** Основные методы */
const vector = vector.scale(factor)          // Умножение вектора на скаляр (масштабирование)
const vector = vector.divide(factor)         // деление вектора на скаляр (для удобства)
const vector = vector.addition(vector)       // Сложение векторов
const vector = vector.difference(vector)     // Разность векторов
const vector = vector.dot(vector)            // Скалярное умножение векторов (scalar)
const vector = vector.multiplication(vector) // Покомпонентное умножение векторов

/** Основные методы 2D */
const vector = vector.rotate2D(angle)      // Вращение вектора
const bool = vector.in2D(vectorA, vectorB) // попадение в ориентированный прямоугольник
const bool = vector.has2D(point)           // наличие point в прямоугольнике [0, vector]

/** Основные методы 3D */
const vector = vector.multiply(vector)     // Векторное умножение (при размерности 3)
const vector = vector.rotate3D()           // TODO: нет пока такого метода
const bool = vector.in3D(vectorA, vectorB) // попадение в ориентированный параллепипед
const bool = vector.has3D(point)           // наличие point в параллепипеде [0, ...vector]

/** Основные методы (с приведением размерностей) */
const vector = vector.add(vector)          // Сложение векторов (с приведением размерностей)
const vector = vector.diff(vector)         // Разность векторов (с приведением размерностей)
const vector = vector.mult(vector)         // Скалярное умножение векторов (с приведением размерностей)
const vector = vector.multiplicate(vector) // Покомпонентное умножение (с приведением размерностей)

/** Дополнительные методы (const vector = new Vector(...)) */
const copy   = vector.copy()   // копирование объекта вектора
const array  = vector.export() // возвращает массив компонент вектора
const object = vector.symbol() // {x?, y?, z?, w?} - возвращает объект с полями-компонентами (макс 4)

const vector  = vector.resize(n)            // Изменение размерности вектора
const vector  = vector.resizeIdentity(n)    // Изменение размерности вектора c дополнением единицами
const vector  = vector.fill(index, ...data) // Заполнение координат вектора новыми значениями

const vector  = Vector.addition(n, A, B, C, ...vectors)  // Сумма нескольких векторов размерности n
const compare = Vector.compare(A, B, precision = 0.0001) // -> boolean (сравнение векторов)
const number  = Vector.dimension(...vectors) // Приведение размерности векторов (выбор максимальной)
```

### `Quatern` класс для работы с кватернионами
```javascript
/** Создание кватерниона */
const quatern = new Quatern(x, y, z, w)     // из чисел
const quatern = Quatern.from(angle, vector) // из угла (number) и вектора (Vector)
const quatern = Quatern.data([x, y, z, w])  // из массива чисел
// TODO: создание кватерниона из матрицы поворота

// значения по осям
// TODO: get / set: x, y, z, w;

/** Частые значения (статические значения) */
Quatern.empty = new Quatern(0, 0, 0, 0)

/** Методы (const quatern = new Quatern(...)) */
const number     = quatern.norm()     // Норма кватерниона    (x^2 + y^2 + z^2 + w^2)
const number     = quatern.absolute() // Модуль кватерниона   (sqrt(norm))
const number     = quatern.argument() // Аргумент кватерниона (2 acos(w))
const quaternion = quatern.sign()     // Знак кватерниона     (.scale(1 / absolute))

/** Основные методы */
const quaternion = quatern.reverse()     // Сопряжённый кватернион  {-x, -y, -z, w}
const quaternion = quatern.inverse()     // Обратный (по умножению) (.reverse().scale(1 / norm))
const quaternion = quatern.scale(factor) // Умножение на скаляр
const quaternion = quatern.addition(Q)   // Сложение кватернионов
const quaternion = quatern.dot(Q)        // Скалярное умножение (scalar)
const quaternion = quatern.multiply(Q)   // Умножение кватернионов

/** Дополнительные методы (const quatern = new Quatern(...)) */
const copy  = quatern.copy() // Копия объекта кватерниона
const array = quatern.data() // export? -> возвращает массив компонент Float32Array[x, y, z, w]
```

### `Matrix` класс для работы с матрицами
```javascript
/** Создание матрицы */
const matrix = new Matrix(array, height, width) // из элементов массива параметра
const matrix = Matrix.from(...vector)            // из набора векторов

/** Создание матриц для частых задач */
// TODO: создание матрицы 4x4 из кватерниона
const matrix = Matrix.identity(n)           // Единичная матрица любой размерности
const matrix = Matrix.empty(height, width)  // Нулевая (пустая) матрица
const matrix = Matrix.random(height, width) // Матрица из случайных элементов [0..1)
const matrix = Matrix.diagonal(vector)      // Диагональная матрица из вектора
const matrix = Matrix.diagonalUp(vector)    // Над-диагональная матрица
const matrix = Matrix.diagonalDown(vector)  // Под-диагональная матрица

const matrix = Matrix.sparse(data, height, width) // Разряженная матрица
const matrix = Matrix.concat(...matrix)           // Блок из матриц (Блочная матрица)

/** Матрицы для основных преобразований */
const matrix = Matrix.translate(vector)   // Матрица переноса

const matrix = Matrix.shiftUp(n)          // Матрица сдвига вверх (верхне-сдвиговая матрица)
const matrix = Matrix.shiftDown(n)        // Матрица сдвига вниз (нижне-сдвиговая матрица)

const matrix = Matrix.scale(vector)       // Матрица масштабирования

/** 2D */
const matrix = Matrix.transform2(a, b, c, d, e, f) // Матрица трансформаций [[a,b,0], [c,d,0], [e,f,1]]

const matrix = Matrix.rot(angle)   // Матрица абсолютного поворота
const matrix = Matrix.skew(vector) // Матрица искажения

/** 3D */
const matrix = Matrix.lookAt(eye, center, up) // Видовая матрица (eye, center, up: Vector)
const matrix = Matrix.frustum(top, right, bottom, left, near, far) // Матрица пирамидального отсечения
const matrix = Matrix.ortho(top, right, bottom, left, near, far)   // Матрица прямоугольного отсечения
const matrix = Matrix.perspective(fovy, aspect, near, far) // Матрица симметричной перспективной проекции

const matrix = Matrix.translateX(vector)  // Матрица переноса по оси X
const matrix = Matrix.translateY(vector)  // Матрица переноса по оси Y
const matrix = Matrix.translateZ(vector)  // Матрица переноса по оси Z
const matrix = Matrix.translateXY(vector) // Матрица переноса по плоскости Z
const matrix = Matrix.translateXZ(vector) // Матрица переноса по плоскости Y
const matrix = Matrix.translateYZ(vector) // Матрица переноса по плоскости X

const matrix = Matrix.scaleX(factor)      // Матрица масштабирования по оси X
const matrix = Matrix.scaleY(factor)      // Матрица масштабирования по оси Y
const matrix = Matrix.scaleZ(factor)      // Матрица масштабирования по оси Z
const matrix = Matrix.scaleXYZ(factor)    // Матрица масштабирования по всем осям на одинаковые значения

const matrix = Matrix.rotate(vector, angle) // Матрица абсолютного поворота вокруг вектора
const matrix = Matrix.rotateX(angle)        // Матрица абсолютного поворота вокруг оси X
const matrix = Matrix.rotateY(angle)        // Матрица абсолютного поворота вокруг оси Y
const matrix = Matrix.rotateZ(angle)        // Матрица абсолютного поворота вокруг оси Z

/** Методы */
const number   = matrix.trace()    // След матрицы
const empty    = matrix.empty()    // true, если все элементы матрицы = 0
const identity = matrix.identity() // true, если все элементы главной диагонали = 1

/** Основные методы (const matrix = new Matrix(...)) */
const matx = matrix.transpose()       // Транспонирование матрицы
const matx = matrix.dot(factor)       // Умножение матрицы на скаляр (scalar)
const matx = matrix.addition(M)       // Сложение матриц
const matx = matrix.multiply(M)       // Умножение согласованных матриц
const matx = matrix.translate(vector) // Операция переноса координат
const matx = matrix.scale(vector)     // Операция масштабирования координат

const matx = matrix.vectorCol(vector) // Умножение матрицы на вектор-столбец справа
const matx = matrix.vectorRow(vector) // Умножение матрицы (N x 1) на вектор-строку (N) слева

const matx = matrix.shiftDown()      // Сдвиг квадратной матрицы вниз
const matx = matrix.shiftUp()        // Сдвиг квадратной матрицы вверх
const matx = matrix.shiftLeft()      // Сдвиг квадратной матрицы влево
const matx = matrix.shiftRight()     // Сдвиг квадратной матрицы вправо
const matx = matrix.shiftUpRight()   // Сдвиг квадратной матрицы вверх-вправо
const matx = matrix.shiftUpLeft()    // Сдвиг квадратной матрицы вверх-влево
const matx = matrix.shiftDownRight() // Сдвиг квадратной матрицы вниз-вправо
const matx = matrix.shiftDownLeft()  // Сдвиг квадратной матрицы вниз-влево

const vec = matrix.transition(vector)        // перевод системы координат
const vec = matrix.transitionInverse(vector) // перевод системы координат @slow

/** Основные методы (с приведением размерностей) */
const matx = matrix.add(M)  // Сложение матриц (с приведением размерностей)
const matx = matrix.mult(M) // Умножение матриц с с предварительным согласованием

/** 2D */
const matx = matrix.rot(angle)   // Операция поворота координат
const matx = matrix.skew(vector) // Операция искажения (extended)
const vec = matrix.transition2D(vector) // Перевод точек из одной СК окружения пера в другую через матрицу перехода

/** 3D */
const matx = matrix.rotate(vector, angle) // Операция поворота координат
const matx = matrix.inverse3D()       // Обратная матрица к матрице модели для 3d графики (fast)

const matx = matrix.rotateX(angle)    // Операция поворота координат вокруг оси X
const matx = matrix.rotateY(angle)    // Операция поворота координат вокруг оси Y
const matx = matrix.rotateZ(angle)    // Операция поворота координат вокруг оси Z

const matx = matrix.translateX(coord) // Операция переноса координат по оси X
const matx = matrix.translateY(coord) // Операция переноса координат по оси Y
const matx = matrix.translateZ(coord) // Операция переноса координат по оси Z

const matx = matrix.translateXY(x, y) // Операция переноса координат по плоскости Z
const matx = matrix.translateXZ(x, z) // Операция переноса координат по плоскости Y
const matx = matrix.translateYZ(y, z) // Операция переноса координат по плоскости X

const matx = matrix.scaleX(factor)    // Операция масштабирования координат по оси X
const matx = matrix.scaleY(factor)    // Операция масштабирования координат по оси Y
const matx = matrix.scaleZ(factor)    // Операция масштабирования координат по оси Z

const matx = matrix.scaleXYZ(factor)  // Операция масштабирования координат по всем осям

const vec = matrix.transitionInverse3D(vector) // перевод системы координат @slow

/** Работа с различными векторами матрицы */
const columns = matrix.cols()               // Набор вектор-столбцов матрицы -> [...Vector]
const rows    = matrix.rows()               // Набор вектор-строк матрицы    -> [...Vector]

const column = matrix.col(index)            // Вектор-столбец матрицы -> Vector
const matx   = matrix.setCol(index, vector) // Замена столбца index в матрице на значения из вектора
const matx   = matrix.additionCol(index, vector) // Добавление к столбцу матрицы значение из вектора

const row    = matrix.row(index)            // Вектор-строка матрицы -> Vector
const matx   = matrix.setRow(index, vector) // Замена строки index в матрице на значения из вектора
const matx   = matrix.additionRow(index, vector) // Добавление к строке матрицы значение из вектора

const vector = matrix.diagonal()             // Главная диагональ матрицы -> Vector
const matx   = matrix.DIAGONAL(vector)       // Замена главной диагонали матрицы -> Matrix

/** Применение метода Гаусса */
const matx   = matrix.inverse()     // Обратная матрица
const number = matrix.determinant() // Определитель матрицы
const number = matrix.rank()        // Ранг матрицы
const vec    = matrix.solve(vector) // Решение СЛАУ (Ax = B: matrix = A, vector = B)
const object = Matrix.gauss(matrix, w) // применение метода Гаусса

/** Работа с минорами матрицы */
const matx = matrix.minor(row, col)    // Минор матрицы по строке и столбцу
const matx = matrix.minors(rows, cols) // Минор матрицы любого порядка по строкам и столбцам
const matx = matrix.minore(from, to)   // Минор матрицы любого порядка (from, to: Vector{x, y})

/** Дополнительные методы (const matrix = new Matrix(...)) */
const compare = Matrix.compare(A, B, precision = 0.0001) // -> boolean (сравнение матриц)
const copy    = matrix.copy()                  // Копирование матрицы
const string  = matrix.toString(precision = 2) // Вывод матрицы в терминал @debug
const vector  = matrix.vector()                // Вектор из элементов матрицы
const vector  = matrix.element(start, count)   // Возврат элементов матрицы с любого места (по столбцам)
const matx    = matrix.fill(start, array)      // Заполнение элементов с любого места (по столбцам)
const number  = matrix.get(row, col)           // Получение конкретного элемента матрицы
const matx    = matrix.set(row, col, value)    // Установка конкретного элемента матрицы

const matx    = matrix.resize(height, width)   // Изменение размеров матрицы

/** Элементарные преобразования */
const matx = matrix.swapCol(a, b) // Обмен столбцов с номерами a и b
const matx = matrix.swapRow(a, b) // Обмен строк с номерами a и b
const matx = matrix.scaleCol(index, factor) // Умножение столбца матрицы на скаляр
const matx = matrix.scaleRow(index, factor) // Умножение строки матрицы на скаляр
const matx = matrix.additionCols(a, b, factor) // Добавление к столбцу столбца, помноженного на скаляр
const matx = matrix.additionRows(a, b, factor) // Добавление к строке  строки, помноженной на скаляр

/** Преобразования векторов через матрицы */
const vec = Matrix.transition(matrix, vector)          // перевод системы координат
const vec = Matrix.transition2D(matrix, vector)        // Перевод точек из одной СК окружения пера в другую через матрицу перехода
const vec = Matrix.transitionInverse(matrix, vector)   //
const vec = Matrix.transitionInverse3D(matrix, vector) //
```

## ROADMAP
- `Quatern` - повороты, интерполяция (LERP)
- `Matrix`  - мутабельные методы работы с элементами @faster, жорданки, расчет теней для 3d
