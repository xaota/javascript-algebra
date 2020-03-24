/** @description Алгебра: Векторы полезно для @2d и @3d [es6]
  * @author github.com/xaota
  * @types
  * * {integer} <-> {number} - целые числа
  * * {natural} <-> {number} - натуральные числа и ноль, т.е., {unsigned int} // ноль не натуральное число
  * * {percent} <-> {number} - число в промежутке [0, 1]
  * @todo Ещё гора чего не описана. +этим тегом помечаю кандидаты на оптимизацию, переписывание и т. д.
  * @feature Цепочные вызовы, типа `Vector.from(1,2,3).scale(2).reverse().normalize()`
  */

/** {Vector} Работа с векторами @export @class
  * @field {natural} dimension размерность вектора
  * @field {Float32Array} data координаты вектора
  */
  export default class Vector {
  /** {Vector} Вектор из массива координат @constructor
    * @param {Float32Array|Array} array данные координат вектора
    */
    constructor(array) {
      this.data = new Float32Array(array);
      this.dimension = array.length;
    }

  /** @subsection @field Индексы вектора по осям */
  /** Вывод вектора в терминал @debug
    * @param {natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} @multiline
    */
    toString(precision = 2) {
      const data = Array.from(this.data, e => e.toFixed(precision));
      return '{' + data.join(', ') + '}';
    }

  /** Значение по оси X
    * @return {number} значение компоненты
    */
    get x() { return this.data[0] }

  /** Значение по оси Y
    * @return {number} значение компоненты
    */
    get y() { return this.data[1] }

  /** Значение по оси Z
    * @return {number} значение компоненты
    */
    get z() { return this.data[2] }

  /** Значение по оси W
    * @return {number} значение компоненты
    */
    get w() { return this.data[3] }

  /** Установка значения по оси X
    * @param {number} value устанавливаемое значение компоненты
    */
    set x(value) { this.data[0] = value }

  /** Установка значения по оси Y
    * @param {number} value устанавливаемое значение компоненты
    */
    set y(value) { this.data[1] = value }

  /** Установка значения по оси Z
    * @param {number} value устанавливаемое значение компоненты
    */
    set z(value) { this.data[2] = value }

  /** Установка значения по оси W
    * @param {number} value устанавливаемое значение компоненты
    */
    set w(value) { this.data[3] = value }

  /** @subsection @method */
  /** Копия вектора / copy
    * @return {Vector} копия вектора
    */
    copy() {
      return new Vector(this.data);
    }

  /** Объект с индексами вектора по осям / symbol
    * @return {Object} список индексов и значений
    */
    symbol() {
      const result = {}, n = Math.min(this.dimension, vectorIndex.length);
      this.data.slice(0, n).forEach((e, i) => result[vectorIndex.charAt(i)] = e);
      return result;
    }

  /** Проверка на нулевой вектор / empty
    * @return {Boolean} true, если все компоненты вектора - нули
    */
    empty() {
      return this.data.every(e => e === 0);
    }

  /** Проверка на единичный базисный вектор / basis
    * @return {Boolean} true, если одна из компонент вектора единица, а остальные нули
    */
    basis() {
      return this.data.some(e => e === 1) && (this.data.filter(e => e === 0).length === this.dimension - 1);
    }

  /** Номер оси базисного вектора / index
    * @return {integer} номер ненулевой размерности
    */
    index() {
      return this.basis()
        ? this.data.indexOf(1)
        : -1;
    }

  /** Проверка на единичный базисный вектор определенной оси / axis
    * @param {number} index номер проверяемой оси
    * @return {Boolean} true, если все компоненты вектора нули, кроме index
    */
    axis(index) {
      return this.data.indexOf(1) === index && this.basis();
    }

  /** Нахождение вектора в ориентированном прямоугольнике / in2D @2D
    * @param {Vector} A левый нижний угол ориентированного прямоугольника
    * @param {Vector} B правый верхний угол ориентированного прямоугольника
    * @param {boolean} edges учитывать нахождение точки на границах
    * @return {boolean} true, если вектор находится в заданной области
    */
    in2D(A = Vector.zero, B = Vector.infinity, edges = true) {
      const [x, y] = [this.x, this.y];
      return edges
        ? A.x <= x && A.y <= y && B.x >= x && B.y >= y
        : A.x < x && A.y < y && B.x > x && B.y > y;
    }

  /** Нахождение вектора в ориентированном параллепипеде / in3D @3D
    * @param {Vector} A левый нижний угол ориентированного параллепипеда
    * @param {Vector} B правый верхний угол ориентированного параллепипеда
    * @param {boolean} edges учитывать нахождение точки на границах
    * @return {boolean} true, если вектор находится в заданном объёме
    */
    in3D(A = Vector.zero, B = Vector.infinity, edges = true) {
      const [x, y, z] = [this.x, this.y, this.z];
      return edges
        ? A.x <= x && A.y <= y && A.z <= z && B.x >= x && B.y >= y && B.z >= z
        : A.x < x && A.y < y && A.z < z && B.x > x && B.y > y && B.z > z;
    }

  /** Норма вектора / norm
    * @return {number} значение нормы вектора
    */
    norm() {
      return this.data.reduce((r, e) => r + e ** 2, 0);
    }

  /** Длина вектора / length, magnitude
    * @return {number} значение длины вектора
    */
    length() {
      return Math.hypot(...this.data); // Math.sqrt(this.norm());
    }

  /** Нормализация вектора / normalize
    * @return {Vector} сонаправленный с исходным единичный вектор
    */
    normalize() {
      const factor = this.length();
      return this.divide(factor);
    }

  /** Сопряжённый вектор (1/a) / link
    * @return {Vector} (1 / vector)
    */
    link() {
      return new Vector(this.data.map(e => e === 0 ? 0 : 1 / e));
    }

  /** Обратный вектор (-a) / reverse
    * @return {Vector} (-vector)
    */
    reverse() {
      return new Vector(this.data.map(e => -e));
    }

  /** Вектор из компонент в обратном порядке / inverse
    * @return {Vector} (-vector)
    */
    inverse() {
      return new Vector(this.data.reverse());
    }

  /** Половина исходного вектора / half
    * @return {Vector} вектор половинного размера
    */
    half() {
      return new Vector(this.data.map(e => e / 2));
    }

  /** @subsection Аггрегирующие функции */
  /** Максимальная компонента вектора / max
    * @return {number} Значение максимальной компоненты или 0
    */
    max() {
      return Math.max(...this.data, 0);
    }

  /** Минимальная компонента вектора / min
    * @return {number} Значение минимальной компоненты или 0
    */
    min() {
      return Math.min(...this.data, 0);
    }

  /** Среднее всех компонент вектора / average
    * @return {number} значение среднего
    */
    average() {
      if (this.dimension === 0) return 0;
      return this.data.reduce((r, e) => r + e, 0) / this.dimension;
    }

  /** Приведение покомпонентного максимума (выравнивание вектора) к отношению от максимума / align
    * @param {percent} level процент от минимума до максиума среди компонент вектора
    * @return {Vector} выровненный вектор
    */
    align(level = 1) {
      const min = this.min(), max = this.max();
      level = (max - min) * level + min;
      return this.level(level);
    }

  /** Приведение покомпонентного максимума (выравнивание вектора) к значению / level
    * @param {number} level абсолютное значение
    * @return {Vector} выровнненный вектор
    */
    level(level = 1) {
      return new Vector(this.data.map(e => e === 0 ? e : level));
    }

  /** @subsection Дополнительные функции */
  /** Изменение размерности вектора @todo / resize
    * уменьшение - хвостовые значения отбрасываются
    * увеличение - координаты инициализируются нулями
    * @param {natural} dimension размерность вектора
    * @return {Vector} вектор новой размерности
    */
    resize(dimension) {
      const data = new Float32Array(dimension), n = Math.min(dimension, this.dimension);
      for (let i = 0; i < n; ++i) data[i] = this.data[i];
      return new Vector(data);
    }

  /** Изменение размерности вектора c дополнением единицами / resizeIdentity
    * уменьшение - хвостовые значения отбрасываются
    * увеличение - координаты инициализируются единицами
    * @param {natural} dimension размерность вектора
    * @return {Vector} вектор новой размерности
    */
    resizeIdentity(dimension) {
      return Vector.identity(dimension).fill(0, ...this.data);
    }

  /** Заполнение координат вектора новыми значениями / fill
    * @param {natural} index позиция первого из заменяемых элементов в списке координат
    * @arguments {number} новые значения координат
    * @return {Vector} новый вектор с новыми значениями
    */
    fill(index, ...coord) {
      const data = this.data.slice();
      coord.forEach((e, i) => data[index + i] = e);
      return new Vector(data);
    }

  /** @subsection Основные функции */
  /** Умножение вектора на скаляр (масштабирование вектора) / scale
    * @param {number} factor множитель (коэффициент масштабирования)
    * @return {Vector} новый вектор с новыми значениями координат
    */
    scale(factor) {
      return new Vector(this.data.map(e => e * factor));
    }

  /** Деление вектора на скаляр (для удобства) / divide
    * @param {number} factor множитель (коэффициент масштабирования)
    * @return {Vector} новый вектор с новыми значениями координат
    */
    divide(factor) {
      if (factor === 0) return Vector.empty(this.dimension);
      return new Vector(this.data.map(e => e / factor));
    }

  /** Сложение векторов / addition
    * @param {Vector} vector слагаемое
    * @return {Vector} вектор суммы
    */
    addition(vector) {
      return new Vector(this.data.map((e, i) => e + vector.data[i]));
    }

  /** Сложение векторов (с приведением размерностей) / add
    * @param {Vector} vector слагаемое
    * @return {Vector} вектор суммы
    */
    add(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).addition(vector.resize(n))
    }

  /** Разность векторов / difference, subtract
    * @param {Vector} vector вычитаемое
    * @return {Vector} вектор разности
    */
    difference(vector) {
      return this.addition(vector.reverse());
    }

  /** Разность векторов (с приведением размерностей) / diff
    * @param {Vector} vector вычитаемое
    * @return {Vector} вектор разности
    */
    diff(vector) {
      return this.add(vector.reverse());
    }

  /** Скалярное умножение векторов / dot (scalar)
    * @param {Vector} vector множитель
    * @return {number} результат умножения
    */
    dot(vector) {
      return this.data.reduce((result, e, i) => result + e * vector.data[i], 0);
    }

  /** Скалярное умножение векторов (с приведением размерностей) / mult
    * @param {Vector} vector множитель
    * @return {number} результат умножения
    */
    mult(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).dot(vector.resize(n));
    }

  /** Векторное умножение (при размерности 3) / multiply
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiply(vector) {
      const A = this, B = vector;
      const a = Vector.from(A.z * B.y, A.x * B.z, A.y * B.x);
      const b = Vector.from(A.y * B.z, A.z * B.x, A.x * B.y);
      return Vector.to(a, b);
    }

  /** Покомпонентное умножение векторов / multiplication
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiplication(vector) {
      return new Vector(this.data.map((e, i) => e * vector.data[i]));
    }

  /** Покомпонентное умножение векторов (с приведением размерностей) / multiplicate
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiplicate(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).multiplication(vector.resize(n));
    }

  /** Вращение вектора @2d / rotate2D
    * @param {number} angle угол поворота @radians
    * @return {Vector} вектор после поворота
    */
    rotate2D(angle) {
      const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
      const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
      return Vector.from(x, y);
    }

  /** Вращение вектора @3d @TODO: создать метод / rotate3D
    * @param {number} angle угол поворота @radians
    * @return {Vector} @this
    */
    rotate3D(angle) {
      // ...
      return this;
    }

  /** @subsection @export */
  /** Массив компонент вектора / export
    * @param {boolean} typed необходимость вернуть типимизованный массив
    * @return {Float32Array|Array} массив координат вектора
    */
    export(typed = false) {
      return typed !== false
        ? this.data.slice()
        : Array.from(this.data);
    }

  /** @subsection @method @static */
  /** Вектор из переданных параметров / from @static
    * @param {...number} coord координаты
    * @return {Vector} вектор
    */
    static from(...coord) {
      return new Vector(coord);
    }

  /** Нулевой (пустой) вектор любой размерности / empty @static
    * @param {natural} dimension размерность вектора
    * @return {Vector} нулевой вектор
    */
    static empty(dimension = 2) {
      return new Vector(new Float32Array(dimension)); // auto.fill(0)
    }

  /** Вектор любой размерности, все элементы которого одинаковые / identity @static
    * @param {natural} dimension размерность вектора
    * @param {number} value значение элементов вектора
    * @return {Vector} вектор с единиичными компонентами
    */
    static identity(dimension = 2, value = 1) {
      return new Vector((new Float32Array(dimension)).fill(value));
    }

  /** Единичный (базисный) вектор любой размерности / basis @static
    * @param {natural} dimension размерность вектора
    * @param {natural} index     номер единичной координаты
    * @return {Vector} кроме index все координаты будут нулевыми
    */
    static basis(dimension, index) {
      return Vector.empty(dimension).fill(index, 1);
    }

  /** Вектор из точки A в точку B / to @static
    * @param {Vector} A координаты точки A
    * @param {Vector} B координаты точки B
    * @return {Vector} вектор разности B - A
    */
    static to(A, B) {
      return B.difference(A);
    }

  /** Расстояние между двумя точками / distance @static
    * @param {Vector} A координаты точки A
    * @param {Vector} B координаты точки B
    * @return {number} длина вектора между точками
    */
    static distance(A, B) {
      return Vector.to(A, B).length();
    }

  /** Сравнение двух векторов / compare @static
    * @param {Vector} A сравниваемые векторы
    * @param {Vector} B сравниваемые векторы
    * @param {number} precision точность
    * @return {Boolean} true, если векторы близкие
    */
    static compare(A, B, precision = 0.0001) {
      return A.data.every((e, i) => Math.abs(e - B.data[i]) < precision);
    }

  /** Вектор отношения двух векторов (одинаковых размерностей) / relation @static
    * @param {Vector} A первый вектор
    * @param {Vector} B второй вектор
    * @return {Vector} вектор покомпонентного отношения
    */
    static relation(A, B) {
      return new Vector(B.data.map((e, i) => e / A.data[i]));
    }

  /** Вектор случайных значений / random @static
    * @param {natural} dimension размерность итогового вектора
    * @return {Vector} истоговый вектор с значениями [0, 1)
    */
    static random(dimension = 2) {
      const array = Array.from({length: dimension}, _ => Math.random());
      return new Vector(array);
    }

  /** @subsection Ортогональные векторы */
  /** Ортогональный вектор @2d для линии на плоскости / ortho2D, normal2D
    * @param {Vector} vector оригинальный вектор
    * @return {Vector} ортогональ
    */
    static ortho2D(vector) {
      return Vector.from(-vector.y, vector.x);
    }

  /** Ортогональный вектор @3d для плоскости в пространстве / ortho3D
    * @param {Vector} A первый вектор задания плоскости
    * @param {Vector} B второй вектор задания плоскости
    * @return {Vector} ортогональ
    */
    static ortho3D(A, B) {
      return A.multiply(B);
    }

  /** Единичный вектор нормали к плоскости, заданной тремя точками (a, b, c) / normal @static
    * @param {Vector} a координаты точки a
    * @param {Vector} b координаты точки b
    * @param {Vector} c координаты точки c
    * @return {Vector} вектор нормали
    */
    static normal(a, b, c) {
      const A = Vector.to(b, a),
            B = Vector.to(b, c);
      return A.multiply(B).normalize().reverse();
    }

  /** Сумма нескольких векторов / addition @static
    * @param {natural} dimension размерность складываемых векторов
    * @param {...Vector} слагаемые векторы размерности dimension
    * @return {Vector} вектор суммы
    */
    static addition(dimension = 0, ...vectors) {
      if (vectors.length === 0) return dimension > 0
        ? Vector.empty(dimension)
        : null;
      const head = vectors[0];
      const tail = vectors.slice(1);
      return tail.reduce((result, vector) => result.addition(vector), head);
    }

  /** Приведение размерности векторов (выбор максимальной) / dimension @static
    * @param {...Vector} vectors список векторов
    * @return {number} максимальная размерность
    */
    static dimension(...vectors) {
      return Math.max(...vectors.map(e => e.dimension), 0);
    }
  }

  /** @subsection @const Частые значения */
  /** 2D */
    Vector.x        = Vector.basis(2, 0);
    Vector.y        = Vector.basis(2, 1);
    Vector.zero     = Vector.empty(2);
    Vector.flipX    = Vector.from(-1,  1);
    Vector.flipY    = Vector.from( 1, -1);
    Vector.one      = Vector.identity(2);
    Vector.half     = Vector.from(0.5, 0.5);
    Vector.infinity = Vector.from(Infinity, Infinity);
  /** 3D */
    Vector.X        = Vector.basis(3, 0);
    Vector.Y        = Vector.basis(3, 1);
    Vector.Z        = Vector.basis(3, 2);
    Vector.ZERO     = Vector.empty(3);
    Vector.FlipX    = Vector.from(-1,  1,  1);
    Vector.FlipY    = Vector.from( 1, -1,  1);
    Vector.FlipZ    = Vector.from( 1,  1, -1);
    Vector.ONE      = Vector.identity(3);
    Vector.HALF     = Vector.from(0.5, 0.5, 0.5);
    Vector.INFINITY = Vector.from(Infinity, Infinity, Infinity);

/** @section @private */
  const vectorIndex = 'xyzw';
