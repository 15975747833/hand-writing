/**
 * 节流 throttle  在一定时间间隔内执行一次 类似游戏中的释放技能
 * 防抖 debounce 一个需要被频繁触发的函数，只有任务触发的时间大于间隔时间，任务才会执行 在一定时间间隔内只触发一次  类似于有系统的回城
 */

/**
 * throttle 与 debounce 分析
 * 1、返回值           两个函数返回的是两个被节流/防抖之后的函数
 * 2、参数 fn，delay   一个需要节流/防抖执行的函数，一个是延迟的时间间隔
 * 
 * throttle实现思路
 * 在一定间隔中只执行一次
 * （一定时间内只触发第一次）
 * 第一次正常执行
 *  执行顺序 先将false值为false，等待定时器执行完值为true(可再次执行)
 * 第二次 判断之前的函数是否执行  在闭包中缓存一个变量来判断  true允许执行；false还在计时中
 *  根据执行顺序，第二次进入有两种场景
 *    定时器内的函数未执行(时间间隔不够) 因为上一步的值将flag设为false，所以这次 if (!flag) return; 会被return掉
 *    定时器内函数已执行  函数已执行，将flag的值重新设为true，所以重新设置定时器执行函数
 * 
 * 优化 在重新设置定时器前 清空定时器
 * 
 * 
 * 
 * debounce
 * 频频触发中，会重新触发定时器计时，只会触发最后一次
 * （一定时间内只触发最后一次）
 * 第一次正常执行
 * 第二次 有两种场景，但不会判断下定时器是否执行了，只要间隔时间够，函数会自动执行；间隔时间不够，定时器被清空
 *  时间间隔不够 直接清空定时器，重新计时
 *  间隔时间足够 函数自动执行
 * 
 */




// throttle(fn, 300)
function throttle(fn, delay) {
  let flag = true
  let timer = null;
  return () => {
    if (!flag) return;
    flag = false
    clearInterval(timer)
    timer = setTimeout(() => {
      fn()
      flag = true;
    }, delay)
  }
}
// 测试函数
window.addEventListener(
  "scroll",
  debounce(() => {
    console.log(111);
  }, 1000)
);

function debounce(fn, delay) {
  let timer = null;
  return () => {
    clearInterval(timer)
    timer = setTimeout(() => {
      fn()
    }, delay);
  }
}
// 测试函数
window.addEventListener(
  "scroll",
  debounce(() => {
    console.log(111);
  }, 1000)
);
// 第一次手写，没有意识到debounce和throttle返回是一个函数，直接写死了执行一次
// debounce
// function debounce(fn, times) {
//   let timer = null;
//   timer = setTimeout(() => {
//     fn()
//     timer = null;
//   }, times)
// }
// debounce(fn, 300)