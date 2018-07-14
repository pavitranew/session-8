function talk(){
	console.log(this.sound)
}
talk('woof')
talk() // 'this' = window object which doesn't have the property sound

/// node this.js

function talk(){
	console.log(this)
}

talk() // global object

///

function talk(){
	console.log(this.sound)
}
const boromir = {
	sound: 'One does not simply walk into Mordor'
}
const talkBoundToBoromir = talk.bind(boromir) 
talkBoundToBoromir() // creates a copy of the original function
talk() // bind leaves the original function alone

//////

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	speak: talk, // talk is a property of speak. Reference to talk function is being assigned as a property
	sound: 'One does not simply walk into Mordor'
}
boromir.speak() // calling a property on an object. JS infers that 'this' is a function. Uses boromir as 'this'
talk() // undefined. Uses the global object (window) as 'this'

// the two calls above refer to the same function

//////

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	speak: talk, // talk is a property of speak.
	sound: 'One does not simply walk into Mordor'
}
let blabber = boromir.speak() // 
blabber() // undefined. Refers to the talk function


///// bind() to make a copy of the function

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	speak: talk.bind(boromir), // talk is a property of speak.
	sound: 'One does not simply walk into Mordor'
}
let blabber = boromir.speak() // 
blabber() // boromir is not defined. boromir deosn't exist yet because we are still in the statement where boromir is defined


/////

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	sound: 'One does not simply walk into Mordor'
}
boromir.speak = talk.bind(boromir)
let blabber = boromir.speak() // creates a new copy of talk with 'this' refering to boromir
blabber() // works!

////// comment out the bind()

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	sound: 'One does not simply walk into Mordor'
}
boromir.speak = talk//.bind(boromir)
let blabber = boromir.speak() // 
blabber() // undefined


///// call talk after blabber

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	sound: 'One does not simply walk into Mordor'
}
boromir.speak = talk.bind(boromir)
let blabber = boromir.speak() // 
blabber() // works!
talk() // undefined


//// go back to where we had talk as a property on boromir

let talk = function (){
	console.log(this.sound)
}
const boromir = {
	blabber: talk,
	sound: 'One does not simply walk into Mordor'
}

const gollum = {
	jabber: boromir.blabber,
	sound: 'My preciousss'
}
gollum.jabber() // works

// what 'this' refers to is determined at the time of the call, context sensitive























