## Prototypal inheritance

cd into `_classes`, run `lite-server` and open http://localhost:3000/1-inheritance.html

We have a constructor function:

```
function Car(model, make) {
  this.model = model;
  this.make = make;
}
```

and a car with properties.

```
> expo
```

Prototypal inheritance - methods on the original constructor will be inherited.

### Example: Array 

Create an array: 

```
> const names = ['John', 'Henry']
```

Examine the Array - Array prototypes

```
> names.join(', ')
> names.pop()
```

Add a prototype:

```
Car.prototype.drive = function() {
    console.log(`Vroom vroom! I'm a ${this.model}`);
};
```

Add a second car:

```
const miata = new Car('Miata', 'Mazda');
```

```
> miata.drive()
> expo.drive()
```

expo inherits the prototype.

Override with (add after)

```
Car.prototype.drive = function() {
    console.log(`Vroom vroom 🚗 🚗 🚗! I'm a ${this.model} and I'm a ${this.make}`);
};
```

```
> expo.drive()
```

Add an additional prototype:

```
Car.prototype.stop = function() {
    console.log(`Screech! 🚒 🚑 🚓`);
};
```

```
> expo.stop()
```

### Classes

http://localhost:3000/2-classes.html

Note syntax - (esp. lack of comma):

```
class Car {
  constructor(model, make) {
    this.model = model;
    this.make = make;
  }
  drive() {
    console.log(`Vroom vroom 🚗🚗🚗! I'm a ${this.model} and I'm a ${this.make}`);
  }
  stop() {
    console.log(`Screech! 🚒🚑🚓`);
  }
}
```

```
> expo
> expo.drive()
> expo.stop()
```

### Static Methods

```
static info() {
  console.log('I\'m a static method, cars only need apply' );
}
```

```
> expo.info()
> Car.info()
> expo
```

Inspect the expo prototype.

A static method is similar to Array.of - it is not inherited.

### Static methods on an Array

Array.of and the spread operator:

[Emmet](https://docs.emmet.io/abbreviations/syntax/) (ctrl-e):

`ul>li*4>a[href="#"]{link}`

```
> Array.of(1,2,3,4)
> const links = document.querySelectorAll('li')
> Array.of(links)
> Array.of(...links)
```

But .of is not inerited

```
> numbers = [6,7,8,9]
> numbers.of(1,2,3,4)
```

e.g. static method - Cars only:

```
Car.info()
```

### Getters and Setters

```
get description() {
  return `${this.model} is a ${this.make} type of car`;
}
```

* Not a method (no braces when calling)

```
> expo.description
```

Setters

```
set nicknames(value) {
  this.nick = value.trim();
}
```

```
expo.nicknames = '   fluffy   '
```

```
get nicknames() {
  return this.nick.toUpperCase();
}
```

```
expo.nicknames
```

### Extending Classes

http://localhost:3000/3-extending-classes.html

```
> rhino
> rhino.eat('lilies')
> rhino.eat('hunters')
> rhino.drink()
```

#### Super

Calls the thing that you are extending first.

We want to extend our Animal class to include a subclass dogs.

This will not work:

```
class Dog extends Animal {
  constructor(name, breed) {
    this.name = name;
    this.breed = breed;
  }
}
```

We need to call `super` first and here, super needs a name:

```
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}
```

```
const yorik = new Dog('Yorik', 'Terrier');
```

```
> yorik
```

Add a bark method:

```
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() {
    console.log(`Bark bark my name is ${this.name} and I\'m a dog`);
  }
}
```

### Extending Arrays

http://localhost:3000/4-extending-arrays.html

Making our own classes modelled after Array.

Start off with an array with a property:

```
const movies = new MovieCollection('My Favorite Movies',
  { name: 'Bee Movie', stars: 10 },
  { name: 'Star Wars Trek', stars: 1 },
  { name: 'Virgin Suicides', stars: 7 },
  { name: 'King of the Road', stars: 8 }
);
```

We create a class _off_ the Array.

Adding name and using a spread operator to add the items:

```
class MovieCollection extends Array {
  constructor(name, ...items) {
    super(...items);
    this.name = name;
  }
```

Super calls the Array prototype with a spread operator.

```
> movies[4]
> movies.name
```

We have an Array that also has properties (possible because in JS, Arrays are objects):

```
typeof [1,2]
```

Methods using the array prototype methods can be added:

```
add(movie) {
  this.push(movie);
}
```

`for... in`:

```
> for (const movie in movies){ console.log(movie) }
```

returns the key _and_ the name property.

More useful will be `for... of` which returns only the array:

```
> for (const movie of movies){ console.log(movie) }
```

We get the object (not the key) and the property (name) is not shown. 

N.B. for of loops skip over the properties.

```
> movies.topRated()
```

topRated:

```
topRated() {
  const ordered = this.sort(function(firstMovie, secondMovie){
    if(firstMovie.stars > secondMovie.stars){
      return 1
    } else {
      return -1
    }
    })
}
```

```
> console.table(movies.topRated())
```

```
> console.table(movies.topRated(2))
```

Aside: we will be using this in a future exercise 

```
Object.keys(movies)
```



















