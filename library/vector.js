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
    * @param {Float32Array} array данные координат вектора
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
  /** Копия вектора
    * @return {Vector} копия вектора
    */
    copy() {
      return new Vector(this.data);
    }

  /** Объект с индексами вектора по осям
    * @return {Object} список индексов и значений
    */
    symbol() {
      const result = {}, n = Math.min(this.dimension, vectorIndex.length);
      this.data.slice(0, n).forEach((e, i) => result[vectorIndex.charAt(i)] = e);
      return result;
    }

  /** Проверка на нулевой вектор
    * @return {Boolean} true, если все компоненты вектора - нули
    */
    empty() {
      return this.data.every(e => e === 0);
    }

  /** Проверка на единичный базисный вектор
    * @return {Boolean} true, если одна из компонент вектора единица, а остальные нули
    */
    basis() {
      return this.data.some(e => e === 1) && (this.data.filter(e => e === 0).length === this.dimension - 1);
    }

  /** Номер оси базисного вектора
    * @return {integer} номер ненулевой размерности
    */
    index() {
      return this.basis()
        ? this.data.indexOf(1)
        : -1;
    }

  /** Норма вектора
    * @return {number} значение нормы вектора
    */
    norm() {
      return this.data.reduce((r, e) => r + e ** 2, 0);
    }

  /** Длина вектора
    * @return {number} значение длины вектора
    */
    length() {
      return Math.hypot(...this.data); // Math.sqrt(this.norm());
    }

  /** Нормализация вектора
    * @return {Vector} сонаправленный с исходным единичный вектор
    */
    normalize() {
      const length = this.length();
      return length === 0
        ? Vector.empty(this.dimension)
        : this.scale(1 / length);
    }

  /** Сопряжённый вектор
    * @return {vector} (1 / vector)
    */
    link() {
      return new Vector(this.data.map(e => e === 0 ? 0 : 1 / e));
    }

  /** Обратный вектор
    * @return {Vector} (-vector)
    */
    reverse() {
      return new Vector(this.data.map(e => -e));
    }

  /** Вектор из компонент в обратном порядке
    * @return {Vector} (-vector)
    */
    inverse() {
      return new Vector(this.data.reverse());
    }

  /** Половина исходного вектора
    * @return {Vector} вектор половинного размера
    */
    half() {
      return new Vector(this.data.map(e => e / 2));
    }

  /** @subsection Аггрегирующие функции */
  /** Максимальная компонента вектора
    * @return {number} Значение максимальной компоненты или 0
    */
    max() {
      return Math.max(...this.data, 0);
    }

    /** Минимальный компонент вектора
    * @return {number} Значение минимальной компоненты или 0
    */
    min() {
      return Math.min(...this.data, 0);
    }

  /** Среднее всех компонентов вектора
    * @return {number} значение среднего
    */
    average() {
      if (this.dimension === 0) return 0;
      return this.data.reduce((r, e) => r + e, 0) / this.dimension;
    }

  /** Приведение покомпонентного максимума (выравнивание вектора) к отношению от максимума
    * @param {percent} level процент от минимума до максиума среди компонент вектора
    * @return {Vector} выровненный вектор
    */
    align(level = 1) {
      const min = this.min(), max = this.max();
      level = (max - min) * level + min;
      return this.level(level);
    }

  /** Приведение покомпонентного максимума (выравнивание вектора) к значению
    * @param {number} level абсолютное значение
    * @return {Vector} выровнненный вектор
    */
    level(level = 1) {
      return new Vector(this.data.map(e => e === 0 ? e : level));
    }

  /** Изменение размерности вектора @todo
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

  /** Изменение размерности вектора c дополнением единицами
    * уменьшение - хвостовые значения отбрасываются
    * увеличение - координаты инициализируются единицами
    * @param {natural} dimension размерность вектора
    * @return {Vector} вектор новой размерности
    */
    resizeIdentity(dimension) {
      return Vector.identity(dimension).fill(0, ...this.data);
    }

  /** Заполнение координат вектора новыми значениями
    * @param {natural} index позиция первого из заменяемых элементов в списке координат
    * @arguments {number} новые значения координат
    * @return {Vector} новый вектор с новыми значениями
    */
    fill(index, ...coord) {
      const data = this.data.slice();
      coord.forEach((e, i) => data[index + i] = e);
      return new Vector(data);
    }

  /** Умножение вектора на скаляр (масштабирование вектора)
    * @param {number} factor множитель (коэффициент масштабирования)
    * @return {Vector} новый вектор с новыми значениями координат
    */
    scale(factor) {
      return new Vector(this.data.map(e => e * factor));
    }

  /** Сложение векторов
    * @param {Vector} vector слагаемое
    * @return {Vector} вектор суммы
    */
    addition(vector) {
      return new Vector(this.data.map((e, i) => e + vector.data[i]));
    }

  /** Сложение векторов (с приведением размерностей)
    * @param {Vector} vector слагаемое
    * @return {Vector} вектор суммы
    */
    add(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).addition(vector.resize(n))
    }

  /** Разность векторов
    * @param {Vector} vector вычитаемое
    * @return {Vector} вектор разности
    */
    difference(vector) {
      return this.addition(vector.reverse());
    }

  /** Разность векторов (с приведением размерностей)
    * @param {Vector} vector вычитаемое
    * @return {Vector} вектор разности
    */
    diff(vector) {
      return this.add(vector.reverse());
    }

  /** Скалярное умножение векторов
    * @param {Vector} vector множитель
    * @return {number} результат умножения
    */
    scalar(vector) {
      return this.data.reduce((result, e, i) => result + e * vector.data[i], 0);
    }

  /** Скалярное умножение векторов (с приведением размерностей)
    * @param {Vector} vector множитель
    * @return {number} результат умножения
    */
    mult(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).scalar(vector.resize(n));
    }

  /** Векторное умножение (при размерности 3)
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiply(vector) {
      const A = this, B = vector;
      const a = Vector.from(A.z * B.y, A.x * B.z, A.y * B.x);
      const b = Vector.from(A.y * B.z, A.z * B.x, A.x * B.y);
      return Vector.to(a, b);
    }

  /** Покомпонентное умножение векторов
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiplication(vector) {
      return new Vector(this.data.map((e, i) => e * vector.data[i]));
    }

  /** Покомпонентное умножение векторов (с приведением размерностей)
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiplicate(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).multiplication(vector.resize(n));
    }

  /** Вращение вектора @2d
    * @param {number} angle угол поворота @radians
    * @return {Vector} вектор после поворота
    */
    rotate2d(angle) {
      const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
      const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
      return Vector.from(x, y);
    }

  /** Вращение вектора @3d @TODO:
    * @param {number} angle угол поворота @radians
    * @return {Vector} @this
    */
    rotate3D(angle) {
      // ...
      return this;
    }

  /** @subsection @export */
  /** Массив компонент вектора
    * @param {boolean} float32array необходимость вернуть типимизованный массив
    * @return {Array} массив координат вектора
    */
    export(float32array = false) {
      return float32array
        ? this.data.slice()
        : Array.from(this.data);
    }

  /** @subsection @method @static */
  /** Вектор из переданных параметров
    * @param {...number} coord координаты
    * @return {Vector} вектор
    */
    static from(...coord) {
      return new Vector(coord);
    }

  /** Нулевой (пустой) вектор любой размерности
    * @param {natural} dimension размерность вектора
    * @return {Vector} нулевой вектор
    */
    static empty(dimension) {
      return new Vector(new Float32Array(dimension)); // auto.fill(0)
    }

  /** Вектор любой размерности, все элементы которого одинаковые
    * @param {natural} dimension размерность вектора
    * @param {number} value значение элементов вектора
    * @return {Vector} вектор с единиичными компонентами
    */
    static identity(dimension, value = 1) {
      return new Vector((new Float32Array(dimension)).fill(value));
    }

  /** Единичный (базисный) вектор любой размерности
    * @param {natural} dimension размерность вектора
    * @param {natural} index     номер единичной координаты
    * @return {Vector} кроме index все координаты будут нулевыми
    */
    static basis(dimension, index) {
      return Vector.empty(dimension).fill(index, 1);
    }

  /** Вектор из точки A в точку B
    * @param {Vector} A координаты точки A
    * @param {Vector} B координаты точки B
    * @return {Vector} вектор разности B - A
    */
    static to(A, B) {
      return B.difference(A);
    }

  /** Расстояние между двумя точками
    * @param {Vector} A координаты точки A
    * @param {Vector} B координаты точки B
    * @return {number} длина вектора между точками
    */
    static distance(A, B) {
      return Vector.to(A, B).length();
    }

  /** Сравнение двух векторов
    * @param {Vector} A сравниваемые векторы
    * @param {Vector} B сравниваемые векторы
    * @param {number} precision точность
    * @return {Boolean} true, если векторы близкие
    */
    static compare(A, B, precision = 0.0001) {
      return A.data.every((e, i) => Math.abs(e - B.data[i]) < precision);
    }

  /** Вектор отношения двух векторов (одинаковых размерностей)
    * @param {Vector} A первый вектор
    * @param {Vector} B второй вектор
    * @return {Vector} вектор покомпонентного отношения
    */
    static relation(A, B) {
      return new Vector(B.data.map((e, i) => e / A.data[i]));
    }

  /** @subsection Ортогональные векторы */
  /** Ортогональный вектор @2d для линии на плоскости
    * @param {Vector} vector оригинальный вектор
    * @return {Vector} ортогональ
    */
    static ortho2(vector) {
      return Vector.from(-vector.y, vector.x);
    }

  /** Ортогональный вектор @3d для плоскости в пространстве
    * @param {Vector} A первый вектор задания плоскости
    * @param {Vector} B второй вектор задания плоскости
    * @return {Vector} ортогональ
    */
    static ortho3(A, B) {
      return A.multiply(B);
    }

  /** Единичный вектор нормали к плоскости, заданной тремя точками (a, b, c)
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

  /** Сумма нескольких векторов
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

  /** Приведение размерности векторов (выбор максимальной)
    * @param {...Vector} vectors список векторов
    * @return {number} максимальная размерность
    */
    static dimension(...vectors) {
      return Math.max(...vectors.map(e => e.dimension), 0);
    }
  }

  /** @subsection @const Частые значения */
    Vector.x     = Vector.basis(2, 0);
    Vector.y     = Vector.basis(2, 1);
    Vector.X     = Vector.basis(3, 0);
    Vector.Y     = Vector.basis(3, 1);
    Vector.Z     = Vector.basis(3, 2);
    Vector.zero  = Vector.empty(2);
    Vector.ZERO  = Vector.empty(3);
    Vector.flipX = Vector.from(-1,  1);
    Vector.flipY = Vector.from( 1, -1);
    Vector.FlipX = Vector.from(-1,  1,  1);
    Vector.FlipY = Vector.from( 1, -1,  1);
    Vector.FlipZ = Vector.from( 1,  1, -1);
    Vector.one   = Vector.identity(2);
    Vector.ONE   = Vector.identity(3);
    Vector.half  = Vector.from(0.5, 0.5);
    Vector.HALF  = Vector.from(0.5, 0.5, 0.5);

/** @section @private */
  const vectorIndex = 'xyzw';
