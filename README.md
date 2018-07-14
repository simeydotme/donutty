# donutty 🍩📉
Simple (but powerful) SVG donut charts with JavaScript (or jQuery)

![Example of almost-default configuration](../master/docs/images/donutty-updated.gif)  
[see a bunch of examples on CodePen](https://codepen.io/simeydotme/pen/rrOEmO/)

## installation

in your terminal, use one of the following;

```shell
yarn add donutty
```

```shell
npm install donutty
```

```shell
bower install donutty
```

## usage

Once you have the package installed in your `node_modules/` folder by following the installation above
then you may include the `./dist/` file of choice:
- `donutty.min.js`
- `donutty-jquery.min.js`

### classic
You may include the **javascript** directly in to your **html** files by
using a direct `<script>` tag;
```html
<script src="/node_modules/donutty/dist/donutty.min.js"></script>
```
This method is not really ideal for a modern web application, though.

### bundle
A better way to include **donutty** is to add it to your vendor bundle, this can be done
many ways with tools such as **gulp** or **webpack**. In those scenarios you might want to
use the `dist/donutty.js` file as the entry point.

## configuration

There's a couple of ways to configure **donutty** depending on how you prefer:
1. `html` data attributes  
  This way uses data attributes in the `DOM` (**html**) to configure the options of donutty

  ```html
  <!-- this will create a donut chart with a mininum value
      of -50, maximum of 50 and a set value of 33 -->

  <div id="donut" data-donutty data-min=-50 data-max=50 data-value=33>
  </div>
  ```
2. `js` initialisation  
  This method uses a javascript accessor to initialise and configure **donutty**'s options

  ```js
  // this will create a donut chart on #donut with a minimum value
  // of -50, maximum of 50 and a set value of 11

  // jquery
  var donut = $("#donut").donutty({ min: -50, max: 50, value: 11 });

  // or vanilla
  var donut = new Donutty( document.getElementById( "donut" ), { min: -50, max: 50, value: 11 });
  ```

## options

| option | type | default | description |
| -----: | :--- | :------ | :---------- |
| **`min`** | `Number` | `0` | the minimum value the donut can be |
| **`max`** | `Number` | `100` | the maximum value of the donut |
| **`value`** | `Number` | `50` | the actual value of the donut |
| **`round`** | `Boolean` | `true` | if the edges of the donut are rounded or not |
| **`circle`** | `Boolean` | `true` | does the donut create a complete circle or not |
| **`radius`** | `Number` | `50` | the radius of the donut (size, essentially, but can be made auto with `css`) |
| **`thickness`** | `Number` | `10` | how thick the actual donut track is |
| **`padding`** | `Number` | `4` | padding between the background (track) and the donut |
| **`bg`** | `String` | `"rgba(70, 130, 180, 0.15)"` | the color of the background (track) |
| **`color`** | `String` | `"mediumslateblue"` | color of the actual donut |
| **`transition`** | `String` | [¹ see below](#1-default-transition) | the default animation which runs on the donut |

##### 1 default transition
`"all 1.2s cubic-bezier(0.57, 0.13, 0.18, 0.98)"`  
[Check out all the options on CodePen](https://codepen.io/simeydotme/pen/rrOEmO/)


## methods
There are some methods available for updating/changing values on the
donut chart after it has been created. These are accessible by creating a reference
to the chart in javascript.

```js
// first create the donut chart
var elem = document.getElementById( "donut" );
var chart = new Donutty( elem, { max: 500, value: 100 });

// then lets modify the values
chart.set( "value", 300 ).set( "min", 100 ).set( "max", 300 ).set( "bg", "aquamarine" ).set( "color", "slategrey" );

// or;
chart.setState({ min: 100, max: 300, value: 300, color: "", bg: "aquamarine", color: "slategrey" )
```

| method | arguments | arg types | description |
| -----: | :-------- | :-------- | :---------- |
| `set` | `property, value` | `String, Number` | Set a property's value (`min`, `max`, `value`)
| `setState` | `newState` | `Object` | Set the values for multiple properties (`min`, `max`, `value`, `bg`, `color`)

---

## contributing
- Please feel free to raise bugs/issues if found, and submit pull-requests. 😊
- For additional features; please open a discussion before submitting a pull-request.
- Follow the formatting as described in the config files.
