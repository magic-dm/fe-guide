/**
 * 题目：
 * 
 * dp-目标和
 * 
 * 思路：
 * 动态规划
 * 
 */
// function getArrayCount(nums, S) {
//   const cach = new Map();
//   let sum = 0;
//   const dp = (array, cachKey = '') => {
//     const { length } = array;
//     const [el] = array;
//     const lastVal = cach.get(cachKey) || 0;
//     const restSum = array.reduce((res, pre) => res + pre, 0);
//     if (!length) return;
//     if (lastVal + restSum < S || lastVal - restSum > S) return;
//     const minusKey = cachKey + `-${el}`;
//     const addKey = cachKey + `+${el}`;
//     cach.set(minusKey, lastVal - el);
//     cach.set(addKey, lastVal + el);

//     if (length === 1 && cach.get(minusKey) === S) {
//       sum += 1;
//     }

//     if (length === 1 && cach.get(addKey) === S) {
//       sum += 1;
//     }

//     if (length) {
//       dp(array.slice(1), minusKey);
//       dp(array.slice(1), addKey);
//     }
//   };
//   dp(nums);
//   return sum;
// }
function getArrayCount(nums, S) {
  const memo = new Map();
  const dp = (arr, i, rest) => {
    if (i === arr.length) {
      if (rest === 0) return 1;
      return 0;
    }
    const key = `${i},${rest}`;
    if (memo.has(key)) {
      return memo.get(key);
    }
    const result = dp(arr, i + 1, rest - arr[i]) + dp(arr, i + 1, rest + arr[i]);
    memo.set(key, result);
    return result;
  };
  if (nums.length == 0) return 0;
  return dp(nums, 0, S);
}

console.log(getArrayCount(
  [10,9,6,4,19,0,41,30,27,15,14,39,33,7,34,17,24,46,2,46],
  45,
  // [1,1,1,1,1],
  // 3,
));