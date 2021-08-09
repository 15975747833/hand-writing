/** @format */

class Test {
  constructor(name) {
    this.name = name;
  }
  // 原型上的方法
  f1(name) {
    this.name = name;
  }
}

let t = new Test('小猪');
console.log('t:000 ', t);
t.f1('大猪');
console.log('t: 111', t);

function test() {
  console.log('aaa');
}
let t2 = new test();
console.log('t:000 ', t2);

t2.prototype = function t3() {
  console.log('t2.prototype t3');
};

test.prototype = function t4() {
  console.log('t2.prototype t4');
};

function a(name) {
  this.name = name;
}
let res = new a('小猪');
console.log(a, 'a');

a.prototype.age = function (age) {
  console.log(this, 'this');
  this.age = age;
};
console.log(a, 'a111');
let res2 = new a('小猪2');

/**
 * [object Boolean]
 * [object Number]
 * [object String]
 * [object Null]
 * [object Undefined]
 * [object Symbol]
 * [object Object]
 * [object Function]
 * [object Array]
 * [object Error]
 * [object RegExp]
 * [object Math]
 * [object JSON]
 * [object HTMLDocument]
 * [object Window]
 */

/**
 * 在JS中如何判断变量类型
 * typeof
 *  返回是字符串
 * typeof null === [object Object]
 * typeof {} [] /^$/ Date    Object
 * instanceof
 * Object.prototype.toString.call
 */

function getType(obj) {
  return Object.prototype.toString.call(obj);
}

const obj = {
  married: true,
  age: 18,
  name: '小猪',
  girlFriend: null,
  boyFriend: undefined,
  flag: Symbol('girl'),
  home: { name: '北京' },
  set: new Set(),
  map: new Map(),
  getName: function () {},
  hobbies: [1, 2, 3],
  error: new Error('lalala'),
  pattern: /^ref$/,
  math: Math,
  json: JSON,
  document: document,
  window: window,
};

let OBJECT_TYPES = [{}, [], new Map(), new Error(), new Date(), /^$/].map((item) => getType(item));
let MAP_TYPE = getType(new Map());
let SET_TYPE = getType(new Set());
let SYMBOL_TYPE = getType(Symbol('1'));
let REGEXP_TYPE = getType(new RegExp(/^$/));
let CONSTRUCT_TYPE = [new Error(), new Date()].map((item) => getType(item));

function clone(source, map = new Map()) {
  const type = getType(source);
  if (!OBJECT_TYPES.includes(type)) {
    return source; // 基本类型直接返回
  }
  if (map.get(source)) {
    return map.get(source);
  }
  if (CONSTRUCT_TYPE.includes(type)) {
    // 实例的constructor 是构造函数
    return new source.constructor(source); // new Date(oldDate)  new Error(oldError)
  }
  let target = new source.constructor(); // {} []
  map.set(source, target);
  if (SYMBOL_TYPE === type) {
    // 克隆symbol的方法，使用valueOf方法倒要原始值，再用object包装一层
    /**
     * let sym = Symbol('a')
     * let newSym = Symbol.prototype.valueOf.call(sym)
     * sym === newSym // true
     */
    // 注意 Symbol.prototyp
    return Object(Symbol.prototype.valueOf.call(source));
  }
  if (REGEXP_TYPE === type) {
    const flags = /\w*$/; //  /.JPG/gi/
    let target = new RegExp(source.source, flags.exec(source));
    target.lastIndex = source[lastIndex];
    return target;
  }
  if (SET_TYPE === type) {
    source.forEach((value) => target.add(clone(value, map)));
    return target;
  }
  if (MAP_TYPE === type) {
    source.forEach((value) => target.set(clone(value, map)));
    return target;
  }
  return target;
}
