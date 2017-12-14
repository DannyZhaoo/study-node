var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var  int1 = function (str) {
    return +str;
}

var int2 = function (str) {
    return parseInt(str);
}

var int3 = function (str) {
    return Number(str);
}

var number = '100';

// 添加测试
suite.add('+', function () {
    int1(number);
})
.add('parseInt', function () {
    int2(number);
}) 
.add('Number', function () {
    int3(number);
})
// 每个测试跑完后，输出信息
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });