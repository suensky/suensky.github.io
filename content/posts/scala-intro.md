---
title: Recap of Scala tutorial
tags:
  - programming
nav: 编程语言
categories:
- Scala
date: 2021-07-12 11:29:23
image: img/tech.png
---

A cheatsheet that gets you started. The original tutorial can be found [here](https://docs.scala-lang.org/overviews/scala-book/introduction.html)

## Main function

The normal version:
```scala
object Hello {
    def main(args: Array[String]) = {
        println("Hello, world")
    }
}
```

The version that extends `App` trait
```scala
object Hello extends App {
    println("Hello, world")
}

// To access args.
object Hello extends App {
    if (args.size == 0)
        println("Hello, you")
    else
        println("Hello, " + args(0))
}
```
> As you may notice: no `;` needed as ending in Scala.

## Variables
### The type in declaration is optional.
```scala
val s: String = "hello" // val for immutable, final in Java.
val s = "hello"         // Same as above.
var i: Int = 42         // var for mutable.
var i = 42              // Same as above.
```
### Built-in types:
```scala
val b: Byte = 1 // 8-bit signed [-128, 127](-2^7 to 2^7-1, inclusive)
val s: Short = 1      // 16-bit signed.
val x: Int = 1        // 32-bit signed.
val l: Long = 1       // 64-bit signed.
val f: Float = 3.0    // 32-bit IEEE 754 single-precision float.
val d: Double = 2.0   // 64-bit IEEE 754 double-precision float.
val c: Char = 'a'     // 16-bit unsigned Unicode character.
val s: String = "str" // A sequence of Char
```

`BigInt` and `BigDecimal` for large numbers:
```scala
var b = BigInt(1234567890)
var b = BigDecimal(123456.789)
```

### `String` operations:
```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"

val name1 = firstName + " " + mi + " " + lastName   // Concat through +
val name2 = s"$firstName $mi $lastName"             // String interpolation
val name3 = s"Name: ${firstName} ${mi} ${lastName}" // String interpolation with {}

// String interpolation with expressions inside the braces
println(s"1+1 = ${1+1}")
```

### Multiline Strings:
```scala
val speech = """Four score and
               seven years ago
               our fathers ..."""

// To fix the line indentation
val speech = """Four score and
               |seven years ago
               |our fathers ...""".stripMargin
```

## Command-line I/O
### Standard output
```scala
// STDOUT
println("Hello, world")        // With newline at the end
print("Hello without newline") // Without newline.

// STDERR
System.err.println("yikes, an error happened")
```
### Standard input
```scala
import scala.io.StdIn.readLine

object HelloInteractive extends App {

    print("Enter your first name: ")
    val firstName = readLine()

    print("Enter your last name: ")
    val lastName = readLine()

    println(s"Your name is $firstName $lastName")
}
```

## Control Structures
### `if/else` expressions
Statements that are used for side-effects.
```scala
// Basic
if (a == b) doSomething()

// With curly braces
if (a == b) {
    doSomething()
}

// if/else
if (a == b) {
    doSomething()
} else {
    doSomethingElse()
}

// if/else-if/else
if (test1) {
    doX()
} else if (test2) {
    doY()
} else {
    doZ()
}
```

`if` always returns a result
```scala
val minValue = if (a < b) a else b
```

### `for` loops

`for` statements
```scala
// Loop over Seq/List/etc.
val nums = Seq(1,2,3)

for (n <- nums) println(n) // for
people.foreach(println)   // foreach

// Loop over map
val ratings = Map(
    "Lady in the Water"  -> 3.0,
    "Snakes on a Plane"  -> 4.0,
    "You, Me and Dupree" -> 3.5
)

for ((name,rating) <- ratings) println(s"Movie: $name, Rating: $rating")
ratings.foreach {
    case(movie, rating) => println(s"key: $movie, value: $rating")
}
```

`for` expressions
```scala
// Get *2
val doubledNums = for (n <- nums) yield n * 2

// Get capitalized names
val ucNames = for (name <- names) yield name.capitalize

// Use block
val capNames = for (name <- names) yield {
    val nameWithoutUnderscore = name.drop(1)
    val capName = nameWithoutUnderscore.capitalize
    capName
}
// or,
val capNames = for (name <- names) yield name.drop(1).capitalize
// or,
val capNames = for (name <- names) yield { name.drop(1).capitalize }
```

### `match` expressions
`match` returns values.
```scala
val monthName = i match {
    case 1  => "January"
    case 2  => "February"
    // 3,4,5,6,7,8,9,10,11
    case 12 => "December"
    case _  => "Invalid month"
}
```
`match` as a method body.
```scala
// Note: there’s no need for a default case statement.
def convertBooleanToStringMessage(bool: Boolean): String = bool match {
    case true => "you said true"
    case false => "you said false"
}
```

Handling alternate cases.
```scala
def isTrue(a: Any) = a match {
    case 0 | "" => false
    case _ => true
}

val evenOrOdd = i match {
    case 1 | 3 | 5 | 7 | 9 => println("odd")
    case 2 | 4 | 6 | 8 | 10 => println("even")
    case _ => println("some other number")
}
```

`if` in `case`.
```scala
// case body after => can also be in put in curly braces.
count match {
    case 1 => println("one, a lonely number")
    case x if x == 2 || x == 3 => {
      println("two's company, three's a crowd")
    }
    case x if x > 3 =>
      println("4+, that's a party")
    case _ => println("i'm guessing your number is zero or less")
}

// Reference class fields in `if`.
stock match {
  case x if (x.symbol == "XYZ" && x.price < 20) => buy(x)
  case x if (x.symbol == "XYZ" && x.price > 50) => sell(x)
  case x => doNothing(x)
}
```

### try/catch/finally expressions

```scala
var text = ""
try {
    text = openAndReadAFile(filename)
} catch {
    case e: FileNotFoundException => println("Couldn't find that file.")
    case e: IOException => println("Had an IOException trying to read that file")
} finally {
  // your scala code here, such as closing a database connection
  // or file handle
}
```

## Classes
```scala
// Define a class with mutable parameters.
class Person(var firstName: String, var lastName: String)
             ---                    ---

// with immutable parameters.
class Person(val firstName: String, val lastName: String)
             ---                    ---
// more in the constructor.
class Person(var firstName: String, var lastName: String) {

    println("the constructor begins")

    // 'public' access by default
    var age = 0

    // some class fields
    private val HOME = System.getProperty("user.home")

    // some methods
    override def toString(): String = s"$firstName $lastName is $age years old"

    def printHome(): Unit = println(s"HOME = $HOME")
    def printFullName(): Unit = println(this)

    printHome()
    printFullName()
    println("you've reached the end of the constructor")

}

// Create a Person instance.
val p = new Person("Bill", "Panner")
```

More classes.
```scala
class Socket(val timeout: Int, val linger: Int) {
    override def toString = s"timeout: $timeout, linger: $linger"
}

class Address (
    var street1: String,
    var street2: String,
    var city: String,
    var state: String
)
```

### Auxiliary class constructors
```scala
// the primary constructor
class Pizza (var crustSize: Int, var crustType: String) {

    // one-arg auxiliary constructor
    def this(crustSize: Int) = {
        this(crustSize, DefaultCrustType)
    }

    // one-arg auxiliary constructor
    def this(crustType: String) = {
        this(DefaultCrustSize, crustType)
    }

    // zero-arg auxiliary constructor
    def this() = {
        this(DefaultCrustSize, DefaultCrustType)
    }

    override def toString = s"A $crustSize inch pizza with a $crustType crust"
}

val p1 = new Pizza(DefaultCrustSize, DefaultCrustType)
val p2 = new Pizza(DefaultCrustSize)
val p3 = new Pizza(DefaultCrustType)
val p4 = new Pizza // Note: no parens needed.
```

### More on constructor parameters
```scala
// Default values
class Socket(var timeout: Int = 2000, var linger: Int = 3000) {
    override def toString = s"timeout: $timeout, linger: $linger"
}

new Socket()
new Socket(1000)
new Socket(4000, 6000)

// Named parameters
new Socket(timeout=4000, linger=3000)
new Socket(linger = 100)
```

### Methods
```scala
// One input parameter
def double(a: Int) = a * 2             // Omit the return type.
def double(a: Int): Int = a * 2        // With the return type.

def add(a: Int, b: Int) = a + b
def add(a: Int, b: Int): Int = a + b

// Multiline methods in a block.
def addThenDouble(a: Int, b: Int): Int = {
    val sum = a + b
    val doubled = sum * 2
    doubled // Note: return is omitted here.
}
```

### Enumerations
```scala
sealed trait Topping
case object Cheese extends Topping
case object Pepperoni extends Topping
case object Sausage extends Topping
case object Mushrooms extends Topping
case object Onions extends Topping

sealed trait CrustSize
case object SmallCrustSize extends CrustSize
case object MediumCrustSize extends CrustSize
case object LargeCrustSize extends CrustSize

sealed trait CrustType
case object RegularCrustType extends CrustType
case object ThinCrustType extends CrustType
case object ThickCrustType extends CrustType

// The Pizaa class using above enum.
class Pizza (
    var crustSize: CrustSize = MediumCrustSize,
    var crustType: CrustType = RegularCrustType
) {
    // ArrayBuffer is a mutable sequence (list)
    val toppings = scala.collection.mutable.ArrayBuffer[Topping]()

    def addTopping(t: Topping): Unit = toppings += t
    def removeTopping(t: Topping): Unit = toppings -= t
    def removeAllToppings(): Unit = toppings.clear()
}

// The main method.
object PizzaTest extends App {
   val p = new Pizza
   p.addTopping(Cheese)
   p.addTopping(Pepperoni)
   println(p)
}
```

## Trait and Abstract classes
Scala traits are like a Java interface but also like abstract classes that have real methods. Scala classes can extend and “mix in” multiple traits.

### Using Traits as Interfaces
```scala
// Define traits.
trait Speaker {
    def speak(): String
}

trait TailWagger {
    def startTail(): Unit
    def stopTail(): Unit
}

trait Runner {
    def startRunning(): Unit
    def stopRunning(): Unit
}

// Extends a trait.
class Dog extends TailWagger {
    // the implemented methods
    def startTail(): Unit = println("tail is wagging")
    def stopTail(): Unit = println("tail is stopped")
}

// Extends mutltiple traits
class Dog extends Speaker with TailWagger with Runner {

    // Speaker
    def speak(): String = "Woof!"

    // TailWagger
    def startTail(): Unit = println("tail is wagging")
    def stopTail(): Unit = println("tail is stopped")

    // Runner
    def startRunning(): Unit = println("I'm running")
    def stopRunning(): Unit = println("Stopped running")

}
```

### Using Traits as abstract classes
```scala
trait Pet {
    def speak = println("Yo")     // concrete implementation of a speak method
    def comeToMaster(): Unit      // abstract
}

// Class only needs to implement abstract method.
class Dog(name: String) extends Pet {
    def comeToMaster(): Unit = println("Woo-hoo, I'm coming!")
}

// Class can also override implemented methods.
class Cat extends Pet {
    override def speak(): Unit = println("meow")    // override 'speak'
    def comeToMaster(): Unit = println("That's not gonna happen.")
}
```

### Mixing traits in on the fly
```scala
// Traits with concrete methods.
trait TailWagger {
    def startTail(): Unit = println("tail is wagging")
    def stopTail(): Unit = println("tail is stopped")
}

trait Runner {
    def startRunning(): Unit = println("I'm running")
    def stopRunning(): Unit = println("Stopped running")
}

// A minimal class definition.
class Dog(name: String)

// Create a Dog instance that mixes in those traits.
val d = new Dog("Fido") with TailWagger with Runner

// Call the methods in traits. Note: no () needed here.
d.startTail
d.stopTail
d.startRunning
d.stopRunning
```

### Abstract classes
Why abstract classes when Scala already has traits?
> Because Java doesn’t know anything about Scala traits, if you want to call your Scala code from Java code, you’ll need to use an abstract class rather than a trait.
```scala
abstract class Pet (name: String) {
    def speak(): Unit = println("Yo")   // concrete implementation
    def comeToMaster(): Unit            // abstract method
}

// Notice how name parameter is passed from Dog to Pet constructor.
class Dog(name: String) extends Pet(name) {
    override def speak() = println("Woof")
    def comeToMaster() = println("Here I come!")
}
```
> Notice that Scala traits don’t allow constructor parameters, while abstract classes do.

## Collections
Class | Description
--- | ---
ArrayBuffer |	an indexed, mutable sequence
List | a linear (linked list), immutable sequence
Vector | an indexed, immutable sequence
Map | the base Map (key/value pairs) class
Set | the base Set class
> Map and Set come in both mutable and immutable versions.

### ArrayBuffer
```scala
// Need to import first.
import scala.collection.mutable.ArrayBuffer

// Create an empty ArrayBuffer.
val ints = ArrayBuffer[Int]()     // ints=[]
val names = ArrayBuffer[String]()

// Add elements
ints += 1   // ints=[1]
ints += 2   // ints=[1,2]

// Create an ArrayBuffer with initial elements.
val nums = ArrayBuffer(1, 2, 3)

// add one element
nums += 4

// add multiple elements
nums += 5 += 6

// add multiple elements from another collection
nums ++= List(7, 8, 9)

// remove one element
nums -= 9

// remove multiple elements
nums -= 7 -= 8

// remove multiple elements using another collection
nums --= Array(5, 6)
```

More `ArrayBuffer` methods.
```scala
val a = ArrayBuffer(1, 2, 3)         // ArrayBuffer(1, 2, 3)
a.append(4)                          // ArrayBuffer(1, 2, 3, 4)
a.append(5, 6)                       // ArrayBuffer(1, 2, 3, 4, 5, 6)
a.appendAll(Seq(7,8))                // ArrayBuffer(1, 2, 3, 4, 5, 6, 7, 8)
a.clear                              // ArrayBuffer()

val a = ArrayBuffer(9, 10)           // ArrayBuffer(9, 10)
a.insert(0, 8)                       // ArrayBuffer(8, 9, 10)
a.insertAll(0, Vector(4, 5, 6, 7))   // ArrayBuffer(4, 5, 6, 7, 8, 9, 10)
a.prepend(3)                         // ArrayBuffer(3, 4, 5, 6, 7, 8, 9, 10)
a.prepend(1, 2)                      // ArrayBuffer(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
a.prependAll(Array(0))               // ArrayBuffer(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

val a = ArrayBuffer.range('a', 'h')  // ArrayBuffer(a, b, c, d, e, f, g)
a.remove(0)                          // ArrayBuffer(b, c, d, e, f, g)
a.remove(2, 3)                       // ArrayBuffer(b, c, g)

val a = ArrayBuffer.range('a', 'h')  // ArrayBuffer(a, b, c, d, e, f, g)
a.trimStart(2)                       // ArrayBuffer(c, d, e, f, g)
a.trimEnd(2)                         // ArrayBuffer(c, d, e)
```

### List
The List class is a linear, immutable sequence. All this means is that it’s a linked-list that you can’t modify.
```scala
val a = List(1, 2, 3)
// Same as above. This works because a List is
// a singly-linked list that ends with the Nil element.
val a = 1 :: 2 :: 3 :: Nil
val names = List("Joel", "Chris", "Ed")

val a: List[Int] = List(1, 2, 3)
val names: List[String] = List("Joel", "Chris", "Ed")

// Prepend
val b = 0 +: a             // Prepend one element via +:
val b = List(-1, 0) ++: a  // Prepend a sequence via ++:

// Append.
val c = a :+ 5
val c = a :+ List(4, 5)
```
> Note: List is a singly-linked list, you should really only prepend elements to it; appending elements to it is a relatively slow operation, especially when you work with large sequences.


### Vector
The Vector class is an indexed, immutable sequence. In general, except for the difference that Vector is indexed and List is not, the two classes work the same.

```scala
val nums = Vector(1, 2, 3, 4, 5)

val strings = Vector("one", "two")

val peeps = Vector(
    Person("Bert"),
    Person("Ernie"),
    Person("Grover")
)

// Append
val b = a :+ 4
val b = a ++ Vector(4, 5)
val b = a ++: Vector(4, 5)
```

### Map
Map comes in both mutable and immutable.
```scala
import scala.collection.mutable.Map

// Create a Map.
val states = Map(
    "AK" -> "Alaska",
    "IL" -> "Illinois",
    "KY" -> "Kentucky"
)

// Add.
states += ("AL" -> "Alabama")                             // Add a single element.
states += ("AR" -> "Arkansas", "AZ" -> "Arizona")         // Add multiple elements.
states ++= Map("CA" -> "California", "CO" -> "Colorado")  // Add another Map.

// Remove.
states -= "AR"
states -= ("AL", "AZ")
states --= List("AL", "AZ")

// Update.
states("AK") = "Alaska, A Really Big State"

// Loop over an Map.
for ((k,v) <- states) println(s"key: $k, value: $v")
states.foreach {
    case(short, name) => println(s"key: $short, value: $name")
}
```

### Set
The Scala Set class is an iterable collection with no duplicate elements, also comes in both mutable and immutable.
```scala
import scala.collection.mutable.Set

// Create.
val set = scala.collection.mutable.Set[Int]()

// Add.
set += 1
set += 2 += 3
set ++= Vector(4, 5)

set.add(6) // returns true if the element is added, false otherwise.

// Delete.
set -= 1
set -= (2, 3)
set --= Array(4, 5)

set.clear()
set.remove(2) // returns true if the element is removed, false otherwise.
```

### Anonymous function
`map`
```scala
val ints = List(1,2,3)

val doubledInts = ints.map(_ * 2)             // _ * 2 is an anonymous function.
val doubledInts = ints.map((i: Int) => i * 2) // Same as above.
val doubledInts = ints.map(i => i * 2)        // Same as above.

// Also same as
val doubledInts = for (i <- ints) yield i * 2
```

`filter`
```scala
val ints = List.range(1, 10)

val x = ints.filter(_ > 5)

// Below are same.
val x = ints.filter(_ % 2 == 0)
val x = ints.filter((i: Int) => i % 2 == 0)
val x = ints.filter(i => i % 2 == 0)
```

Under the hood.
```scala
val ints = List(1,2,3)

def double(i: Int): Int = i * 2   //a method that doubles an Int
val doubledInts = ints.map(double)

val doubledInts = ints.map(_ * 2) // Same as defining a method and then using it as a parameter.
```

### Common Sequence Methods
> Note: The methods don't mutate the collection

Besides aforementioned `map`, `filter`,`foreach`.

Method | Description
--- | ---
`head` | Get the first element of a sequence.
`tail` | Get every element in a list after the head element.
`take` | Take the first `n` elements out of a list. E.g., `nums.take(2)`
`takeWhile` | Take elements out of a list while condition meets. E.g., `nums.takeWhile(_ < 5)`, `names.takeWhile(_.length < 5)`
`drop` | Drop the first `n` elements out of a list. E.g., `nums.drop(2)`
`dropWhile` | Drop elements out of a list while condition meets. E.g., `nums.dropWhile(_ < 5)`, `names.dropWhile(_ != "chris")`
`reduce` | Takes a function and applies that function to successive elements in the list. E.g., `nums.reduce(_ + _)` to get sum of `nums`

## Miscellaneous
### Tuples
Tuples are NOT collections, they're just a convenient little container.
```scala
// Create.
val t = (3, "Three", new Person("Al"))

// Access fields.
t._1 // 3
t._2 // "Three"
t._3 // Person instance

// Assign to variables.
val(x, y, z) = (3, "Three", new Person("David"))

// Method that returns a tuple.
def getStockInfo = {
    // other code here ...
    ("NFLX", 100.00, 101.00)  // this is a Tuple3
}

// Call the method.
val (symbol, currentPrice, bidPrice) = getStockInfo
```