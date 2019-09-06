## Алгебраические методы для 2d и 3d графики и так далее
Векторы, Кватернионы и Матрицы @chainable

## Установка
```shell
$ npm install javascript-algebra
```

## Использование (node.js)
```javascript
import {Vector, Quatern, Matrix} from 'javascript-algebra';

Vector
  .from(1, 2, 3) // -> Vector @3d {x: 1,  y: 0,  z: 0}
  .scale(10);    //    Vector @3d {x: 10, y: 20, z: 30}
...
```

## Использование (browser)
```javascript
import {Vector, Quatern, Matrix} from '/javascript-algebra/index.js';

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
Vector.x     = Vector.basis(2, 0)
Vector.y     = Vector.basis(2, 1)
Vector.zero  = Vector.empty(2)
Vector.flipX = Vector.from(-1,  1)
Vector.flipY = Vector.from( 1, -1)
Vector.one   = Vector.identity(2)
Vector.half  = Vector.from(0.5, 0.5)

/** 3D */
Vector.X     = Vector.basis(3, 0)
Vector.Y     = Vector.basis(3, 1)
Vector.Z     = Vector.basis(3, 2)
Vector.ZERO  = Vector.empty(3)
Vector.FlipX = Vector.from(-1,  1,  1)
Vector.FlipY = Vector.from( 1, -1,  1)
Vector.FlipZ = Vector.from( 1,  1, -1)
Vector.ONE   = Vector.identity(3)
Vector.HALF  = Vector.from(0.5, 0.5, 0.5)

/** Создание вектора для частых задач */
const vector = Vector.to(A, B)        // Вектор из точки A в B; A и B элементы Vector // B - A
const vector = Vector.distance(A, B)  // Расстояние между двумя точками
const vector = Vector.relation(A, B)  // Вектор отношения двух векторов (одинаковых размерностей)
const normal = Vector.normal(A, B, C) // Единичный вектор нормали к плоскости, заданной тремя точками

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
const vector = vector.addition(vector)       // Сложение векторов
const vector = vector.difference(vector)     // Разность векторов
const vector = vector.scalar(vector)         // Скалярное умножение векторов
const vector = vector.multiplication(vector) // Покомпонентное умножение векторов

/** Основные методы 2D */
const vector = vector.rotate2d(angle) // Вращение вектора

/** Основные методы 3D */
const vector = vector.multiply(vector) // Векторное умножение (при размерности 3)
const vector = vector.rotate3D()       // TODO: нет пока такого метода

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
const quaternion = quatern.scalar(Q)     // Скалярное умножение
const quaternion = quatern.multiply(Q)   // Умножение кватернионов

/** Дополнительные методы (const quatern = new Quatern(...)) */
const copy  = quatern.copy() // Копия объекта кватерниона
const array = quatern.data() // export? -> возвращает массив компонент Float32Array[x, y, z, w]
```

### `Matrix` класс для работы с матрицами
```javascript
/** Создание матрицы */
const matrix = new Matrix(array, height, width) // из элементов массива параметра
const matrix = new MAtrix(...vector)            // из набора векторов

/** Создание матриц для частых задач */

/** Методы */
const number   = matrix.trace()    // След матрицы
const empty    = matrix.empty()    // true, если все элементы матрицы = 0
const identity = matrix.identity() // true, если все элементы главной диагонали = 1

/** Основные методы */
const matx = matrix.transpose() // Транспонирование матрицы

/** 2D */

/** 3D */

/** Работа с различными векторами матрицы */

/** Работа с минорами матрицы */

/** Дополнительные методы (const matrix = new Matrix(...)) */
const copy   = matrix.copy()                  // Копирование матрицы
const string = matrix.toString(precision = 2) // Вывод матрицы в терминал @debug
const vector = matrix.vector()                // Вектор из элементов матрицы

/** Элементарные преобразования */
```
