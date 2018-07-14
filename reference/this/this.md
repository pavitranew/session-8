## THIS

```
> this // window

> this.a = 37
> window.a // 37

> document.a // undefined
```

In a function, if the value of 'this' is not set by the call, 'this' will default to the global object:

```
function f1() {
  return this;
}

> f1()
```

Note: in strict mode the value of 'this' works differently:

```
function f1() {
  'use strict';
  return this;
}

> f1() // undefined
```

Function methods - call and apply

```
function add(c, d) {
  return this.a + this.b + c + d;
}
const n = {a: 1, b: 3};
```

```
> add.call(n, 5, 7)
> add.apply(n, [10, 20])
```

```
function f() {
  return this.a;
}
const g = f.bind({a: 'unicycle'});
const h = g.bind({a: 'cereal'});
```

```
> g()
> h()  // won’t work a second time
```


```
> const o = {a: 8, f: f, g: g, h: h};
> o.f()
> o.g()
> o.h()
```

```
const o = {
  traditionalFunc: function () {
    console.log('traditionalFunc: is this === o?', this === o);
  },
  arrowFunc: () => {
    console.log('arrowFunc: is this === o?', this === o);
    console.log('arrowFunc: is this === window?', this === window);
  }
};
```

```
> o.traditionalFunc()
> o.arrowFunc()
```

Function called as a method of an object:

```
const p = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};
```

```
> p.f() // logs 37
```

'this' is bound to the 'p' object because the function is called as a method of that object.






