const esprima = require('esprima');
const babel = require('babel-core');

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
const isEven = num => num % 2 === 0;
const square = num => num * num;
const expt = (num, times) => {
  if (times <= 1) {
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










// ast
const scripts = `
 const a = {
   props: {
     bindingPropLis_: {
       type: Array,
       default() {
         return [];
       },
     },
   },
   data() {
     return {
       slots: [],
     };
   },
   mounted() {
     const $slots = this.$slots;
     const slots = {};
     Object.keys($slots).forEach((key) => {
       slots[key] = $slots[key];
     });
     this.slots = slots;
     this.$on('hello', (text) => {
       console.log(text);
     });
     console.log(this);
   },
 };
`;

// console.log(JSON.stringify(esprima.parseScript(scripts), null, '  '));
// console.log(JSON.stringify(babel.transform(scripts), null, '  '));