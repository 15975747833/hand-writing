/**
 * Object.create(prototype, [propertiesObject])
 * 参数
 * - 原型
 * - propertiesObject对象自有的可枚举属性(自身定义的属性，而不是原型链上的属性)
 * 返回
 * 一个新对象 返回指定的原型对象和属性。
 *
 * @format
 */

function create(prototype, prop) {
  // 创建一个 空的 构造函数
  function F() {}
  // 将构造函数的原型 执行传入的原型
  F.prototype = prototype;
  F.prototype.prop = prop;
  // 实例化这个有新原型的构造函数
  return new F();
}

/**
 * new
 * new constructor[([arguments])]
 * 参数
 *  arguments 构造函数调用的参数列表，会被固化在构造函数上，可以通过this.xx访问
 * 结果
 *  返回一个对象，这个对象包含了构造函数的属性及方法
 * 
 * 使用 new Test({name: 'name'})
 * 
 * 1、初始化一个空对象
 * 2、将this绑定到这个新对象上，并执行方法
 * 3、判断返回结果如果是一个对象或函数，则返回这个结果；否则返回创建的新对象
 */
function myNew(fn, arguments) {
  // 需要复制传进来函数的原型，等下call执行的方法，不能实现原型上的属性
  let obj = Object.create(fn.prototype); // Object.create 可以使用上面的方法来实现
  // 将this指向为 obj, **直接调用call去执行函数，会丢失原型上的属性及方法**
  const res = fn.call(obj, ...arguments);
  // 简单版，函数返回有值，则返回函数调用的结果，否则返回创建的这个新对象
  return res ? res : obj;
  // if (res && (typeof res === 'object' || typeof res === 'function')) {
  //   return res
  // }
  // return obj
}

/** 
 * call 
 * 参数
 *  context 显式绑定的this值
 *  arguments 传递的参数,参数是一个一个传递进来的
 * 返回
 *  call的函数会自动执行，返回结果
 * 
 * call是函数上的一个方法
 * 
 * fn.call(context， arguments)
 */
function call(context, ...args) {
  if (!context || context !== 'null') {
    context = window
  }
  const fn = Symbol()
  context[fn] = this;
  // 为了起到改变this指向的作用，在context添加一个属性，值为fn,
  // 因为函数的this执行是根据谁执行，this就是谁  obj.fn() --this为obj   fn() -- this为window
  // 执行函数 并返回结果
  return context[fn](args)
}

/**
 * apply
 * 与call类似，都是绑定this之后立即执行，参数传进的是个数组
 */
function apply(context, args) {
  if (!context || context !== 'null') {
    context = window
  }
  const fn = Symbol()
  context[fn] = this;
  return context[fn](...args)
}

/**
 * bind 
 * 参数
 *  context 绑定的this
 *  args 绑定的参数(固化的参数)
 * 返回
 *  返回一个重新绑定this的函数
 * 
 * 原理：
 *  使用了函数柯里化
 * 使用 fn.bind(context, args)
 */

// 这个bind先不考虑返回的函数可以作为构造函数使用的场景
// 因为测试这个函数的时候，发现无法调用，所以需要改造函数，改造成原型上的方法
Function.prototype.myBind = function (context, ...args) {
  if (!context || context !== 'null') {
    context = window
  }
  return function (...innerArgs) {
    const fn = Symbol()
    context[fn] = this;
    return context[fn]([...args, ...innerArgs])
  }
}
// function bind(context, ...args) {
//   if (!context || context !== 'null') {
//     context = window
//   }
//   return function (...innerArgs) {
//     const fn = Symbol()
//     return context[fn]([...args, ...innerArgs])
//   }
// }

// 如果考虑到bind出来的函数作为构造函数使用
Function.prototype.myBindConstructor = function (context, ...args) {
  if (!context || context !== 'null') {
    context = window // obj
  }
  const fn = Symbol()
  context[fn] = this;
  const _this = this; // Person 函数
  const result = function (...innerArgs) {
    // ! ** 关键 ** 如何判断bind出来的函数是用做构造函数还是普通函数使用
    // bind出来的函数的名为result， new result ==> context[fn]的实例 ==>  也是this的实例
    // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
    // this.__proto__ === result.prototype   //this instanceof result =>true
    // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
    // 里层的this为result的实例  _this为初始执行的函数
    // ! **如果将bind后的函数 进行实例化，之前bind绑定的this值会 失效 ，this指向为 person的实例**  
    // ! 重点搞清楚什么时候的this是实例，什么时候的this是context,
    if (this instanceof _this) {
      // 此时的this指向result的实例
      this[fn] = _this;
      this[fn]([...args, ...innerArgs])
    } else {
      // this指向context
      context[fn]([...args, ...innerArgs])
    }
  }
  // 作为构造函数，需要继承原来this 原型上的属性及方法
  result.prototype = Object.create(this.prototype)
  return result
}



// 例子
// function Person(name) {
//   this.name = name;
//   console.log('name', this.name, this)
// }

// Person.prototype.say = function () {
//   console.log('123')
// }

// let obj = {
//   name: 'xiaozhu',
//   age: 18
// }

// let bindFunc = Person.myBind(obj, '我是传进来的name');
// let a = new bindFunc('我是传进来的age')
