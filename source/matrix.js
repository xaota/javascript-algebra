/** Алгебра: Векторы. Полезно для @2D и @3D
  * @author github.com/xaota
  * @todo Ещё многое не описано. +этим тегом помечаю кандидаты на оптимизацию, переписывание и т. д.
  * @feature Цепочные вызовы, типа `Vector.from(1, 2, 3).scale(2).inverse.normal`
  *
  * @typedef {number} Integer целые числа
  * @typedef {number} Natural натуральные числа и ноль, т.е., {unsigned int} // ноль не натуральное число
  * @typedef {number} Percent число в промежутке [0, 1]
  *
  * @typedef {object} OptionsTransform2D объект параметров 2D преобразования
  * @property {Vector} [scale] Масштабирование
  * @property {Vector} [translate] Перенос
  * @property {Vector} [skew] Искажение
  *
  * @typedef {object} MatrixInfo
  * @property {number} width ширина матрицы
  * @property {number} height высота матрицы
  * @property {Float32Array} data элементы матрицы по столбцам
  *
  * @typedef {object} MatrixData Объект, возвращаемый методом Гаусса
  * @property {boolean} hasCourage - Indicates whether the Courage component is present.
  * @property {number} width число столбцов расширенной матрицы, с которыми производилась работа
  * @property {Matrix} matrix итоговая расширенная матрица
  * @property {number} determinant определитель матрицы
  * @property {number} rank ранг матрицы
  * @property {number} swap число перестановок строк в процессе применения метода Гаусса
  * @property {Array<any>} history история операций со строками
  *
  * @typedef {object} MatrixItemsInfoABCD элементы матрицы
  * @property {number} a элемент матрицы {0, 0}
  * @property {number} b элемент матрицы {1, 0}
  * @property {number} c элемент матрицы {0, 1}
  * @property {number} d элемент матрицы {1, 1}
  *
  * @typedef {object} MatrixItemsInfoABCDEF элементы матрицы
  * @property {number} a элемент матрицы {0, 0}
  * @property {number} b элемент матрицы {1, 0}
  * @property {number} c элемент матрицы {0, 1}
  * @property {number} d элемент матрицы {1, 1}
  * @property {number} e элемент матрицы {0, 2}
  * @property {number} f элемент матрицы {1, 2}
  *
  * @typedef {object} MatrixItemsInfoABCDEFGHI элементы матрицы
  * @property {number} a элемент матрицы {0, 0}
  * @property {number} b элемент матрицы {1, 0}
  * @property {number} c элемент матрицы {2, 0}
  * @property {number} d элемент матрицы {0, 1}
  * @property {number} e элемент матрицы {1, 1}
  * @property {number} f элемент матрицы {2, 1}
  * @property {number} g элемент матрицы {0, 2}
  * @property {number} h элемент матрицы {1, 2}
  * @property {number} i элемент матрицы {2, 2}
  */

import Vector from './vector.js';
import Quatern from './quatern.js';

/** {Matrix} Работа с матрицами @export @class - матрица хранится по столбцам
  * @field {Float32Array} data элементы матрицы (по столбцам)
  * @field {Vector} dimension размерность матрицы {x - строки, y - столбцы}
  */
  export default class Matrix {
    #data = new Float32Array([]);
    #dimension = new Vector([]);

  /** Матрица из элементов массива параметра @constructor
    * @param {Float32Array|Array<number>} array данные элементов матрицы (по столбцам)
    * @param {Vector} dimension размерность матрицы - {x - строки, y - столбцы}
    */
    constructor(array, dimension) {
      const data = new Float32Array(dimension.xy.product);
      array.forEach((e, i) => { data[i] = e || 0 });
      this.#data = data;
      this.#dimension = dimension;
    }

  /** Получение конкретного элемента матрицы по строке и столбцу / at
    * @param {Vector} point Координаты элемента (индексация начинается с нуля)
    * @return {number} значение элемента матрицы
    */
    at(point) {
      if (!this.#dimension.has2D(point)) {
        throw new Error(`Point {${point.toString(0)}} is not exist in Matrix${this.#dimension.toString(0)}`);
      }
      return this.data[this.height * point.x + point.y];
    }

  /** @section HELPERS */
  /** abcd
    * @sample
    * [a c]
    * [b d]
    *
    * @return {MatrixItemsInfoABCD}
    */
    get abcd() {
      if (!this.#dimension.has2D(Vector.d2, true)) {
        throw new Error(`Minor{abcd} is not exist in Matrix${this.#dimension.toString(0)}`);
      }
      const height = this.#dimension.y;
      return {
        a: this.#data[0],
        b: this.#data[1],
        c: this.#data[height],
        d: this.#data[height + 1]
      };
    }

  /** abcdef @2D
    * @sample
    * [a, c, e]
    * [b, d, f]
    *
    * @return {MatrixItemsInfoABCDEF}
    */
    get abcdef() {
      if (!this.#dimension.has2D(Vector.from(3, 2), true)) {
        throw new Error(`Minor{abcdef} is not exist in Matrix${this.#dimension.toString(0)}`);
      }
      const height2 = this.#dimension.y * 2;
      return {
        ...this.abcd,
        e: this.#data[height2],
        f: this.#data[height2 + 1]
      };
    }

  /** abcdefghi @3D
    * @sample
    * [a, d, g]
    * [b, e, h]
    * [c, f, i]
    *
    * @returns {MatrixItemsInfoABCDEFGHI}
    */
    get abcdefghi() {
      if (!this.#dimension.has2D(Vector.d3, true)) {
        throw new Error(`Minor{abcdefghi} is not exist in Matrix${this.#dimension.toString(0)}`);
      }
      const height = this.#dimension.y;
      const height2 = height * 2;
      return {
        a: this.#data[0],
        b: this.#data[1],
        c: this.#data[2],
        d: this.#data[height],
        e: this.#data[height + 1],
        f: this.#data[height + 2],
        g: this.#data[height2],
        h: this.#data[height2 + 1],
        i: this.#data[height2 + 2]
      };
    }

  // abcdefghixyz

  /** @section FIELDS */
  /** Размерность матрицы / dimension
    * @return {Vector} вектор с размерами матрицы {x - строки, y - столбцы}
    */
    get dimension() {
      return this.#dimension;
    }

  /** Количество столбцов матрицы / width
    * @return {number} ширина матрицы
    */
    get width() {
      return this.#dimension.x;
    }

  /** Количество строк матрицы / height
    * @return {number} высота матрицы
    */
    get height() {
      return this.#dimension.y;
    }

  /** Минимальный компонент из размерности матрицы
    * @return {number} Math.min(width, height)
    */
    get DIMENSION() {
      return this.#dimension.min;
    }

  /** Вектор-столбец из матрицы / column
    * @param {Natural} index номер столбца (индексация начинается с нуля)
    * @return {Vector} Вектор-столбец
    */
    column(index = 0) {
      const height = this.height;
      const from = index * height;
      const to = from + height;
      return new Vector(this.#data.slice(from, to));
    }

  /** Массив вектор-столбцов из матрицы / columns
    * @return {Array<Vector>} набор вектор-столбцов
    */
    get columns() {
      return Array.from({ length: this.width }, (_, index) => this.column(index));
    }

  /** Вектор-строка из матрицы / row
    * @param {Natural} index номер строки (индексация начинается с нуля)
    * @return {Vector} Вектор-строка
    */
    row(index = 0) {
      const height = this.height;
      const data = this.#data.filter((_, i) => i % height === index);
      return new Vector(data);
    }

  /** Массив вектор-строк из матрицы / rows
    * @return {Array<Vector>} набор вектор-строк
    */
    get rows() {
      return Array.from({ length: this.height }, (_, index) => this.row(index));
    }

  /** @section COMMON */
  /** Изменение размеров матрицы / resize
    * уменьшение - элементы за пределами таблицы отбрасываются
    * увеличение - новые элементы инициализируются нулями
    * @param {Vector} dimension новая размерность матрицы
    * @return {Matrix} новая матрица
    */
    resize(dimension) {
      const h = this.height;
      const H = dimension.y;
      const height = Math.min(h, H);
      const width = Math.min(this.width, dimension.x);
      const array = new Float32Array(dimension.xy.product);
      for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
          array[i * H + j] = this.data[i * h + j];
        }
      }
      return new Matrix(array, dimension);
    }

  /** @TODO: Изменение размеров матрицы (достроение до кавдратной единичной) / resizeIdentity
    *
    */

  /** Заполнение элементов матрицы новыми данными с любого места (значения хранятся по столбцам) / fill
    * @param {Natural} index стартовое значение
    * @param {Float32Array|Array<number>} data новые значения элементов матрицы
    * @return {Matrix} новая матрица с измененными значениями элементов
    */
    fill(index, ...data) {
      const array = this.#data.slice();
      data.forEach((e, i) => { array[index + i] = e; });
      return new Matrix(array, this.#dimension);
    }

  /** Приведение размерности матриц (выбор максимальной) / dimension @static
    * @param {Array<Matrix>} matrices список матриц
    * @return {Vector} максимальная размерность
    */
    static dimension(...matrices) {
      let X = 0;
      let Y = 0;
      matrices.forEach(m => {
        const x = m.#dimension.x;
        const y = m.#dimension.y;
        if (x > X) X = x;
        if (y > Y) Y = y;
      });
      return Vector.from(X, Y);
    }

  /** @section PROPERTY */
  /** Главная диагональ матрицы / diagonal
    * @return {Vector} вектор главной диагонали матрицы
    */
    get diagonal() {
      const h = this.height;
      const n = this.DIMENSION;
      const array = new Float32Array(n).map((_, i) => this.#data[h * i + i]);
      return new Vector(array);
    }

  /** След матрицы / trace
    * @return {number} сумма элементов главной диагонали
    */
    get trace() {
      return this.diagonal.summary;
    }

  /** Проверка на единичную матрицу / identity
    * @return {Boolean} true, если все элементы главной диагонали - единицы, а остальные элементы матрицы - нули
    */
    get identity() {
      const dimension = this.DIMENSION;
      const noZerosCount = this.#data.filter(e => e !== 0).length === dimension;
      return noZerosCount && this.diagonal.identity;
    }

  /** Проверка на нулевую (пустую) матрицу / empty
    * @return {Boolean} true, если все элементы матрицы - нули
    */
    get empty() {
      return this.data.every(e => e === 0);
    }

  /** Определитель матрицы / determinant */

  /** Определитель матрицы 2x2 / determinant2
    * @return {number} значение определителя
    * @info det A = |A| = ad - bc
    * @fast
    */
    get determinant2() {
      const { a, b, c, d } = this.abcd;
      return a * d - b * c;
    }

  /** Определитель матрицы 3x3 / determinant3
    * @return {number} значение определителя
    * @info det A = |A| = a(ei − fh) − b(di − fg) + c(dh − eg)
    * @fast
    */
    get determinant3() {
      const { a, b, c, d, e, f, g, h, i } = this.abcdefghi;
      return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

  /** @section ALGEBRA */
  /** Транспонирование матрицы / transpose
    * @return {Matrix} новая транспонированная матрица
    */
    get transpose() {
      const { x, y } = this.#dimension;
      const array = new Float32Array(x * y);
      for (let i = 0; i < x; ++i) {
        for (let j = 0; j < y; ++j) {
          array[j * x + i] = this.data[i * y + j];
        }
      }
      return new Matrix(array, this.#dimension.copy);
    }

  /** @TODO: cofactors, cofactors2 */
  /** Присоединённая матрица для матрицы 2x2 (Adjugate matrix) M' / cofactors2
    *
    */
    get cofactors2() {
      const { a, b, c, d } = this.abcd;
      const array = new Float32Array([d, -b, -c, a]);
      return new Matrix(array, Vector.d2);
    }

  /** Присоединённая матрица для матрицы 3x3 (Adjugate matrix) M' / cofactors3
    *
    */
    get cofactors3() {
      const { a, b, c, d, e, f, g, h, i } = this.abcdefghi;
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

      return new Matrix(array, Vector.d3);
    }

  /** @TODO: inverse */
  /** Обратная матрица 2x2 / inverse2
    * @return {Matrix} обратная матрица
    */
    get inverse2() {
      return this.cofactors2.dot(1 / this.determinant2);
    }

  /** Обратная матрица 3x3 / inverse3
    * @return {Matrix} обратная матрица
    */
    get inverse3() {
      return this.cofactors3.dot(1 / this.determinant3);
    }

  /** Ортогональная обратная матрица для @3D графики / inverseOrtho, inverse3D @3D
    * @return {Matrix} обратная матрица
    */
    get inverseOrtho() {
      // transpose minor(3,3) and recalculate vector translate
      const { a, b, c, d, e, f, g, h, i } = this.abcdefghi;
      const t = this.column(3).xyz;             // vector translate
      const x = -(t.x * a + t.y * d + t.z * g); // -dot(translate, right)
      const y = -(t.x * b + t.y * e + t.z * h); // -dot(translate, up)
      const z = -(t.x * c + t.y * f + t.z * i); // -dot(translate, dir)
      return Matrix.d4(a, d, g, 0, b, e, h, 0, c, f, i, 0, x, y, z, 1);
    }

  /** Умножение матрицы на скаляр / dot, scalar (!scale)
    * @param {number} factor коэффициент изменения элементов матрицы
    * @return {Matrix} новая матрица с измененными компонентами
    */
    dot(factor) {
      const data = this.#data.map(e => e * factor);
      return new Matrix(data, this.#dimension);
    }

  /** Сложение матриц одинакового размера / addition
    * @param {Matrix} matrix прибавляемая матрица
    * @return {Matrix} результирующая матрица
    */
    addition(matrix) {
      const data = this.#data.map((e, i) => e + matrix.#data[i]);
      return new Matrix(data, this.#dimension);
    }

  /** Умножение согласованных матриц / multiply
    * @param {Matrix} matrix матрица-множитель (справа)
    * @return {Matrix} результирующая матрица
    */
    multiply(matrix) {
      const y = this.height;
      const x = matrix.width;
      const data = new Float32Array(x * y);

      for (let i = 0; i < x; ++i) {
        for (let j = 0; j < y; ++j) {
          const row = this.row(j);
          const column = matrix.column(i);
          data[i * y + j] = row.dot(column);
        }
      }

      return new Matrix(data, Vector.from(x, y));
    }

  /** Умножение вектор-строки слева на матрицу (матрица должна состоять из одного вектор-столбца) / multiplyVectorLeft
    * @param  {Vector} vector вектор-строка
    * @return {Matrix} Матрица, состоящая из одной вектор строки
    */
    multiplyVectorLeft(vector) {
      const dimension = Vector.from(vector.dimension, 1);
      return new Matrix(vector.data, dimension).multiply(this);
    }

  /** Умножение матрицы слева на вектор-столбец справа
    * @param  {Vector} vector вектор-столбец
    * @return {Matrix} матрица, состоящая из одного вектор-столбца
    */
    multiplyVectorRight(vector) {
      const dimension = Vector.from(1, vector.dimension);
      return this.multiply(new Matrix(vector.data, dimension));
    }

  /** @section METHOD / NON-ALGEBRA */
  /** Сложение матриц (с приведением размерностей) / ADDITION
    * @param {Matrix} matrix прибавляемая матрица
    * @return {Matrix} результирующая матрица
    */
    ADDITION(matrix) {
      const dimension = Matrix.dimension(this, matrix);
      return this.resize(dimension).addition(matrix.resize(dimension));
    }

  /** Умножение матриц с приведением размерностей (с предварительным согласованием) / MULTIPLY
    * @param {Matrix} matrix матрица-множитель (справа)
    * @return {Matrix} результирующая матрица
    */
    MULTIPLY(matrix) {
      const n = Math.max(this.width, matrix.height);
      const left  = Vector.from(n, this.height);
      const right = Vector.from(matrix.width, n);
      return this.resize(left).multiply(matrix.resize(right));
    }

  /** @section LINEAR-ALGEBRA / Линейные (элементарные) преобразования (операции со строками и столбцами) */
  /** Замена столбца в матрице на значения из вектора / columnReplace
    * @param {Natural} index номер столбца
    * @param  {Vector} column новый вектор-столбец
    * @return {Matrix} новая матрица с измененным столбцом
    */
    columnReplace(index, column) {
      return this.fill(index * this.height, ...column.data);
    }

  /** Замена строки в матрице на значения из вектора / rowReplace
    * @param {Natural} index номер столбца
    * @param  {Vector} row новая вектор-строка
    * @return {Matrix} новая матрица с измененной строкой
    * @TODO: @slow
    */
    rowReplace(index, row) {
      return this.transpose.fill(index * this.height, ...row.data).transpose;
    }

  /** Добавление к столбцу матрицы значений из вектора / columnAddition
    * @param {Natural} index номер столбца матрицы
    * @param  {Vector} column прибавляемый вектор-столбец
    * @return {Matrix} новая матрица с измененным столбцом
    */
    columnAddition(index, column) {
      return this.columnReplace(index, this.column(index).addition(column));
    }

  /** Добавление к строке матрицы значений из вектора / rowAddition
    * @param {Natural} index номер столбца матрицы
    * @param  {Vector} row прибавляемая вектор-строка
    * @return {Matrix} новая матрица с измененной строкой
    */
    rowAddition(index, row) {
      return this.rowReplace(index, this.row(index).addition(row));
    }

  /** Обмен местами столбцов матрицы / columnSwap
    * @param {Natural} a номер первого перемещаемого столбца
    * @param {Natural} b номер второго перемещаемого столбца
    * @return {Matrix} новая матрица с изменением мест двух столбцов
    */
    columnSwap(a, b) {
      const columns = this.columns;
      const temp = columns[a];
      columns[a] = columns[b];
      columns[b] = temp;
      return Matrix.from(...columns);
    }

  /** Обмен местами строк матрицы / rowSwap
    * @param {Natural} a номер первой перемещаемой строки
    * @param {Natural} b номер второй перемещаемой строки
    * @return {Matrix} новая матрица с изменением мест двух строк
    * @TODO: @slow
    */
    rowSwap(a, b) {
      return this.transpose.columnSwap(a, b).transpose;
    }

  /** Умножение столбца матрицы на скаляр / columnScale
    * @param {Natural} index номер столбца матрицы
    * @param {number} factor множитель
    */
    columnScale(index, factor) {
      return this.columnReplace(index, this.column(index).scale(factor));
    }

  /** Умножение строки матрицы на скаляр / rowScale
    * @param {Natural} index номер строки матрицы
    * @param {number} factor множитель
    */
    rowScale(index, factor) {
      return this.rowReplace(index, this.row(index).scale(factor));
    }

  /** Добавление к столбцу матрицы другого столбца, помноженного на скаляр / columnAdditionColumn
    * @param {Natural} a номер столбца, к которому будет прибавление
    * @param {Natural} b номер прибавляемого столбца
    * @param {number} factor множитель прибавляемого столбца @required
    * @return {Matrix} матрица после преобразования
    */
    columnAdditionColumn(a, b, factor = 1) {
      return this.columnAddition(a, this.column(b).scale(factor));
    }

  /** Добавление к строке матрицы другой строки, помноженной на скаляр / rowAdditionRow
    * @param {Natural} a номер строки, к которой будет прибавление
    * @param {Natural} b номер прибавляемой строки
    * @param {number} factor множитель прибавляемой строки @required
    * @return {Matrix} матрица после преобразования
    */
    rowAdditionRow(a, b, factor = 1) {
      return this.rowAddition(a, this.row(b).scale(factor));
    }

  /** @section MINORS */

  /** @section SOLVE / GAUSS */
  static gauss(matrix, width) {

  }

  /** @section CREATION @factory @static */
  /** Создание матрицы 2x2 / d2 @static
    *
    * @return {Matrix} н
    */
    static d2(...numbers) {
      return new Matrix(numbers.slice(0, 4), Vector.d2);
    }

  /** Создание матрицы 3x3 / d3 @static
    *
    * @return {Matrix} н
    */
    static d3(...numbers) {
      return new Matrix(numbers.slice(0, 9), Vector.d3);
    }

  /** Создание матрицы 4x4 / d4 @static
    *
    * @return {Matrix} н
    */
    static d4(...numbers) {
      return new Matrix(numbers.slice(0, 16), Vector.d4);
    }

  /** Нулевая (пустая) матрица любой размерности / empty @static
    * @param {Natural|Vector} dimension размерность матрицы
    * @return {Matrix} нулевая матрица
    */
    static empty(dimension = 3) {
      const size = dimension instanceof Vector
        ? dimension.xy
        : Vector.from(dimension || 0, dimension || 0);
      return new Matrix([], size);
    }

  /** Единичная матрица любой размерности / identity @static
    * @param {Natural|Vector} dimension размерность матрицы
    * @return {Matrix} единиичная матрица
    */
    static identity(dimension = 3) {
      const size = dimension instanceof Vector
        ? dimension.xy
        : Vector.from(dimension || 0, dimension || 0);
      const min = size.xy.min;
      const array = new Float32Array(size.product);
      for (let i = 0; i < min; ++i) array[i * size.y + i] = 1;
      return new Matrix(array, size);
    }

  /** Матрица из случайных элементов [0..1) / random @static @factory
    * @param {Natural|Vector} dimension размерность матрицы
    * @return {Matrix} рандомная матрица
    */
    static random(dimension = 3) {
      const size = dimension instanceof Vector
        ? dimension.xy
        : Vector.from(dimension || 0, dimension || 0);
      const data = Array.from(new Array(size.product), Math.random);
      return new Matrix(data, size);
    }

  /** Матрица из набора векторов / from @static @factory
    * @param {Array<Vector>} vectors векторы-столбцы матрицы (размерности должны совпадать)
    * @return {Matrix} матрица
    */
    static from(...vectors) {
      const x = vectors.length;
      const y = vectors[0].dimension; // @TODO: check vector sizes and throw error;

      const data = vectors.reduce(concatenate, []);
      return new Matrix(new Float32Array(data), Vector.v2(x, y));

      /** Собирает общий массив из данных векторов @reduce
        * @param {Array<number>} result аггрегирующий массив
        * @param {Vector} vector текущий вектор
        * @return {Float32Array} итоговый массив
        */
        function concatenate(result, vector) {
          return result.concat(...vector.data);
        }
    }

  /** @section DIAGONAL / SHIFT / SKEW / SHEAR - Диагональные матрицы, матрицы сдвига, матрицы искажения, матрицы перспективы */
  /** Новая матрица из исходной с заменой главной диагонали / DIAGONAL
    * @param {Vector} vector значения для новой главной диагонали
    * @return {Matrix} новая матрица с измененными компонентами главной диагонали
    */
    DIAGONAL(vector) {
      const dimension = this.dimension;
      const h = dimension.y;
      const data = this.#data.slice(0);
      vector.data.forEach((e, i) => { data[h * i + i] = e; })
      return new Matrix(data, dimension);
    }

  /** Диагональная матрица из вектора / diagonal @static
    * @param {Vector} vector элементы главной диагонали
    * @return {Matrix} матрица с нулями и данным вектором главной диагонали
    */
    static diagonal(vector) {
      const n = vector.dimension;
      const data = new Float32Array(n * n);
      vector.data.forEach((e, i) => { data[i * n + i] = e; });
      return new Matrix(data, Vector.from(n, n));
    }

  /** Над-диагональная матрица (диагональ над главной диагональю) / diagonalUp @static
    * @param  {Vector} vector элементы верхней диагонали
    * @return {Matrix} матрица с нулями и данным вектором главной над-диагонали
    */
    static diagonalUp(vector) {
      const n = vector.dimension + 1;
      const data = new Float32Array(n * n);
      vector.data.forEach((e, i) => { data[(i + 1) * n + i] = e; });
      return new Matrix(data, Vector.from(n, n));
    }

  /** Под-диагональная матрица (диагональ под главной диагональю) / diagonalDown @static
    * @param {Vector} vector элементы нижней диагонали
    * @return {Matrix} матрица с нулями и данным вектором главной под-диагонали
    */
    static diagonalDown(vector) {
      const n = vector.dimension + 1;
      const data = new Float32Array(n * n);
      vector.data.forEach((e, i) => { data[i * n + (i + 1)] = e; });
      return new Matrix(data, Vector.from(n, n));
    }

  /** Матрица сдвига вверх (верхне-сдвиговая матрица) / shiftUp @static
    * @param {Natural} dimension размерность
    * @return {Matrix} матрица для операции сдвига
    */
    static shiftUp(dimension) {
      return Matrix.diagonalUp(Vector.identity(dimension));
    }

  /** Матрица сдвига вниз (нижне-сдвиговая матрица) / shiftDown @static
    * @param {Natural} dimension размерность
    * @return {Matrix} матрица для операции сдвига
    */
    static shiftDown(dimension) {
      // return Matrix.shiftUp(dimension).transpose;
      return Matrix.diagonalDown(Vector.identity(dimension));
    }

  /** @TODO: SKEW, SHEAR 2D 3D */
  /** skew2X, skew2Y, skew3X, skew3Y, skew3Z, skew3XY, skew3XZ, skew3YZ, skew */

  /** @section TRANSLATE / Перенос координат */
  /** Операция переноса координат / translate
    * @param {Vector} vector вектор переноса (размерностью на 1 меньше размерности матрицы)
    * @return {Matrix} матрица после переноса координат
    */
    translate(vector) {
      return this.multiply(Matrix.translate(vector));
    }

  /** Операция переноса координат по оси X / translate2X @2D
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translate2X(coordinate) {
      return this.multiply(Matrix.translate2X(coordinate));
    }

  /** Операция переноса координат по оси Y / translate2Y @2D
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translate2Y(coordinate) {
      return this.multiply(Matrix.translate2Y(coordinate));
    }

  /** Операция переноса координат по оси X / translate3X @3D
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translate3X(coordinate) {
      return this.multiply(Matrix.translate3X(coordinate));
    }

  /** Операция переноса координат по оси Y / translate3Y @2D
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translate3Y(coordinate) {
      return this.multiply(Matrix.translate3Y(coordinate));
    }

  /** Операция переноса координат по оси Z / translate3Z @3D
    * @param {number} coordinate координата переноса
    * @return {Matrix} матрица после переноса координат
    */
    translate3Z(coordinate) {
      return this.multiply(Matrix.translate3Z(coordinate));
    }

  /** Операция переноса координат по плоскости Z (перенос по осям X и Y) / translate3XY @3D
    * @param {number} x составляющая переноса по оси X
    * @param {number} y составляющая переноса по оси Y
    * @return {Matrix} матрица после переноса координат
    */
    translate3XY(x, y) {
      return this.multiply(Matrix.translate3XY(x, y));
    }

  /** Операция переноса координат по плоскости Y (перенос по осям X и Z) / translate3XZ @3D
    * @param {number} x составляющая переноса по оси X
    * @param {number} z составляющая переноса по оси Z
    * @return {Matrix} матрица после переноса координат
    */
    translate3XZ(x, z) {
      return this.multiply(Matrix.translate3XZ(x, z));
    }

  /** Операция переноса координат по плоскости X (перенос по осям Y и Z) / translate3YZ @3D
    * @param {number} y составляющая переноса по оси Y
    * @param {number} z составляющая переноса по оси Z
    * @return {Matrix} матрица после переноса координат
    */
    translate3YZ(y, z) {
      return this.multiply(Matrix.translate3YZ(y, z));
    }

  /** Матрица переноса / translate @static
    * @param  {Vector} vector координаты переноса
    * @return {Matrix} размерность на 1 больше размерности вектора
    */
    static translate(vector) {
      const n = vector.dimension + 1;
      const column = n - 1;
      return Matrix.identity(n).fill(column * n, ...vector.data);
    }

  /** Матрица переноса по оси X / translate2X @static @2D
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translate2X(coordinate) {
      return Matrix.translate(Vector.v2(coordinate, 0));
    }

  /** Матрица переноса по оси Y / translate2Y @static @2D
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translate2Y(coordinate) {
      return Matrix.translate(Vector.v2(0, coordinate));
    }

  /** Матрица переноса по оси X / translate3X @static @3D
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translate3X(coordinate) {
      return Matrix.translate(Vector.v3(coordinate, 0, 0));
    }

  /** Матрица переноса по оси Y / translate3Y @static @3D
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translate3Y(coordinate) {
      return Matrix.translate(Vector.v3(0, coordinate, 0));
    }

  /** Матрица переноса по оси Z / translate3Z @static @3D
    * @param {number} coordinate координата переноса
    * @return {Matrix} новая матрица
    */
    static translate3Z(coordinate) {
      return Matrix.translate(Vector.v3(0, 0, coordinate));
    }

  /** Матрица переноса по плоскости Z (по осям X и Y) / translate3XY @static @3D
    * @param {number} x координата по оси X
    * @param {number} y координата по оси Y
    * @return {Matrix} новая матрица
    */
    static translate3XY(x, y = x) {
      return Matrix.translate(Vector.v3(x, y, 0));
    }

  /** Матрица переноса по плоскости Y (по осям X и Z) / translate3XZ @static @3D
    * @param {number} x координата по оси X
    * @param {number} z координата по оси Z
    * @return {Matrix} новая матрица
    */
    static translate3XZ(x, z = x) {
      return Matrix.translate(Vector.v3(x, 0, z));
    }

  /** Матрица переноса по плоскости X (по осям Y и Z) / translate3YZ @static @3D
    * @param {number} y координата по оси Y
    * @param {number} z координата по оси Z
    * @return {Matrix} новая матрица
    */
    static translate3YZ(y, z = y) {
      return Matrix.translate(Vector.v3(0, y, z));
    }

  /** @section SCALE Матрицы масштабирования координат */
  /** Операция масштабирования координат / scale
    * @param {Vector} vector вектор масштаба (размерностью на 1 меньше размерности матрицы)
    * @return {Matrix} матрица после масштабирования координат
    */
    scale(vector) {
      return this.multiply(Matrix.scale(vector));
    }

  /** Операция масштабирования координат по оси X / scale2X @2D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масштабирования координат
    */
    scale2X(factor) {
      return this.multiply(Matrix.scale2X(factor));
    }

  /** Операция масштабирования координат по оси Y / scale2Y @2D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масштабирования координат
    */
    scale2Y(factor) {
      return this.multiply(Matrix.scale2Y(factor));
    }

  /** Операция масштабирования координат по оси X / scale3X @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3X(factor) {
      return this.multiply(Matrix.scale3X(factor));
    }

  /** Операция масштабирования координат по оси Y / scale3Y @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3Y(factor) {
      return this.multiply(Matrix.scale3Y(factor));
    }

  /** Операция масштабирования координат по оси Z / scale3Z @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3Z(factor) {
      return this.multiply(Matrix.scale3Z(factor));
    }

  /** Операция масштабирования координат на плоскости Z (по осям XY) / scale3XY @3D
    * @param {number} x коэффициент масштабирования по оси X
    * @param {number} y коэффициент масштабирования по оси Y
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3XY(x, y = x) {
      return this.multiply(Matrix.scale3XY(x, y));
    }

  /** Матрица масштабирования на плоскости Y (по осям XZ) / scale3XZ @static @3D
    * @param {number} x коэффициент масштабирования по оси X
    * @param {number} z коэффициент масштабирования по оси Y
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3XZ(x, z = x) {
      return this.multiply(Matrix.scale3XZ(x, z));
    }

  /** Матрица масштабирования на плоскости X (по осям YZ) / scale3YZ @static @3D
    * @param {number} y коэффициент масштабирования по оси X
    * @param {number} z коэффициент масштабирования по оси Y
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3YZ(y, z = y) {
      return this.multiply(Matrix.scale3YZ(y, z));
    }

  /** Операция масштабирования координат по осям X, Y, Z на одинаковые значения
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} матрица после масштабирования координат
    */
    scale3XYZ(factor) {
      return this.multiply(Matrix.scale3XYZ(factor));
    }

  /** Матрица масштабирования / scale
    * @param {Vector} vector коэффициенты масштабирования
    * @return {Matrix} матрица размерностю на 1 большей размерности вектора
    */
    static scale(vector) {
      const n = vector.dimension;
      return Matrix.diagonal(vector.resize(n + 1).fill(n, 1));
    }

  /** Матрица масштабирования по оси X / scale2X @static @2D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scale2X(factor) {
      return Matrix.scale(Vector.v2(factor, 1));
    }

  /** Матрица масштабирования по оси Y / scale2Y @static @2D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scale2Y(factor) {
      return Matrix.scale(Vector.v2(1, factor));
    }

  /** Матрица масштабирования по оси X / scale3X @static @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scale3X(factor) {
      return Matrix.scale(Vector.v3(factor, 1, 1));
    }

  /** Матрица масштабирования по оси Y / scale3Y @static @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scale3Y(factor) {
      return Matrix.scale(Vector.v3(1, factor, 1));
    }

  /** Матрица масштабирования по оси Z / scale3Z @static @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scale3Z(factor) {
      return Matrix.scale(Vector.v3(1, 1, factor));
    }

  /** Матрица масштабирования на плоскости Z (по осям XY) / scale3XY @static @3D
    * @param {number} x коэффициент масштабирования по оси X
    * @param {number} y коэффициент масштабирования по оси Y
    * @return {Matrix} новая матрица
    */
    static scale3XY(x, y = x) {
      return Matrix.scale(Vector.v3(x, y, 1));
    }

  /** Матрица масштабирования на плоскости Y (по осям XZ) / scale3XZ @static @3D
    * @param {number} x коэффициент масштабирования по оси X
    * @param {number} z коэффициент масштабирования по оси Y
    * @return {Matrix} новая матрица
    */
    static scale3XZ(x, z = x) {
      return Matrix.scale(Vector.v3(x, 1, z));
    }

  /** Матрица масштабирования на плоскости X (по осям YZ) / scale3YZ @static @3D
    * @param {number} y коэффициент масштабирования по оси X
    * @param {number} z коэффициент масштабирования по оси Y
    * @return {Matrix} новая матрица
    */
    static scale3YZ(y, z = y) {
      return Matrix.scale(Vector.v3(1, y, z));
    }

  /** Матрица масштабирования по осям X, Y, Z на одинаковые значения / scale3XYZ @static @3D
    * @param {number} factor коэффициент масштабирования
    * @return {Matrix} новая матрица
    */
    static scale3XYZ(factor) {
      return Matrix.scale(Vector.v3(factor, factor, factor));
    }

  /** @section ROTATE Матрицы поворота */
  /** Операция абсолютного поворота / rotate2 @2D
    * @param {number} angle угол поворота (в радианах)
    * @return {Matrix} матрица после поворота координат
    */
    rotate2(angle) {
      return this.multiply(Matrix.rotate2(angle));
    }

  /** Матрица абсолютного поворота / rotate2 @static @2D
    * @param {number} angle угол поворота (в радианах)
    * @return {Matrix} матрица поворота
    */
    static rotate2(angle) {
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      return Matrix.TRANSFORM2(cos, sin, -sin, cos);
    }

  /** Матрица абсолютного поворота вокруг вектора @3D / rotate3
    * @param {Vector} vector ось поворота в трёхмерных координатах
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotate3(vector, angle) {
      const q = Quatern.from(angle, vector);
      const xx = q.x * q.x; const xy = q.x * q.y; const xz = q.x * q.z; const xw = q.x * q.w;
      const yy = q.y * q.y; const yz = q.y * q.z; const yw = q.y * q.w;
      const zz = q.z * q.z; const zw = q.z * q.w; const ww = q.w * q.w;

      const a = Vector.v4(1 - 2 * (yy + zz),     2 * (xy + zw),     2 * (xz - yw));
      const b = Vector.v4(2 * (xy - zw),     1 - 2 * (xx + zz),     2 * (yz + xw));
      const c = Vector.v4(2 * (xz + yw),         2 * (yz - xw), 1 - 2 * (xx + yy));

      return Matrix.from(a, b, c, Vector.W);
    }

  /** Матрица абсолютного поворота вокруг оси X @3D / rotate3X
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotate3X(angle) {
      return Matrix.rotate3(Vector.X, angle);
    }

  /** Матрица абсолютного поворота вокруг оси Y @3D /rotate3Y
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotate3Y(angle) {
      return Matrix.rotate3(Vector.Y, angle);
    }

  /** Матрица абсолютного поворота вокруг оси Z @3D / rotate3Z
    * @param {number} angle угол поворота
    * @return {Matrix} матрица поворота
    */
    static rotate3Z(angle) {
      return Matrix.rotate3(Vector.Z, angle);
    }

  /** Создание матрицы поворота 4x4 из кватерниона /
    * @param {Quatern} rotation кватернион
    * @return {Matrix} 4x4
    */
    static quatern(rotation) {
      const sx = rotation.x * rotation.x;
      const sy = rotation.y * rotation.y;
      const sz = rotation.z * rotation.z;
      const sw = rotation.w * rotation.w;
      let inv = 1 / (sx + sy + sz + sw);

      const e00 = ( sx - sy - sz + sw) * inv;
      const e11 = (-sx + sy - sz + sw) * inv;
      const e22 = (-sx - sy + sz + sw) * inv;
      inv *= 2;

      let t1 = rotation.x * rotation.y;
      let t2 = rotation.z * rotation.w;
      const e10 = (t1 + t2) * inv;
      const e01 = (t1 - t2) * inv;

      t1 = rotation.x * rotation.z;
      t2 = rotation.y * rotation.w;
      const e20 = (t1 - t2) * inv;
      const e02 = (t1 + t2) * inv;

      t1 = rotation.y * rotation.z;
      t2 = rotation.x * rotation.w;
      const e21 = (t1 + t2) * inv;
      const e12 = (t1 - t2) * inv;

      return Matrix.d3(e00, e01, e02, e10, e11, e12, e20, e21, e22).resize(Vector.d4).fill(15, 1);
    }

  /** @section TRANSFORM / TRANSITION преобразования */
  /** Применение преобразований (вектор -> вектор) / transition
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    transition(vector) {
      return Matrix.transition(this, vector);
    }

  /** Применение преобразований (переход от одной СК к другой) (вектор -> вектор) AX = B / transition @static
    * @param {Matrix} matrix матрица СК
    * @param {Vector} vector изначальные координаты
    * @return {Vector} координаты в новой СК
    */
    static transition(matrix, vector) {
      return matrix.multiplyVectorRight(vector).vector;
    }

  /** @subsection 2D */
  /** Создание матрицы для 2D преобразований из векторов / transform2 @static @2D
    * @sample
    * [scale.x,  skew.x, translate.x]
    * [ skew.y, scale.y, translate.y]
    * [      0,       0,           1]
    *
    * @param {OptionsTransform2D} optionsTransform2D параметры 2D трансофрмации { scale, transform, skew }
    * @return {Matrix} матрица 2D трансформации
    */
    static transform2(optionsTransform2D) {
      const { scale = Vector.one, translate = Vector.zero, skew = Vector.zero } = optionsTransform2D;
      return Matrix.d3(scale.x, skew.y, 0, skew.x, scale.y, 0, translate.x, translate.y, 1);
    }

  /** Создание матрицы для 2D преобразований из значений / TRANSFORM2 @static @2D
    * @sample
    * [scaleX,  skewX, translateX]
    * [ skewY, scaleY, translateY]
    * [     0,      0,          1]
    *
    * @param {number} scaleX Масштабирование по X
    * @param {number} skewY Искажение по Y
    * @param {number} skewX Искажение по X
    * @param {number} scaleY Масштабирование по Y
    * @param {number} translateX Перенос по X
    * @param {number} translateY Перенос по Y
    * @return {Matrix} матрица 2D трансформации
    */
    static TRANSFORM2(scaleX = 1, skewY = 0, skewX = 0, scaleY = 1, translateX = 0, translateY = 0) {
      return Matrix.d3(scaleX, skewY, 0, skewX, scaleY, 0, translateX, translateY, 1);
    }

  /** Матрица изометрической проекции / isometric @static @2D
    * @param {number} iso коэффициент изометрии
    * @param {Vector} offset сдвиг
    * @return {Matrix} матрица изометрического преобразования
    */
    static isometric(iso = 2, offset = Vector.zero) {
      const scale = 1 / iso;
      const angle = Math.sqrt(1 - scale * scale);
      return Matrix.TRANSFORM2(angle, -scale, angle, scale, offset.x, offset.y);
    }

  /** Перевод точек из одной СК окружения пера в другую через матрицу перехода 2D преобразований / transition2 @2D
    * @param {Vector} vector изначальные координаты { x, y }
    * @return {Vector} координаты в новой СК { x, y }
    */
    transition2(vector) {
      return Matrix.transition2(this, vector.xyz1).xy;
    }

  /** Перевод точек из одной СК окружения пера в другую через матрицу перехода 2D преобразований / transition2 @static @2D
    * @param {Matrix} matrix матрица СК {3, 3}
    * @param {Vector} vector изначальные координаты { x, y }
    * @return {Vector} координаты в новой СК { x, y }
    */
    static transition2(matrix, vector) {
      return Matrix.transition(matrix, vector.xyz1).xy;
    }

  /** @subsection 3D (матрицы 4x4) хелперы для рендеринга 3D */
  /** Перевод точек из одной СК окружения пера в другую через матрицу перехода 3D преобразований / transition3 @3D
    * @param {Vector} vector изначальные координаты { x, y, z }
    * @return {Vector} координаты в новой СК { x, y, z }
    */
    transition3(vector) {
      return Matrix.transition(this, vector.xyzw1).xyz;
    }

  /** Перевод точек из одной СК окружения пера в другую через матрицу перехода 3D преобразований / transition3 @static @3D
    * @param {Matrix} matrix матрица СК {4, 4}
    * @param {Vector} vector изначальные координаты { x, y, z }
    * @return {Vector} координаты в новой СК { x, y, z }
    */
    static transition3(matrix, vector) {
      return Matrix.transition(matrix, vector.xyzw1).xyz;
    }

  /** Матрица пирамидального отсечения (произвольной перспективной проекции) из векторов / frustum @3D @static
    * @param {Vector} vertical вертикальные границы отсечения (x -> bottom, y -> top)
    * @param {Vector} horizontal горизонтальные границы отсечения (x -> left, y -> right)
    * @param {Vector} depth границы отсечения по глубине сцены (x -> near, y -> far)
    * @return {Matrix} итоговая матрица (4x4)
    */
    static frustum(vertical, horizontal, depth) {
      const { a, b, c, d, e, f } = vectors2panes(vertical, horizontal, depth);
      const data = new Float32Array(16);
      // diagonal
      data[0] = 2 * depth.x / a;
      data[5] = 2 * depth.x / b;
      data[10] = -f / c;
      // other
      data[8] = d / a;
      data[9] = e / b;
      data[11] = -1;
      data[14] = -2 * depth.y * depth.x / c;
      return new Matrix(data, Vector.d4);
    }

  /** Матрица прямоугольного отсечения (параллельной / ортогональной проекции) / ortho @3D @static
    * @param {Vector} vertical вертикальные границы отсечения (x -> bottom, y -> top)
    * @param {Vector} horizontal горизонтальные границы отсечения (x -> left, y -> right)
    * @param {Vector} depth границы отсечения по глубине сцены (x -> near, y -> far)
    * @return {Matrix} итоговая матрица (4x4)
    */
    static ortho(vertical, horizontal, depth) {
      const { a, b, c, d, e, f } = vectors2panes(vertical, horizontal, depth);
      const data = new Float32Array(16);
      // diagonal
      data[0]  =  2 / a;
      data[5]  =  2 / b;
      data[10] = -2 / c;
      data[15] =  1;
      // other
      data[12] = -d / a;
      data[13] = -e / b;
      data[14] = -f / c;
      return new Matrix(data, Vector.d4);
    }

  /** Матрица симметричной перспективной проекции / perspective @3D @static
    * @param {number} fovy угол между верхней и нижней плоскостями отсечения (угол обзора)
    * @param {number} aspect отношение ширины к высоте отсекающего окна
    * @param {Vector} depth границы отсечения по глубине сцены (x -> near, y -> far)
    * @return {Matrix} итоговая матрица
    */
    static perspective(fovy, aspect, depth) {
      aspect *= (fovy = depth.x * Math.tan(fovy * Math.PI / 360));
      const vertical   = Vector.v2(-fovy, fovy);
      const horisontal = Vector.v2(-aspect, aspect);
      return Matrix.frustum(vertical, horisontal, depth);
    }

  /** Матрица вида / видовая матрица, матрица камеры / lookAt @D @static
    * @param {Vector} eye начало координат системы наблюдения (положение камеры)
    * @param {Vector} center опорная точка
    * @param {Vector} up верктор "вверх"
    * @return {Matrix} итоговая матрица
    */
    static lookAt(eye, center, up) {
      const f = center.difference(eye).normal;
      const s = f.cross(up).normal;
      const u = s.cross(f);

      return Matrix
        .from(s.xyzw, u.xyzw, f.inverse.xyzw, Vector.W)
        .transpose
        .translate(eye.inverse);
    }

  /** / viewport @3D @static
    * @param {Vector} point
    * @param {Vector} size
    * @param {Vector} depth границы отсечения по глубине сцены (x -> near, y -> far)
    * @return {Matrix} итоговая матрица (4x4)
    */
    static viewport(point, size, depth) {
      const data = new Float32Array(16);
      // diagonal
      data[0]  = size.x / 2;
      data[5]  = size.y / 2;
      data[10] = (depth.y - depth.x) / 2;
      data[15] = 1;

      // translate
      data[12]  = point.x + data[0];
      data[13]  = point.y + data[5];
      data[14] = (depth.y + depth.x) / 2;

      return new Matrix(data, Vector.d4);
    }

  /** @section SERIALIZE */
  /** Строковое представление матрицы / toString @debug
    * @param {Natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} многострочное представление матрицы
    */
    toString(precision = 2) {
      const data = Array.from(this.#data, e => e.toFixed(precision));
      const length = Math.max(...data.map(e => e.length)) + 1;
      const { x, y } = this.#dimension;
      const strings = [];

      for (let i = 0; i < y; ++i) {
        const current = [];
        for (let j = 0; j < x; ++j) {
          const value = data[j * y + i].padStart(length);
          current.push(value);
        }
        strings.push(current.join(', '));
      }
      return `\n${strings.join('\n')}\n`;
    }

  /** JSON-представление матрицы / toJSON
    * @return {string} Matrix{x,y,[a,b,c,d,...]}
    */
    toJSON() {
      const { x, y } = this.#dimension;
      return `Matrix{${x},${y},[${this.#data.join(',')}]}`;
    }

  /** Представление для записи в математических программах / toMath
    * @param {Natural} precision количество знаков после запятой в значениях элементов матрицы
    * @return {string} представление матрицы для математических программ (по строкам)
    */
    toMath(precision = 2) {
      const rows = this.rows;
      return `{${rows.map(v => v.toMath(precision)).join(',')}}`;
    }

  /** Копирование матрицы / copy
    * @return {Matrix} новая матрица
    */
    get copy() {
      const dimension = this.#dimension.copy;
      const array = this.#data.slice();
      return new Matrix(array, dimension);
    }

  /** Вектор из элементов матрицы / vector
    * @return {Vector} вектор элементов матрицы
    */
    get vector() {
      return new Vector(this.#data);
    }

  /** Массив элементов матрицы (по столбцам) / data
    * @return {Float32Array} элементы матрицы
    */
    get data() {
      return this.#data;
    }

  /** Объект из элементов матрицы / object
    * @return {MatrixInfo} объект описывающий матрицу
    */
    get object() {
      const dimension = this.#dimension;
      return {
        width: dimension.x,
        height: dimension.y,
        data: this.#data
      };
    }

  /** @section COMPARE */
  /** Сравнение определителей двух матриц / compare @static
    * @param {Matrix} A сравниваемые матрицы
    * @param {Matrix} B сравниваемые матрицы
    * @return {number} +1, если A > B
    */
    static compare(A, B) {
      const detA = A.determinant;
      const detB = B.determinant;
      return detA > detB ? 1 : detB > detA ? -1 : 0;
    }

  /** Сравнение матриц / equal @static
    * @param {Matrix} A сравниваемые матрицы
    * @param {Matrix} B сравниваемые матрицы
    * @return {Boolean} true, если A === B
    */
    static equal(A, B) {
      const dimension = Vector.equal(A.dimension, B.dimension);
      const dataA = A.data;
      const dataB = B.data;
      return dimension && dataA.every((e, i) => dataB[i] === e);
    }

  /** Проверка типа / is @static
    * @param {any} matrix проверяемый элемент
    * @return {boolean} true, если параметр - {Matrix}
    */
    static is(matrix) {
      return matrix instanceof Matrix;
    }
  }

/** @section @const Частые значения */
/** 2D, 3D */
/** Единичная матрица 2x2 */
  Matrix.i2 = Matrix.identity(2);

/** Единичная матрица 3x3 */
  Matrix.i3 = Matrix.identity(3);

/** Единичная матрица 4x4 */
  Matrix.i4 = Matrix.identity(4);

// #region [Private]
/** Преобразование векторов границ отсечения в значения / vectors2panes
  * @param {Vector} vertical вертикальные границы отсечения (x -> bottom, y -> top)
  * @param {Vector} horizontal горизонтальные границы отсечения (x -> left, y -> right)
  * @param {Vector} depth границы отсечения по глубине сцены (x -> near, y -> far)
 */
  function vectors2panes(vertical, horizontal, depth) {
    return {
      a: horizontal.y - horizontal.x,
      b: vertical.y - vertical.x,
      c: depth.y - depth.x,
      d: horizontal.y + horizontal.x,
      e: vertical.y + vertical.x,
      f: depth.y + depth.x
    };
  }
// #endregion
