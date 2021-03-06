const esprima = require('esprima');
const babel = require('babel-core');
const signale = require('signale');
const chai = require('chai');
const expect = chai.expect;
const TRUE = true;
const NULL = null;

console.log = (...inputs) => {
  return signale.success(...inputs.map((input) => {
    if (typeof input === 'object') {
      return JSON.stringify(input);
    }
    return input;
  }));
};

// 求最大公约数
const gcd = (a, b) => {
  if (b > a) {
    [a, b] = [b, a];
  }

  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

// console.log(gcd(16, 28));
// console.log(gcd(206, 40));



// 帕斯卡三角
const paska = (line = 1, result = {}) => {
  line = line || 1;
  const preLine = result[line];

  let length;
  let nextLine;

  if (preLine) {
    length = preLine.length;
    nextLine = new Array(length + 1);
    for (let i = 0; i <= length; i += 1) {
      nextLine[i] = i ? preLine[i - 1] + (preLine[i] || 0) : 1;
    }
    result[--line] = nextLine;
  } else {
    result[--line] = [1];
  }

  if (line) {
    return paska(line, result);
  }
  return result;
};

// console.log(paska(8));





// 幂
const isNull = val => val == NULL;
const hasValue = val => !isNull(val);
const isEven = num => num % 2 === 0;
const isOdd = num => !isEven(num);
const square = num => num * num;
const cube = num => square(num) * num;
const expt = (num, times) => {
  if (times < 1) {
    return 1;
  }

  if (times === 1) {
    return num;
  }

  if (isEven(times)) {
    return square(expt(num, times / 2));
  } else {
    return num * square(expt(num, (times - 1) / 2))
  }
};

const expt2 = (num, times) => {
  if (times <= 1) {
    return num;
  }
  return num * expt2(num, --times);
};

// console.log(expt(2, 5));
// console.log(expt2(2, 5));





// 素数-寻找最小因子
const prime = (num) => {
  if (num < 3) return true;
  const min = 2;
  const max = Math.floor(Math.sqrt(num));
  for (let i = min; i <= max; i += 1) {
    if (!(num % i)) {
      return false;
    }
  }
  return true;
};

// console.log(prime(5));
// console.log(prime(12));
// console.log(prime(37));





// 素数-寻找最小因子-增强
const primeImprove = (num) => {
  if (num < 3) return true;
  const min = 2;
  const max = Math.floor(Math.sqrt(num));
  for (let i = min; i <= max; i += i === 2 ? 1 : 2) {
    if (!(num % i)) {
      return false;
    }
  }
  return true;
};
// console.log(primeImprove(10000));



// 费马小定理：如果n是素数，a为小于n的任意正整数，则a的n次方与a，模n同余
// TODO js精度问题，无法证实定理
const famaS = (num) => {
  num = parseInt(num);
  if (prime(num)) {
    if (num === 1) return true;
    for (let a = 1; a < num; a += 1) {
      if (expt2(a, num) % num !== a % num) {
        return false;
      }
    }
    return true;
  }
  return 'is not prime';
};
// console.log(famaS(561));
// console.log(famaS(1105));





// 找素数花费时间
const searchPrimeTime = (func, range = [0, 1]) => {
  let globalStartTime = Date.now();
  let [start = 0, end = 1] = range;
  const result = {};
  if (end < start) {
    [start, end] = [end, start];
  }

  let startTime = Date.now();
  for (let i = start ; i < end; i += 1) {
    if (func(i)) {
      result[i] = Date.now() - startTime;
      startTime = Date.now();
    }
  }
  return {
    name: func.name,
    // result,
    cost: Date.now() - globalStartTime,
  };
};

// console.log(searchPrimeTime(primeImprove, [, 100000]));
// console.log(searchPrimeTime(prime, [, 100000]));





// 高阶函数-过程作为参数
const sum = (term, start = 0, next, end = 0) => {
  let result = 0;
  if (start > end) {
    return result;
  }

  for (let i = start; i <= end; ) {
    result += term(i);
    i = next(i);
  }
  return result;
};

const increment = num => num += 1;
const pow = num => Math.pow(num, 3);
const identity = num => num;

const sumIncrement = (start, end) => sum(pow, start, increment, end);
const sumIdentity = (start, end) => sum(identity, start, increment, end);

// console.log(sumIncrement(1, 10));
// console.log(sumIdentity(1, 10));




// production
const iter = (min = 1, max = 2, end = 10) => max >= end ? 1 : min / max * iter(max + 1, min + 1, end);
const production = (start = 2, end = 10) => iter(start, start + 1, end);
// console.log(production(2, 9));





// 不动点f(x) === x
const fixPoint = (func, input = 1, tolerance = 0.0001) => {
  const result = func(input);
  if (Math.abs(result - input) <= tolerance) {
    return result;
  }
  return fixPoint(func, result, tolerance);
};

// console.log(fixPoint(Math.cos, 1, 0.0000001)); // 余弦不动点
// console.log(fixPoint(x => Math.sin(x) + Math.cos(x), 1));
// console.log(fixPoint(x => 1 + 1 / x, 1)); // 黄金分割数1.618





const average = (num1, num2) => (num1 +num2) / 2;
const averageFunc = func => num => average(num, func(num));

// 平均阻尼
const averageDump = averageFunc(square);

// 求平方根
const sqrt = x => fixPoint(averageFunc(y => x / y), 1);

// 求立方根
const cubert = x => fixPoint(averageFunc(y => x / square(y)), 1);
// console.log(averageDump(10)); //55
// console.log(sqrt(10)); // 3.1622
// console.log(sqrt(100));
// console.log(cubert(100));


// 求导数
const deriv = func => (num, dx = 0.0001) => (func(num + dx) - func(num)) / dx;
// 求x -> x^3的导数（3x^2）
const derivCube = deriv(cube);
// console.log(derivCube(5));




// 求平方根（牛顿法）
const newtonTransform = func => num => num - func(num) / deriv(func)(num);
const newTonMethod = (func, guess = 1) =>  fixPoint(newtonTransform(func), guess);
// y -> y^2 - x
const sqrt2 = x => newTonMethod(y => square(y) - x);
// console.log(sqrt2(100));






// 第一级抽象：最少限制元素
const fixPointTransform = (func, transform, guess = 1) => fixPoint(transform(func), guess);

// 求平方根（平均阻尼不动点-第一级抽象）
const sqrt3 = x => fixPointTransform(y => x / y, averageFunc);

// 求平方根（牛顿法-第一级抽象）
const sqrt4 = x => fixPointTransform(y => square(y) - x, newtonTransform);
// console.log(sqrt3(100));
// console.log(sqrt4(100));

// 求立方根
const cubert2 = x => fixPointTransform(y => x / square(y), averageFunc);
// console.log(cubert2(100));

// x^3 + ax^2 + bx + c
const newTonCubic = (a, b, c) => newTonMethod(x => cubert2(x) + a * sqrt3(x) + b * x + c);



// f(g(x))
const compose = (f, g) => x => f(g(x));
// (x + 1)^2
const squareInc = compose(square, x => x + 1);
// console.log(squareInc(6)); // 49

// x^2^n
const repeated = x => expt(5, x);
const squareN = x => expt(2, x);
const squareRepeat = compose(repeated, squareN);
// console.log(squareRepeat(2)); // 625




// 有理数运算
const divide = (x, y) => {
  if (y) {
    return x / y;
  }
  throw new Error('the denor can`t be zero');
};
const multi = (...args) => args.reduce((x = 1, y = 0) => (x * y), 1);
const minus = (...args) => args.reduce((x = 0, y = 0) => (x - y));
const add = (...args) => args.reduce((x = 0, y = 0) => (x + Number(y)), 0);
const min = (...args) => Math.min.apply(null, args);
const max = (...args) => Math.max.apply(null, args);

const getRat = (x, options = {}) => {
  let num = x;
  let times = 1;
  while (num % 1) {
    times *= 10;
    num = x * times;
  }

  if (options.toInt) {
    return `${num}/${times}`;
  }

  return {
    numer: num,
    denom: times,
  };
};

/**
 * 抽象屏障
 */

// 1-序对
const cons = divide;
const car = x => getRat(x).numer;
const cdr = x => getRat(x).denom;
// 2-分子分母有理数
const makeRat = (x, y) => cons(x, y);
const numer = x => car(x);
const denom = x => cdr(x);
// 3-有理数操作
const addRat = (x, y) => divide(
  add(
    multi(numer(x), denom(y)),
    multi(numer(y), denom(x)),
  ),
  multi(denom(x), denom(y)),
);
const multRat = (x, y) => divide(
  multi(
    numer(x),
    numer(y),
  ),
  multi(
    denom(x),
    denom(y),
  ),
);

// console.log(addRat(0.8, 0.3));
// console.log(addRat(0.05, 0.3));
// console.log(multRat(0.8, 0.3));
// console.log(multRat(0.05, 0.3));




const oneHalf = makeRat(1, 2);
const oneThird = makeRat(1, 3);

// console.log(addRat(oneHalf, oneThird));// 5 / 6
// console.log(multRat(oneHalf, oneThird));// 1 / 6
// console.log(addRat(oneThird, oneThird));// 6 / 9


const makeRat2 = (x, y) => {
  const g = gcd(x, y);
  if (divide(x, y) < 0) {
    x = -Math.abs(x);
    y = Math.abs(y);
  }
  return cons(divide(x, g), divide(y, g));
};

const oneHalf2 = makeRat2(1, 2);
const oneThird2 = makeRat2(1, 3);

// console.log(addRat(oneHalf2, oneThird2));// 5 / 6
// console.log(multRat(oneHalf2, oneThird2));// 1 / 6
// console.log(addRat(oneThird2, oneThird2));// 6 / 9


const numer2 =  (x) => {
  const g = gcd(car(x), cdr(x));
  return car(x) / g;
};
const denom2 =  (x) => {
  const g = gcd(car(x), cdr(x));
  return cdr(x) / g;
};
// console.log(numer2(0.8));
// console.log(denom2(0.8));

// 线段
class Segment {
  constructor(...args) {
    const argsLength = args.length;
    if (!argsLength) {
      return;
    }

    const {
      start,
      end,
    } = this;
    const iterateArray = [start, end];
    const iterator = argsLength === 1 ? args[0] : args;

    this.checkStatus('isAllArray', iterator);
    iterator.length = 2;
    iterator.forEach((item, index) => {
      iterateArray[index].apply(this, item);
    });
  }

  start(x, y) {
    if (this.begin) {
      return;
    }
    this.begin = true;
    this.startX = x;
    this.startY = y;
  }

  end(x, y) {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.endX = x;
    this.endY = y;
  }

  checkStatus(status, input) {
    switch(status) {
      case 'completed':
        const completed = this.begin && this.ended;
        if (completed) {
          return true;
        }
        throw new Error('the line is not completed');
      case 'isAllArray':
        const isAllArray = input && Array.isArray(input) && input.every(item => Array.isArray);
        if (isAllArray) {
          return true;
        }
        throw new Error(`${input} is not all array`);
      default:
        break;
    }
  }

  getMiddlePoint() {
    this.checkStatus('completed');
    return [
      divide(add(this.endX, this.startX), 2),
      divide(add(this.endY, this.startY), 2)
    ];
  }

  getStartPoint() {
    return [this.startX, this.startY];
  }

  getEndPoint() {
    return [this.endX, this.endY];
  }

  getLength() {
    this.checkStatus('complete');
    return sqrt3(
      add(
        square(minus(this.startX, this.endX)),
        square(minus(this.startY, this.endY)),
      )
    );
  }
}

// const segment = new Segment;
// segment.start(1, 1);
// segment.end(2, 2);
// console.log(segment.getMiddlePoint());
// console.log(segment.getLength());

// const segment2 = new Segment([1, 1], [2, 2]);
// console.log(segment2.getMiddlePoint());
// console.log(segment2.getLength());

// const segment3 = new Segment([[1, 1], [2, 2]]);
// console.log(segment3.getMiddlePoint());
// console.log(segment3.getLength());

// const segment4 = new Segment([[1, 1]]);
// segment4.end(2, 2);
// console.log(segment4.getMiddlePoint());
// console.log(segment4.getLength());

class Rect {
  constructor() {

  }
}

// const rat = makeRat2(1, 2);
// console.log(numer(rat) / denom(rat) === rat);


const cons2 = (x, y) => (m) => [x, y][m];
const z = cons2(1, 5);
const car2 = z(0);
const cdr2 = z(1);
// console.log(car2, cdr2);


const countAdd = (x = 0) => ++x;
const addL = (func, times) => {
  let result = 0;
  while (times--) {
    result = func(result);
  }
  return result;
};
const one = x => addL(countAdd, 1);
// console.log(addL(countAdd, 5));


// 区间算数
const lowerBound = interval => interval[0];
const upperBound = interval => interval[1];
const makeInterval = (x, y) => [x, y];
// 区间相加
const addInterval = (x, y) => makeInterval(
  add(lowerBound(x), lowerBound(y)),
  add(upperBound(x), upperBound(y)),
);
// 相减
const subInterval = (x, y) => makeInterval(
  minus(lowerBound(x), lowerBound(y)),
  minus(upperBound(x), upperBound(y)),
);
// 相乘
const mulInterval = (x, y) => {
  const lowerX = lowerBound(x);
  const lowerY = lowerBound(y);
  const upperX = upperBound(x);
  const upperY = upperBound(y);
  const mArray = [
    multi(lowerX, lowerY),
    multi(lowerX, upperY),
    multi(upperX, lowerY),
    multi(upperX, upperY),
  ];
  return makeInterval(
    min.apply(null, mArray),
    max.apply(null, mArray),
  );
};
// 相除
const divInterval = (x, y) => mulInterval(
  x,
  makeInterval(
    divide(1, lowerBound(y)),
    divide(1, upperBound(y)),
  ),
);

const getIntervalWidth = x => divide(upperBound(x) - lowerBound(x), 2);
const intv1 = [1, 2];
const intv2 = [3, 4];
// console.log(addInterval(intv1, intv2));
// console.log(subInterval(intv1, intv2));
// console.log(mulInterval(intv1, intv2));
// console.log(divInterval(intv1, intv2));
// console.log(getIntervalWidth(addInterval(intv1, intv2)) === add(getIntervalWidth(intv1), getIntervalWidth(intv2)));

// 按需相乘
const mulInterval2 = (x, y) => {
  let interval = new Array(2);
  const lowerX = lowerBound(x);
  const lowerY = lowerBound(y);
  const upperX = upperBound(x);
  const upperY = upperBound(y);

  switch(
    Number(lowerX > 0 && 1)
      | Number(lowerY > 0 && 2)
      | Number(upperX > 0 && 4)
      | Number(upperY > 0 && 8)
  ) {
    case 0:
      interval[0] = multi(upperX, upperY);
      interval[1] = multi(lowerX, lowerY);
      break;
    case 4:
      interval[0] = multi(lowerY, upperX); 
      interval[1] = multi(lowerX, lowerY); 
      break;
    case 8:
      interval[0] = multi(lowerX, upperY); 
      interval[1] = multi(lowerX, lowerY);
      break;
    case 10:
      interval[0] = multi(lowerX, upperY); 
      interval[1] = multi(lowerY, upperX);
      break;
    case 12:
      interval[0] = min.apply(null, [multi(lowerX, upperY), multi(lowerY, upperX)]);
      interval[1] = max.apply(null, [multi(upperX, upperY), multi(lowerX, lowerY)]);
      break;
    case 13:
      interval[0] = multi(upperX, lowerY);
      interval[1] = multi(upperX, upperY);
      break;
    case 14:
      interval[0] = multi(upperY, lowerX);
      interval[1] = multi(upperX, upperY);
      break;
    case 15:
      interval[0] = multi(lowerX, lowerY);
      interval[1] = multi(upperX, upperY);
      break;
  }
  return makeInterval.apply(null, interval);
};

// console.log(mulInterval2([1, 2], [3, 4]));
// console.log(mulInterval2([-1, 2], [3, 4]));
// console.log(mulInterval2([-1, 2], [-3, 4]));
// console.log(mulInterval2([-1, 2], [-4, -3]));
// console.log(mulInterval2([-2, -1], [3, 4]));
// console.log(mulInterval2([-2, -1], [-3, 4]));
// console.log(mulInterval2([-2, -1], [-4, -3]));



const makeCenterInterval = (x, width) => makeInterval(minus(x, width), add(x,width));
const getCenter = x => divide(add(lowerBound(x), upperBound(x)), 2);
const getWidth = getIntervalWidth;
const makeCenterPercent = (center, percent) => [
  minus(center, multi(center, percent)),
  add(center, multi(center, percent)),
];
const gerPercent = (interval) => {
  const center = getCenter(interval);
  return divide(minus(upperBound(interval), center), center);
};
// console.log(makeCenterPercent(3, 0.5));
// console.log(gerPercent([1.5, 4.5]));


const R1 = 4;
const R2 = 5;
// console.log(divide(multi(R1, R2), add(R1, R2)));
// console.log(divide(one(), add(divide(one(), R1), divide(one(), R2))));









// 序列
const listify = (...args) => {
  if (!args.length) {
    return null;
  }

  if (args.length === 1) {
    return args.shift();
  }
  return [args.shift(), listify.apply(null, args)];
};
const flatten = (list, res = []) => {
  if (list) {
    if (list.length) {
      let first = list[0];
      if (Array.isArray(first)) {
        flatten(first, res);
      } else {
        res.push(first);
      }
      return flatten(list[1], res);
    }
    res.push(list);
  }
  return res;
};
const listCons = (el, list) => (
  el ? list ? list.length ? [el, list] : [el] : el : list
);
const listCar = list => list ? list.length ? list[0] : list : list;
const listCdr = (list, noFlatten) => {
  if (list) {
    if (list.length > 1) {
      if (noFlatten) {
        return list[1];
      }
      return flatten(list[1]);
    }
    return list[0];
  }
  return null;
};
const oneThroughFour = () => listify(1, 2, 3, 4);
// console.log(listify(1,2,3));
// console.log(oneThroughFour());
// console.log(listCar(oneThroughFour()));
// console.log(listCdr(oneThroughFour()));
// console.log(listCar(listCdr(oneThroughFour())));
// console.log(listCons(10, oneThroughFour()));
// console.log(listCons(5, oneThroughFour()));


const listRef = (list, index) => {
  if (list && list.length) {
    if (!index) {
      return listCar(list);
    }
    return listCdr(list)[index - 1];
  }
  throw new Error('miss the list');
};
const listOdd = () => listify(1, 3, 5, 7);
const listSqures = () => listify(1, 4, 9, 16, 25);
// console.log(listRef(listSqures(), 3));


const listLength = list => !list ? 0 : (listCdr(list).length + 1);
// console.log(listLength(listOdd())); // 4

const listAppend = (list1, list2) => {
  if (!list1) {
    return list2;
  }
  return listCons(listCar(list1), listAppend(listCdr(list1, true), list2));
};
// console.log(JSON.stringify(listAppend(listOdd(), listSqures())));

const listLastPair = (list) => {
  const cdrList = listCdr(list);
  return cdrList[cdrList.length - 1];
};
// console.log(listLastPair(listOdd()));
// console.log(listLastPair(listSqures()));

const listReverse = (list) => {
  list = flatten(list);
  return listify.apply(null, list.reverse());
};
// console.log(listReverse(listOdd()));


// 算硬币
const getMap = (list) => (list.reduce((map, value, index) => {
  map[index + 1] = value;
  return map;
}, {}));
const usCoins = () => getMap([50, 25, 10, 5, 1]);
const ukCoins = () => getMap([100, 50, 20, 10, 5, 2, 1, 0.5]);
const listCC = (
  amount,
  coinList,
  kind = Object.keys(coinList).length,
) => {
  if (!amount) {
    return 1;
  }

  if (amount < 0 || kind === 0) {
    return 0;
  } else {
    return listCC(amount, coinList, kind - 1) + listCC(amount - coinList[kind], coinList, kind);
  }  
};
// console.log(listCC(100, usCoins())); // 292
// console.log(listCC(100, ukCoins()));

// 序列循环
const listScale = (list, factor) => (
  list
    ? listCons(listCar(list) * factor, listScale(listCdr(list, true), factor))
    : null
);
// console.log(JSON.stringify(listScale(listify(1, 2, 3, 4, 5), 10)));


const listMap = (proc, list) => (
  list
    ? listCons(proc(listCar(list)), listMap(proc, listCdr(list, true)))
    : null
);
const listForEach = (proc, list) => {
  if (list) {
    proc(listCar(list));
    listForEach(proc, listCdr(list, true));
  }
};
const listScale2 = (list, factor) => listMap(x => x * factor, list);
const listSquare = (list, factor) => listMap(square, list);
// console.log(listMap(Math.abs, listify(-1, 2, -3, 4)));
// console.log(listMap(x => x * x, listify(-1, 2, -3, 4)));
// console.log(listScale2(listify(-1, 2, -3, 4), 10));
// console.log(listSquare(listify(-1, 2, -3, 4)));
// listForEach(x => console.log(x), listify(1, -2, 3, 4));
// console.log(listReverse(listify(listify(1, 2), listify(3, 4))));

const listX = () => listify(listify(1, 2), listify(3, 4));
const fringe = list => flatten(list);
const makeMobile = (left, right) => listify(left, right);
// console.log(fringe(listX()));
// console.log(fringe(listify(listX(), listX())));

const listMapDeep = (proc, list) => {
  if (list) {
    if (Array.isArray(listCar(list))) {
      return listCons(
        listMapDeep(proc, listCar(list)),
        listMapDeep(proc, listCdr(list, true)),
      );
    }
    return listCons(
      proc(listCar(list)),
      listMapDeep(proc, listCdr(list, true)),
    );
  }
  return null;
};
const listSquareDeep = list => listMapDeep(square, list);
// console.log(listMapDeep(x => x * 10, ));
// [10,[[20,[[30,40],50]],[60,70]]]
// console.log(JSON.stringify(listSquareDeep(listify(1, listify(2, listify(3, 4), 5), listify(6, 7)))));


const sumOddSqures = (list) => {
  let result = 0;
  listForEach((value) => {
    if (isOdd(value)) {
      result += square(value);
    }
  }, list);
  return result;
};

const sumOddSqures2 = (list) => {
  if (list && list.length) {
    return list.reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + sumOddSqures2(value);
      }
      return count + (isOdd(value) ? square(value) : 0);
    }, 0);
  }
  return 0;
};

// console.log(sumOddSqures(listify(1, 2, 3, 4, 5)));
// console.log(sumOddSqures2(listify(1, 2, 3, 4, 5)));

// 信号流
const listFilter = (predicate, list) => {
  if (list) {
    if (Array.isArray(list)) {
      let car = listCar(list);
      if (predicate(car)) {
        return listCons(car, listFilter(predicate, listCdr(list, true)));
      }
      return listFilter(predicate, listCdr(list, true));
    }
    return list;
  }
  return null;
};

const listAccumulate = (op, initValue, list) => {
  if (list) {
    if (Array.isArray(list)) {
      initValue = op(initValue, listCar(list));
      return listAccumulate(op, initValue, listCdr(list, true));
    }
    return op(initValue, list);
  }
  return 0;
};
// console.log(listFilter(isOdd, listify(1, 2, 3, 4, 5))); // [ 1, [ 3, 5 ] ]
// console.log(listAccumulate(add, 0, listify(1, 2, 3, 4, 5))); // 15
// console.log(listAccumulate(multi, 1, listify(1, 2, 3, 4, 5))); // 120
// console.log(JSON.stringify(listAccumulate(listCons, null, listify(1, 2, 3, 4, 5)))); // [[[[1,2],3],4],5]


// 区间整数序列
const enumerableInterval = (low, high) => {
  if (low > high) {
    return null;
  }
  return listCons(low, enumerableInterval(low + 1, high));
};
// console.log(JSON.stringify(enumerableInterval(1, 4)));

const sumOddSqures3 = (list) => listAccumulate(
  add,
  0,
  listMapDeep(
    square,
    listFilter(isOdd, list),
  ),
);
// console.log(sumOddSqures3(listify(1, 2, 3, 4, 5)));

const listEvenFibs = high => (
  listAccumulate(listCons, null, listFilter(isEven, enumerableInterval(0, high)))
);
// console.log(JSON.stringify(listEvenFibs(10)));

// 斐波那契数
const getFibs = (high, list = [0, 1]) => {
  const length = list.length;
  const next = list[length - 2] + list[length - 1];
  if (length > high) {
    return list;
  }
  list.push(next);
  return getFibs(high, list);
};
// console.log(getFibs(10)); // [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]

// 斐波那契数-平方
const listFibSquare = high => listMap(square, listify.apply(null, getFibs(high)));
// console.log(JSON.stringify(listFibSquare(10))); // [1,[1,[4,[9,[25,[64,[169,[441,[1156,3025]]]]]]]]]

// 奇数平方积
const productOddSquare = list => listAccumulate(multi, 1, listMap(square, listFilter(isOdd, list)));
// console.log(productOddSquare(listify(1, 2, 3, 4, 5))); // 225

// 多项式
const hornerEval = (x, list) => {
  const op = (() => {
    let times = 0;
    return (count, next) => {
      return add(count, multi(next, expt(x, times++)));
    };
  })();
  return listAccumulate(op, 0, list);
};
// 设x = 2, 求1 + 3x + 5x^3 + x^5
// console.log(hornerEval(2, listify(1, 3, 0, 5, 0, 1))); // 79


const countLeaves = list => listAccumulate((count, next) => {
  return add(count, 1);
}, 0, list);
// console.log(countLeaves(listify(1, 2, 3, 4, 5))); // 5


const foldLeft = (op, initValue, list) => {
    const iter = (init, array) => {
      if (array && array.length) {
        return iter(op(init, listCar(array)), listCdr(array, true));
      }
      return op(init, array);
    };
    return iter(initValue, list);
};
// console.log(foldLeft(add, 0, listify(1, 2, 3, 4, 5))); // 15


const listifyRight = (...args) => {
  if (args.length) {
    return args.reduce((result, value, index) => {
      if (index < 2) {
        result.push(value);
        return result;
      }
      return [result, value];
    }, []);
  }
  return null;
};

const foldRight = (op, initValue, list) => {
  if (list && list.length) {
    let suffix = list.pop();
    while (Array.isArray(suffix)) {
      list = suffix;
      suffix = suffix.pop();
    }
    initValue = op(initValue, suffix);
    return foldRight(op, initValue, list);
  }
  return initValue;
};
// console.log(JSON.stringify(listifyRight(1, 2, 3, 4, 5))); // [[[[1,2],3],4],5]
// console.log(foldRight(add, 0, listifyRight(1, 2, 3, 4, 5))); // 15
// console.log(foldLeft(divide, 1, listify(1, 2, 3)));
// console.log(foldRight(divide, 1, listifyRight(1, 2, 3)));
// console.log(foldLeft(listify, null, listify(1, 2, 3))); // [ [ [ null, 1 ], 2 ], 3 ]
// console.log(foldRight(listifyRight, null, listifyRight(1, 2, 3))); // [ [ [ null, 3 ], 2 ], 1 ]
// console.log(foldLeft(add, null, listify(1, 2, 3))); // 6
// console.log(foldRight(add, null, listifyRight(1, 2, 3))); // 6

// 自然序对和为素数（i <= n，j < i，i + j是素数）
const getCountPrime = (n, result = []) => {
  const list = enumerableInterval(2, n);
  listForEach((item) => {
    const childList = enumerableInterval(1, item);
    listForEach((child) => {
      const sum = child + item;
      if (prime(sum)) {
        result.push([item, child, sum]);
      }
    }, childList);
  }, list);
  return result;
};

const primeSum = list => list.reduce((sum, next) => sum + next[2], 0);
// 过滤序列字段
const removeSeq = (removeItem, list) => listFilter(item => removeItem !== item, list);
// console.log(JSON.stringify(getCountPrime(6))); // [[2,1,3],[3,2,5],[4,1,5],[4,3,7],[5,2,7],[6,1,7],[6,5,11]]
// console.log(primeSum(getCountPrime(6)));
// console.log(removeSeq(3, listify(1, 2, 3, 4, 5)));


// 排列组合
const permutation = (list) => {
  // n(n-1)(n-2)……(n-m+1)
  if (list) {
    if (!list.length) {
      list = [list];
    }
    list = flatten(list);
    let result = 1;
    let length = list.length;
    while (length) {
      result = multi(result, length--);
    }
    return result;
  }
  return 0;
};
// console.log(permutation(listify(1, 2, 3, 4)));
// console.log(permutation(listify(1, 2, 3)));
// console.log(permutation(listify(1, 2)));
// console.log(permutation(listify(1)));


// TODO 画家 + 向量这块没看懂。。。。
const makeVect = (x, y) => [x, y];
const addVect = (vect1, vect2) => [vect1[0] + vect2[0], vect1[1] + vect2[1]];
const subVect = (vect1, vect2) => [vect2[0] - vect1[0], vect2[1] - vect1[1]];
const scaleVect = (scale, vect) => [scale * vect[0], scale * vect[1]];
const makeFrame = (origin, edgeX, edgeY) => ({
  origin,
  edgeX,
  edgeY,
});
const makeSegment = (vect1, vect2) => [vect1, vect2];
const startSegment = (origin, start) => subVect(origin, start);
const endSegment = (origin, end) => subVect(origin, end);
// 画家
const segmentsPainter = (list, origin = [0, 0]) => {
  const getX = arr => arr[0];
  const getY = arr => arr[1];

  if (list && list.length) {
    const edges = [];
    let x = 0;
    let y = 0;
    list.forEach((segment) => {
      const start = startSegment(origin, segment[0]);
      const end = endSegment(origin, segment[1]);
      x = Math.max(getX(start), getX(end), x);
      y = Math.max(getY(start), getY(end), y);
      edges.push([start, end]);
    });

    const frame = makeFrame(
      origin,
      makeVect(x, getY(origin)),
      makeVect(getX(origin), y)
    );
    return {
      edges,
      frame,
    };
  }
};
// console.log(JSON.stringify(segmentsPainter([[[1, 1], [2, 1]], [[0, 1], [1, 2]]]))); // 画十
// console.log(JSON.stringify(segmentsPainter([[[1, 1], [2, 2]], [[2, 1], [1, 2]]]))); // 画X

// 画家变换
const transformPainter = (painter, origin, corner1, corner2) => {
  const start = startSegment(origin, corner1);
  const end = endSegment(origin, corner2);
  painter.frame = makeFrame(origin, start, end);
  painter.edges = painter.edges.map((edge) => {
    let [edgeStart, edgeEnd] = edge;
    edgeStart = startSegment(origin, edgeStart);
    edgeEnd = endSegment(origin, edgeEnd);
    return [edgeStart, edgeEnd];
  });
  return painter;
};
// console.log(JSON.stringify(transformPainter(segmentsPainter([[[1, 1], [2, 1]], [[0, 1], [1, 2]]]), [0, 1], [1, 1], [0, 0])));

// 垂直反转
const flipVert = painter => transformPainter(
  painter,
  makeVect(0, 1),
  makeVect(1, 1),
  makeVect(0, 0),
);

// 右上角收缩
const shrinkToUpperRight = painter => transformPainter(
  painter,
  makeVect(0.5, 0.5),
  makeVect(1, 0.5),
  makeVect(0.5, 1),
);

// 逆时针转90°
const rotate90 = painter => transformPainter(
  painter,
  makeVect(1, 0),
  makeVect(1, 1),
  makeVect(0, 0),
);

// 图像中心收缩
const shrinkInwards = painter => transformPainter(
  painter,
  makeVect(0, 0),
  makeVect(0.65, 0.35),
  makeVect(0.35, 0.65),
);

// 判断包含
const memq = (item, list) => {
  if (list) {
    const car = listCar(list);
    if (item === car) {
      return true;
    }
    return memq(item, listCdr(list, true));
  }
  return false;
};
// console.log(memq(5, listify(1, 2, 3, 4, 5)));
// console.log(listFilter(v => v === 5, listify(1, 2, 3, 4, 5)));


const getIndexItem = (array, index = 0) => (Array.isArray(array) ? array[index] : null);
const identify = v => v;

const cad = (expression, options = {}) => {
  const {
    optSymbol,
    optSymbolRe,
    optExprRe,
  } = options;
  const symbol = optSymbol || '[\\*\\/\\+-]+';
  const symbolRe = optSymbolRe || new RegExp(symbol);
  const exprRe = optExprRe || new RegExp(`\\(?(${symbol})((?:\\s*[-\\+]?(?:\\d+|\\d*\\.\\d+)){2,})\\s*\\)?`);
  const result = exprRe.exec(expression);

  if (result) {
    const [expr, symbol, numString] = result;
    const numArray = numString.split(/\s+/g).filter(identify);
    return [expr, symbol, ...numArray];
  }

  if (!options.silence) {
    if (!symbolRe.exec(expression)) {
      return expression;
    }
    throw new Error(`the expression: ${expression} is incorrect`);
  }
  return null;
};

const getSymbolMap = symbol => (
  {
    '+': add,
    '-': minus,
    '/': divide,
    '*': multi,
    '**': expt,
  }[symbol]
);

const cadcalc = (...args) => {
  const [, symbol, ...cadNums] = cad.apply(null, args);
  const symbolFunc = getSymbolMap(symbol);
  if (symbolFunc) {
    return symbolFunc.apply(null, cadNums);
  }
  throw new Error('the ${symbol} is incorrect');
};

const cadMultiCalc = (...args) => {
  let [expression, ...opts] = args;
  let result = cad.apply(null, args);
  while (result && Array.isArray(result)) {
    const [expr] = result;
    expression = expression.replace(expr, cadcalc(expr));
    result = cad.apply(null, [expression].concat(opts));
  }
  return Number(expression);
};

const cadr = expression => Number(getIndexItem(cad(expression), 2));
const caddr = expression => Number(getIndexItem(cad(expression), 3));
const addend = expression => cadr(expression);
const augend = expression => caddr(expression);
const multiplier = expression => cadr(expression);
const multiplicand = expression => caddr(expression);
const isNumber = num => typeof num === 'number';
const makeSum = (a1, a2) => {
  a1 = isNumber(a1) ? a1 : 0;
  a2 = isNumber(a2) ? a2 : 0;
  return cadcalc(`+ ${a1} ${a2}`);
};
const makeProduct = (a1, a2) => {
  a1 = isNumber(a1) ? a1 : 0;
  a2 = isNumber(a2) ? a2 : 0;

  if (!a1 || !a2) {
    return 0;
  }
  return cadcalc(`* ${a1} ${a2}`);
};
// console.log(expect(cad('+ 5 1').toString()).to.be.equal('+ 5 1,+,5,1'));
// console.log(expect(addend('+ 5 1')).to.be.equal(5));
// console.log(expect(augend('+ 5  1')).to.be.equal(1));
// console.log(expect(multiplier('* 5 1')).to.be.equal( 5));
// console.log(expect(multiplicand('(* 5  1)')).to.be.equal(1));
// console.log(expect(makeSum(5, 2)).to.be.equal(7));
// console.log(expect(makeProduct(5, 2)).to.be.equal(10));
// console.log(expect(cadcalc('+ 5 2')).to.be.equal(7));
// console.log(expect(cadMultiCalc('*7 5')).to.be.equal(35));
// console.log(expect(cadMultiCalc('/(-(+(*7 5) 5) 5) 7')).to.be.equal(5));
// console.log(expect(cadMultiCalc('/(-(+(*7 5) 5) 5) 7)')).to.be.equal(5));
// console.log(expect(cadMultiCalc('**(/(-(+(*7 5) 5) 5) 7) 3')).to.be.equal(125));
// console.log(expect(cadMultiCalc('**(+ (- 3 -2.125) -3.125) 4')).to.be.equal(16));
// console.log(expect(cadMultiCalc('**(+ (- 3 -.125 4) -.125 4) 4')).to.be.equal(81));

// 插入集合（去重）
const adjoinSet = (set, el) => {
  if (memq(el, set)) {
    return set;
  }
  return listCons(el, set);
};
// console.log(expect(adjoinSet(listify(1, 2, 3, 4, 5), 6)).to.be.deep.equal([6,[1,[2,[3,[4,5]]]]]));

// 求集合交集（排过序的情况下）
const intersectionSet = (set1, set2, result = []) => {
  if (!set1 || !set2) {
    return result;
  }

  const car1 = listCar(set1);
  const car2 = listCar(set2);

  if (car1 === car2) {
    result = listCons(car1, result);
    return intersectionSet(listCdr(set1, true), listCdr(set2, true), result);
  } else if (car1 > car2) {
    return intersectionSet(listCdr(set2, true), set1, result);
  }
  return intersectionSet(listCdr(set1, true), set2, result);
};
// console.log(expect(intersectionSet(listify(1, 2, 3, 4, 5), listify(1, 4, 5))).to.be.deep.equal([5,[4,[1]]]));


class List {
  constructor(...args) {
    this._els = args || [];
  }

  getElement() {
    return this._els;
  }

  setElement(newList) {
    return this._els = newList;
  }

  getLength (set = this._els) {
    return set.length;
  }

  car () {}
  cdr () {}
  cons(el) {}
  has(el) {}
  adjoin(el) {}
  intersection(list) {}
}

class SSet extends List {
  constructor(...args) {
    super(...args);
    this.sort();
  }

  sort() {
    const set = this.getElement().sort((a, b) => a - b);
    return this.setElement(set);
  }

  car() {
    return this.getElement()[0];
  }

  cdr() {
    return this.getElement().slice(1);
  }

  cons(el) {
    const set = this.getElement();
    set.push(el);
    return set;
  }

  has(el) {
    if (this.getLength()) {
      const car = this.car();
      const cdr = this.cdr();

      if (el === car) {
        return true;
      }

      if (cdr.length) {
        return (new SSet(...cdr)).has(el);
      }
    }
    return false;
  }

  adjoin(el) {
    if (this.has(el)) {
      return this.getElement();
    }
    return this.cons(el);
  }

  intersection(set, result = new SSet()) {
    if (!this.getLength() || !set || !set.getLength()) {
      return result.getElement();
    }

    const car = this.car();
    const otherCar = set.car();

    if (car === otherCar) {
      result.adjoin(car);
      return new SSet(...this.cdr()).intersection(new SSet(...set.cdr()), result);
    } else if (car < otherCar) {
      return new SSet(...this.cdr()).intersection(set, result);
    }
    return this.intersection(new SSet(...set.cdr()), result);
  }
}

// const set1 = new SSet(1, 2, 3, 4, 5);
// const set2 = new SSet(1, 4, 6);
// console.log(expect(set1.has(4)).to.be.deep.equal(true));
// console.log(expect(set1.adjoin(2)).to.be.deep.equal([1,2,3,4,5]));
// console.log(expect(set1.adjoin(6)).to.be.deep.equal([1,2,3,4,5,6]));
// console.log(expect(set1.intersection(set2)).to.be.deep.equal([1,4,6]));



class Tree extends SSet {
  constructor(...args) {
    super(...args);
    this._tree = this.createTree(this.getElement());
  }

  createTree(set = this.getElement(), result = {}) {
    const length = this.getLength(set);
    let mid = Math.floor(length / 2);
    if (!length) {
      return null;
    }

    if (length === 1) {
      return set[0];
    }

    result.left = this.createTree(set.slice(0, mid));
    result.center = set[mid++];
    result.right = this.createTree(set.slice(mid));
    return result;
  }

  getMiddleOfTree(tree = this.getTree()) {
    return tree.center;
  }

  getLeftBranch(tree = this.getTree()) {
    return tree.left;
  }

  getRightBranch(tree = this.getTree()) {
    return tree.right;
  }

  getElementOfTree(el, tree = this.getTree()) {
    if (tree === null) {
      return false;
    }

    if (isNumber(tree)) {
      return el === tree;
    }

    const mid = this.getMiddleOfTree(tree); 
    if (el === mid) {
      return true;
    }
    return this.getElementOfTree(
      el,
      el < mid
        ? this.getLeftBranch(tree)
        :  this.getRightBranch(tree),
    );
  }

  adjoinTree(el, tree = this.getTree(), parentTree, key) {
    if (!isNumber(el)) {
      throw new Error('the el of tree must be a number');
    }

    if (tree === null) {
      return parentTree[key] = el;
    }

    if (isNumber(tree)) {
      let [left, center] = [el, tree];
      
      if (el > tree) {
        [left, center] = [center, left];
      }

      if (parentTree && key) {
        return parentTree[key] = {
          left,
          center,
        };
      }
    }

    const mid = this.getMiddleOfTree(tree);
    
    if (el === mid) {
      return tree;
    }

    this.adjoinTree(
      el,
      el < mid
        ? this.getLeftBranch(tree)
        :  this.getRightBranch(tree),
      tree,
      el < mid ? 'left' : 'right',
    );
    return tree;
  }

  getTree() {
    return this._tree;
  }
}

// const tree1 = new Tree(1, 2, 3, 4, 5);
// const tree2 = new Tree(1, 4, 6);
// console.log(expect(JSON.stringify(tree1.getTree())).to.be.equal('{"left":{"left":1,"center":2,"right":null},"center":3,"right":{"left":4,"center":5,"right":null}}'));
// console.log(expect(JSON.stringify(tree2.getTree())).to.be.equal('{"left":1,"center":4,"right":6}'));
// console.log(expect(tree1.getElementOfTree(3)).to.be.equal(true));
// console.log(expect(tree2.getElementOfTree(3)).to.be.equal(false));
// console.log(expect(JSON.stringify(tree2.adjoinTree(3))).to.be.equal('{"left":{"left":1,"center":3},"center":4,"right":6}'));
// console.log(expect(JSON.stringify(tree2.getTree())).to.be.equal('{"left":{"left":1,"center":3},"center":4,"right":6}'));
// console.log(expect(JSON.stringify(tree2.adjoinTree(4))).to.be.equal('{"left":{"left":1,"center":3},"center":4,"right":6}'));
// console.log(expect(JSON.stringify(tree2.getTree())).to.be.equal('{"left":{"left":1,"center":3},"center":4,"right":6}'));
// console.log(expect(JSON.stringify(tree1.adjoinTree(7))).to.be.equal('{"left":{"left":1,"center":2,"right":null},"center":3,"right":{"left":4,"center":5,"right":7}}'));
// console.log(expect(JSON.stringify(tree1.adjoinTree(2.5))).to.be.equal('{"left":{"left":1,"center":2,"right":2.5},"center":3,"right":{"left":4,"center":5,"right":7}}'));
// console.log(expect(JSON.stringify(tree1.adjoinTree(6))).to.be.equal('{"left":{"left":1,"center":2,"right":2.5},"center":3,"right":{"left":4,"center":5,"right":{"left":6,"center":7}}}'));

const isFunction = val => typeof val === 'function';
const isBoolean = val => typeof val === 'boolean';
const isString = val => typeof val === 'string';
const isObject = val => typeof val === 'object';
const isExist = val => val != void 0;
const func = val => val;

// 哈夫曼树
class HuffmanTree {
  constructor(...args) {
    this.invariant(args, true);
    this.initialize(args);
  }

  invariant(input, checkFunc, options = {}) {
    // initialize input
    if (isBoolean(checkFunc) && checkFunc) {
      this.invariant(input, Array.isArray);
      input.forEach(([symbol, code, weight]) => {
        this.invariant(symbol, isString);
        this.invariant(weight, isNumber);
        this.invariant(code, val => (isString(val) || isNumber(val)));
      });
    } else {
      if (options.deep) {
        if (Array.isArray(input)) {
          return input.forEach(({
            value,
            check,
            message = '',
          }) => (this.invariant(value, check, { message })));
        }
      }

      if (!checkFunc(input)) {
        throw new Error(options.message || `arg: ${input} is invalid`);
      }
    }
    return true;
  }

  initialize(input) {
    this.setLeafList(this.makeLeaf(input));
    this.createLeafCodeMap(input);
    this.createTree();
  }

  setLeafList(input) {
    this.invariant(input, Array.isArray);
    this._leaflist = input;
  }

  createLeafCodeMap(input) {
    this.invariant(input, Array.isArray);
    this._leafCodeMap = {};
    input.forEach(([symbol, code]) => {
      this._leafCodeMap[symbol] = String(code);
    });
  }

  getLeafList() {
    return this._leaflist;
  }

  setTree(tree) {
    this.invariant(tree, isObject);
    this._tree = tree;
    return tree;
  }

  getTree(tree) {
    return this._tree;
  }

  getLeafCodeMap() {
    return this._leafCodeMap;
  }

  isZeroOrOne(val) {
    val = String(val);
    return val === '0' || val === '1';
  }

  sortByWeight(list, ascend) {
    this.invariant(list, Array.isArray);
    const iterator = ascend
      ? (pre, next) => (pre.weight - next.weight)
      : (pre, next) => (next.weight - pre.weight);
    return list.sort(iterator);
  }

  makeLeaf(input) {
    this.invariant(input, Array.isArray);
    return this.sortByWeight(input.map(([symbol, code, weight]) => ({
      symbol,
      code,
      weight,
    })));
  }

  getSymbol(leaf) {
    return leaf.symbol;
  }

  getWeight(leaf) {
    return leaf.weight;
  }

  getLeaf(symbol) {
    const list = this.getLeafList();
    const result = list.filter(leaf => leaf.symbol === symbol);
    if (result.length) {
      return result[0];
    }
    return null;
  }

  getDefaultTree() {
    return {
      weight: 0,
      0: null,
      1: null,
    };
  }

  genLRBranch(list, tree = this.getDefaultTree()) {
    list.forEach((leaf) => {
      let { code } = leaf;
      let index = 0;
      let value;
      let tempTree = tree;

      code = String(code);
      const { weight } = leaf;
      const { length } = code;
      while (TRUE) {
        value = code[index];
        index += 1;
        this.invariant(value, this.isZeroOrOne);
        if (index < length) {
          tempTree[value] = tempTree[value] || this.getDefaultTree();
          tempTree[value].weight += weight;
          tempTree = tempTree[value];
        } else {
          tempTree[value] = leaf;
          break;
        }
      }
    });
    tree.weight = Object.keys(tree).reduce((weight, key) => {
      const value = tree[key].weight || 0;
      return weight += value;
    }, 0);
    return tree;
  }

  createTree() {
    const list = this.getLeafList();
    const tree = this.genLRBranch(list);
    this.setTree(tree);
  }

  getLeftBranch(tree = this.getTree()) {
    this.invariant(tree, isObject);
    return tree[0];
  }

  getRightBranch(tree = this.getTree()) {
    this.invariant(tree, isObject);
    return tree[1];
  }

  getTreeWeight(tree = this.getTree()) {
    this.invariant(tree, isObject);
    return this.getWeight(tree);
  }

  getTreeSymbol(tree = this.getTree()) {
    this.invariant(tree, isObject);
    return this.getSymbol(tree);
  }

  createCodeWalker(code = '') {
    const codelist = String(code).split('');
    return ({
      iterator = func,
      finish = func,
    }) => {
      while (TRUE) {
        const alph = codelist.shift();
        const hasNext = !!codelist.length;
        this.invariant(alph, this.isZeroOrOne);
        iterator(alph, hasNext);
        if (!hasNext) {
          finish(alph);
          break;
        }
      }
    };
  }

  decode(code) {
    this.invariant(code, isExist);
    const codeWalker = this.createCodeWalker(code);
    const tree = this.getTree();
    const result = [];
    let tempTree = tree;

    codeWalker({
      iterator: (alph) => {
        if (isExist(tempTree[alph])) {
          tempTree = tempTree[alph];
        } else {
          result.push(tempTree.symbol);
          tempTree = tree[alph];
        }
      },
      finish: () => {
        if (tempTree.symbol) {
          result.push(tempTree.symbol);
        }
      },
    });
    return result.join('');
  }

  encode(input) {
    const re = new RegExp(`[${input}]`, 'g');
    const map = this.getLeafCodeMap();
    return input.replace(re, (result) => {
      return String(map[result] || '');
    });
  }

  adjoinTree(...leaves) {
    this.invariant(leaves, true);
    const tree = this.getTree();
    let tempTree = tree;
    this.sortByWeight(leaves).forEach((leaf) => {
      const [symbol, code, weight] = leaf;
      const codeWalker = this.createCodeWalker(code);
      codeWalker({
        iterator: (alph, hasNext) => {
          if (hasNext) {
            tempTree[alph] = tempTree[alph] || this.getDefaultTree();
            tempTree.weight += weight;
            tempTree = tempTree[alph];
          } else {
            tempTree[alph] = {
              symbol,
              code,
              weight,
            };
          }
        },
        finish: () => {
          tempTree = tree;
        },
      });
    });
    return this.setTree(tree);
  }

}

const huff = new HuffmanTree(
  ['A', 0, 8],
  ['B', 100, 3],
  ['D', 1010, 1],
  ['R', 1011, 1],
  ['E', 1100, 1],
  ['N', 1101, 1],
  ['L', 1110, 1],
  ['O', 1111, 1],
);
// console.log(expect(JSON.stringify(huff.getTree())).to.be.equal('{"0":{"symbol":"A","code":0,"weight":8},"1":{"0":{"0":{"symbol":"B","code":100,"weight":3},"1":{"0":{"symbol":"C","code":1010,"weight":1},"1":{"symbol":"D","code":1011,"weight":1},"weight":2},"weight":5},"1":{"0":{"0":{"symbol":"E","code":1100,"weight":1},"1":{"symbol":"F","code":1101,"weight":1},"weight":2},"1":{"0":{"symbol":"G","code":1110,"weight":1},"1":{"symbol":"H","code":1111,"weight":1},"weight":2},"weight":4},"weight":9},"weight":17}'));
// console.log(expect(JSON.stringify(huff.getLeftBranch())).to.be.equal('{"symbol":"A","code":0,"weight":8}'));
// console.log(expect(JSON.stringify(huff.getRightBranch())).to.be.equal('{"0":{"0":{"symbol":"B","code":100,"weight":3},"1":{"0":{"symbol":"C","code":1010,"weight":1},"1":{"symbol":"D","code":1011,"weight":1},"weight":2},"weight":5},"1":{"0":{"0":{"symbol":"E","code":1100,"weight":1},"1":{"symbol":"F","code":1101,"weight":1},"weight":2},"1":{"0":{"symbol":"G","code":1110,"weight":1},"1":{"symbol":"H","code":1111,"weight":1},"weight":2},"weight":4},"weight":9}'));
// console.log(expect(huff.decode(1100)).to.be.equal('E'));
// console.log(expect(huff.decode(0)).to.be.equal('A'));
// console.log(expect(huff.decode(100)).to.be.equal('B'));
// console.log(expect(huff.decode('010111101111111101010')).to.be.equal('ARNOLD'));
// console.log(expect(JSON.stringify(huff.adjoinTree(['C', 11110, 2], ['F', 11111, 1]))).to.be.equal('{"0":{"symbol":"A","code":0,"weight":8},"1":{"0":{"0":{"symbol":"B","code":100,"weight":3},"1":{"0":{"symbol":"D","code":1010,"weight":1},"1":{"symbol":"R","code":1011,"weight":1},"weight":2},"weight":5},"1":{"0":{"0":{"symbol":"E","code":1100,"weight":1},"1":{"symbol":"N","code":1101,"weight":1},"weight":2},"1":{"0":{"symbol":"L","code":1110,"weight":1},"1":{"0":{"symbol":"C","code":11110,"weight":2},"1":{"symbol":"F","code":11111,"weight":1},"symbol":"O","code":1111,"weight":1},"weight":5},"weight":7},"weight":12},"weight":20}'));
// console.log(expect(huff.decode(11111)).to.be.equal('F'));
// console.log(expect(huff.decode(huff.encode('ARNOLD'))).to.be.equal('ARNOLD'));




/**
 * 复数（抽象屏障）
 */
class Plural {
  constructor(num) {
    /** TODO **/
    this.num = num;
  }
  add() { /** TODO **/ }
  sub() { /** TODO **/ }
  multi() { /** TODO **/ }
  divide() { /** TODO **/ }
}

// 实部+虚部求复数
class RealImagPlural extends Plural {
  // TODO
}

// 极坐标求复数
class PolarPlural extends Plural {
  // TODO
}

const commonPlural = {
  typeMap: {},
  push(klass) {
    this.typeMap[`${klass.name}`] = klass;
  },
  get(name) {
    return this.typeMap[`${name}Plural`];
  },
};

commonPlural.push(RealImagPlural);
commonPlural.push(PolarPlural);

// console.log(new (commonPlural.get('Polar'))(123.1));



class InstallClass {
  constructor(klass) {
    if (!Array.isArray(klass)) {
      klass = [klass];
    }
    this.klass = klass;
    this.klassProto = klass.map(k => k.prototype);

    this.put = this.put.bind(this);
    this.get = this.get.bind(this);
    this.init();
  }

  invariant(match, errorCallback) {
    if (!match) {
      if (isString(errorCallback)) {
        throw new Error(errorCallback);
      }
      errorCallback();
    }
  }

  init() {
    this.put('invariant', this.invariant);
  }

  put(key, lambda, map) {
    const mapIterator = map ? (k, kl, lamb) => {
      map[k] = map[k] || {};
      map[k][kl.name] = [kl, lamb];
    } : () => {};

    this.klassProto.forEach((proto, index) => {
      const klass = this.klass[index];
      proto[key] = lambda;
      mapIterator(key, klass, lambda);
    });
  }

  get(key, klass = '') {
    if (klass) {
      const klassProto = this.klassProto.filter(proto => proto.constructor === klass);
      if (klass) {
        return klassProto[key];
      }
      return null;
    }
    return this.klassProto.map(proto => proto[key]);
  }
}


class Polynomial {
  constructor(...args) {
    this.args = args;
  }

  checkNumOrArray(input = '', errorMessage = 'error') {
    return this.invariant(Array.isArray(input) || isNumber(input) || !isNaN(Number(input)), errorMessage);
  }

  checkZeroDiv(num, tag) {
    const zeroMessage = 'num can`t be zero';
    if (tag === divide) {
      return this.invariant(!this.isZero(num), zeroMessage);
    }
  }

  addPoly(...args) {
    return add.apply(null, this.args.concat(args));
  }

  multiPoly(...args) {
    return multi.apply(null, this.args.concat(args));
  }

  isZero0(num) {
    if (isNumber(num)) {
      return num === 0;
    }
    return this.args.map(arg => arg === 0);
  }

  baseTermPoly(tag, pre, next) {
    const result = [];
    const errorMsg = 'data type is wrong';
    this.invariant(isFunction(tag), errorMsg);
    this.checkNumOrArray(pre, errorMsg);

    if (!pre) {
      return next;
    }

    if (!next) {
      return pre;
    }

    if (Array.isArray(pre)) {
      return pre.reduce((res, num, index) => {
        res[index] = this.baseTermPoly(tag, num, next);
        return res;
      }, result);
    }
  
    pre = Number(pre);
    if (!Array.isArray(next)) {
      this.checkNumOrArray(next, errorMsg);
      next = [next];
    }
    return next.reduce((res, num) => {
      this.checkNumOrArray(num, errorMsg);
      this.checkZeroDiv(num, tag);
      res = tag(res, num);
      return res;
    }, pre);
  }

  addTermPoly(pre, next) {
    return this.baseTermPoly(add, pre, next);
  }

  minusTermPoly(pre, next) {
    return this.baseTermPoly(minus, pre, next);
  }

  multiTermPoly(pre, next) {
    return this.baseTermPoly(multi, pre, next);
  }

  divideTermPoly(pre, next) {
    return this.baseTermPoly(divide, pre, next);
  }

  gcd(pre, next) {
    if (pre > next) {
      [next, pre] = [pre, next];
    }

    if (!pre) {
      return next;
    }
    return this.gcd(pre, next % pre);
  }

  gcdTermPoly(...args) {
    args = this.args.concat(args);
    let result = args.shift();
    while (args.length) {
      result = this.gcd(result, args.shift());
    }
    return result;
  }

}

{
  const installPolynomial = new InstallClass(Polynomial);
  const { put } = installPolynomial;
  const calMap = {};

  put('isZero', function isZero(...args) {
    return this.isZero0(...args);
  });

  put('add', function add(...args) {
    return this.addPoly(...args);
  });

  put('multi', function multi(...args) {
    return this.multiPoly(...args);
  }, calMap);

  put('addTerm', function addTerm(pre, next) {
    return this.addTermPoly(pre, next);
  });

  put('minusTerm', function minusTerm(pre, next) {
    return this.minusTermPoly(pre, next);
  });

  put('multiTerm', function multiTerm(pre, next) {
    return this.multiTermPoly(pre, next);
  });

  put('divideTerm', function divideTerm(pre, next) {
    return this.divideTermPoly(pre, next);
  });

  put('gcdTerm', function gcdTerm(...args) {
    return this.gcdTermPoly(...args);
  });

  // const poly = new Polynomial(1, 2, 3);
  // console.log(expect(poly.add()).to.be.equal(6));
  // console.log(expect(poly.add(4, 5, 6)).to.be.equal(21));
  // console.log(expect(poly.multi()).to.be.equal(6));
  // console.log(expect(poly.multi(4, 5, 6)).to.be.equal(720));
  // console.log(expect(poly.addTerm([1, 2, 3], [4, 5, 6])).to.be.deep.equal([16,17,18]));
  // console.log(expect(poly.multiTerm([1, 2, 3], [4, 5, 6])).to.be.deep.equal([120,240,360]));
  // console.log(expect(poly.minusTerm([1, 2, 3], [4, 5, 6])).to.be.deep.equal([-14,-13,-12]));
  // console.log(calMap);
  // const exp1 = x => [expt(x, 2) + 1, x + 1, x];
  // const exp2 = x => [x + 2, x, x - 1];
  // console.log(poly.multiTerm(exp1(2), exp2(2)));// [5, 3, 2] * [4, 2, 1] = [40,24,16];
  // console.log(poly.divideTerm([1, 2, 3], [4, 5, 6]));

  // const poly2 = new Polynomial(12);
  // console.log(expect(poly2.gcdTerm(24, 14)).to.be.equal(2)); // 2


// P.162

}


const withdraw = (balance = 100) => (amount) => {
  const result = balance - amount;
  if (result >= 0) {
    balance = result;
    return result;
  }
  return 'Insufficient money';
};

// const w1 = withdraw(100);
// console.log(expect(w1(10)).to.be.equal(90));
// console.log(expect(w1(60)).to.be.equal(30));
// console.log(expect(w1(60)).to.be.equal('Insufficient money'));



let makeAccount = (balance = 100) => (type, amount = 0) => {
  let result = balance;
  const typeType = typeof type;

  if (typeType === 'string') {
    switch (type) {
      case 'deposit':
        result += amount;
        break;
      case 'withdraw':
        result -= amount;
        if (result < 0) {
          return 'Insufficient money';
        }
        break;
      default:
        throw new Error('action is invalid');
        break;
    }
  } else if (typeType === 'function') {
    result = type(result, amount);
  }
  balance = result;
  return result;
};

// const dispatch = makeAccount(100);
// console.log(expect(dispatch('deposit', 10)).to.be.equal(110));
// console.log(expect(dispatch('withdraw', 10)).to.be.equal(100));
// console.log(expect(dispatch((bal, amt) => ((bal * 2) + amt), 10)).to.be.equal(210));


makeAccount = (password = '12345', balance = 100) => {
  const MAX_ATTEMPTS = 7;
  let attempts = 0;

  const callCops = () => {
    // TODO
    return 'cops coming';
  };

  return (pass, type, amount = 0) => {
    if (attempts >= MAX_ATTEMPTS) {
      return callCops();
    }

    if (password !== pass) {
      attempts += 1;
      return new Error('password is invalid');
    }

    let result = balance;
    const typeType = typeof type;

    if (typeType === 'string') {
      switch (type) {
        case 'deposit':
          result += amount;
          break;
        case 'withdraw':
          result -= amount;
          if (result < 0) {
            return 'Insufficient money';
          }
          break;
        default:
          return new Error('action is invalid');
      }
    } else if (typeType === 'function') {
      result = type(result, amount);
    }
    balance = result;
    return result;
  };
};

// const dispatch = makeAccount();
// console.log(expect(dispatch('12345', 'deposit', 10)).to.be.equal(110));
// console.log(expect(dispatch('12345', 'withdraw', 10)).to.be.equal(100));
// console.log(expect(dispatch('12345', (bal, amt) => ((bal * 2) + amt), 10)).to.be.equal(210));
// dispatch('1', 'deposit', 10);
// console.log(expect(dispatch('1', 'deposit', 10)).to.be.deep.equal(new Error('password is invalid')));
// dispatch('1', 'deposit', 10);
// dispatch('1', 'deposit', 10);
// dispatch('1', 'deposit', 10);
// dispatch('1', 'deposit', 10);
// dispatch('1', 'deposit', 10);
// console.log(expect(dispatch('1', 'deposit', 10)).to.be.equal('cops coming'));

// const makeSimplifiedWithdraw = balance => amount => balance -= amount;

// const D = makeSimplifiedWithdraw(100);
// console.log(expect(D(10)).to.be.equal(90));
// console.log(expect(D(10)).to.be.equal(80));
// console.log(expect(D(10)).to.be.equal(70));


const f = (input = 0) => {
  const square = x => x * x;
  const sumOfSquare = (...args) => (
    args.reduce((s, num) => (
      s + square(num)
    ), 0)
  );

  return sumOfSquare(input * 2, input + 1);
};

// console.log(expect(f(5)).to.be.equal(136));

const cons3 = (x, y) => [x, y];
const car3 = (z) => z[0];
const cdr3 = (z) => z[1];
const setCar3 = (z, newVal) => (z[0] = newVal);
const setCdr3 = (z, newVal) => (z[1] = newVal);

// const x = cons3(1, 2);
// const list = cons3(x, x);
// setCar3(cdr3(list), 100);
// console.log(expect(car3(x)).to.be.equal(100));


const makeTable = () => {
  const table = [];

  const lookup = (x, y) => {
    if (typeof table[x] === 'undefined') {
      throw new Error(`line ${x} is missing`);
    }
    return table[x][y];
  };

  const insert = (x, y, value) => {
    table[x] = Array.isArray(table[x]) ? table[x] : [];
    if (table[x][y] !== value) {
      table[x][y] = value;
    }
  };

  const dispatch = (action, ...args) => {
    switch(action) {
      case 'lookup-table':
        return lookup(...args);
      case 'insert-table':
        insert(...args);
        break;
      default:
        throw new Error('unknown operation');
    }
  };

  return {
    lookup,
    insert,
    dispatch,
  };
};

const operationTable = table => ({
  get: table.lookup,
  put: table.insert,
});

let table1 = makeTable();
let table2 = operationTable(table1);
table1.insert(0, 0, 'aa');
table1.insert(1, 3, 'aa');
table1.insert(3, 2, 'aa');
console.log(expect(table1.lookup(1, 3)).to.be.equal('aa'));
console.log(expect(table1.lookup(0, 0)).to.be.equal('aa'));
console.log(expect(table1.lookup(3, 2)).to.be.equal('aa'));
console.log(expect(table1.dispatch('lookup-table', 1, 3)).to.be.equal('aa'));
console.log(expect(table1.dispatch('lookup-table', 0, 0)).to.be.equal('aa'));
console.log(expect(table1.dispatch('lookup-table', 3, 2)).to.be.equal('aa'));
console.log(expect(table2.get(1, 3)).to.be.equal('aa'));
console.log(expect(table2.get(0, 0)).to.be.equal('aa'));
console.log(expect(table2.get(3, 2)).to.be.equal('aa'));



const orGate = (...args) => args.reduce((res, item) => res || item, false);
const andGate = (...args) => args.reduce((res, item) => res || item, true);
const inverter = (...args) => args.reduce((res, item) => res && !item, true);

const makeWire = () => {
  const getSignal = () => {

  };

  const setSignal = (signal = {}, newValue) => {
    if (signal.value !== newValue) {
      signal.value = newValue;
    }
    return signal;
  };

  const addAction = () => {

  };

  const dispatch = (type, ...args) => {
    switch(type) {
      case 'get-signal':
        return getSignal(...args);
      case 'set-signal':
        return setSignal(...args);
      case 'add-action':
        return addAction(...args);
      default:
        throw new Error('unknown operation');
    }
  };

  return {
    getSignal,
    setSignal,
    addAction,
  }
};

const squarer = (x, res) => {
  const processNewValue = () => {
    if (hasValue(x)) {
      if (x !== 0) {
        res = x * x;
      } else {
        throw new Error('square result less than 0');
      }
    }

    if (hasValue(res) && isNull(x)) {
      x = Math.sqrt(res);
    }

    return res;
  };

  const processForgetValue = () => {
    if (hasValue(x)) {
      x = NULL;
    }

    if (hasValue(res)) {
      res = NULL;
    }
  };

  return {
    processNewValue,
    processForgetValue,
  }
};

const constraintSys = (() => {
  return {
    hasValue() {},
    getValue() {},
    setValue() {},
    forgetValue() {},
    connect() {},
  };
})();

// 串行化执行
makeAccount = (balance = 100) => (type, amount = 0) => {
  let result = balance;
  const typeType = typeof type;

  const deposit = (res, amt) => {
    return res + amt;
  };

  const withdraw = (res, amt) => {
    res -= amt;
    if (res < 0) {
      return 'Insufficient money';
    }
    return res;
  };

  if (typeType === 'string') {
    switch (type) {
      case 'deposit':
        result = deposit(result, amount);
        break;
      case 'withdraw':
        result = withdraw(result, amount);
        break;
      default:
        throw new Error('action is invalid');
        break;
    }
  } else if (typeType === 'function') {
    result = type(result, amount);
  }
  balance = result;
  return result;
};

// 互斥元
isPending = false;
if (!isPending) {
  isPending = true;
  // sth is done
  // .....
  isPending = false;
}

// 可读流
// const fs = require('fs');
// const rreader = fs.createReadStream('package.json');
// rreader.on('readable', () => {
//   console.log(`读取的数据: ${rreader.read()}`);
// });
// rreader.on('end', () => {
//   console.log('结束');
// });


// 流计算π
const getPI = (factor = 1, res = 1, calc = '-') => {
  if (res * 4 === Math.PI) {
    return;
  }

  factor += 2;

  if (calc === '-') {
    calc = '+';
    res -= 1 / factor;
  } else {
    calc = '-';
    res += 1 / factor;
  }
  console.log(res * 4);
  return setTimeout(() => getPI(factor, res, calc));
};

// getPI();

// 交替流
const consStream = (el, stream) => {
  return [el].concat(stream);
};

const streamAppend = (stream1, stream2) => {
  if (!stream1.length) {
    return stream2;
  }
  return consStream(stream1.shift(), streamAppend(stream1, stream2)); 
};
expect(streamAppend([1, 2, 3], [4, 5, 6, 7])).to.be.deep.equal([1,2,3,4,5,6,7]);

const interleave = (stream1, stream2) => {
  if (!stream1.length) {
    return stream2;
  }
  return consStream(stream1.shift(), interleave(stream2, stream1));
};
expect(interleave([1, 2, 3], [4, 5, 6, 7])).to.be.deep.equal([1,4,2,5,3,6,7]);






