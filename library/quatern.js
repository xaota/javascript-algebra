/** @description Алгебра: Кватернионы полезно для @2d и @3d [es6]
  * @author github.com/xaota
  * @typedef {number} Integer целые числа
  * @typedef {number} Natural натуральные числа и ноль, т.е., {unsigned int} // ноль не натуральное число
  * @typedef {number} Percent число в промежутке [0, 1]

  * @todo Ещё гора чего не описана. +этим тегом помечаю кандидаты на оптимизацию, переписывание и т. д.
  * @feature Цепочные вызовы, типа `Vector.from(1,2,3).scale(2).reverse().normalize()`
  */

/** {Quatern} Работа с кватернионами @export @class
  * @field x y z w {number} элементы кватерниона
  */
  export default class Quatern {
  /** {Quatern} Кватернион из элементов-параметров @constructor
    * @param {number} x элемент кватерниона
    * @param {number} y элемент кватерниона
    * @param {number} z элемент кватерниона
    * @param {number} w элемент кватерниона
    */
    constructor(x, y, z, w) {
      Object.assign(this, { x, y, z, w });
    }

  /** @subsection @method */
  /** Копия кватерниона
    * @return {Quatern} кватернион
    */
    copy() {
      return new Quatern(this.x, this.y, this.z, this.w);
    }

  /** Массив значений элементов кватерниона
    * @return {Float32Array} [x, y, z, w]
    */
    data() {
      return new Float32Array([this.x, this.y, this.z, this.w]);
    }

  /** Норма кватерниона
    * @return {number} значение нормы
    */
    norm() {
      return this.data().reduce((r, e) => r + e ** 2, 0);
    }

  /** Модуль кватерниона
    * @return {number} значениие модуля
    */
    absolute() {
      return Math.hypot(this.x, this.y, this.z, this.w); // Math.sqrt(this.norm());
    }

  /** Знак кватерниона
    * @return {Quatern} кватернион
    */
    sign() {
      const abs = this.absolute();
      return abs === 0
        ? Quatern.empty
        : this.scale(1 / abs);
    }

  /** Аргумент кватерниона
    * @return {number} значение аргумента
    */
    argument() {
      // arg q = Math.acos(a / q.absolute()), где q = (a, vector)
      return Math.acos(this.w) * 2;
    }

  /** Сопряжённый кватернион
    * @return {Quatern} кватернион
    */
    reverse() {
      return new Quatern(-this.x, -this.y, -this.z, this.w);
    }

  /** Обратный (по умножению) кватернион
    * @return {Quatern} кватернион
    */
    inverse() {
      const norm = this.norm();
      return norm === 0
        ? Quatern.empty
        : this.reverse().scale(1 / norm);
    }

  /** Умножение кватерниона на скаляр
    * @param {number} factor множитель
    * @return {Quatern} кватернион
    */
    scale(factor) {
      return Quatern.data(this.data().map(e => e * factor));
    }

  /** Сложение кватернионов
    * @param {Quatern} quatern слагаемое
    * @return {Quatern} кватернион
    */
    addition(quatern) {
      const A = this; const B = quatern;
      return new Quatern(A.x + B.x, A.y + B.y, A.z + B.z, A.w + B.w);
    }

  /** Скалярное умножение кватернионов / dot (scalar)
    * @param {Quatern} quatern множитель
    * @return {Quatern} кватернион
    */
    dot(quatern) {
      const A = this; const B = quatern;
      return new Quatern(A.x * B.x, A.y * B.y, A.z * B.z, A.w * B.w);
    }

  /** Умножение кватернионов
    * @param {Quatern} quatern множитель
    * @return {Quatern} кватернион
    */
    multiply(quatern) {
      const A = this; const B = quatern;
        const x = A.w * B.x + A.x * B.w + A.y * B.z - A.z * B.y;
        const y = A.w * B.y - A.x * B.z + A.y * B.w + A.z * B.x;
        const z = A.w * B.z + A.x * B.y - A.y * B.x + A.z * B.w;
        const w = A.w * B.w - A.x * B.x - A.y * B.y - A.z * B.z;
      return new Quatern(x, y, z, w);
    }

  /** @section @method @static */
  /** Кватернион из скаляра и трёхмерного вектора
    * @param {number} angle вещественная составляющая кватерниона
    * @param {Vector} vector векторная составляющая кватерниона
    * @return {Quatern} кватернион
    */
    static from(angle, vector) {
      angle /= 2;
      const cos = Math.cos(angle); const sin = Math.sin(angle);
        const w = cos;
        const x = vector.x * sin;
        const y = vector.y * sin;
        const z = vector.z * sin;
      return new Quatern(x, y, z, w);
    }

  /** Кватернион из элементов массива
    * @param {Float32Array} array массив элементов кватерниона
    * @return {Quatern} кватернион
    */
    static data(array) {
      return new Quatern(array[0], array[1], array[2], array[3]);
    }
  }

/** @section @const Частые значения */
  Quatern.empty = new Quatern(0, 0, 0, 0);

/** @section @private */
