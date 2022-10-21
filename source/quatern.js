/** Алгебра: Кватернионы полезно для @2D и @3D
  * @author github.com/xaota
  *
  * @todo Ещё многое не описано. +этим тегом помечаю кандидаты на оптимизацию, переписывание и т. д.
  * @feature Цепочные вызовы, типа `Vector.from(1, 2, 3).scale(2).inverse.normal`
  *
  * @typedef {number} Integer целые числа
  * @typedef {number} Natural натуральные числа и ноль, т.е., {unsigned int} // ноль не натуральное число
  * @typedef {number} Percent число в промежутке [0, 1]
  */

import Vector from "./vector.js";

/** {Quatern} Работа с кватернионами @export @class
  * @field x y z w {number} элементы кватерниона
  */
  export default class Quatern {
  /** @type {number} x */
    #x;

  /** @type {number} y */
    #y;

  /** @type {number} z */
    #z;

  /** @type {number} w */
    #w;

  /** {Quatern} Кватернион из элементов-параметров @constructor
    * @param {number} x элемент кватерниона
    * @param {number} y элемент кватерниона
    * @param {number} z элемент кватерниона
    * @param {number} w элемент кватерниона
    */
    constructor(x = 0, y = 0, z = 0, w = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

  /** @section FIELDS */
  /** Значение по оси X
    * @return {number} значение компоненты
    */
    get x() {
      return this.#x;
    }

  /** Значение по оси Y
    * @return {number} значение компоненты
    */
    get y() {
      return this.#y;
    }

  /** Значение по оси Z
    * @return {number} значение компоненты
    */
    get z() {
      return this.#z;
    }

  /** Значение по оси W
    * @return {number} значение компоненты
    */
    get w() {
      return this.#w;
    }

  /** Установка значения по оси X
    * @param {number} value устанавливаемое значение компоненты
    */
    set x(value) {
      this.#x = value;
    }

  /** Установка значения по оси Y
    * @param {number} value устанавливаемое значение компоненты
    */
    set y(value) {
      this.#y = value;
    }

  /** Установка значения по оси Z
    * @param {number} value устанавливаемое значение компоненты
    */
    set z(value) {
      this.#z = value;
    }

  /** Установка значения по оси W
    * @param {number} value устанавливаемое значение компоненты
    */
    set w(value) {
      this.#w = value;
    }

  /** Вектор значений / xyz
    * @readonly
    * @return {Vector} вектор
   */
    get xyz() {
      return Vector.v3(this.x, this.y, this.z);
    }

  /** Вещественная составляющая кватерниона / angle, argument
    * @readonly
    * @return {number} угол
    */
    get angle() {
      return Math.acos(this.w) * 2;
    }

  /** Векторная составляющая кватерниона / vector
    * @readonly
    * @return {Vector} вектор
    */
    get vector() {
      const sin = Math.sin(Math.acos(this.w));
      const x = this.x / sin;
      const y = this.y / sin;
      const z = this.z / sin;
      return Vector.v3(x, y, z);
    }

  /** @section PROPERTY */
  /** Проверка на нулевой кватернион / empty
    * @return {Boolean} true, если все компоненты вектора - нули
    */
    get empty() {
      return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0;
    }

  /** Длина (модуль) кватерниона |q| / abs, modul, length, magnitude
    * @return {number} значение нормы кватерниона
    */
    get length() {
      return Math.hypot(...this.data); // Math.sqrt(this.norm);
    }

  /** Норма кватерниона N(q) / norm, length2
    * @return {number} значение квадрата нормы кватерниона
    */
    get norm() {
      const { x, y, z, w } = this.object;
      return x * x + y * y + z * z + w * w;
    }

  /** Отрицательный кватернион (-q) / reverse
    * @return {Quatern} {-x, -y, -z, -w}
    */
    get reverse() {
      return new Quatern(-this.x, -this.y, -this.z, -this.w);
    }

  /** Сопряжённый кватернион (q^*) / link, adjoint, conjugate
    * @return {Quatern} {-x, -y, -z, w}
    */
    get adjoint() {
      return new Quatern(-this.x, -this.y, -this.z, this.w);
    }

  /** Нормализация кватерниона (знак) / normal, normalize, sign
    * @return {Quatern} сонаправленный с исходным единичный кватернион
    */
    get normal() {
      return this.divide(this.length);
    }

  /** Обратный кватернион (q^-1) / inverse
    * @return {Vector} сонаправленный с исходным единичный кватернион
    */
    get inverse() {
      return this.adjoint.divide(this.norm);
    }

  /** @section ALGEBRA */
  /** Сложение кватернионов / addition
    * @param {Quatern} q слагаемый кватернион
    * @return {Quatern}
    */
    addition(q) {
      const { x, y, z, w } = this.object;
      return new Quatern(x + q.x, y + q.y, z + q.z, w + q.w);
    }

  /** Умножение кватерниона на скаляр / scale
    * @param {number} factor делитель (коэффициент масштабирования)
    * @return {Quatern} новый кватернион с новыми значениями координат
    */
    scale(factor) {
      if (factor === 0) return Quatern.zero;
      const { x, y, z, w } = this.object;
      return new Quatern(x * factor, y * factor, z * factor, w * factor);
    }

  /** Скалярное умножение кватернионов / dot
    * @param {Quatern} q кватернион-множитель
    * @return {number} скаляр: результат умножения
    */
    dot(q) {
      const { x, y, z, w } = this.object;
      return x * q.x + y * q.y + z * q.z + w * q.w;
    }

  /** Умножение кватернионов / cross
    * @param {Quatern} q кватернион-множитель
    * @return {Quatern} результат умножения
    */
    cross(q) {
      const { x, y, z, w } = this.object;
      const X = w * q.x + x * q.w + y * q.z - z * q.y;
      const Y = w * q.y + y * q.w + z * q.x - x * q.z;
      const Z = w * q.z + z * q.w + x * q.y - y * q.x;
      const W = w * q.w - x * q.x - y * q.y - z * q.z;
      return new Quatern(X, Y, Z, W);
    }

  /** Умножение кватерниона на вектор / multiply
    * @param {Vector} vector множитель (dimension = 3)
    * @return {Vector} результат умножения (dimension = 3)
    */
    multiply(vector) {
      const xyz = this.xyz;
      const W = vector.scale(this.w);
      const V = xyz.cross(vector).addition(W);
      return vector.addition(xyz.cross(V).scale(2));
    }

  /** @section METHOD */
  /** Деление кватерниона на скаляр (для удобства) / divide(x) === scale(1 / x)
    * @param {number} factor делитель (коэффициент масштабирования)
    * @return {Quatern} новый кватернион с новыми значениями координат
    */
    divide(factor) {
      if (factor === 0) return Quatern.zero;
      const { x, y, z, w } = this.object;
      return new Quatern(x / factor, y / factor, z / factor, w / factor);
    }

  /** Вычитание кватернионов / difference
    * @param {Quatern} q вычитаемый кватернион
    * @return {Quatern} результат
    */
    difference(q) {
      const { x, y, z, w } = this.object;
      return new Quatern(x - q.x, y - q.y, z - q.z, w - q.w);
    }

  /** Угол между кватернионами / angle @static
    * @param {Quatern} A кватернион 1
    * @param {Quatern} B кватернион 2
    * @return {number} угол
    */
    static angle(A, B) {
      return Math.acos(A.dot(B) / (A.length * B.length));
    }

  /** LERP - Linear Interpolation
    * @param {Quatern} A начальное значение
    * @param {Quatern} B конечное значение
    * @param {Percent} percent процент от перехода
    * @return {Quatern} промежуточный кватернион
    */
    static LERP(A, B, percent = 0) {
      if (percent <= 0) return A;
      if (percent >= 1) return B;

      return A.dot(B) < 0
        ? A.difference(B.addition(A).scale(percent))
        : A.addition(B.difference(A).scale(percent));
    }

  /** SLERP - Spherical Linear Interpolation (сферическая линейная интерполяция)
    * @param {Quatern} A начальное значение
    * @param {Quatern} B конечное значение
    * @param {Percent} percent процент от перехода
    * @return {Quatern} промежуточный кватернион
    */
    static SLERP(A, B, percent = 0, precision = 0.0001) {
      if (percent <= 0) return A;
      if (percent >= 1) return B;

      /** @type {Quatern} */
      let temp;

      let cosom = A.dot(B);
      if (cosom < 0) {
        temp = B.reverse;
        cosom = -cosom;
      } else {
        temp = B;
      }

      let scale0;
      let scale1;

      if (1 - cosom > precision) {
        const omega = Math.acos(cosom);
        const sinom = 1 / Math.sin(omega);

        scale0 = Math.sin((1 - percent) * omega) * sinom;
        scale1 = Math.sin(percent * omega) * sinom;
      } else {
        scale0 = 1 - percent;
        scale1 = percent;
      }

      return A.scale(scale0).addition(temp.scale(scale1));
    }

  // @TODO: SQUAD (Spherical and Quadrangle — сферическая и четырёхугольная) можно использовать для плавной интерполяции по пути поворотов

  /** @section CREATE */
  /** Кватернион из скаляра и трёхмерного вектора / from @static
    * @param {number} angle Вещественная составляющая кватерниона
    * @param {Vector} vector Векторная составляющая кватерниона
    * @return {Quatern} кватернион
    */
    static from(angle, vector) {
      const alpha = angle / 2;
      const sin = Math.sin(alpha);
      const cos = Math.cos(alpha);

        const w = cos;
        const x = vector.x * sin;
        const y = vector.y * sin;
        const z = vector.z * sin;
      return new Quatern(x, y, z, w);
    }

  /** Кватернион из элементов массива / data @static
    * @param {Float32Array|Array<number>} array массив элементов кватерниона
    * @return {Quatern} кватернион
    */
    static data(array) {
      return new Quatern(array[0], array[1], array[2], array[3]);
    }

  /** @section SERIALIZE */
  /** Массив значений кватерниона / data
    * @readonly
    * @return {Float32Array} [x, y, z, w];
    */
    get data() {
      return new Float32Array([this.x, this.y, this.z, this.w]);
    }

  /** Объект значений кватерниона / object
    * @readonly
    * @return {{x: number, y: number, z: number, w: number}} объект значений кватернина
    */
    get object() {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
    }

  /** Копия кватерниона / copy
    * @return {Quatern} кватернион
    */
    get copy() {
      return new Quatern(this.x, this.y, this.z, this.w);
    }

  /** Строковое представление кватерниона / toString @debug
    * @param {Natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} Quatern{w, xi, yj, zk}
    */
    toString(precision = 2) {
      const w = this.w.toFixed(precision);
      const x = this.x.toFixed(precision);
      const y = this.y.toFixed(precision);
      const z = this.z.toFixed(precision);
      return `Quatern{${w}, ${x}i, ${y}j, ${z}k}`;
    }

  /** JSON-представление кватерниона / toJSON
    * @return {string} Vector{x,y,z,...}
    */
    toJSON() {
      return `Quatern{${this.data.join(',')}}`;
    }

  /** Математическая запись кватерниона / toMath
    * @param {Natural} precision количество знаков после запятой в значениях элементов
    * @return {string} "a + bi + cj + dk";
    */
    toMath(precision = 2) {
      const i = this.x.toFixed(precision) + 'i';
      const j = this.y.toFixed(precision) + 'j';
      const k = this.z.toFixed(precision) + 'k';

      const W = this.w.toFixed(precision);
      const I = i.startsWith('-') ? ' - ' + i.slice(1) : ' + ' + i;
      const J = j.startsWith('-') ? ' - ' + j.slice(1) : ' + ' + j;
      const K = k.startsWith('-') ? ' - ' + k.slice(1) : ' + ' + k;
      return W + I + J + K;
    }

  /** @section COMPARE */
  /** Сравнение длин кватернионов / compare @static
    * @param {Quatern} A сравниваемый кватернион 1
    * @param {Quatern} B сравниваемый кватернион 2
    * @return {number} +1, если A > B
    */
    static compare(A, B) {
      const lengthA = A.length;
      const lengthB = B.length;
      return lengthA > lengthB ? 1 : lengthB > lengthA ? -1 : 0;
    }

  /** Сравнение двух кватернионов / equal @static
    * @param {Quatern} A сравниваемый кватернион 1
    * @param {Quatern} B сравниваемый кватернион 2
    * @return {boolean} true, если A === B
    */
    static equal(A, B) {
      return A.x === B.x && A.y === B.y && A.z === B.z && A.w === B.w;
    }

  /** Проверка типа / is @static
    * @param {any} quatern проверяемый элемент
    * @return {boolean} true, если параметр - {Quatern}
    */
    static is(quatern) {
      return quatern instanceof Quatern;
    }
  }

/** @section @const Частые значения */
Quatern.zero = new Quatern(0, 0, 0, 0);
Quatern.one  = new Quatern(0, 0, 0, 1);
