/** Алгебра: Векторы полезно для @2D и @3D
  * @author github.com/xaota
  *
  * @todo Ещё многое не описано. +этим тегом помечаю кандидаты на оптимизацию, переписывание и т. д.
  * @feature Цепочные вызовы, типа `Vector.from(1, 2, 3).scale(2).inverse.normal`
  * @imutable
  *
  * @typedef {number} Integer целые числа
  * @typedef {number} Natural натуральные числа и ноль, т.е., {unsigned int} // ноль не натуральное число
  * @typedef {number} Percent число в промежутке [0, 1]
  */

/** {Vector} Работа с векторами @export @class
  */
  export default class Vector {
    #data = new Float32Array([]);

  /** {Vector} Вектор из массива координат @constructor
    * @param {Float32Array|Array<number>} array данные координат вектора
    */
    constructor(array) {
      this.#data = new Float32Array(array);
    }

  /** @section FIELDS */
  /** Значение по оси X
    * @return {number} значение компоненты
    */
    get x() {
      return this.#data[0];
    }

  /** Значение по оси Y
    * @return {number} значение компоненты
    */
    get y() {
      return this.#data[1];
    }

  /** Значение по оси Z
    * @return {number} значение компоненты
    */
    get z() {
      return this.#data[2];
    }

  /** Значение по оси W
    * @return {number} значение компоненты
    */
    get w() {
      return this.#data[3];
    }

  /** Установка значения по оси X
    * @param {number} value устанавливаемое значение компоненты
    */
    set x(value) {
      this.#data[0] = value;
    }

  /** Установка значения по оси Y
    * @param {number} value устанавливаемое значение компоненты
    */
    set y(value) {
      this.#data[1] = value;
    }

  /** Установка значения по оси Z
    * @param {number} value устанавливаемое значение компоненты
    */
    set z(value) {
      this.#data[2] = value;
    }

  /** Установка значения по оси W
    * @param {number} value устанавливаемое значение компоненты
    */
    set w(value) {
      this.#data[3] = value;
    }

  /** Вектор из координат {X, Y} @2D / xy
    * @readonly
    */
    get xy() {
      const x = this.x || 0;
      const y = this.y || 0;
      return Vector.from(x, y);
    }

  /** Вектор из координат {X, Z} @2D / xz
    * @readonly
    */
    get xz() {
      const x = this.x || 0;
      const z = this.z || 0;
      return Vector.from(x, z);
    }

  /** Вектор из координат {Y, Z} @2D / yz
    * @readonly
    */
    get yz() {
      const y = this.y || 0;
      const z = this.z || 0;
      return Vector.from(y, z);
    }

  /** Вектор из координат {X, Y, Z} @2D, @3D / xyz
    * @readonly
    */
    get xyz() {
      const x = this.x || 0;
      const y = this.y || 0;
      const z = this.z || 0;
      return Vector.from(x, y, z);
    }

  /** Вектор из координат {X, Y, Z, W} @3D / xyzw
    * @readonly
    */
    get xyzw() {
      const x = this.x || 0;
      const y = this.y || 0;
      const z = this.z || 0;
      const w = this.w || 0;
      return Vector.from(x, y, z, w);
    }

  /** Вектор из координат {X, Y, Z ?? 1} @2D, @3D/ xyz1
    * @readonly
    */
    get xyz1() {
      const x = this.x || 0;
      const y = this.y || 0;
      const z = this.z ?? 1;
      return Vector.from(x, y, z);
    }

  /** Вектор из координат {X, Y, Z, W ?? 1} @3D / xyzw1
    * @readonly
    */
    get xyzw1() {
      const x = this.x || 0;
      const y = this.y || 0;
      const z = this.z || 0;
      const w = this.w ?? 1;
      return Vector.from(x, y, z, w);
    }

  /** Вектор из координат {Y, X} @2D (xy -> yx) / yx
    * @readonly
    */
    get yx() {
      const x = this.x || 0;
      const y = this.y || 0;
      return Vector.from(y, x);
    }

  /** @section COMMON */
  /** Проверка что вектор задан / nil
    * @return {boolean} false, если вектор задан
    */
    get nil() {
      return this.dimension === 0;
    }

  /** Заполнение координат вектора новыми значениями / fill
    * @param {Natural} index позиция первого из заменяемых элементов в списке координат
    * @arguments {number} новые значения координат
    * @return {Vector} новый вектор с новыми значениями
    */
    fill(index, ...coords) {
      const data = this.#data.slice();
      coords.forEach((e, i) => { data[index + i] = e });
      return new Vector(data);
    }

  /** Изменение координат и размерности вектора / splice
    * @param {Natural} index позиция первого из заменяемых элементов в списке координат
    * @param {Natural} deleteCount количество удаляемых элементов
    * @arguments {number} новые значения координат
    * @return {Vector} новый вектор с новыми значениями
    */
    splice(index, deleteCount, ...coords) {
      const data = Array.from(this.#data);
      data.splice(index, deleteCount, ...coords);
      return new Vector(data);
    }

  /** Изменение размерности вектора @todo / resize
    * уменьшение - хвостовые значения отбрасываются
    * увеличение - координаты инициализируются нулями
    * @param {Natural} dimension размерность вектора
    * @return {Vector} вектор новой размерности
    */
    resize(dimension) {
      const data = new Float32Array(dimension);
      const n = Math.min(dimension, this.dimension);
      for (let i = 0; i < n; ++i) data[i] = this.#data[i];
      return new Vector(data);
    }

  /** Изменение размерности вектора c дополнением единицами / resizeIdentity
    * уменьшение - хвостовые значения отбрасываются
    * увеличение - координаты инициализируются единицами
    * @param {Natural} dimension размерность вектора
    * @return {Vector} вектор новой размерности
    */
    resizeIdentity(dimension) {
      return Vector.identity(dimension).fill(0, ...this.#data);
    }

  /** Добавление координат (с увеличением размерности) / concat
    * @arguments {number} новые значения координат
    * @return {Vector} новый вектор с новыми значениями
    */
    concat(...coords) {
      const data = [...this.#data, ...coords];
      return new Vector(new Float32Array(data));
    }

  /** @section PROPERTY */
  /** Размерность вектора / dimension
    * @return {Natural} 0+
    */
    get dimension() {
      return this.#data.length;
    }

  /** Норма вектора / norm
    * @return {number} значение нормы вектора
    */
    get norm() {
      return this.#data.reduce((r, e) => r + e ** 2, 0);
    }

  /** Длина вектора / length, magnitude
    * @return {number} значение длины вектора
    */
    get length() {
      return Math.hypot(...this.#data) || 0; // Math.sqrt(this.norm);
    }

  /** Нормализация вектора / normal, normalize
    * @return {Vector} сонаправленный с исходным единичный вектор
    */
    get normal() {
      const factor = this.length;
      return this.divide(factor);
    }

  /** Проверка на нулевой вектор / empty
    * @return {Boolean} true, если все компоненты вектора - нули
    */
    get empty() {
      const nil = this.nil;
      const zero = this.#data.every(e => e === 0);
      return !nil && zero;
    }

  /** Проверка на вектор, все элементы которого единицы / identity
    * @return {Boolean} true, если все компоненты вектора - единицы
    */
    get identity() {
      const nil = this.nil;
      const one = this.#data.every(e => e === 1);
      return !nil && one;
    }

  /** Сопряжённый вектор (1/a) / link, adjoint, conjugate
    * @return {Vector} (1 / vector)
    */
    get adjoint() {
      return new Vector(this.#data.map(e => e === 0 ? 0 : 1 / e));
    }

  /** Обратный вектор (-a) / inverse
    * @return {Vector} (-vector)
    */
    get inverse() {
      return new Vector(this.#data.map(e => -e));
    }

  /** Вектор из компонент в обратном порядке / reverse
    * @return {Vector} vector.data.reverse()
    */
    get reverse() {
      return new Vector(this.#data.reverse());
    }

  /** / reflect
    * @param {Vector} vector dimension = 3
    * @returns {Vector} dimension = 3
    */
    reflect(vector) {
      return this.difference(vector.scale(2 * this.dot(vector)));
    }

  /** Вектор с половинными значениями от исходного / half
    * @return {Vector} вектор половинного размера
    */
    get half() {
      return this.divide(2);
    }

  /** @section BASIS */
  /** Проверка на единичный базисный вектор / basis
    * @return {Boolean} true, если одна из компонент вектора единица, а остальные нули
    */
    get basis() {
      const direction = this.#data.some(e => e === 1);
      const zeros = this.#data.filter(e => e === 0);
      const flag = zeros.length === this.dimension - 1;
      return direction && flag;
    }

  /** Номер оси базисного вектора / index
    * @return {Integer} номер ненулевой размерности
    */
    get index() {
      return this.basis
        ? this.#data.indexOf(1)
        : -1;
    }

  /** @section METHOD */
  /** Умножение вектора на скаляр (масштабирование вектора) / scale
    * @param {number} factor множитель (коэффициент масштабирования)
    * @return {Vector} новый вектор с новыми значениями координат
    */
    scale(factor) {
      return new Vector(this.#data.map(e => e * factor));
    }

  /** Деление вектора на скаляр (для удобства) / divide(x) === scale(1 / x)
    * @param {number} factor делитель (коэффициент масштабирования)
    * @return {Vector} новый вектор с новыми значениями координат
    */
    divide(factor) {
      if (factor === 0) return Vector.empty(this.dimension);
      return new Vector(this.#data.map(e => e / factor));
    }

  /** Сложение векторов / addition
    * @param {Vector} vector слагаемое
    * @return {Vector} вектор суммы
    */
    addition(vector) {
      const array = this.#data.map((e, i) => e + vector.#data[i]);
      return new Vector(array);
    }

  /** Сложение векторов (с приведением размерностей) / addition
    * @param {Vector} vector слагаемое
    * @return {Vector} вектор суммы
    */
    ADDITION(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).addition(vector.resize(n))
    }

  /** Разность векторов / difference, subtract
    * @param {Vector} vector вычитаемое
    * @return {Vector} вектор разности
    */
    difference(vector) {
      return this.addition(vector.inverse);
    }

  /** Разность векторов (с приведением размерностей) / difference
    * @param {Vector} vector вычитаемое
    * @return {Vector} вектор разности
    */
    DIFFERENCE(vector) {
      return this.ADDITION(vector.inverse);
    }

  /** Скалярное умножение векторов / dot (scalar)
    * @param {Vector} vector множитель
    * @return {number} результат умножения
    */
    dot(vector) {
      return this.#data.reduce((result, e, i) => result + e * vector.#data[i], 0);
    }

  /** Скалярное умножение векторов (с приведением размерностей) / dot
    * @param {Vector} vector множитель
    * @return {number} результат умножения
    */
    DOT(vector) {
      const n = Vector.dimension(this, vector);
      return this.resize(n).dot(vector.resize(n));
    }

  /** Векторное умножение (при размерности 3) / cross
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    * @TODO: cross3D + cross(n)
    */
    cross(vector) {
      const A = this; const B = vector;
      const a = Vector.from(A.z * B.y, A.x * B.z, A.y * B.x);
      const b = Vector.from(A.y * B.z, A.z * B.x, A.x * B.y);
      return Vector.to(a, b);
    }

  /** Покомпонентное умножение векторов (для удобства) / multiply
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    multiply(vector) {
      return new Vector(this.#data.map((e, i) => e * vector.data[i]));
    }

  /** Покомпонентное умножение векторов (с приведением размерностей) (для удобства) / multiply
    * @param {Vector} vector множитель
    * @return {Vector} результат умножения
    */
    MULTIPLY(vector) {
      const n = Vector.dimension(this, vector);
      return this.resizeIdentity(n).multiply(vector.resizeIdentity(n));
    }

  /** Покомпонентное деление векторов (для удобства) / multiply
    * @param {Vector} vector делитель
    * @return {Vector} результат умножения
    */
    division(vector) {
      return new Vector(this.#data.map((e, i) => e / vector.data[i]));
    }

  /** Покомпонентное деление векторов (с приведением размерностей) (для удобства) / multiply
    * @param {Vector} vector делитель
    * @return {Vector} результат деления
    */
    DIVISION(vector) {
      const n = Vector.dimension(this, vector);
      return this.resizeIdentity(n).division(vector.resizeIdentity(n));
    }

  /** Вращение вектора @2D / rotate2D
    * @param {number} angle угол поворота @radians
    * @return {Vector} вектор после поворота
    */
    rotate2D(angle) {
      const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
      const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
      return Vector.from(x, y);
    }

  /** Вращение вектора @3d / rotate3D
    * @param {number} angle угол поворота @radians
    * @return {Vector} @this
    * @TODO: создать метод
    */
    rotate3D(angle) {
      // ...
      return this;
    }

  /** @section COLLISION */
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

  /** Находится ли точка в прямоугольной области, ограничивающую текущий вектор / has2D
    * @param {Vector} point координаты проверямой точки
    * @param {boolean} edges? включать ли внешние границы
    * @return {boolean} Vector.zero <= point (edges ? <= : <) vector
    */
    has2D(point, edges = false) {
      const zero = point.x >= 0 && point.y >= 0;
      if (!zero) return false;
      return edges
        ? point.x <= this.x && point.y <= this.y
        : point.x < this.x && point.y < this.y;
    }

  /** Находится ли точка в ограничивающем текущий вектор параллепипеде / has3D
    * @param {Vector} point координаты проверямой точки
    * @param {boolean} edges? включать ли внешние границы
    * @return {boolean} Vector.zero <= point (edges ? <= : <) vector
    */
    has3D(point, edges = false) {
      const zero = point.x >= 0 && point.y >= 0 && point.z >= 0;
      if (!zero) return false;
      return edges
        ? point.x <= this.x && point.y <= this.y && point.z <= this.z
        : point.x < this.x && point.y < this.y && point.z < this.z;
    }

  /** @section AGGREGATE */
  /** Максимальная компонента вектора / max
    * @return {number} Значение максимальной компоненты или 0
    */
    get max() {
      return Math.max(...this.#data) || 0;
    }

  /** Минимальная компонента вектора / min
    * @return {number} Значение минимальной компоненты или 0
    */
    get min() {
      return Math.min(...this.#data) || 0;
    }

  /** Сумма всех компонент вектора / summary
    * @return {number} Сумма всех компонент
    */
    get summary() {
      return this.#data.reduce((result, e) => result + e, 0);
    }

  /** Произведение всех компонент вектора / product
    * @return {number} Произведение всех компонент
    */
    get product() {
      return this.#data.reduce((result, e) => result * e, 1);
    }

  /** Среднее всех компонент вектора / mean, average
    * @return {number} значение среднего
    */
    get mean() {
      if (this.dimension === 0) return 0;
      return this.#data.reduce((r, e) => r + e, 0) / this.dimension;
    }

  /** Приведение покомпонентного максимума (выравнивание вектора) к отношению от максимума / align
    * @param {Percent} level процент от минимума до максиума среди компонент вектора
    * @return {Vector} выровненный вектор
    */
    align(level = 1) {
      const min = this.min; const max = this.max;
      level = (max - min) * level + min;
      return this.level(level);
    }

  /** Приведение покомпонентного максимума (выравнивание вектора) к значению / level
    * @param {number} level абсолютное значение
    * @return {Vector} выровнненный вектор
    */
    level(level = 1) {
      return new Vector(this.#data.map(e => e === 0 ? e : level));
    }

  /** @section @factory @static */
  /** Вектор любой размерности, все элементы которого одинаковые / identity @static
    * @param {Natural} dimension размерность вектора
    * @param {number} value значение элементов вектора
    * @return {Vector} вектор с единиичными компонентами
    */
    static identity(dimension = 2, value = 1) {
      return new Vector((new Float32Array(dimension)).fill(value));
    }

  /** Единичный (базисный) вектор любой размерности / basis @static
    * @param {Natural} dimension размерность вектора
    * @param {Natural} index     номер единичной координаты
    * @return {Vector} кроме index все координаты будут нулевыми
    */
    static basis(dimension, index) {
      return Vector.empty(dimension).fill(index, 1);
    }

  /** Двухмерный вектор из полярных координат / polar @static @2D
    * @param {number} r длина вектора (радиус)
    * @param {number} phi угол поворота на базовой плоскости (азимутный угол)
    * @return {Vector} Двухмерный вектор {x, y} в декартовых координатах
    */
    static polar(r, phi) {
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      return Vector.v2(x, y);
    }

  /** Трехмерный вектор из цилиндрических координат / cylinder @static @3D
    * @param {number} r длина вектора (радиус)
    * @param {number} phi угол поворота на базовой плоскости (азимутный угол)
    * @param {number} z расстояние до базовой плоскости
    * @return {Vector} Трёхмерный вектор {x, y, z} в декартовых координатах
    */
    static cylinder(r, phi, z) {
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      return Vector.v3(x, y, z);
    }

  /** Трехмерный вектор из сферических координат / cylinder @static @3D
    * @param {number} r длина вектора (радиус)
    * @param {number} phi угол поворота на базовой плоскости (азимутный угол)
    * @param {number} theta угол поворота от фундаментальной плоскости (зенитный / полярный угол)
    * @return {Vector} Трёхмерный вектор {x, y, z} в декартовых координатах
    */
    static sphere(r, phi, theta) {
      const rsin = r * Math.sin(theta);
      const x = rsin * Math.cos(phi);
      const y = rsin * Math.sin(phi);
      const z = r * Math.cos(theta);
      return Vector.v3(x, y, z);
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
      return Vector.to(A, B).length;
    }

  /** Покомпонентное отношение двух векторов / relation @static
    * @param {Vector} A первый вектор
    * @param {Vector} B второй вектор
    * @return {Vector} вектор покомпонентного отношения
    */
    static relation(A, B) {
      return new Vector(B.#data.map((e, i) => e / A.#data[i]));
    }

  /** Покомпонентное отношение двух векторов (с приведением размерностей) / relation @static
    * @param {Vector} A первый вектор
    * @param {Vector} B второй вектор
    * @return {Vector} вектор покомпонентного отношения
    */
    static RELATION(A, B) {
      const n = Vector.dimension(A, B);
      const a = A.resizeIdentity(n);
      const b = B.resizeIdentity(n);
      return new Vector(b.#data.map((e, i) => e / a.#data[i]));
    }

  /** Приведение размерности векторов (выбор максимальной) / dimension @static
    * @param {Array<Vector>} vectors список векторов
    * @return {number} максимальная размерность
    */
    static dimension(...vectors) {
      return Math.max(...vectors.map(e => e.dimension), 0);
    }

  /** Вектор случайных значений / random @static
    * @param {Natural} dimension размерность итогового вектора
    * @return {Vector} истоговый вектор с значениями [0, 1)
    */
    static random(dimension = 2) {
      const array = Array.from({ length: dimension }, () => Math.random());
      return new Vector(array);
    }

  /** Нулевой (пустой) вектор любой размерности / empty @static
    * @param {Natural} dimension размерность вектора
    * @return {Vector} нулевой вектор
    */
    static empty(dimension = 2) {
      return new Vector(new Float32Array(dimension));
    }

  /** Единичный вектор нормали к плоскости, заданной тремя точками (a, b, c) / normal @static @3D
    * @param {Vector} a координаты точки a
    * @param {Vector} b координаты точки b
    * @param {Vector} c координаты точки c
    * @return {Vector} вектор нормали
    */
    static normal(a, b, c) {
      const A = Vector.to(b, a);
      const B = Vector.to(b, c);
      return A.cross(B).normal.inverse;
    }

  /** Сумма нескольких векторов / addition @static
    * @param {Natural} dimension размерность складываемых векторов
    * @param {...Vector} vectors слагаемые векторы размерности dimension
    * @return {Vector} вектор суммы
    */
    static addition(dimension = 0, ...vectors) {
      if (vectors.length === 0) {
        return dimension > 0
          ? Vector.empty(dimension)
          : new Vector([]);
      };

      return vectors
        .slice(1)
        .reduce((result, vector) => result.addition(vector), vectors[0]);
    }

  /** Вектор из переданных параметров / from @static
    * @param {...number} coords координаты (любая размерность)
    * @return {Vector} вектор
    */
    static from(...coords) {
      return new Vector(coords);
    }

  /** Создание 2D вектора / v2 @static
    * @param {number} x координата x
    * @param {number} y координата y
    * @return {Vector} вектор
    */
    static v2(x, y) {
      return new Vector([x, y]);
    }

  /** Создание 3D вектора / v3 @static
    * @param {number} x координата x
    * @param {number} y координата y
    * @param {number} z координата z
    * @return {Vector} вектор
    */
    static v3(x, y, z = 0) {
      return new Vector([x, y, z]);
    }

  /** Создание 4D вектора / v4 @static
    * @param {number} x координата x
    * @param {number} y координата y
    * @param {number} z координата z
    * @param {number} w координата w
    * @return {Vector} вектор
    */
    static v4(x, y, z = 0, w = 0) {
      return new Vector([x, y, z, w]);
    }

  /** @subsection Ортогональные векторы */
  /** Ортогональный вектор @2D для линии на плоскости / ortho2D, normal2D
    * @param {Vector} vector оригинальный вектор
    * @return {Vector} ортогональ
    */
    static ortho2D(vector) {
      return Vector.from(-vector.y, vector.x);
    }

  /** Ортогональный вектор @3D для плоскости в пространстве / ortho3D, normal3D
    * @param {Vector} A первый вектор для задания плоскости
    * @param {Vector} B второй вектор для задания плоскости
    * @return {Vector} ортогональ
    */
    static ortho3D(A, B) {
      return A.cross(B);
    }

  /** @section SERIALIZE */
  /** Массив значений координат вектора / data
    * @readonly
    * @return {Float32Array} координаты
    */
    get data() {
      return this.#data;
    }

  /** Объект значений координат вектора / object
    * @readonly
    * @return {object} {x?, y?, z?, w?, [0...dimension - 1]: number}
    */
    get object() {
      const index = 'xyzw';
      const result = {};
      const dimension = this.dimension;
      const min = Math.min(index.length, dimension);
      for (let i = 0; i < min; ++i) {
        const char = index[i];
        result[char] = this[char];
      }
      this.#data.forEach((e, i) => { result[i] = e });
      return result;
    }

  /** Копия вектора / copy
    * @return {Vector} копия вектора
    */
    get copy() {
      return new Vector(this.#data);
    }

  /** Строковое представление вектора / toString @debug
    * @param {Natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} Vector{x, y, z, ...}
    */
    toString(precision = 2) {
      return 'Vector' + this.toMath(precision)
    }

  /** JSON-представление вектора / toJSON
    * @return {string} Vector{x, y, z, ...}
    */
    toJSON() {
      return `Vector{${this.#data.join(',')}}`;
    }

  /** Математическая запись вектора / toMath
    * @param {Natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} {x, y, z, ...}
    */
    toMath(precision = 2) {
      const data = Array.from(this.#data, e => e.toFixed(precision));
      return `{${data.join(', ')}}`;
    }

  /** @section COMPARE */
  /** Сравнение длин векторов / compare @static
    * @param {Vector} A сравниваемые векторы
    * @param {Vector} B сравниваемые векторы
    * @return {number} +1, если A > B
    */
    static compare(A, B) {
      const lengthA = A.length;
      const lengthB = B.length;
      return lengthA > lengthB ? 1 : lengthB > lengthA ? -1 : 0;
    }

  /** Сравнение векторов / equal @static
    * @param {Vector} A сравниваемые векторы
    * @param {Vector} B сравниваемые векторы
    * @return {Boolean} true, если A === B
    */
    static equal(A, B) {
      const dimension = A.dimension === B.dimension;
      const dataA = A.data;
      const dataB = B.data;
      return dimension && dataA.every((e, i) => dataB[i] === e);
    }

  /** Проверка типа / is @static
    * @param {any} vector проверяемый элемент
    * @return {boolean} true, если параметр - {Vector}
    */
    static is(vector) {
      return vector instanceof Vector;
    }
  }

/** @section @const Частые значения */
/** 2D */
  Vector.x        = Vector.basis(2, 0);
  Vector.y        = Vector.basis(2, 1);
  Vector.xy       = Vector.v2(1, 1);
  Vector.zero     = Vector.empty(2);
  Vector.flipX    = Vector.v2(-1, 1);
  Vector.flipY    = Vector.v2(1, -1);
  Vector.one      = Vector.identity(2);
  Vector.half     = Vector.v2(0.5, 0.5);
  Vector.infinity = Vector.v2(Infinity, Infinity);

/** 3D */
  Vector.X        = Vector.basis(3, 0);
  Vector.Y        = Vector.basis(3, 1);
  Vector.Z        = Vector.basis(3, 2);
  Vector.W        = Vector.basis(4, 3);
  Vector.XY       = Vector.v3(1, 1, 0);
  Vector.XZ       = Vector.v3(1, 0, 1);
  Vector.YZ       = Vector.v3(0, 1, 1);
  Vector.XYZ      = Vector.v3(1, 1, 1);
  Vector.ZERO     = Vector.empty(3);
  Vector.FlipX    = Vector.v3(-1, 1,  1);
  Vector.FlipY    = Vector.v3(1, -1,  1);
  Vector.FlipZ    = Vector.v3(1,  1, -1);
  Vector.ONE      = Vector.identity(3);
  Vector.HALF     = Vector.v3(0.5, 0.5, 0.5);
  Vector.INFINITY = Vector.v3(Infinity, Infinity, Infinity);

/** Matrices SIZES */
/** @type {Vector} 2x2 */
  Vector.d2 = Vector.from(2, 2);

/** @type {Vector} 3x3 */
  Vector.d3 = Vector.from(3, 3);

/** @type {Vector} 4x4 */
  Vector.d4 = Vector.from(4, 4);
