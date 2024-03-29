/** @description Алгебра: Матрицы, полезно для @2d и @3d [es6]
  * @author github.com/xaota
  * @types
  * @typedef {number} Integer целые числа
  * @typedef {number} Natural натуральные числа и ноль, т.е., {unsigned int} // ноль не натуральное число
  * @typedef {number} Percent число в промежутке [0, 1]
  * * {Object#MatrixData} - Объект, возвращаемый методом Гаусса
        width         {number} число столбцов расширенной матрицы, с которыми производилась работа
        matrix        {Matrix} итоговая расширенная матрица
        determinant   {number} определитель матрицы
        rank          {number} ранг матрицы
        swap          {number} число перестановок строк в процессе применения метода Гаусса
        history {array of any} история операций со строками
  * @todo Ещё гора чего не описана. +этим тегом помечаю кандидаты на оптимизацию, переписывание и т. д.
  * @feature Цепочные вызовы, типа `Vector.from(1,2,3).scale(2).reverse().normalize()`
  */

/** @section @imports */
  import Arr from 'javascript-std-lib/library/array.js';
  import Vector  from './Vector.js';
  import Quatern from './Quatern.js';

/** @section {Matrix} Работа с матрицами @export @class
  * @field height {Natural} количество строк    (высота)
  * @field width  {Natural} количество столбцов (ширина)
  * @field data {Float32Array} элементы матрицы (по столбцам)
  */
  export default class Matrix {
  /** Матрица из элементов массива параметра
    * @param {Float32Array} array данные элементов матрицы (по столбцам)
    * @param {Natural} height количество строк    (высота)
    * @param {Natural} width  количество столбцов (ширина)
    */
    constructor(array, height, width) {
      this.height = height;
      this.width  = width;
      this.data = new Float32Array(array);
    }

  /** @subsection @method */
  /** Вывод матрицы в терминал @debug
    * @param {Natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} @multiline
    */
    toString(precision = 2) {
      const w = this.width; const h = this.height; const s = [];
          const d = Array.from(this.data, e => e.toFixed(precision));
          const l = Math.max(...d.map(e => e.length)) + 1;
      for (let i = 0; i < h; ++i) {
        const temp = [];
        for (let j = 0; j < w; ++j) {
          const c = d[j * h + i];
          temp.push((new Array(l - c.length + 1)).join(' ') + c);
        }
        s.push(temp.join(','));
      }
      return '\n' + s.join('\n');
    }

  /** Копирование матрицы / copy
    * @return {Matrix} новая матрица
    */
    copy() {
      return new Matrix(this.data.slice(), this.height, this.width);
    }

  /** Вектор из элементов матрицы
    * @return {Vector} вектор элементов матрицы
    */
    vector() {
      return new Vector(this.data);
    }

  /** Транспонирование матрицы
    * @return {Matrix} транспонированная матрица
    */
    transpose() {
      const h = this.height; const w = this.width; const array = new Float32Array(w * h);
      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          array[j * w + i] = this.data[i * h + j];
        }
      }
      return new Matrix(array, w, h);
    }

  /** След матрицы
    * @return {number} значение следа
    */
    trace() {
      const h = this.height; const w = this.width; const n = Math.min(h, w);
      let r = 0;
      for (let i = 0; i < n; ++i) r += this.data[i * h + i];
      return r;
    }

  /** Проверка на единичную матрицу
    * @return {Boolean} true, если все элементы главной диагонали - единицы, а остальные элементы матрицы - нули
    */
    identity() {
      const h = this.height; const w = this.width; const l = h * w; const n = Math.min(h, w);
      return (this.data.filter(e => e === 0).length === l - n) && (this.data.filter(e => e === 1).length === n);
    }

  /** Проверка на нулевую (пустую) матрицу
    * @return {Boolean} true, если все элементы матрицы - нули
    */
    empty() {
      return this.data.every(e => e === 0);
    }

  /** Набор вектор-столбцов матрицы
    * @return {array} {...Vector}
    */
    cols() {
      return Array.from(new Array(this.width), (v, i) => this.col(i));
    }

  /** Набор вектор-строк матрицы
    * @return {array} {...Vector}
    */
    rows() {
      return this.transpose().cols();
    }

  /** Вектор-столбец матрицы
    * @param {Natural} index номер столбца, вектор из элементов которого необходимо получить
    * @return {Vector} столбец матрицы
    */
    col(index) {
      const h = this.height; const start = index * h; const end = start + h;
      return new Vector(this.data.slice(start, end));
    }

  /** Вектор-строка матрицы
    * @param {Natural} index номер строки, вектор из элементов которой необходимо получить
    * @return {Vector} строка матрицы
    */
    row(index) {
      return this.transpose().col(index);
    }

  /** Главная диагональ матрицы
    * @return {Vector} вектор главной диагонали матрицы
    */
    diagonal() {
      const h = this.height; const n = Math.min(h, this.width);
      const array = new Float32Array(n).map((e, i) => this.data[h * i + i]);
      return new Vector(array);
    }

  /** Замена главной диагонали матрицы
    * @param  {Vector} vector значения для главной диагонали
    * @return {Matrix} новая матрица с измененными компонентами главной диагонали
    */
    DIAGONAL(vector) {
      const h = this.height; const w = this.width; const n = Math.min(h, w); const array = this.data.slice();
      for (let i = 0; i < n; ++i) array[h * i + i] = vector.data[i];
      return new Matrix(array, h, w);
    }

  /** @subsection Основные методы */
  /** Умножение матрицы на скаляр / dot (scalar)
    * @param {number} factor коэффициент изменения элементов матрицы
    * @return {Matrix} новая матрица с измененными компонентами
    */
    dot(factor) {
      return new Matrix(this.data.map(e => e * factor), this.height, this.width);
    }

  /** Изменение размеров матрицы
    * уменьшение - элементы за пределами таблицы отбрасываются
    * увеличение - новые элементы инициализируются нулями
    * @param {Natural} height количество строк    (высота) матрицы
    * @param {Natural} width  количество столбцов (ширина) матрицы
    * @return {Matrix} новая матрица
    */
    resize(height, width) {
      const h = Math.min(this.height, height); const w = Math.min(this.width, width); const array = new Float32Array(height * width);
      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          array[i * height + j] = this.data[i * this.height + j];
        }
      }
      return new Matrix(array, height, width);
    }

  /** Сложение матриц одинакового размера
    * @param {Matrix} matrix прибавляемая матрица
    * @return {Matrix} результирующая матрица
    */
    addition(matrix) {
      return new Matrix(this.data.map((e, i) => e + matrix.data[i]), this.height, this.width);
    }

  /** Сложение матриц (с приведением размерностей)
    * @param {Matrix} matrix прибавляемая матрица
    * @return {Matrix} результирующая матрица
    */
    add(matrix) {
      const h = Math.max(this.height, matrix.height); const w = Math.max(this.width, matrix.width);
      return this.resize(h, w).addition(matrix.resize(h, w));
    }

  /** Умножение согласованных матриц / multiply
    * @param {Matrix} matrix матрица-множитель (справа)
    * @return {Matrix} результирующая матрица
    */
    multiply(matrix) {
      const h = this.height; const w = matrix.width; const array = new Float32Array(h * w);
            const A = this.rows(); const B = matrix.cols();
      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          array[i * h + j] = A[j].dot(B[i]);
        }
      }
      return new Matrix(array, h, w);
    }

  /** Умножение матриц с приведением размерностей (с предварительным согласованием)
    * @param {Matrix} matrix матрица-множитель (справа)
    * @return {Matrix} результирующая матрица
    */
    mult(matrix) {
      const n = Math.max(this.width, matrix.height);
      return this.resize(this.height, n).multiply(matrix.resize(n, matrix.width));
    }

  /** Умножение матрицы на вектор-столбец справа
    * @param  {Vector} vector вектор-столбец
    * @return {Matrix} матрица, состоящая из одного вектор-столбца
    */
    vectorCol(vector) {
      return this.multiply(new Matrix(vector.data, vector.dimension, 1));
    }

  /** Умножение матрицы на вектор-строку слева (матрица должна состоять из вектор-столбца)
    * @param  {Vector} vector вектор-строка
    * @return {Matrix} Матрица, состоящая из одной вектор строки
    */
    vectorRow(vector) {
      return new Matrix(vector.data, 1, vector.dimension).multiply(this);
    }

  /** Возврат элементов матрицы с любого места (значения хранятся по столбцам)
    * @param {Natural} start стартовое значение
    * @param {Natural} count количество возвращаемых элементов
    * @return {Float32Array} частичный вектор значений элементов матрицы
    */
    element(start, count) {
      return this.data.slice(start, start + count);
    }

  /** Заполнение элементов матрицы новыми данными с любого места (значения хранятся по столбцам)
    * @param {Natural} index стартовое значение
    * @param {Float32Array} data новые значения элементов матрицы
    * @return {Matrix} новая матрица с измененными значениями элементов
    */
    fill(index, data) {
      const array = this.data.slice();
      data.forEach((e, i) => array[index + i] = e);
      return new Matrix(array, this.height, this.width);
    }

  /** Получение конкретного элемента матрицы по строке и столбцу
    * @param {Natural} row номер строки
    * @param {Natural} col номер столбца
    * @return {number} значение элемента матрицы
    */
    get(row, col) {
      return this.data[this.height * col + row];
    }

  /** Установка конкретного элемента матрицы по строке и столбцу
    * @param {Natural} row номер строки
    * @param {Natural} col номер столбца
    * @param {number} value устанавливаемое значение
    * @return {Matrix} новая матрица с одним измененным значением
    */
    set(row, col, value) {
      const array = this.data.slice(); const h = this.height; const w = this.width;
      array[h * col + row] = value;
      return new Matrix(array, h, w);
    }

  /** */
    get2() {
      const a = this.get(0, 0);
      const b = this.get(0, 1);
      const c = this.get(1, 0);
      const d = this.get(1, 1);

      return { a, b, c, d };
    }

  /** */
    get3() {
      const a = this.get(0, 0);
      const b = this.get(0, 1);
      const c = this.get(0, 2);

      const d = this.get(1, 0);
      const e = this.get(1, 1);
      const f = this.get(1, 2);

      const g = this.get(2, 0);
      const h = this.get(2, 1);
      const i = this.get(2, 2);

      return { a, b, c, d, e, f, g, h, i };
    }

  /** Замена столбца в матрице на значения из вектора
    * @param {Natural} index номер столбца
    * @param  {Vector} vector вектор, который станет столбцом
    * @return {Matrix} новая матрица с измененным столбцом
    */
    setCol(index, vector) {
      return this.fill(index * this.height, vector.data);
    }

  /** Замена строки в матрице на значения из вектора
    * @param {Natural} index номер строки
    * @param  {Vector} vector вектор, который станет строкой
    * @return {Matrix} новая матрица с измененной строкой
    */
    setRow(index, vector) {
      return this.transpose().setCol(index, vector).transpose();
    }

  /** Добавление к столбцу матрицы значение из вектора
    * @param {Natural} index номер столбца матрицы
    * @param  {Vector} vector прибавляемый вектор
    * @return {Matrix} новая матрица с измененным столбцом
    */
    additionCol(index, vector) {
      return this.setCol(index, this.col(index).addition(vector));
    }

  /** Добавление к строке матрицы значение из вектора
    * @param {Natural} index номер строки матрицы
    * @param  {Vector} vector прибавляемый вектор
    * @return {Matrix} новая матрица с измененной строкой
    */
    additionRow(index, vector) {
      return this.transpose().additionCol(index, vector).transpose();
    }

  /** Операция переноса координат
    * @param {Vector} vector вектор переноса (размерностью на 1 меньше размерности матрицы)
    * @return {Matrix} матрица после переноса координат
    */
    translate(vector) {
      return this.multiply(Matrix.translate(vector));
    }

  /** Операция переноса координат по оси X
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translateX(coordinate) {
      return this.multiply(Matrix.translateX(coordinate));
    }

  /** Операция переноса координат по оси Y
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translateY(coordinate) {
      return this.multiply(Matrix.translateY(coordinate));
    }

  /** Операция переноса координат по оси Z
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translateZ(coordinate) {
      return this.multiply(Matrix.translateZ(coordinate));
    }

  /** Операция переноса координат по плоскости Z (перенос по осям X и Y) @3d
    * @param {number} x составляющая переноса по оси X
    * @param {number} y составляющая переноса по оси Y
    * @return {Matrix} матрица после переноса координат
    */
    translateXY(x, y) {
      return this.multiply(Matrix.translateXY(x, y));
    }

  /** Операция переноса координат по плоскости Y (перенос по осям X и Z) @3d
    * @param {number} x составляющая переноса по оси X
    * @param {number} z составляющая переноса по оси Z
    * @return {Matrix} матрица после переноса координат
    */
    translateXZ(x, z) {
      return this.multiply(Matrix.translateXZ(x, z));
    }

  /** Операция переноса координат по плоскости X (перенос по осям Y и Z) @3d
    * @param {number} y составляющая переноса по оси Y
    * @param {number} z составляющая переноса по оси Z
    * @return {Matrix} матрица после переноса координат
    */
    translateYZ(y, z) {
      return this.multiply(Matrix.translateYZ(y, z));
    }

  /** Операция масштабирования координат
    * @param {Vector} vector вектор масштаба (размерностью на 1 меньше размерности матрицы)
    * @return {Matrix} матрица после масшабирования координат
    */
    scale(vector) {
      return this.multiply(Matrix.scale(vector));
    }

  /** Операция масштабирования координат по оси X
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масшабирования координат
    */
    scaleX(factor) {
      return this.multiply(Matrix.scaleX(factor));
    }

  /** Операция масштабирования координат по оси Y
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масшабирования координат
    */
    scaleY(factor) {
      return this.multiply(Matrix.scaleY(factor));
    }

  /** Операция масштабирования координат по оси Z
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масшабирования координат
    */
    scaleZ(factor) {
      return this.multiply(Matrix.scaleZ(factor));
    }

  /** Операция масштабирования координат по осям X, Y, Z на одинаковые значения
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масшабирования координат
    */
    scaleXYZ(factor) {
      return this.multiply(Matrix.scaleXYZ(factor));
    }

  /** Операция поворота координат @2d
    * @param {number} angle угол поворота (в радианах)
    * @return {Matrix} матрица после поворота координат
    */
    rot(angle) {
      return this.multiply(Matrix.rot(angle));
    }

  /** Операция поворота координат @3d
    * @param {Vector} vector вектор оси поворота (размерностью на 1 меньше размерности матрицы)
    * @param {number} angle угол поворота
    * @return {Matrix} матрица после поворота координат
    */
    rotate(vector, angle) {
      return this.multiply(Matrix.rotate(vector, angle));
    }

  /** Операция поворота координат вокруг оси X
    * @param {number} angle угол поворота
    * @return {Matrix} матрица после поворота координат
    */
    rotateX(angle) {
      return this.multiply(Matrix.rotateX(angle));
    }

  /** Операция поворота координат вокруг оси Y
    * @param {number} angle угол поворота
    * @return {Matrix} матрица после поворота координат
    */
    rotateY(angle) {
      return this.multiply(Matrix.rotateY(angle));
    }

  /** Операция поворота координат вокруг оси Z
    * @param {number} angle угол поворота
    * @return {Matrix} матрица после поворота координат
    */
    rotateZ(angle) {
      return this.multiply(Matrix.rotateZ(angle));
    }

  /** Сдвиг квадратной матрицы вниз
    * @return {Matrix} матрица после сдвига
    */
    shiftDown() {
      return Matrix.shiftDown(this.width).multiply(this);
    }

  /** Сдвиг квадратной матрицы вверх
    * @return {Matrix} матрица после сдвига
    */
    shiftUp() {
      return Matrix.shiftUp(this.width).multiply(this);
    }

  /** Сдвиг квадратной матрицы влево
    * @return {Matrix} матрица после сдвига
    */
    shiftLeft() {
      return this.multiply(Matrix.shiftDown(this.width));
    }

  /** Сдвиг квадратной матрицы вправо
    * @return {Matrix} матрица после сдвига
    */
    shiftRight() {
      return this.multiply(Matrix.shiftUp(this.width));
    }

  /** Сдвиг квадратной матрицы вверх-вправо
    * @return {Matrix} матрица после сдвига
    */
    shiftUpRight() {
      const shift = Matrix.shiftUp(this.width);
      return shift.multiply(this).multiply(shift);
    }

  /** Сдвиг квадратной матрицы вверх-влево
    * @return {Matrix} матрица после сдвига
    */
    shiftUpLeft() {
      const n = this.width; const shift = Matrix.shiftUp(n); const unshift = Matrix.shiftDown(n);
      return shift.multiply(this).multiply(unshift);
    }

  /** Сдвиг квадратной матрицы вниз-влево
    * @return {Matrix} матрица после сдвига
    */
    shiftDownLeft() {
      const unshift = Matrix.shiftDown(this.width);
      return unshift.multiply(this).multiply(unshift);
    }

  /** Сдвиг квадратной матрицы вниз-вправо
    * @return {Matrix} матрица после сдвига
    */
    shiftDownRight() {
      const n = this.width; const shift = Matrix.shiftUp(n); const unshift = Matrix.shiftDown(n);
      return unshift.multiply(this).multiply(shift);
    }

  /** Операция искажения
    * @param  {Vector} vector вектор @2d коэффициентов искажения
    * @return {Matrix} матрица после искажения
    */
    skew(vector) {
      const dimension = Math.min(this.width, this.height);
      return this.multiply(Matrix.skew(vector, dimension));
    }

  /** Обратная матрица (методом Гаусса)
    * @return {Matrix} обратная матрица
    */
    inverse() {
      const h = this.height; const w = this.width;
            const m = Matrix.concat(this, Matrix.identity(h));
       const matrix = Matrix.gauss(m, w).matrix.data.slice(h * w);
      return new Matrix(matrix, h, w);
    }

  /** Обратная матрица 2x2 */
    inverse2() {
      const { a, b, c, d } = this.get2();
      const determinant = this.determinant2();
      const array = new Float32Array([d, -c, -b, a]);
      return new Matrix(array, 2, 2).dot(1 / determinant);
    }

  /** Обратная матрица 3x3 */
    inverse3() {
      return this.cofactors3().dot(1 / this.determinant3());
    }

  /** */
    inverse2D() {
      return this.inverse3();
    }

  /** Обратная матрица к матрице модели для @3d графики
    * @return {Matrix} обратная матрица
    */
    inverse3D() {
      const translate = (new Vector(this.element(12, 3).reverse()));
      return this.minor(3, 3).transpose().resize(4, 4).set(3, 3, 1).translate(translate);
    }

  /** / cofactors3 M' - Присоединённая матрица (Adjugate matrix) */
    cofactors3() {
      const { a, b, c, d, e, f, g, h, i } = this.get3();
      const array = new Float32Array([
        e * i - f * h,
        c * h - b * i,
        b * f - c * e,

        f * g - d * i,
        a * i - c * g,
        c * d - a * f,

        d * h - e * g,
        b * g - a * h,
        a * e - b * d
      ]);

      return new Matrix(array, 3, 3);
    }

  /** Определитель матрицы (методом Гаусса)
    * @return {number} значение определителя
    */
    determinant() {
      return Matrix.gauss(this, this.width).determinant;
    }

  /** Определитель матрицы 2x2
    * @return {number} значение определителя
    * @info det A = |A| = ad - bc
    */
    determinant2() {
      const { a, b, c, d } = this.get2();
      return a * d - b * c;
    }

  /** Определитель матрицы 3x3
    * @return {number} значение определителя
    * @info det A = |A| = a(ei − fh) − b(di − fg) + c(dh − eg)
    */
    determinant3() {
      const { a, b, c, d, e, f, g, h, i } = this.get3();
      return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

  /** Ранг матрицы (методом Гаусса)
    * @return {number} значение ранга матрицы
    */
    rank() {
      return Matrix.gauss(this, this.width).rank;
    }

  /** Минор матрицы по строке и столбцу (получаемый минор должен существовать)
    * @param {Natural} row номер исключаемой строки
    * @param {Natural} col номер исключаемого столбца
    * @return {Matrix} минор
    */
    minor(row, col) {
      const h = this.height; const w = this.width; const m = h - 1; const n = w - 1; const array = new Float32Array(m * n);
      for (let i = 0; i < w; ++i) {
        if (col === i) continue;
        for (let j = 0; j < h; ++j) {
          if (row === j) continue;
          array[(i - (col < i)) * m + (j - (row < j))] = this.data[i * h + j];
        }
      }
      return new Matrix(array, m, n);
    }

  /** Минор матрицы любого порядка по строкам и столбцам (получаемый минор должен существовать)
    * @param {array} rows {...natural} номера исключаемых строк
    * @param {array} cols {...natural} номера исключаемых столбцов
    * @return {Matrix} минор
    */
    minors(rows, cols) {
      const h = this.height; const w = this.width;
      const m = h - rows.length; const n = w - cols.length; const array = new Float32Array(m * n);
      let i = 0; let y = 0; let j; let x;
      for (; i < w; ++i) {
        if (cols.indexOf(i) > -1) ++y; else {
          for (j = 0, x = 0; j < h; ++j) {
            if (rows.indexOf(j) > -1) ++x; else {
              array[(i - y) * m + (j - x)] = this.data[i * h + j];
            }
          }
        }
      }
      return new Matrix(array, m, n);
    }

  /** Минор матрицы любого порядка
    * @param {Vector} from левый верхний элемент минора
    * @param {Vector} to правый нижний элемент минора
    * @return {Matrix} минор матрицы
    */
    minore(from = Vector.zero, to = Vector.from(this.height, this.width)) {
      const h = this.height; const w = this.width;
      const items = (count, point = 0) => Array.from(new Array(count), (_, i) => point + i);
      const rows = items(from.x).concat(items(h - to.x, to.x));
      const cols = items(from.y).concat(items(w - to.y, to.y));
      return this.minors(rows, cols);
    }

  /** Решение СЛАУ (методом Гаусса)
    * @param {Vector} vector правая часть системы уравнений Ax = B с матрицей A и вектором B @required
    * @return {Vector} решение СЛАУ
    */
    solve(vector) {
      const w = this.width; const n = this.height * w;
      return new Vector(Matrix.gauss(Matrix.concat(this, Matrix.from(vector)), w).matrix.data.slice(n));
    }

  /** @subsection Элементарные преобразования матрицы */
  /** Обмен столбцов матрицы
    * @param {Natural} a номер первого перемещаемого столбца
    * @param {Natural} b номер второго перемещаемого столбца
    * @return {Matrix} новая матрица с изменением мест двух столбцов
    */
    swapCol(a, b) {
      const A = this.col(a); const B = this.col(b);
      return this.setCol(a, B).setCol(b, A);
    }

  /** Смена местами строк матрицы
    * @param {Natural} a номер первой перемещаемой строки
    * @param {Natural} b номер второй перемещаемой строки
    * @return {Matrix} новая матрица с изменением мест двух строк
    */
    swapRow(a, b) {
      return this.transpose().swapCol(a, b).transpose();
    }

  /** Умножение столбца матрицы на скаляр
    * @param {Natural} index номер столбца
    * @param {number} factor множитель
    * @return {Matrix} матрица после преобразования
    */
    scaleCol(index, factor) {
      return this.setCol(index, this.col(index).scale(factor));
    }

  /** Умножение строки матрицы на скаляр
    * @param {Natural} index номер строки
    * @param {number} factor множитель
    * @return {Matrix} матрица после преобразования
    */
    scaleRow(index, factor) {
      return this.transpose().scaleCol(index, factor).transpose();
    }

  /** Добавление к столбцу матрицы другого столбца, помноженного на скаляр
    * @param {Natural} a номер столбца, к которому будет прибавление
    * @param {Natural} b номер прибавляемого столбца
    * @param {number} factor множитель прибавляемого столбца @required
    * @return {Matrix} матрица после преобразования
    */
    additionCols(a, b, factor = 1) {
      return this.additionCol(a, this.col(b).scale(factor));
    }

  /** Добавление к строке матрицы другой строки, помноженной на скаляр
    * @param {Natural} a номер строки, к которой будет прибавление
    * @param {Natural} b номер прибавляемой строки
    * @param {number} factor множитель прибавляемой строки @required
    * @return {Matrix} матрица после преобразования
    */
    additionRows(a, b, factor = 1) {
      return this.transpose().additionCol(a, b, factor).transpose();
    }

  /** Применение преобразований (вектор -> вектор) / transition
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    transition(vector) {
      return Matrix.transition(this, vector);
    }

  /** Применение преобразований (вектор -> вектор) (через обратную матрицу) / transitionInverse @slow
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    transitionInverse(vector) {
      return Matrix.transitionInverse(this, vector);
    }

  /** Применение преобразований (вектор -> вектор) (через обратную матрицу @3D) / transitionInverse3D @slow
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    transitionInverse3D(vector) {
      return Matrix.transitionInverse3D(this, vector);
    }

  /** Перевод точек из одной СК окружения пера в другую через матрицу перехода / transition2D @2D
    * @param {Vector} vector изначальные координаты (x, y)
    * @return {Vector} координаты в новой СК
    */
    transition2D(vector) {
      return Matrix.transition2D(this, vector);
    }

  /** @subsection @method @static */
  /** Сравнение двух матриц
    * @param {Matrix} A сравниваемые матрицы
    * @param {Matrix} B сравниваемые матрицы
    * @param {number} precision точность
    * @return {Boolean} true, если матрицы близкие
    */
    static compare(A, B, precision = 0.0001) {
      return A.height === B.height && A.width === B.width && A.data.every((e, i) => Math.abs(e - B.data[i]) < precision);
    }

  /** Матрица из набора векторов
    * @arguments {Vector} векторы-столбцы матрицы (размерности должны совпадать)
    * @return {Matrix} матрица
    */
    static from(...vector) {
      const w = vector.length; const h = vector[0].dimension;
      let matrix = Matrix.empty(h, w);
      vector.forEach((v, i) => matrix = matrix.fill(i * h, v.data)); // setCol(i, v)
      return matrix;
    }

  /** Блок из матриц @todo
    * @arguments {Matrix} матрицы с одинаковым количествои строк
    * @return {Matrix} матрица-блок
    */
    static concat(...matrix) {
      const h = matrix[0].height; const w = matrix.reduce((r, e) => r + e.width, 0); const array = new Float32Array(h * w);
      let i = 0; let shift = 0;
      for (; i < matrix.length; ++i) {
        matrix[i].data.forEach((e, i) => array[shift + i] = e);
        shift += matrix[i].width * h;
      }
      return new Matrix(array, h, w);
    }

  /** Единичная матрица любой размерности
    * @param {Natural} dimension размерность
    * @return {Matrix} единиичная матрица
    */
    static identity(dimension) {
      const array = new Float32Array(dimension * dimension);
      for (let i = 0; i < dimension; ++i) array[i * dimension + i] = 1;
      return new Matrix(array, dimension, dimension);
    }

  /** Нулевая (пустая) матрица
    * @param {Natural} height количество строк    (высота)
    * @param {Natural} width  количество столбцов (ширина)
    * @return {Matrix} нулевая матрица
    */
    static empty(height, width = height) {
      const array = new Float32Array(height * width);
      return new Matrix(array, height, width);
    }

  /** Матрица из случайных элементов [0..1)
    * @param {number} height количество строк
    * @param {number} width  количество столбцов
    * @return {Matrix} рандомная матрица
    */
    static random(height, width = height) {
      const data = Array.from(new Array(height * width), Math.random);
      return new Matrix(data, height, width);
    }

  /** Разряженная матрица
    * @param {array} data ненулевые элементы [...[row, col, value]]
    * @param {number} height количество строк
    * @param {number} width  количество столбцов
    * @return {Matrix} разряженная матрица
    */
    static sparse(data, height, width) {
      const matrix = Matrix.empty(height, width);
      data.forEach(([row, col, value]) => {
        matrix.data[height * col + row] = value;
      });
      return matrix;
    }

  /** Диагональная матрица из вектора
    * @param {Vector} vector элементы главной диагонали
    * @return {Matrix} матрица с нулями и данным вектором главной диагонали
    */
    static diagonal(vector) {
      const n = vector.dimension; const array = new Float32Array(n * n);
      vector.data.forEach((e, i) => array[i * n + i] = e);
      return new Matrix(array, n, n);
    }

  /** Над-диагональная матрица (диагональ над главной диагональю)
    * @param  {Vector} vector элементы верхней диагонали
    * @return {Matrix} матрица с нулями и данным вектором главной над-диагонали
    */
    static diagonalUp(vector) {
      const n = vector.dimension + 1; const array = new Float32Array(n * n);
      vector.data.forEach((e, i) => array[(i + 1) * n + i] = e);
      return new Matrix(array, n, n);
    }

  /** Под-диагональная матрица (диагональ под главной диагональю)
    * @param {Vector} vector элементы нижней диагонали
    * @return {Matrix} матрица с нулями и данным вектором главной под-диагонали
    */
    static diagonalDown(vector) {
      const n = vector.dimension + 1; const array = new Float32Array(n * n);
      vector.data.forEach((e, i) => array[i * n + (i + 1)] = e);
      return new Matrix(array, n, n);
    }

  /** Матрица сдвига вверх (верхне-сдвиговая матрица)
    * @param {Natural} dimension размерность
    * @return {Matrix} матрица для операции сдвига
    */
    static shiftUp(dimension) {
      return Matrix.diagonalUp(Vector.identity(dimension));
    }

  /** Матрица сдвига вниз (нижне-сдвиговая матрица)
    * @param {Natural} dimension размерность
    * @return {Matrix} матрица для операции сдвига
    */
    static shiftDown(dimension) {
      // return Matrix.shiftUp().transponate();
      return Matrix.diagonalDown(Vector.identity(dimension));
    }

  /** Матрица переноса / translate
    * @param  {Vector} vector координаты переноса
    * @return {Matrix} размерность на 1 больше размерности вектора
    */
    static translate(vector) {
      const n = vector.dimension + 1; const column = n - 1;
      return Matrix.identity(n).fill(column * n, vector.data);
    }

  /** Матрица переноса по оси X
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translateX(coordinate) {
      return Matrix.translate(Vector.X.scale(coordinate));
    }

  /** Матрица переноса по оси Y
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translateY(coordinate) {
      return Matrix.translate(Vector.Y.scale(coordinate));
    }

  /** Матрица переноса по оси Z
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translateZ(coordinate) {
      return Matrix.translate(Vector.Z.scale(coordinate));
    }

  /** Матрица переноса по плоскости Z (по осям X и Y)
    * @param {number} x координата по оси X
    * @param {number} y координата по оси Y
    * @return {Matrix} новая матрица
    */
    static translateXY(x, y) {
      return Matrix.translate(new Vector([x, y, 0]));
    }

  /** Матрица переноса по плоскости Y (по осям X и Z)
    * @param {number} x координата по оси X
    * @param {number} z координата по оси Z
    * @return {Matrix} новая матрица
    */
    static translateXZ(x, z) {
      return Matrix.translate(new Vector([x, 0, z]));
    }

  /** Матрица переноса по плоскости X (по осям Y и Z)
    * @param {number} y координата по оси Y
    * @param {number} z координата по оси Z
    * @return {Matrix} новая матрица
    */
    static translateYZ(y, z) {
      return Matrix.translate(new Vector([0, y, z]));
    }

  /** Матрица масштабирования / scale
    * @param {Vector} vector коэффициенты масштабирования
    * @return {Matrix} матрица размерностю на 1 большей размерности вектора
    */
    static scale(vector) {
      const n = vector.dimension;
      return Matrix.diagonal(vector.resize(n + 1).fill(n, 1));
    }

  /** Матрица масштабирования по оси X
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scaleX(factor) {
      return Matrix.scale(new Vector([factor, 1, 1]));
    }

  /** Матрица масштабирования по оси Y
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scaleY(factor) {
      return Matrix.scale(new Vector([1, factor, 1]));
    }

  /** Матрица масштабирования по оси Z
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scaleZ(factor) {
      return Matrix.scale(new Vector([1, 1, factor]));
    }

  /** Матрица масштабирования по осям X, Y, Z на одинаковые значения
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scaleXYZ(factor) {
      return Matrix.scale(new Vector([factor, factor, factor]));
    }

  /** Матрица абсолютного поворота @2d
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rot(angle) {
      const sin = Math.sin(angle); const cos = Math.cos(angle);
      return new Matrix([cos, sin, 0, -sin, cos, 0, 0, 0, 1], 3, 3);
    }

  /** Матрица абсолютного поворота вокруг вектора @3d
    * @param {Vector} vector ось поворота в трёхмерных координатах
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotate(vector, angle) {
      const q = Quatern.from(angle, vector);
        const xx = q.x * q.x; const xy = q.x * q.y; const xz = q.x * q.z; const xw = q.x * q.w;
        const yy = q.y * q.y; const yz = q.y * q.z; const yw = q.y * q.w;
        const zz = q.z * q.z; const zw = q.z * q.w; const ww = q.w * q.w;
          const a = Vector.from(1 - 2 * (yy + zz),     2 * (xy + zw),     2 * (xz - yw));
          const b = Vector.from(2 * (xy - zw), 1 - 2 * (xx + zz),     2 * (yz + xw));
          const c = Vector.from(2 * (xz + yw),     2 * (yz - xw), 1 - 2 * (xx + yy));
      return  Matrix.from(a, b, c).resize(4, 4).set(3, 3, 1);
    }

  /** Матрица абсолютного поворота вокруг оси X @3d
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotateX(angle) {
      return Matrix.rotate(Vector.X, angle);
    }

  /** Матрица абсолютного поворота вокруг оси Y @3d
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotateY(angle) {
      return Matrix.rotate(Vector.Y, angle);
    }

  /** Матрица абсолютного поворота вокруг оси Z @3d
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotateZ(angle) {
      return Matrix.rotate(Vector.Z, angle);
    }

  /** Матрица искажения
    * @param {Vector} vector двумерный вектор коэффициентов искажения
    * @param {number} dimension размерность матрицы
    * @return {Matrix} матрица искажения
    */
    static skew(vector, dimension = 2) {
      return Matrix.identity(dimension).set(1, 0, vector.x).set(0, 1, vector.y);
    }

  /** Матрица пирамидального отсечения (произвольной перспективной проекции)
    * @param {number} top верхняя граница отсечения
    * @param {number} right правая граница отсечения
    * @param {number} bottom ниижняя граница отсечения
    * @param {number} left левая граница отсечения
    * @param {number} near ближняя граница отсечения
    * @param {number} far дальняя граница отсечения
    * @return {Matrix} итоговая матрица
    */
    static frustum(top, right, bottom, left, near, far) {
      const a = right - left; const b = top - bottom; const c = far - near;
          const d = right + left; const e = top + bottom; const f = far + near;
      let M = Matrix.diagonal(Vector.from(2 * near / a, 2 * near / b, -f / c, 0));
      M = M.fill(8, new Float32Array([d / a, e / b]));
      M = M.set(3, 2, -1).set(2, 3, -2 * far * near / c);
      return M;
    }

  /** Матрица прямоугольного отсечения (параллельной (ортогональной) проекции)
    * @param {number} top верхняя граница отсечения
    * @param {number} right правая граница отсечения
    * @param {number} bottom ниижняя граница отсечения
    * @param {number} left левая граница отсечения
    * @param {number} near ближняя граница отсечения
    * @param {number} far дальняя граница отсечения
    * @return {Matrix} итоговая матрица
    */
    static ortho(top, right, bottom, left, near, far) {
      const a = right - left; const b = top - bottom; const c = far - near;
            const d = right + left; const e = top + bottom; const f = far + near;
      return Matrix.diagonal(Vector.from(2 / a, 2 / b, -2 / c, 1)).fill(12, new Float32Array([-d / a, -e / b, -f / c]));
    }

  /** Матрица симметричной перспективной проекции
    * @param {number} fovy угол между верхней и нижней плоскостями отсечения (угол обзора)
    * @param {number} aspect отношение ширины к высоте отсекающего окна
    * @param {number} near ближняя граница отсечения
    * @param {number} far дальняя граница отсечения
    * @return {Matrix} итоговая матрица
    */
    static perspective(fovy, aspect, near, far) {
      aspect *= (fovy = near * Math.tan(fovy * Math.PI / 360));
      return Matrix.frustum(fovy, aspect, -fovy, -aspect, near, far);
    }

  /** Матрица вида @3d / видовая матрица, матрица камеры
    * @param {Vector} eye начало координат системы наблюдения
    * @param {Vector} center опорная точка
    * @param {Vector} up верктор "вверх"
    * @return {Matrix} итоговая матрица
    */
    static lookAt(eye, center, up) {
      const f = center.difference(eye).normalize();
            const s = f.multiply(up).normalize();
            const u = s.multiply(f);
      return Matrix.from(s, u, f.reverse()).transpose().resize(4, 4).set(3, 3, 1).translate(eye.reverse());
    }

  /** Матрица @2d трансформаций [[a,b,0], [c,d,0], [e,f,1]]
    * @param {number} a (m11) Horizontal scaling
    * @param {number} b (m12) Horizontal skewing
    * @param {number} c (m21) Vertical skewing
    * @param {number} d (m22) Vertical scaling
    * @param {number} e (dx) Horizontal moving
    * @param {number} f (dy) Vertical moving
    * @return {Matrix} матрица (3,3) для 2d трансформации
    */
    static transform2(a, b, c, d, e, f) {
      const array = new Float32Array([a, b, 0, c, d, 0, e, f, 1]);
      return new Matrix(array, 3, 3);
    }

  /** Матрица изометрической проекции / isometric @static @2D
    * @param {number} iso коэффициент изометрии
    * @param {Vector} offset сдвиг
    * @return {Matrix} матрица для изометрического преобразования
    */
    static isometric(iso = 2, offset = Vector.zero) {
      const scale = 1 / iso;
      const angle = Math.sqrt(1 - scale * scale);
      return Matrix.transform2(angle, -scale, angle, scale, offset.x, offset.y);
    }

  // the rotation matrix for isometric view build by multiplying the rotations
  // Mat3x3 matIso = Mat3x3(InitRotX, degToRad(30.0)) * Mat3x3(InitRotY, degToRad(45.0));

  /** Применение метода Гаусса
    * @param {Matrix} matrix левая часть системы уравнений Ax = B с матрицей A и вектором B @required
    * @param {number} w количество столбцов матрицы
    * @optional matrix = A.concat(identity) - для поиска обратной матрицы
    * @return {Object#MatrixData} результат применения метода Гаусса
    */
    static gauss(matrix, w) {
      const h = matrix.height; const history = [];
      let swaps = 0; let i = 0; let j = 0; let determinant = 1; let k; let column;
      matrix = matrix.transpose();
      for (; i < w; ++i) {
        column = matrix.row(i); // re transpose
        if (column.empty()) continue;
        if (column.data[j] === 0) {
          // swap(row[j], row[k])
          for (k = j + 1; k < h; ++k) {
            if (column[k] !== 0) {
              matrix = matrix.swapCol(j, k);
              Arr.swap(column.data, j, k);
              ++swaps; // число перестановок строк
              history.push(['swap', j, k]);
              break;
            }
          }
        }
        determinant *= column.data[j];
        if (column.data[j] === 0) continue; // --rank
        if (column.data[j] !== 1) { // row[j] /= M[j, i]
          matrix = matrix.scaleCol(j, 1 / column.data[j]);
          history.push(['rescale', j, column.data[j]]);
        }
        for (k = 0; k < h; ++k) { // зануление остальных элементов i-го столбца (row[k] -= row[j] * M[k, i])
          if (k === j || column.data[k] === 0) continue;
          matrix = matrix.additionCols(k, j, -column.data[k]);
          history.push(['addition', k, j, column.data[k]]);
        }
        ++j;
      }
      return {
        determinant: swaps % 2 ? -determinant : determinant,
        matrix     : matrix.transpose(),
        width      : w,
        rank       : j,
        history,
        swaps
      }
    }

  /** Применение преобразований (вектор -> вектор) / transition
    * @param {Matrix} matrix матрица СК
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    static transition(matrix, vector) {
      return matrix.vectorCol(vector).vector();
    }

  /** Перевод точек из одной СК окружения пера в другую через матрицу перехода / transition2D @static @2D
    * @param {Matrix} matrix матрица СК
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    static transition2D(matrix, vector) {
      return Matrix.transition(matrix, vector.resize(3).fill(2, 1)).resize(2);
    }

  /** Применение преобразований (вектор -> вектор) (через обратную матрицу) / transitionInverse @slow
    * @param {Matrix} matrix матрица СК
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    static transitionInverse(matrix, vector) {
      return Matrix.transition(matrix.inverse(), vector);
    }

  /** Применение преобразований (вектор -> вектор) (через обратную матрицу @3D) / transitionInverse3D @slow @3D
    * @param {Matrix} matrix матрица СК
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    static transitionInverse3D(matrix, vector) {
      return Matrix.transition(matrix.inverse3D(), vector);
    }
  }
