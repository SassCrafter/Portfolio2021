// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/js/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleClasses = exports.removeClasses = exports.addClasses = void 0;

var addClasses = function addClasses(el, classes) {
  classes.split(' ').forEach(function (className) {
    el.classList.add(className);
  });
};

exports.addClasses = addClasses;

var removeClasses = function removeClasses(el, classes) {
  classes.split(' ').forEach(function (className) {
    el.classList.remove(className);
  });
};

exports.removeClasses = removeClasses;

var toggleClasses = function toggleClasses(el, classes) {
  classes.split(' ').forEach(function (className) {
    el.classList.toggle(className);
  });
};

exports.toggleClasses = toggleClasses;
},{}],"../node_modules/animejs/lib/anime.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */
// Defaults
var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};
var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};
var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d']; // Caching

var cache = {
  CSS: {},
  springs: {}
}; // Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) {
    return Array.isArray(a);
  },
  obj: function (a) {
    return stringContains(Object.prototype.toString.call(a), 'Object');
  },
  pth: function (a) {
    return is.obj(a) && a.hasOwnProperty('totalLength');
  },
  svg: function (a) {
    return a instanceof SVGElement;
  },
  inp: function (a) {
    return a instanceof HTMLInputElement;
  },
  dom: function (a) {
    return a.nodeType || is.svg(a);
  },
  str: function (a) {
    return typeof a === 'string';
  },
  fnc: function (a) {
    return typeof a === 'function';
  },
  und: function (a) {
    return typeof a === 'undefined';
  },
  nil: function (a) {
    return is.und(a) || a === null;
  },
  hex: function (a) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
  },
  rgb: function (a) {
    return /^rgb/.test(a);
  },
  hsl: function (a) {
    return /^hsl/.test(a);
  },
  col: function (a) {
    return is.hex(a) || is.rgb(a) || is.hsl(a);
  },
  key: function (a) {
    return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
  }
}; // Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) {
    return parseFloat(p);
  }) : [];
} // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


function spring(string, duration) {
  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity = minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? duration * t / 1000 : t;

    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }

    if (t === 0 || t === 1) {
      return t;
    }

    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];

    if (cached) {
      return cached;
    }

    var frame = 1 / 6;
    var elapsed = 0;
    var rest = 0;

    while (true) {
      elapsed += frame;

      if (solver(elapsed) === 1) {
        rest++;

        if (rest >= 16) {
          break;
        }
      } else {
        rest = 0;
      }
    }

    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;
} // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


function steps(steps) {
  if (steps === void 0) steps = 10;
  return function (t) {
    return Math.ceil(minMax(t, 0.000001, 1) * steps) * (1 / steps);
  };
} // BezierEasing https://github.com/gre/bezier-easing


var bezier = function () {
  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
        currentT,
        i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;

      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      return;
    }

    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {
      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x;
      }

      if (x === 0 || x === 1) {
        return x;
      }

      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  return bezier;
}();

var penner = function () {
  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
  var eases = {
    linear: function () {
      return function (t) {
        return t;
      };
    }
  };
  var functionEasings = {
    Sine: function () {
      return function (t) {
        return 1 - Math.cos(t * Math.PI / 2);
      };
    },
    Circ: function () {
      return function (t) {
        return 1 - Math.sqrt(1 - t * t);
      };
    },
    Back: function () {
      return function (t) {
        return t * t * (3 * t - 2);
      };
    },
    Bounce: function () {
      return function (t) {
        var pow2,
            b = 4;

        while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}

        return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
      };
    },
    Elastic: function (amplitude, period) {
      if (amplitude === void 0) amplitude = 1;
      if (period === void 0) period = .5;
      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
      };
    }
  };
  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () {
      return function (t) {
        return Math.pow(t, i + 2);
      };
    };
  });
  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;

    eases['easeOut' + name] = function (a, b) {
      return function (t) {
        return 1 - easeIn(a, b)(1 - t);
      };
    };

    eases['easeInOut' + name] = function (a, b) {
      return function (t) {
        return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
      };
    };

    eases['easeOutIn' + name] = function (a, b) {
      return function (t) {
        return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
      };
    };
  });
  return eases;
}();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) {
    return easing;
  }

  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);

  switch (name) {
    case 'spring':
      return spring(easing, duration);

    case 'cubicBezier':
      return applyArguments(bezier, args);

    case 'steps':
      return applyArguments(steps, args);

    default:
      return applyArguments(ease, args);
  }
} // Strings


function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch (e) {
    return;
  }
} // Arrays


function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];

  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];

      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }

  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(is.arr(b) ? flattenArray(b) : b);
  }, []);
}

function toArray(o) {
  if (is.arr(o)) {
    return o;
  }

  if (is.str(o)) {
    o = selectString(o) || o;
  }

  if (o instanceof NodeList || o instanceof HTMLCollection) {
    return [].slice.call(o);
  }

  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) {
    return a === val;
  });
} // Objects


function cloneObject(o) {
  var clone = {};

  for (var p in o) {
    clone[p] = o[p];
  }

  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o1) {
    o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  }

  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o2) {
    o[p] = is.und(o1[p]) ? o2[p] : o1[p];
  }

  return o;
} // Colors


function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? "rgba(" + rgb[1] + ",1)" : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return "rgba(" + r + "," + g + "," + b + ",1)";
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;

  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }

    if (t > 1) {
      t -= 1;
    }

    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2) {
      return q;
    }

    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
  }

  var r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
}

function colorToRgb(val) {
  if (is.rgb(val)) {
    return rgbToRgba(val);
  }

  if (is.hex(val)) {
    return hexToRgba(val);
  }

  if (is.hsl(val)) {
    return hslToRgba(val);
  }
} // Units


function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);

  if (split) {
    return split[1];
  }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') {
    return 'px';
  }

  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) {
    return 'deg';
  }
} // Values


function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) {
    return val;
  }

  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);

  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
    return value;
  }

  var cached = cache.CSS[value + unit];

  if (!is.und(cached)) {
    return cached;
  }

  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || is.svg(el) && el[prop])) {
    return 'attribute';
  }

  if (is.dom(el) && arrayContains(validTransforms, prop)) {
    return 'transform';
  }

  if (is.dom(el) && prop !== 'transform' && getCSSValue(el, prop)) {
    return 'css';
  }

  if (el[prop] != null) {
    return 'object';
  }
}

function getElementTransforms(el) {
  if (!is.dom(el)) {
    return;
  }

  var str = el.style.transform || '';
  var reg = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m;

  while (m = reg.exec(str)) {
    transforms.set(m[1], m[2]);
  }

  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;

  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }

  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform':
      return getTransformValue(target, propName, animatable, unit);

    case 'css':
      return getCSSValue(target, propName, unit);

    case 'attribute':
      return getAttribute(target, propName);

    default:
      return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);

  if (!operator) {
    return to;
  }

  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));

  switch (operator[0][0]) {
    case '+':
      return x + y + u;

    case '-':
      return x - y + u;

    case '*':
      return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) {
    return colorToRgb(val);
  }

  if (/\s/g.test(val)) {
    return val;
  }

  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;

  if (unit) {
    return unitLess + unit;
  }

  return unitLess;
} // getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744


function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return getAttribute(el, 'width') * 2 + getAttribute(el, 'height') * 2;
}

function getLineLength(el) {
  return getDistance({
    x: getAttribute(el, 'x1'),
    y: getAttribute(el, 'y1')
  }, {
    x: getAttribute(el, 'x2'),
    y: getAttribute(el, 'y2')
  });
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;

  for (var i = 0; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);

    if (i > 0) {
      totalLength += getDistance(previousPos, currentPos);
    }

    previousPos = currentPos;
  }

  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
} // Path animation


function getTotalLength(el) {
  if (el.getTotalLength) {
    return el.getTotalLength();
  }

  switch (el.tagName.toLowerCase()) {
    case 'circle':
      return getCircleLength(el);

    case 'rect':
      return getRectLength(el);

    case 'line':
      return getLineLength(el);

    case 'polyline':
      return getPolylineLength(el);

    case 'polygon':
      return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
} // Motion path


function getParentSvgEl(el) {
  var parentEl = el.parentNode;

  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) {
      break;
    }

    parentEl = parentEl.parentNode;
  }

  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  };
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function (property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    };
  };
}

function getPathProgress(path, progress, isPathTargetInsideSVG) {
  function point(offset) {
    if (offset === void 0) offset = 0;
    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }

  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);
  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;

  switch (path.property) {
    case 'x':
      return (p.x - svg.x) * scaleX;

    case 'y':
      return (p.y - svg.y) * scaleY;

    case 'angle':
      return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
} // Decompose value


function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation

  var value = validateValue(is.pth(val) ? val.totalLength : val, unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: is.str(val) || unit ? value.split(rgx) : []
  };
} // Animatables


function parseTargets(targets) {
  var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
  return filterArray(targetsArray, function (item, pos, self) {
    return self.indexOf(item) === pos;
  });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {
      target: t,
      id: i,
      total: parsed.length,
      transforms: {
        list: getElementTransforms(t)
      }
    };
  });
} // Properties


function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings); // Override duration if easing is a spring

  if (/^spring/.test(settings.easing)) {
    settings.duration = spring(settings.easing);
  }

  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = l === 2 && !is.obj(prop[0]);

    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) {
        settings.duration = tweenSettings.duration / l;
      }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {
        value: prop
      };
    }
  }

  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = is.obj(v) && !is.pth(v) ? v : {
      value: v
    }; // Default delay value should only be applied to the first tween

    if (is.und(obj.delay)) {
      obj.delay = !i ? tweenSettings.delay : 0;
    } // Default endDelay value should only be applied to the last tween


    if (is.und(obj.endDelay)) {
      obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
    }

    return obj;
  }).map(function (k) {
    return mergeObjects(k, settings);
  });
}

function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
    return Object.keys(key);
  })), function (p) {
    return is.key(p);
  }).reduce(function (a, b) {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }

    return a;
  }, []);
  var properties = {};

  var loop = function (i) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};

      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) {
            newKey.value = key[p];
          }
        } else {
          newKey[p] = key[p];
        }
      }

      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop(i);

  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;

  if (keyframes) {
    params = mergeObjects(flattenKeyframes(keyframes), params);
  }

  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }

  return properties;
} // Tweens


function normalizeTweenValues(tween, animatable) {
  var t = {};

  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);

    if (is.arr(value)) {
      value = value.map(function (v) {
        return getFunctionValue(v, animatable);
      });

      if (value.length === 1) {
        value = value[0];
      }
    }

    t[p] = value;
  }

  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;

    if (is.und(to)) {
      to = previousValue;
    }

    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);

    if (tween.isColor) {
      tween.round = 1;
    }

    previousTween = tween;
    return tween;
  });
} // Tween progress


var setProgressValue = {
  css: function (t, p, v) {
    return t.style[p] = v;
  },
  attribute: function (t, p, v) {
    return t.setAttribute(p, v);
  },
  object: function (t, p, v) {
    return t[p] = v;
  },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);

    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) {
        str += prop + "(" + value + ") ";
      });
      t.style.transform = str;
    }
  }
}; // Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
} // Animations


function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);

  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    };
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) {
    return !is.und(a);
  });
} // Create Instance


function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;

  var getTlOffset = function (anim) {
    return anim.timelineOffset ? anim.timelineOffset : 0;
  };

  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration;
  })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.delay;
  })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration - anim.endDelay;
  })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
} // Core


var activeInstances = [];

var engine = function () {
  var raf;

  function play() {
    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(step);
    }
  }

  function step(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;

    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];

      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }

    raf = i > 0 ? requestAnimationFrame(step) : undefined;
  }

  function handleVisibilityChange() {
    if (!anime.suspendWhenDocumentHidden) {
      return;
    }

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else {
      // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(function (instance) {
        return instance._onDocumentVisibility();
      });
      engine();
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return play;
}();

function isDocumentHidden() {
  return !!document && document.hidden;
} // Public Instance


function anime(params) {
  if (params === void 0) params = {};
  var startTime = 0,
      lastTime = 0,
      now = 0;
  var children,
      childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) {
      return resolve = _resolve;
    });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;

    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }

    instance.reversed = !instance.reversed;
    children.forEach(function (child) {
      return child.reversed = instance.reversed;
    });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) {
      child.seek(time - child.timelineOffset);
    }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) {
        seekChild(time, children[i]);
      }
    } else {
      for (var i$1 = childrenLength; i$1--;) {
        seekChild(time, children[i$1]);
      }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;

    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength]; // Only check for keyframes if there is more than one tween

      if (tweenLength) {
        tween = filterArray(tweens, function (t) {
          return insTime < t.end;
        })[0] || tween;
      }

      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = void 0;

      for (var n = 0; n < toNumbersLength; n++) {
        var value = void 0;
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;

        if (!tween.isPath) {
          value = fromNumber + eased * (toNumber - fromNumber);
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }

        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }

        numbers.push(value);
      } // Manual Array.reduce for better performances


      var stringsLength = strings.length;

      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];

        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];

          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }

      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) {
      instance[cb](instance);
    }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax(insTime / insDuration * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;

    if (children) {
      syncInstanceChildren(insTime);
    }

    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }

    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }

    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }

    if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
      setAnimationsProgress(insDuration);
    }

    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }

      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }

    instance.currentTime = minMax(insTime, 0, insDuration);

    if (instance.began) {
      setCallback('update');
    }

    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();

      if (!instance.remaining) {
        instance.paused = true;

        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');

          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;

        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function () {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;

    for (var i = childrenLength; i--;) {
      instance.children[i].reset();
    }

    if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) {
      instance.remaining++;
    }

    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  }; // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)


  instance._onDocumentVisibility = resetTime; // Set Value helper

  instance.set = function (targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function (t) {
    now = t;

    if (!startTime) {
      startTime = now;
    }

    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function (time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function () {
    instance.paused = true;
    resetTime();
  };

  instance.play = function () {
    if (!instance.paused) {
      return;
    }

    if (instance.completed) {
      instance.reset();
    }

    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    engine();
  };

  instance.reverse = function () {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };

  instance.restart = function () {
    instance.reset();
    instance.play();
  };

  instance.remove = function (targets) {
    var targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };

  instance.reset();

  if (instance.autoplay) {
    instance.play();
  }

  return instance;
} // Remove targets from animation


function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargetsFromInstance(targetsArray, instance) {
  var animations = instance.animations;
  var children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);

  for (var c = children.length; c--;) {
    var child = children[c];
    var childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);

    if (!childAnimations.length && !child.children.length) {
      children.splice(c, 1);
    }
  }

  if (!animations.length && !children.length) {
    instance.pause();
  }
}

function removeTargetsFromActiveInstances(targets) {
  var targetsArray = parseTargets(targets);

  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
} // Stagger helpers


function stagger(val, params) {
  if (params === void 0) params = {};
  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) {
      fromIndex = 0;
    }

    if (fromCenter) {
      fromIndex = (t - 1) / 2;
    }

    if (fromLast) {
      fromIndex = t - 1;
    }

    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
          var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
          var toX = index % grid[0];
          var toY = Math.floor(index / grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (axis === 'x') {
            value = -distanceX;
          }

          if (axis === 'y') {
            value = -distanceY;
          }

          values.push(value);
        }

        maxValue = Math.max.apply(Math, values);
      }

      if (easing) {
        values = values.map(function (val) {
          return easing(val / maxValue) * maxValue;
        });
      }

      if (direction === 'reverse') {
        values = values.map(function (val) {
          return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
        });
      }
    }

    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
  };
} // Timeline


function timeline(params) {
  if (params === void 0) params = {};
  var tl = anime(params);
  tl.duration = 0;

  tl.add = function (instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;

    if (tlIndex > -1) {
      activeInstances.splice(tlIndex, 1);
    }

    function passThrough(ins) {
      ins.passThrough = true;
    }

    for (var i = 0; i < children.length; i++) {
      passThrough(children[i]);
    }

    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();

    if (tl.autoplay) {
      tl.play();
    }

    return tl;
  };

  return tl;
}

anime.version = '3.2.1';
anime.speed = 1; // TODO:#review: naming, documentation

anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;

anime.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var _default = anime;
exports.default = _default;
},{}],"../src/js/animations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeMenu = exports.revealMenu = void 0;

var _animeEs = _interopRequireDefault(require("animejs/lib/anime.es.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var revealMenu = function revealMenu(menuEl, oper) {
  var tl = _animeEs.default.timeline({
    easing: 'easeInOutExpo'
  });

  tl.add({
    targets: menuEl,
    translateY: ['-100%', 0],
    duration: 400
  }).add({
    targets: menuEl.querySelectorAll('li a'),
    scaleY: [0, 1],
    duration: 400,
    delay: _animeEs.default.stagger(100)
  });
};

exports.revealMenu = revealMenu;

var closeMenu = function closeMenu(menuEl) {
  (0, _animeEs.default)({
    targets: menuEl,
    translateY: '-100%',
    duration: 600,
    easing: 'easeInOutExpo'
  });
};

exports.closeMenu = closeMenu;

var iconToX = function iconToX() {};
},{"animejs/lib/anime.es.js":"../node_modules/animejs/lib/anime.es.js"}],"../src/js/menu.js":[function(require,module,exports) {
"use strict";

var _utils = require("./utils.js");

var _animations = require("./animations.js");

var mobileToggler = document.querySelector('.menu-icon');
var globalNav = document.querySelector('.global-nav');
var isOpen = false;
mobileToggler.addEventListener('click', function () {
  (0, _utils.toggleClasses)(mobileToggler, 'open'); // toggleClasses(globalNav, 'open');

  isOpen ? (0, _animations.closeMenu)(globalNav) : (0, _animations.revealMenu)(globalNav);
  isOpen = !isOpen;
});
},{"./utils.js":"../src/js/utils.js","./animations.js":"../src/js/animations.js"}],"../node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/core-js/library/modules/_global.js":[function(require,module,exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],"../node_modules/core-js/library/modules/_core.js":[function(require,module,exports) {
var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],"../node_modules/core-js/library/modules/_a-function.js":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],"../node_modules/core-js/library/modules/_ctx.js":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"../node_modules/core-js/library/modules/_a-function.js"}],"../node_modules/core-js/library/modules/_is-object.js":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"../node_modules/core-js/library/modules/_an-object.js":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"../node_modules/core-js/library/modules/_is-object.js"}],"../node_modules/core-js/library/modules/_fails.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],"../node_modules/core-js/library/modules/_descriptors.js":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"../node_modules/core-js/library/modules/_fails.js"}],"../node_modules/core-js/library/modules/_dom-create.js":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"../node_modules/core-js/library/modules/_is-object.js","./_global":"../node_modules/core-js/library/modules/_global.js"}],"../node_modules/core-js/library/modules/_ie8-dom-define.js":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js","./_fails":"../node_modules/core-js/library/modules/_fails.js","./_dom-create":"../node_modules/core-js/library/modules/_dom-create.js"}],"../node_modules/core-js/library/modules/_to-primitive.js":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"../node_modules/core-js/library/modules/_is-object.js"}],"../node_modules/core-js/library/modules/_object-dp.js":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"../node_modules/core-js/library/modules/_an-object.js","./_ie8-dom-define":"../node_modules/core-js/library/modules/_ie8-dom-define.js","./_to-primitive":"../node_modules/core-js/library/modules/_to-primitive.js","./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js"}],"../node_modules/core-js/library/modules/_property-desc.js":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"../node_modules/core-js/library/modules/_hide.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js","./_property-desc":"../node_modules/core-js/library/modules/_property-desc.js","./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js"}],"../node_modules/core-js/library/modules/_has.js":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"../node_modules/core-js/library/modules/_export.js":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"../node_modules/core-js/library/modules/_global.js","./_core":"../node_modules/core-js/library/modules/_core.js","./_ctx":"../node_modules/core-js/library/modules/_ctx.js","./_hide":"../node_modules/core-js/library/modules/_hide.js","./_has":"../node_modules/core-js/library/modules/_has.js"}],"../node_modules/core-js/library/modules/es6.object.define-property.js":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_export":"../node_modules/core-js/library/modules/_export.js","./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js","./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js"}],"../node_modules/core-js/library/fn/object/define-property.js":[function(require,module,exports) {
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/es6.object.define-property":"../node_modules/core-js/library/modules/es6.object.define-property.js","../../modules/_core":"../node_modules/core-js/library/modules/_core.js"}],"../node_modules/@babel/runtime-corejs2/core-js/object/define-property.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/object/define-property");
},{"core-js/library/fn/object/define-property":"../node_modules/core-js/library/fn/object/define-property.js"}],"../node_modules/@babel/runtime-corejs2/helpers/createClass.js":[function(require,module,exports) {
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    _Object$defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{"@babel/runtime-corejs2/core-js/object/define-property":"../node_modules/@babel/runtime-corejs2/core-js/object/define-property.js"}],"../src/js/parallax.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = /*#__PURE__*/function () {
  function _default(options) {
    (0, _classCallCheck2.default)(this, _default);
    this.options = options || {};
    this.nameSpaces = {
      wrapper: this.options.wrapper || '.parallax',
      layers: this.options.layers || '.parallax__layer',
      depth: this.options.depth || 'data-parallax-depth'
    };
    this.init();
  }

  (0, _createClass2.default)(_default, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
      this.parallaxWrappers.forEach(function (wrapper) {
        wrapper.addEventListener('mousemove', function (e) {
          _this.moveHandler(e, wrapper);
        });
        var layers = wrapper.querySelectorAll(_this.nameSpaces.layers);
      });
    }
  }, {
    key: "moveHandler",
    value: function moveHandler(e, wrapper) {
      var _this2 = this;

      // console.log(this);
      var x = e.clientX;
      var y = e.clientY; //console.log(x, y);

      var layers = wrapper.querySelectorAll(this.nameSpaces.layers);
      layers.forEach(function (layer) {
        var depth = layer.getAttribute(_this2.nameSpaces.depth);
        var itemX = x / (+depth * 300);
        var itemY = y / (+depth * 300);
        console.log("x: ".concat(x, ", y: ").concat(y, ", depth: ").concat(+depth));
        layer.style.transform = "translate(".concat(itemX, "%, ").concat(itemY, "%)");
      });
    }
  }]);
  return _default;
}();

exports.default = _default;
},{"@babel/runtime-corejs2/helpers/classCallCheck":"../node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js","@babel/runtime-corejs2/helpers/createClass":"../node_modules/@babel/runtime-corejs2/helpers/createClass.js"}],"../node_modules/core-js/library/modules/_defined.js":[function(require,module,exports) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],"../node_modules/core-js/library/modules/_string-ws.js":[function(require,module,exports) {
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],"../node_modules/core-js/library/modules/_string-trim.js":[function(require,module,exports) {
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_export":"../node_modules/core-js/library/modules/_export.js","./_defined":"../node_modules/core-js/library/modules/_defined.js","./_fails":"../node_modules/core-js/library/modules/_fails.js","./_string-ws":"../node_modules/core-js/library/modules/_string-ws.js"}],"../node_modules/core-js/library/modules/_parse-int.js":[function(require,module,exports) {
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":"../node_modules/core-js/library/modules/_global.js","./_string-trim":"../node_modules/core-js/library/modules/_string-trim.js","./_string-ws":"../node_modules/core-js/library/modules/_string-ws.js"}],"../node_modules/core-js/library/modules/es6.parse-int.js":[function(require,module,exports) {
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":"../node_modules/core-js/library/modules/_export.js","./_parse-int":"../node_modules/core-js/library/modules/_parse-int.js"}],"../node_modules/core-js/library/fn/parse-int.js":[function(require,module,exports) {
require('../modules/es6.parse-int');
module.exports = require('../modules/_core').parseInt;

},{"../modules/es6.parse-int":"../node_modules/core-js/library/modules/es6.parse-int.js","../modules/_core":"../node_modules/core-js/library/modules/_core.js"}],"../node_modules/@babel/runtime-corejs2/core-js/parse-int.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/parse-int");
},{"core-js/library/fn/parse-int":"../node_modules/core-js/library/fn/parse-int.js"}],"../node_modules/core-js/library/modules/_to-object.js":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"../node_modules/core-js/library/modules/_defined.js"}],"../node_modules/core-js/library/modules/_cof.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"../node_modules/core-js/library/modules/_iobject.js":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"../node_modules/core-js/library/modules/_cof.js"}],"../node_modules/core-js/library/modules/_to-iobject.js":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"../node_modules/core-js/library/modules/_iobject.js","./_defined":"../node_modules/core-js/library/modules/_defined.js"}],"../node_modules/core-js/library/modules/_to-integer.js":[function(require,module,exports) {
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],"../node_modules/core-js/library/modules/_to-length.js":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"../node_modules/core-js/library/modules/_to-integer.js"}],"../node_modules/core-js/library/modules/_to-absolute-index.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"../node_modules/core-js/library/modules/_to-integer.js"}],"../node_modules/core-js/library/modules/_array-includes.js":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"../node_modules/core-js/library/modules/_to-iobject.js","./_to-length":"../node_modules/core-js/library/modules/_to-length.js","./_to-absolute-index":"../node_modules/core-js/library/modules/_to-absolute-index.js"}],"../node_modules/core-js/library/modules/_library.js":[function(require,module,exports) {
module.exports = true;

},{}],"../node_modules/core-js/library/modules/_shared.js":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"../node_modules/core-js/library/modules/_core.js","./_global":"../node_modules/core-js/library/modules/_global.js","./_library":"../node_modules/core-js/library/modules/_library.js"}],"../node_modules/core-js/library/modules/_uid.js":[function(require,module,exports) {
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],"../node_modules/core-js/library/modules/_shared-key.js":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"../node_modules/core-js/library/modules/_shared.js","./_uid":"../node_modules/core-js/library/modules/_uid.js"}],"../node_modules/core-js/library/modules/_object-keys-internal.js":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"../node_modules/core-js/library/modules/_has.js","./_to-iobject":"../node_modules/core-js/library/modules/_to-iobject.js","./_array-includes":"../node_modules/core-js/library/modules/_array-includes.js","./_shared-key":"../node_modules/core-js/library/modules/_shared-key.js"}],"../node_modules/core-js/library/modules/_enum-bug-keys.js":[function(require,module,exports) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],"../node_modules/core-js/library/modules/_object-keys.js":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"../node_modules/core-js/library/modules/_object-keys-internal.js","./_enum-bug-keys":"../node_modules/core-js/library/modules/_enum-bug-keys.js"}],"../node_modules/core-js/library/modules/_object-sap.js":[function(require,module,exports) {
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_export":"../node_modules/core-js/library/modules/_export.js","./_core":"../node_modules/core-js/library/modules/_core.js","./_fails":"../node_modules/core-js/library/modules/_fails.js"}],"../node_modules/core-js/library/modules/es6.object.keys.js":[function(require,module,exports) {
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_to-object":"../node_modules/core-js/library/modules/_to-object.js","./_object-keys":"../node_modules/core-js/library/modules/_object-keys.js","./_object-sap":"../node_modules/core-js/library/modules/_object-sap.js"}],"../node_modules/core-js/library/fn/object/keys.js":[function(require,module,exports) {
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/es6.object.keys":"../node_modules/core-js/library/modules/es6.object.keys.js","../../modules/_core":"../node_modules/core-js/library/modules/_core.js"}],"../node_modules/@babel/runtime-corejs2/core-js/object/keys.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/object/keys");
},{"core-js/library/fn/object/keys":"../node_modules/core-js/library/fn/object/keys.js"}],"../node_modules/core-js/library/modules/_string-at.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"../node_modules/core-js/library/modules/_to-integer.js","./_defined":"../node_modules/core-js/library/modules/_defined.js"}],"../node_modules/core-js/library/modules/_redefine.js":[function(require,module,exports) {
module.exports = require('./_hide');

},{"./_hide":"../node_modules/core-js/library/modules/_hide.js"}],"../node_modules/core-js/library/modules/_iterators.js":[function(require,module,exports) {
module.exports = {};

},{}],"../node_modules/core-js/library/modules/_object-dps.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js","./_an-object":"../node_modules/core-js/library/modules/_an-object.js","./_object-keys":"../node_modules/core-js/library/modules/_object-keys.js","./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js"}],"../node_modules/core-js/library/modules/_html.js":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"../node_modules/core-js/library/modules/_global.js"}],"../node_modules/core-js/library/modules/_object-create.js":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"../node_modules/core-js/library/modules/_an-object.js","./_object-dps":"../node_modules/core-js/library/modules/_object-dps.js","./_enum-bug-keys":"../node_modules/core-js/library/modules/_enum-bug-keys.js","./_shared-key":"../node_modules/core-js/library/modules/_shared-key.js","./_dom-create":"../node_modules/core-js/library/modules/_dom-create.js","./_html":"../node_modules/core-js/library/modules/_html.js"}],"../node_modules/core-js/library/modules/_wks.js":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"../node_modules/core-js/library/modules/_shared.js","./_uid":"../node_modules/core-js/library/modules/_uid.js","./_global":"../node_modules/core-js/library/modules/_global.js"}],"../node_modules/core-js/library/modules/_set-to-string-tag.js":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js","./_has":"../node_modules/core-js/library/modules/_has.js","./_wks":"../node_modules/core-js/library/modules/_wks.js"}],"../node_modules/core-js/library/modules/_iter-create.js":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"../node_modules/core-js/library/modules/_object-create.js","./_property-desc":"../node_modules/core-js/library/modules/_property-desc.js","./_set-to-string-tag":"../node_modules/core-js/library/modules/_set-to-string-tag.js","./_hide":"../node_modules/core-js/library/modules/_hide.js","./_wks":"../node_modules/core-js/library/modules/_wks.js"}],"../node_modules/core-js/library/modules/_object-gpo.js":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"../node_modules/core-js/library/modules/_has.js","./_to-object":"../node_modules/core-js/library/modules/_to-object.js","./_shared-key":"../node_modules/core-js/library/modules/_shared-key.js"}],"../node_modules/core-js/library/modules/_iter-define.js":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"../node_modules/core-js/library/modules/_library.js","./_export":"../node_modules/core-js/library/modules/_export.js","./_redefine":"../node_modules/core-js/library/modules/_redefine.js","./_hide":"../node_modules/core-js/library/modules/_hide.js","./_iterators":"../node_modules/core-js/library/modules/_iterators.js","./_iter-create":"../node_modules/core-js/library/modules/_iter-create.js","./_set-to-string-tag":"../node_modules/core-js/library/modules/_set-to-string-tag.js","./_object-gpo":"../node_modules/core-js/library/modules/_object-gpo.js","./_wks":"../node_modules/core-js/library/modules/_wks.js"}],"../node_modules/core-js/library/modules/es6.string.iterator.js":[function(require,module,exports) {
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_string-at":"../node_modules/core-js/library/modules/_string-at.js","./_iter-define":"../node_modules/core-js/library/modules/_iter-define.js"}],"../node_modules/core-js/library/modules/_add-to-unscopables.js":[function(require,module,exports) {
module.exports = function () { /* empty */ };

},{}],"../node_modules/core-js/library/modules/_iter-step.js":[function(require,module,exports) {
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],"../node_modules/core-js/library/modules/es6.array.iterator.js":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"../node_modules/core-js/library/modules/_add-to-unscopables.js","./_iter-step":"../node_modules/core-js/library/modules/_iter-step.js","./_iterators":"../node_modules/core-js/library/modules/_iterators.js","./_to-iobject":"../node_modules/core-js/library/modules/_to-iobject.js","./_iter-define":"../node_modules/core-js/library/modules/_iter-define.js"}],"../node_modules/core-js/library/modules/web.dom.iterable.js":[function(require,module,exports) {

require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./es6.array.iterator":"../node_modules/core-js/library/modules/es6.array.iterator.js","./_global":"../node_modules/core-js/library/modules/_global.js","./_hide":"../node_modules/core-js/library/modules/_hide.js","./_iterators":"../node_modules/core-js/library/modules/_iterators.js","./_wks":"../node_modules/core-js/library/modules/_wks.js"}],"../node_modules/core-js/library/modules/_wks-ext.js":[function(require,module,exports) {
exports.f = require('./_wks');

},{"./_wks":"../node_modules/core-js/library/modules/_wks.js"}],"../node_modules/core-js/library/fn/symbol/iterator.js":[function(require,module,exports) {
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/es6.string.iterator":"../node_modules/core-js/library/modules/es6.string.iterator.js","../../modules/web.dom.iterable":"../node_modules/core-js/library/modules/web.dom.iterable.js","../../modules/_wks-ext":"../node_modules/core-js/library/modules/_wks-ext.js"}],"../node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/symbol/iterator");
},{"core-js/library/fn/symbol/iterator":"../node_modules/core-js/library/fn/symbol/iterator.js"}],"../node_modules/core-js/library/modules/_meta.js":[function(require,module,exports) {
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_uid":"../node_modules/core-js/library/modules/_uid.js","./_is-object":"../node_modules/core-js/library/modules/_is-object.js","./_has":"../node_modules/core-js/library/modules/_has.js","./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js","./_fails":"../node_modules/core-js/library/modules/_fails.js"}],"../node_modules/core-js/library/modules/_wks-define.js":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_global":"../node_modules/core-js/library/modules/_global.js","./_core":"../node_modules/core-js/library/modules/_core.js","./_library":"../node_modules/core-js/library/modules/_library.js","./_wks-ext":"../node_modules/core-js/library/modules/_wks-ext.js","./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js"}],"../node_modules/core-js/library/modules/_object-gops.js":[function(require,module,exports) {
exports.f = Object.getOwnPropertySymbols;

},{}],"../node_modules/core-js/library/modules/_object-pie.js":[function(require,module,exports) {
exports.f = {}.propertyIsEnumerable;

},{}],"../node_modules/core-js/library/modules/_enum-keys.js":[function(require,module,exports) {
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-keys":"../node_modules/core-js/library/modules/_object-keys.js","./_object-gops":"../node_modules/core-js/library/modules/_object-gops.js","./_object-pie":"../node_modules/core-js/library/modules/_object-pie.js"}],"../node_modules/core-js/library/modules/_is-array.js":[function(require,module,exports) {
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":"../node_modules/core-js/library/modules/_cof.js"}],"../node_modules/core-js/library/modules/_object-gopn.js":[function(require,module,exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_object-keys-internal":"../node_modules/core-js/library/modules/_object-keys-internal.js","./_enum-bug-keys":"../node_modules/core-js/library/modules/_enum-bug-keys.js"}],"../node_modules/core-js/library/modules/_object-gopn-ext.js":[function(require,module,exports) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_to-iobject":"../node_modules/core-js/library/modules/_to-iobject.js","./_object-gopn":"../node_modules/core-js/library/modules/_object-gopn.js"}],"../node_modules/core-js/library/modules/_object-gopd.js":[function(require,module,exports) {
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_object-pie":"../node_modules/core-js/library/modules/_object-pie.js","./_property-desc":"../node_modules/core-js/library/modules/_property-desc.js","./_to-iobject":"../node_modules/core-js/library/modules/_to-iobject.js","./_to-primitive":"../node_modules/core-js/library/modules/_to-primitive.js","./_has":"../node_modules/core-js/library/modules/_has.js","./_ie8-dom-define":"../node_modules/core-js/library/modules/_ie8-dom-define.js","./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js"}],"../node_modules/core-js/library/modules/es6.symbol.js":[function(require,module,exports) {

'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toObject = require('./_to-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $GOPS = require('./_object-gops');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_global":"../node_modules/core-js/library/modules/_global.js","./_has":"../node_modules/core-js/library/modules/_has.js","./_descriptors":"../node_modules/core-js/library/modules/_descriptors.js","./_export":"../node_modules/core-js/library/modules/_export.js","./_redefine":"../node_modules/core-js/library/modules/_redefine.js","./_meta":"../node_modules/core-js/library/modules/_meta.js","./_fails":"../node_modules/core-js/library/modules/_fails.js","./_shared":"../node_modules/core-js/library/modules/_shared.js","./_set-to-string-tag":"../node_modules/core-js/library/modules/_set-to-string-tag.js","./_uid":"../node_modules/core-js/library/modules/_uid.js","./_wks":"../node_modules/core-js/library/modules/_wks.js","./_wks-ext":"../node_modules/core-js/library/modules/_wks-ext.js","./_wks-define":"../node_modules/core-js/library/modules/_wks-define.js","./_enum-keys":"../node_modules/core-js/library/modules/_enum-keys.js","./_is-array":"../node_modules/core-js/library/modules/_is-array.js","./_an-object":"../node_modules/core-js/library/modules/_an-object.js","./_is-object":"../node_modules/core-js/library/modules/_is-object.js","./_to-object":"../node_modules/core-js/library/modules/_to-object.js","./_to-iobject":"../node_modules/core-js/library/modules/_to-iobject.js","./_to-primitive":"../node_modules/core-js/library/modules/_to-primitive.js","./_property-desc":"../node_modules/core-js/library/modules/_property-desc.js","./_object-create":"../node_modules/core-js/library/modules/_object-create.js","./_object-gopn-ext":"../node_modules/core-js/library/modules/_object-gopn-ext.js","./_object-gopd":"../node_modules/core-js/library/modules/_object-gopd.js","./_object-gops":"../node_modules/core-js/library/modules/_object-gops.js","./_object-dp":"../node_modules/core-js/library/modules/_object-dp.js","./_object-keys":"../node_modules/core-js/library/modules/_object-keys.js","./_object-gopn":"../node_modules/core-js/library/modules/_object-gopn.js","./_object-pie":"../node_modules/core-js/library/modules/_object-pie.js","./_library":"../node_modules/core-js/library/modules/_library.js","./_hide":"../node_modules/core-js/library/modules/_hide.js"}],"../node_modules/core-js/library/modules/es6.object.to-string.js":[function(require,module,exports) {

},{}],"../node_modules/core-js/library/modules/es7.symbol.async-iterator.js":[function(require,module,exports) {
require('./_wks-define')('asyncIterator');

},{"./_wks-define":"../node_modules/core-js/library/modules/_wks-define.js"}],"../node_modules/core-js/library/modules/es7.symbol.observable.js":[function(require,module,exports) {
require('./_wks-define')('observable');

},{"./_wks-define":"../node_modules/core-js/library/modules/_wks-define.js"}],"../node_modules/core-js/library/fn/symbol/index.js":[function(require,module,exports) {
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/es6.symbol":"../node_modules/core-js/library/modules/es6.symbol.js","../../modules/es6.object.to-string":"../node_modules/core-js/library/modules/es6.object.to-string.js","../../modules/es7.symbol.async-iterator":"../node_modules/core-js/library/modules/es7.symbol.async-iterator.js","../../modules/es7.symbol.observable":"../node_modules/core-js/library/modules/es7.symbol.observable.js","../../modules/_core":"../node_modules/core-js/library/modules/_core.js"}],"../node_modules/@babel/runtime-corejs2/core-js/symbol.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/symbol");
},{"core-js/library/fn/symbol":"../node_modules/core-js/library/fn/symbol/index.js"}],"../node_modules/@babel/runtime-corejs2/helpers/typeof.js":[function(require,module,exports) {
var _Symbol$iterator = require("@babel/runtime-corejs2/core-js/symbol/iterator");

var _Symbol = require("@babel/runtime-corejs2/core-js/symbol");

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof _Symbol === "function" && typeof _Symbol$iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof _Symbol === "function" && obj.constructor === _Symbol && obj !== _Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{"@babel/runtime-corejs2/core-js/symbol/iterator":"../node_modules/@babel/runtime-corejs2/core-js/symbol/iterator.js","@babel/runtime-corejs2/core-js/symbol":"../node_modules/@babel/runtime-corejs2/core-js/symbol.js"}],"../src/vendors/fullpage.js":[function(require,module,exports) {
var define;
"use strict";

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-int"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/typeof"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * fullPage 3.1.0
 * https://github.com/alvarotrigo/fullPage.js
 *
 * @license GPLv3 for open source use only
 * or Fullpage Commercial License for commercial use
 * http://alvarotrigo.com/fullPage/pricing/
 *
 * Copyright (C) 2018 http://alvarotrigo.com/fullPage - A project by Alvaro Trigo
 */
(function (root, window, document, factory, undefined) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      root.fullpage = factory(window, document);
      return root.fullpage;
    });
  } else if ((typeof exports === "undefined" ? "undefined" : (0, _typeof2.default)(exports)) === 'object') {
    // Node. Does not work with strict CommonJS.
    module.exports = factory(window, document);
  } else {
    // Browser globals.
    window.fullpage = factory(window, document);
  }
})(void 0, window, document, function (window, document) {
  'use strict'; // keeping central set of classnames and selectors

  var WRAPPER = 'fullpage-wrapper';
  var WRAPPER_SEL = '.' + WRAPPER; // slimscroll

  var SCROLLABLE = 'fp-scrollable';
  var SCROLLABLE_SEL = '.' + SCROLLABLE; // util

  var RESPONSIVE = 'fp-responsive';
  var NO_TRANSITION = 'fp-notransition';
  var DESTROYED = 'fp-destroyed';
  var ENABLED = 'fp-enabled';
  var VIEWING_PREFIX = 'fp-viewing';
  var ACTIVE = 'active';
  var ACTIVE_SEL = '.' + ACTIVE;
  var COMPLETELY = 'fp-completely';
  var COMPLETELY_SEL = '.' + COMPLETELY; // section

  var SECTION_DEFAULT_SEL = '.section';
  var SECTION = 'fp-section';
  var SECTION_SEL = '.' + SECTION;
  var SECTION_ACTIVE_SEL = SECTION_SEL + ACTIVE_SEL;
  var TABLE_CELL = 'fp-tableCell';
  var TABLE_CELL_SEL = '.' + TABLE_CELL;
  var AUTO_HEIGHT = 'fp-auto-height';
  var AUTO_HEIGHT_SEL = '.' + AUTO_HEIGHT;
  var AUTO_HEIGHT_RESPONSIVE = 'fp-auto-height-responsive';
  var AUTO_HEIGHT_RESPONSIVE_SEL = '.' + AUTO_HEIGHT_RESPONSIVE;
  var NORMAL_SCROLL = 'fp-normal-scroll';
  var NORMAL_SCROLL_SEL = '.' + NORMAL_SCROLL; // section nav

  var SECTION_NAV = 'fp-nav';
  var SECTION_NAV_SEL = '#' + SECTION_NAV;
  var SECTION_NAV_TOOLTIP = 'fp-tooltip';
  var SECTION_NAV_TOOLTIP_SEL = '.' + SECTION_NAV_TOOLTIP;
  var SHOW_ACTIVE_TOOLTIP = 'fp-show-active'; // slide

  var SLIDE_DEFAULT_SEL = '.slide';
  var SLIDE = 'fp-slide';
  var SLIDE_SEL = '.' + SLIDE;
  var SLIDE_ACTIVE_SEL = SLIDE_SEL + ACTIVE_SEL;
  var SLIDES_WRAPPER = 'fp-slides';
  var SLIDES_WRAPPER_SEL = '.' + SLIDES_WRAPPER;
  var SLIDES_CONTAINER = 'fp-slidesContainer';
  var SLIDES_CONTAINER_SEL = '.' + SLIDES_CONTAINER;
  var TABLE = 'fp-table'; // slide nav

  var SLIDES_NAV = 'fp-slidesNav';
  var SLIDES_NAV_SEL = '.' + SLIDES_NAV;
  var SLIDES_NAV_LINK_SEL = SLIDES_NAV_SEL + ' a';
  var SLIDES_ARROW = 'fp-controlArrow';
  var SLIDES_ARROW_SEL = '.' + SLIDES_ARROW;
  var SLIDES_PREV = 'fp-prev';
  var SLIDES_PREV_SEL = '.' + SLIDES_PREV;
  var SLIDES_ARROW_PREV = SLIDES_ARROW + ' ' + SLIDES_PREV;
  var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
  var SLIDES_NEXT = 'fp-next';
  var SLIDES_NEXT_SEL = '.' + SLIDES_NEXT;
  var SLIDES_ARROW_NEXT = SLIDES_ARROW + ' ' + SLIDES_NEXT;
  var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

  function initialise(containerSelector, options) {
    var isOK = options && new RegExp('([\\d\\w]{8}-){3}[\\d\\w]{8}|^(?=.*?[A-Y])(?=.*?[a-y])(?=.*?[0-8])(?=.*?[#?!@$%^&*-]).{8,}$').test(options['li' + 'cen' + 'seK' + 'e' + 'y']) || document.domain.indexOf('al' + 'varotri' + 'go' + '.' + 'com') > -1; // cache common elements

    var $htmlBody = $('html, body');
    var $html = $('html')[0];
    var $body = $('body')[0]; //only once my friend!

    if (hasClass($html, ENABLED)) {
      displayWarnings();
      return;
    }

    var FP = {}; // Creating some defaults, extending them with any options that were provided

    options = deepExtend({
      //navigation
      menu: false,
      anchors: [],
      lockAnchors: false,
      navigation: false,
      navigationPosition: 'right',
      navigationTooltips: [],
      showActiveTooltip: false,
      slidesNavigation: false,
      slidesNavPosition: 'bottom',
      scrollBar: false,
      hybrid: false,
      //scrolling
      css3: true,
      scrollingSpeed: 700,
      autoScrolling: true,
      fitToSection: true,
      fitToSectionDelay: 1000,
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      loopBottom: false,
      loopTop: false,
      loopHorizontal: true,
      continuousVertical: false,
      continuousHorizontal: false,
      scrollHorizontally: false,
      interlockedSlides: false,
      dragAndMove: false,
      offsetSections: false,
      resetSliders: false,
      fadingEffect: false,
      normalScrollElements: null,
      scrollOverflow: false,
      scrollOverflowReset: false,
      scrollOverflowHandler: window.fp_scrolloverflow ? window.fp_scrolloverflow.iscrollHandler : null,
      scrollOverflowOptions: null,
      touchSensitivity: 5,
      touchWrapper: typeof containerSelector === 'string' ? $(containerSelector)[0] : containerSelector,
      bigSectionsDestination: null,
      //Accessibility
      keyboardScrolling: true,
      animateAnchor: true,
      recordHistory: true,
      //design
      controlArrows: true,
      controlArrowColor: '#fff',
      verticalCentered: true,
      sectionsColor: [],
      paddingTop: 0,
      paddingBottom: 0,
      fixedElements: null,
      responsive: 0,
      //backwards compabitility with responsiveWiddth
      responsiveWidth: 0,
      responsiveHeight: 0,
      responsiveSlides: false,
      parallax: false,
      parallaxOptions: {
        type: 'reveal',
        percentage: 62,
        property: 'translate'
      },
      cards: false,
      cardsOptions: {
        perspective: 100,
        fadeContent: true,
        fadeBackground: true
      },
      //Custom selectors
      sectionSelector: SECTION_DEFAULT_SEL,
      slideSelector: SLIDE_DEFAULT_SEL,
      //events
      v2compatible: false,
      afterLoad: null,
      onLeave: null,
      afterRender: null,
      afterResize: null,
      afterReBuild: null,
      afterSlideLoad: null,
      onSlideLeave: null,
      afterResponsive: null,
      lazyLoading: true
    }, options); //flag to avoid very fast sliding for landscape sliders

    var slideMoving = false;
    var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
    var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0 || navigator.maxTouchPoints;
    var container = typeof containerSelector === 'string' ? $(containerSelector)[0] : containerSelector;
    var windowsHeight = getWindowHeight();
    var windowsWidth = getWindowWidth();
    var isResizing = false;
    var isWindowFocused = true;
    var lastScrolledDestiny;
    var lastScrolledSlide;
    var canScroll = true;
    var scrollings = [];
    var controlPressed;
    var startingSection;
    var isScrollAllowed = {};
    isScrollAllowed.m = {
      'up': true,
      'down': true,
      'left': true,
      'right': true
    };
    isScrollAllowed.k = deepExtend({}, isScrollAllowed.m);
    var MSPointer = getMSPointer();
    var events = {
      touchmove: 'ontouchmove' in window ? 'touchmove' : MSPointer.move,
      touchstart: 'ontouchstart' in window ? 'touchstart' : MSPointer.down
    };
    var scrollBarHandler; // taken from https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js

    var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'; //cheks for passive event support

    var g_supportsPassive = false;

    try {
      var opts = (0, _defineProperty.default)({}, 'passive', {
        get: function get() {
          g_supportsPassive = true;
        }
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
    } catch (e) {} //timeouts


    var resizeId;
    var resizeHandlerId;
    var afterSectionLoadsId;
    var afterSlideLoadsId;
    var scrollId;
    var scrollId2;
    var keydownId;
    var g_doubleCheckHeightId;
    var originals = deepExtend({}, options); //deep copy

    var activeAnimation;
    var g_initialAnchorsInDom = false;
    var g_canFireMouseEnterNormalScroll = true;
    var g_mediaLoadedId;
    var g_transitionLapseId;
    var extensions = ['parallax', 'scrollOverflowReset', 'dragAndMove', 'offsetSections', 'fadingEffect', 'responsiveSlides', 'continuousHorizontal', 'interlockedSlides', 'scrollHorizontally', 'resetSliders', 'cards'];
    displayWarnings(); //easeInOutCubic animation included in the plugin

    window.fp_easings = deepExtend(window.fp_easings, {
      easeInOutCubic: function easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    });
    /**
    * Sets the autoScroll option.
    * It changes the scroll bar visibility and the history of the site as a result.
    */

    function setAutoScrolling(value, type) {
      //removing the transformation
      if (!value) {
        silentScroll(0);
      }

      setVariableState('autoScrolling', value, type);
      var element = $(SECTION_ACTIVE_SEL)[0];

      if (options.autoScrolling && !options.scrollBar) {
        css($htmlBody, {
          'overflow': 'hidden',
          'height': '100%'
        });
        setRecordHistory(originals.recordHistory, 'internal'); //for IE touch devices

        css(container, {
          '-ms-touch-action': 'none',
          'touch-action': 'none'
        });

        if (element != null) {
          //moving the container up
          silentScroll(element.offsetTop);
        }
      } else {
        css($htmlBody, {
          'overflow': 'visible',
          'height': 'initial'
        });
        var recordHistory = !options.autoScrolling ? false : originals.recordHistory;
        setRecordHistory(recordHistory, 'internal'); //for IE touch devices

        css(container, {
          '-ms-touch-action': '',
          'touch-action': ''
        }); //scrolling the page to the section with no animation

        if (element != null) {
          var scrollSettings = getScrollSettings(element.offsetTop);
          scrollSettings.element.scrollTo(0, scrollSettings.options);
        }
      }
    }
    /**
    * Defines wheter to record the history for each hash change in the URL.
    */


    function setRecordHistory(value, type) {
      setVariableState('recordHistory', value, type);
    }
    /**
    * Defines the scrolling speed
    */


    function setScrollingSpeed(value, type) {
      setVariableState('scrollingSpeed', value, type);
    }
    /**
    * Sets fitToSection
    */


    function setFitToSection(value, type) {
      setVariableState('fitToSection', value, type);
    }
    /**
    * Sets lockAnchors
    */


    function setLockAnchors(value) {
      options.lockAnchors = value;
    }
    /**
    * Adds or remove the possibility of scrolling through sections by using the mouse wheel or the trackpad.
    */


    function setMouseWheelScrolling(value) {
      if (value) {
        addMouseWheelHandler();
        addMiddleWheelHandler();
      } else {
        removeMouseWheelHandler();
        removeMiddleWheelHandler();
      }
    }
    /**
    * Adds or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
    * Optionally a second parameter can be used to specify the direction for which the action will be applied.
    *
    * @param directions string containing the direction or directions separated by comma.
    */


    function setAllowScrolling(value, directions) {
      if (typeof directions !== 'undefined') {
        directions = directions.replace(/ /g, '').split(',');
        directions.forEach(function (direction) {
          setIsScrollAllowed(value, direction, 'm');
        });
      } else {
        setIsScrollAllowed(value, 'all', 'm');
      }
    }
    /**
    * Adds or remove the mouse wheel hijacking
    */


    function setMouseHijack(value) {
      if (value) {
        setMouseWheelScrolling(true);
        addTouchHandler();
      } else {
        setMouseWheelScrolling(false);
        removeTouchHandler();
      }
    }
    /**
    * Adds or remove the possibility of scrolling through sections by using the keyboard arrow keys
    */


    function setKeyboardScrolling(value, directions) {
      if (typeof directions !== 'undefined') {
        directions = directions.replace(/ /g, '').split(',');
        directions.forEach(function (direction) {
          setIsScrollAllowed(value, direction, 'k');
        });
      } else {
        setIsScrollAllowed(value, 'all', 'k');
        options.keyboardScrolling = value;
      }
    }
    /**
    * Moves the page up one section.
    */


    function moveSectionUp() {
      var prev = prevUntil($(SECTION_ACTIVE_SEL)[0], SECTION_SEL); //looping to the bottom if there's no more sections above

      if (!prev && (options.loopTop || options.continuousVertical)) {
        prev = last($(SECTION_SEL));
      }

      if (prev != null) {
        scrollPage(prev, null, true);
      }
    }
    /**
    * Moves the page down one section.
    */


    function moveSectionDown() {
      var next = nextUntil($(SECTION_ACTIVE_SEL)[0], SECTION_SEL); //looping to the top if there's no more sections below

      if (!next && (options.loopBottom || options.continuousVertical)) {
        next = $(SECTION_SEL)[0];
      }

      if (next != null) {
        scrollPage(next, null, false);
      }
    }
    /**
    * Moves the page to the given section and slide with no animation.
    * Anchors or index positions can be used as params.
    */


    function silentMoveTo(sectionAnchor, slideAnchor) {
      setScrollingSpeed(0, 'internal');
      moveTo(sectionAnchor, slideAnchor);
      setScrollingSpeed(originals.scrollingSpeed, 'internal');
    }
    /**
    * Moves the page to the given section and slide.
    * Anchors or index positions can be used as params.
    */


    function moveTo(sectionAnchor, slideAnchor) {
      var destiny = getSectionByAnchor(sectionAnchor);

      if (typeof slideAnchor !== 'undefined') {
        scrollPageAndSlide(sectionAnchor, slideAnchor);
      } else if (destiny != null) {
        scrollPage(destiny);
      }
    }
    /**
    * Slides right the slider of the active section.
    * Optional `section` param.
    */


    function moveSlideRight(section) {
      moveSlide('right', section);
    }
    /**
    * Slides left the slider of the active section.
    * Optional `section` param.
    */


    function moveSlideLeft(section) {
      moveSlide('left', section);
    }
    /**
     * When resizing is finished, we adjust the slides sizes and positions
     */


    function reBuild(resizing) {
      if (hasClass(container, DESTROYED)) {
        return;
      } //nothing to do if the plugin was destroyed


      isResizing = true; //updating global vars

      windowsHeight = getWindowHeight();
      windowsWidth = getWindowWidth();
      var sections = $(SECTION_SEL);

      for (var i = 0; i < sections.length; ++i) {
        var section = sections[i];
        var slidesWrap = $(SLIDES_WRAPPER_SEL, section)[0];
        var slides = $(SLIDE_SEL, section); //adjusting the height of the table-cell for IE and Firefox

        if (options.verticalCentered) {
          css($(TABLE_CELL_SEL, section), {
            'height': getTableHeight(section) + 'px'
          });
        }

        css(section, {
          'height': windowsHeight + 'px'
        }); //adjusting the position fo the FULL WIDTH slides...

        if (slides.length > 1) {
          landscapeScroll(slidesWrap, $(SLIDE_ACTIVE_SEL, slidesWrap)[0]);
        }
      }

      if (options.scrollOverflow) {
        scrollBarHandler.createScrollBarForAll();
      }

      var activeSection = $(SECTION_ACTIVE_SEL)[0];
      var sectionIndex = index(activeSection, SECTION_SEL); //isn't it the first section?

      if (sectionIndex) {
        //adjusting the position for the current section
        silentMoveTo(sectionIndex + 1);
      }

      if (isFunction(options.afterResize) && resizing) {
        options.afterResize.call(container, window.innerWidth, window.innerHeight);
      }

      if (isFunction(options.afterReBuild) && !resizing) {
        options.afterReBuild.call(container);
      }
    }
    /**
    * Determines whether fullpage.js is in responsive mode or not.
    */


    function isResponsiveMode() {
      return hasClass($body, RESPONSIVE);
    }
    /**
    * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
    * are smaller than the set limit values.
    */


    function setResponsive(active) {
      var isResponsive = isResponsiveMode();

      if (active) {
        if (!isResponsive) {
          setAutoScrolling(false, 'internal');
          setFitToSection(false, 'internal');
          hide($(SECTION_NAV_SEL));
          addClass($body, RESPONSIVE);

          if (isFunction(options.afterResponsive)) {
            options.afterResponsive.call(container, active);
          } //when on page load, we will remove scrolloverflow if necessary


          if (options.scrollOverflow) {
            scrollBarHandler.createScrollBarForAll();
          }
        }
      } else if (isResponsive) {
        setAutoScrolling(originals.autoScrolling, 'internal');
        setFitToSection(originals.autoScrolling, 'internal');
        show($(SECTION_NAV_SEL));
        removeClass($body, RESPONSIVE);

        if (isFunction(options.afterResponsive)) {
          options.afterResponsive.call(container, active);
        }
      }
    }

    if (container) {
      //public functions
      FP.version = '3.1.0';
      FP.setAutoScrolling = setAutoScrolling;
      FP.setRecordHistory = setRecordHistory;
      FP.setScrollingSpeed = setScrollingSpeed;
      FP.setFitToSection = setFitToSection;
      FP.setLockAnchors = setLockAnchors;
      FP.setMouseWheelScrolling = setMouseWheelScrolling;
      FP.setAllowScrolling = setAllowScrolling;
      FP.setKeyboardScrolling = setKeyboardScrolling;
      FP.moveSectionUp = moveSectionUp;
      FP.moveSectionDown = moveSectionDown;
      FP.silentMoveTo = silentMoveTo;
      FP.moveTo = moveTo;
      FP.moveSlideRight = moveSlideRight;
      FP.moveSlideLeft = moveSlideLeft;
      FP.fitToSection = fitToSection;
      FP.reBuild = reBuild;
      FP.setResponsive = setResponsive;

      FP.getFullpageData = function () {
        return options;
      };

      FP.destroy = destroy;
      FP.getActiveSection = getActiveSection;
      FP.getActiveSlide = getActiveSlide;
      FP.test = {
        top: '0px',
        translate3d: 'translate3d(0px, 0px, 0px)',
        translate3dH: function () {
          var a = [];

          for (var i = 0; i < $(options.sectionSelector, container).length; i++) {
            a.push('translate3d(0px, 0px, 0px)');
          }

          return a;
        }(),
        left: function () {
          var a = [];

          for (var i = 0; i < $(options.sectionSelector, container).length; i++) {
            a.push(0);
          }

          return a;
        }(),
        options: options,
        setAutoScrolling: setAutoScrolling
      }; //functions we want to share across files but which are not
      //mean to be used on their own by developers

      FP.shared = {
        afterRenderActions: afterRenderActions,
        isNormalScrollElement: false
      };
      window.fullpage_api = FP; //using jQuery initialization? Creating the $.fn.fullpage object

      if (options.$) {
        (0, _keys.default)(FP).forEach(function (key) {
          options.$.fn.fullpage[key] = FP[key];
        });
      }

      init();
      bindEvents();
    }

    function init() {
      //if css3 is not supported, it will use jQuery animations
      if (options.css3) {
        options.css3 = support3d();
      }

      options.scrollBar = options.scrollBar || options.hybrid;
      setOptionsFromDOM();
      prepareDom();
      setAllowScrolling(true);
      setMouseHijack(true);
      setAutoScrolling(options.autoScrolling, 'internal');
      responsive(); //setting the class for the body element

      setBodyClass();

      if (document.readyState === 'complete') {
        scrollToAnchor();
      }

      window.addEventListener('load', scrollToAnchor); //if we use scrollOverflow we'll fire afterRender in the scrolloverflow file

      if (!options.scrollOverflow) {
        afterRenderActions();
      }

      doubleCheckHeight();
    }

    function bindEvents() {
      //when scrolling...
      window.addEventListener('scroll', scrollHandler); //detecting any change on the URL to scroll to the given anchor link
      //(a way to detect back history button as we play with the hashes on the URL)

      window.addEventListener('hashchange', hashChangeHandler); // on window focus

      window.addEventListener('focus', focusHandler); //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.

      window.addEventListener('blur', blurHandler); //when resizing the site, we adjust the heights of the sections, slimScroll...

      window.addEventListener('resize', resizeHandler); //Sliding with arrow keys, both, vertical and horizontal

      document.addEventListener('keydown', keydownHandler); //to prevent scrolling while zooming

      document.addEventListener('keyup', keyUpHandler); //Scrolls to the section when clicking the navigation bullet
      //simulating the jQuery .on('click') event using delegation

      ['click', 'touchstart'].forEach(function (eventName) {
        document.addEventListener(eventName, delegatedEvents);
      });
      /**
      * Applying normalScroll elements.
      * Ignoring the scrolls over the specified selectors.
      */

      if (options.normalScrollElements) {
        ['mouseenter', 'touchstart'].forEach(function (eventName) {
          forMouseLeaveOrTouch(eventName, false);
        });
        ['mouseleave', 'touchend'].forEach(function (eventName) {
          forMouseLeaveOrTouch(eventName, true);
        });
      }
    }

    function delegatedEvents(e) {
      var target = e.target;

      if (target && closest(target, SECTION_NAV_SEL + ' a')) {
        sectionBulletHandler.call(target, e);
      } else if (matches(target, SECTION_NAV_TOOLTIP_SEL)) {
        tooltipTextHandler.call(target);
      } else if (matches(target, SLIDES_ARROW_SEL)) {
        slideArrowHandler.call(target, e);
      } else if (matches(target, SLIDES_NAV_LINK_SEL) || closest(target, SLIDES_NAV_LINK_SEL) != null) {
        slideBulletHandler.call(target, e);
      } else if (closest(target, options.menu + ' [data-menuanchor]')) {
        menuItemsHandler.call(target, e);
      }
    }

    function forMouseLeaveOrTouch(eventName, allowScrolling) {
      //a way to pass arguments to the onMouseEnterOrLeave function
      document['fp_' + eventName] = allowScrolling;
      document.addEventListener(eventName, onMouseEnterOrLeave, true); //capturing phase
    }

    function onMouseEnterOrLeave(e) {
      var type = e.type;
      var isInsideOneNormalScroll = false;
      var isUsingScrollOverflow = options.scrollOverflow; //onMouseLeave will use the destination target, not the one we are moving away from

      var target = type === 'mouseleave' ? e.toElement || e.relatedTarget : e.target; //coming from closing a normalScrollElements modal or moving outside viewport?

      if (target == document || !target) {
        setMouseHijack(true);

        if (isUsingScrollOverflow) {
          options.scrollOverflowHandler.setIscroll(target, true);
        }

        return;
      }

      if (type === 'touchend') {
        g_canFireMouseEnterNormalScroll = false;
        setTimeout(function () {
          g_canFireMouseEnterNormalScroll = true;
        }, 800);
      } //preventing mouseenter event to do anything when coming from a touchEnd event
      //fixing issue #3576


      if (type === 'mouseenter' && !g_canFireMouseEnterNormalScroll) {
        return;
      }

      var normalSelectors = options.normalScrollElements.split(',');
      normalSelectors.forEach(function (normalSelector) {
        if (!isInsideOneNormalScroll) {
          var isNormalScrollTarget = matches(target, normalSelector); //leaving a child inside the normalScoll element is not leaving the normalScroll #3661

          var isNormalScrollChildFocused = closest(target, normalSelector);

          if (isNormalScrollTarget || isNormalScrollChildFocused) {
            if (!FP.shared.isNormalScrollElement) {
              setMouseHijack(false);

              if (isUsingScrollOverflow) {
                options.scrollOverflowHandler.setIscroll(target, false);
              }
            }

            FP.shared.isNormalScrollElement = true;
            isInsideOneNormalScroll = true;
          }
        }
      }); //not inside a single normal scroll element anymore?

      if (!isInsideOneNormalScroll && FP.shared.isNormalScrollElement) {
        setMouseHijack(true);

        if (isUsingScrollOverflow) {
          options.scrollOverflowHandler.setIscroll(target, true);
        }

        FP.shared.isNormalScrollElement = false;
      }
    }
    /**
    * Checks the viewport a few times on a define interval of time to 
    * see if it has changed in any of those. If that's the case, it resizes.
    */


    function doubleCheckHeight() {
      for (var i = 1; i < 4; i++) {
        g_doubleCheckHeightId = setTimeout(adjustToNewViewport, 350 * i);
      }
    }
    /**
    * Adjusts a section to the viewport if it has changed.
    */


    function adjustToNewViewport() {
      var newWindowHeight = getWindowHeight();
      var newWindowWidth = getWindowWidth();

      if (windowsHeight !== newWindowHeight || windowsWidth !== newWindowWidth) {
        windowsHeight = newWindowHeight;
        windowsWidth = newWindowWidth;
        reBuild(true);
      }
    }
    /**
    * Setting options from DOM elements if they are not provided.
    */


    function setOptionsFromDOM() {
      //no anchors option? Checking for them in the DOM attributes
      if (!options.anchors.length) {
        var anchorsAttribute = '[data-anchor]';
        var anchors = $(options.sectionSelector.split(',').join(anchorsAttribute + ',') + anchorsAttribute, container);

        if (anchors.length && anchors.length === $(options.sectionSelector, container).length) {
          g_initialAnchorsInDom = true;
          anchors.forEach(function (item) {
            options.anchors.push(item.getAttribute('data-anchor').toString());
          });
        }
      } //no tooltips option? Checking for them in the DOM attributes


      if (!options.navigationTooltips.length) {
        var tooltipsAttribute = '[data-tooltip]';
        var tooltips = $(options.sectionSelector.split(',').join(tooltipsAttribute + ',') + tooltipsAttribute, container);

        if (tooltips.length) {
          tooltips.forEach(function (item) {
            options.navigationTooltips.push(item.getAttribute('data-tooltip').toString());
          });
        }
      }
    }
    /**
    * Works over the DOM structure to set it up for the current fullpage options.
    */


    function prepareDom() {
      css(container, {
        'height': '100%',
        'position': 'relative'
      }); //adding a class to recognize the container internally in the code

      addClass(container, WRAPPER);
      addClass($html, ENABLED); //due to https://github.com/alvarotrigo/fullPage.js/issues/1502

      windowsHeight = getWindowHeight();
      removeClass(container, DESTROYED); //in case it was destroyed before initializing it again

      addInternalSelectors();
      var sections = $(SECTION_SEL); //styling the sections / slides / menu

      for (var i = 0; i < sections.length; i++) {
        var sectionIndex = i;
        var section = sections[i];
        var slides = $(SLIDE_SEL, section);
        var numSlides = slides.length; //caching the original styles to add them back on destroy('all')

        section.setAttribute('data-fp-styles', section.getAttribute('style'));
        styleSection(section, sectionIndex);
        styleMenu(section, sectionIndex); // if there's any slide

        if (numSlides > 0) {
          styleSlides(section, slides, numSlides);
        } else {
          if (options.verticalCentered) {
            addTableClass(section);
          }
        }
      } //fixed elements need to be moved out of the plugin container due to problems with CSS3.


      if (options.fixedElements && options.css3) {
        $(options.fixedElements).forEach(function (item) {
          $body.appendChild(item);
        });
      } //vertical centered of the navigation + active bullet


      if (options.navigation) {
        addVerticalNavigation();
      }

      enableYoutubeAPI();

      if (options.scrollOverflow) {
        scrollBarHandler = options.scrollOverflowHandler.init(options);
      }
    }
    /**
    * Styles the horizontal slides for a section.
    */


    function styleSlides(section, slides, numSlides) {
      var sliderWidth = numSlides * 100;
      var slideWidth = 100 / numSlides;
      var slidesWrapper = document.createElement('div');
      slidesWrapper.className = SLIDES_WRAPPER; //fp-slides

      wrapAll(slides, slidesWrapper);
      var slidesContainer = document.createElement('div');
      slidesContainer.className = SLIDES_CONTAINER; //fp-slidesContainer

      wrapAll(slides, slidesContainer);
      css($(SLIDES_CONTAINER_SEL, section), {
        'width': sliderWidth + '%'
      });

      if (numSlides > 1) {
        if (options.controlArrows) {
          createSlideArrows(section);
        }

        if (options.slidesNavigation) {
          addSlidesNavigation(section, numSlides);
        }
      }

      slides.forEach(function (slide) {
        css(slide, {
          'width': slideWidth + '%'
        });

        if (options.verticalCentered) {
          addTableClass(slide);
        }
      });
      var startingSlide = $(SLIDE_ACTIVE_SEL, section)[0]; //if the slide won't be an starting point, the default will be the first one
      //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.

      if (startingSlide != null && (index($(SECTION_ACTIVE_SEL), SECTION_SEL) !== 0 || index($(SECTION_ACTIVE_SEL), SECTION_SEL) === 0 && index(startingSlide) !== 0)) {
        silentLandscapeScroll(startingSlide, 'internal');
      } else {
        addClass(slides[0], ACTIVE);
      }
    }
    /**
    * Styling vertical sections
    */


    function styleSection(section, index) {
      //if no active section is defined, the 1st one will be the default one
      if (!index && $(SECTION_ACTIVE_SEL)[0] == null) {
        addClass(section, ACTIVE);
      }

      startingSection = $(SECTION_ACTIVE_SEL)[0];
      css(section, {
        'height': windowsHeight + 'px'
      });

      if (options.paddingTop) {
        css(section, {
          'padding-top': options.paddingTop
        });
      }

      if (options.paddingBottom) {
        css(section, {
          'padding-bottom': options.paddingBottom
        });
      }

      if (typeof options.sectionsColor[index] !== 'undefined') {
        css(section, {
          'background-color': options.sectionsColor[index]
        });
      }

      if (typeof options.anchors[index] !== 'undefined') {
        section.setAttribute('data-anchor', options.anchors[index]);
      }
    }
    /**
    * Sets the data-anchor attributes to the menu elements and activates the current one.
    */


    function styleMenu(section, index) {
      if (typeof options.anchors[index] !== 'undefined') {
        //activating the menu / nav element on load
        if (hasClass(section, ACTIVE)) {
          activateMenuAndNav(options.anchors[index], index);
        }
      } //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)


      if (options.menu && options.css3 && closest($(options.menu)[0], WRAPPER_SEL) != null) {
        $(options.menu).forEach(function (menu) {
          $body.appendChild(menu);
        });
      }
    }
    /**
    * Adds internal classes to be able to provide customizable selectors
    * keeping the link with the style sheet.
    */


    function addInternalSelectors() {
      addClass($(options.sectionSelector, container), SECTION);
      addClass($(options.slideSelector, container), SLIDE);
    }
    /**
    * Creates the control arrows for the given section
    */


    function createSlideArrows(section) {
      var arrows = [createElementFromHTML('<div class="' + SLIDES_ARROW_PREV + '"></div>'), createElementFromHTML('<div class="' + SLIDES_ARROW_NEXT + '"></div>')];
      after($(SLIDES_WRAPPER_SEL, section)[0], arrows);

      if (options.controlArrowColor !== '#fff') {
        css($(SLIDES_ARROW_NEXT_SEL, section), {
          'border-color': 'transparent transparent transparent ' + options.controlArrowColor
        });
        css($(SLIDES_ARROW_PREV_SEL, section), {
          'border-color': 'transparent ' + options.controlArrowColor + ' transparent transparent'
        });
      }

      if (!options.loopHorizontal) {
        hide($(SLIDES_ARROW_PREV_SEL, section));
      }
    }
    /**
    * Creates a vertical navigation bar.
    */


    function addVerticalNavigation() {
      var navigation = document.createElement('div');
      navigation.setAttribute('id', SECTION_NAV);
      var divUl = document.createElement('ul');
      navigation.appendChild(divUl);
      appendTo(navigation, $body);
      var nav = $(SECTION_NAV_SEL)[0];
      addClass(nav, 'fp-' + options.navigationPosition);

      if (options.showActiveTooltip) {
        addClass(nav, SHOW_ACTIVE_TOOLTIP);
      }

      var li = '';

      for (var i = 0; i < $(SECTION_SEL).length; i++) {
        var link = '';

        if (options.anchors.length) {
          link = options.anchors[i];
        }

        li += '<li><a href="#' + link + '"><span class="fp-sr-only">' + getBulletLinkName(i, 'Section') + '</span><span></span></a>'; // Only add tooltip if needed (defined by user)

        var tooltip = options.navigationTooltips[i];

        if (typeof tooltip !== 'undefined' && tooltip !== '') {
          li += '<div class="' + SECTION_NAV_TOOLTIP + ' fp-' + options.navigationPosition + '">' + tooltip + '</div>';
        }

        li += '</li>';
      }

      $('ul', nav)[0].innerHTML = li; //activating the current active section

      var bullet = $('li', $(SECTION_NAV_SEL)[0])[index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL)];
      addClass($('a', bullet), ACTIVE);
    }
    /**
    * Gets the name for screen readers for a section/slide navigation bullet.
    */


    function getBulletLinkName(i, defaultName, item) {
      var anchor = defaultName === 'Section' ? options.anchors[i] : item.getAttribute('data-anchor');
      return options.navigationTooltips[i] || anchor || defaultName + ' ' + (i + 1);
    }
    /*
    * Enables the Youtube videos API so we can control their flow if necessary.
    */


    function enableYoutubeAPI() {
      $('iframe[src*="youtube.com/embed/"]', container).forEach(function (item) {
        addURLParam(item, 'enablejsapi=1');
      });
    }
    /**
    * Adds a new parameter and its value to the `src` of a given element
    */


    function addURLParam(element, newParam) {
      var originalSrc = element.getAttribute('src');
      element.setAttribute('src', originalSrc + getUrlParamSign(originalSrc) + newParam);
    }
    /*
    * Returns the prefix sign to use for a new parameter in an existen URL.
    *
    * @return {String}  ? | &
    */


    function getUrlParamSign(url) {
      return !/\?/.test(url) ? '?' : '&';
    }
    /**
    * Actions and callbacks to fire afterRender
    */


    function afterRenderActions() {
      var section = $(SECTION_ACTIVE_SEL)[0];
      addClass(section, COMPLETELY);
      lazyLoad(section);
      lazyLoadOthers();
      playMedia(section);

      if (options.scrollOverflow) {
        options.scrollOverflowHandler.afterLoad();
      }

      if (isDestinyTheStartingSection() && isFunction(options.afterLoad)) {
        fireCallback('afterLoad', {
          activeSection: section,
          element: section,
          direction: null,
          //for backwards compatibility callback (to be removed in a future!)
          anchorLink: section.getAttribute('data-anchor'),
          sectionIndex: index(section, SECTION_SEL)
        });
      }

      if (isFunction(options.afterRender)) {
        fireCallback('afterRender');
      }
    }
    /**
    * Determines if the URL anchor destiny is the starting section (the one using 'active' class before initialization)
    */


    function isDestinyTheStartingSection() {
      var anchor = getAnchorsURL();
      var destinationSection = getSectionByAnchor(anchor.section);
      return !anchor.section || !destinationSection || typeof destinationSection !== 'undefined' && index(destinationSection) === index(startingSection);
    }

    var isScrolling = false;
    var lastScroll = 0; //when scrolling...

    function scrollHandler() {
      var currentSection;

      if (isResizing) {
        return;
      }

      if (!options.autoScrolling || options.scrollBar) {
        var currentScroll = getScrollTop();
        var scrollDirection = getScrollDirection(currentScroll);
        var visibleSectionIndex = 0;
        var screen_mid = currentScroll + getWindowHeight() / 2.0;
        var isAtBottom = $body.offsetHeight - getWindowHeight() === currentScroll;
        var sections = $(SECTION_SEL); //when using `auto-height` for a small last section it won't be centered in the viewport

        if (isAtBottom) {
          visibleSectionIndex = sections.length - 1;
        } //is at top? when using `auto-height` for a small first section it won't be centered in the viewport
        else if (!currentScroll) {
            visibleSectionIndex = 0;
          } //taking the section which is showing more content in the viewport
          else {
              for (var i = 0; i < sections.length; ++i) {
                var section = sections[i]; // Pick the the last section which passes the middle line of the screen.

                if (section.offsetTop <= screen_mid) {
                  visibleSectionIndex = i;
                }
              }
            }

        if (isCompletelyInViewPort(scrollDirection)) {
          if (!hasClass($(SECTION_ACTIVE_SEL)[0], COMPLETELY)) {
            addClass($(SECTION_ACTIVE_SEL)[0], COMPLETELY);
            removeClass(siblings($(SECTION_ACTIVE_SEL)[0]), COMPLETELY);
          }
        } //geting the last one, the current one on the screen


        currentSection = sections[visibleSectionIndex]; //setting the visible section as active when manually scrolling
        //executing only once the first time we reach the section

        if (!hasClass(currentSection, ACTIVE)) {
          isScrolling = true;
          var leavingSection = $(SECTION_ACTIVE_SEL)[0];
          var leavingSectionIndex = index(leavingSection, SECTION_SEL) + 1;
          var yMovement = getYmovement(currentSection);
          var anchorLink = currentSection.getAttribute('data-anchor');
          var sectionIndex = index(currentSection, SECTION_SEL) + 1;
          var activeSlide = $(SLIDE_ACTIVE_SEL, currentSection)[0];
          var slideIndex;
          var slideAnchorLink;
          var callbacksParams = {
            activeSection: leavingSection,
            sectionIndex: sectionIndex - 1,
            anchorLink: anchorLink,
            element: currentSection,
            leavingSection: leavingSectionIndex,
            direction: yMovement
          };

          if (activeSlide) {
            slideAnchorLink = activeSlide.getAttribute('data-anchor');
            slideIndex = index(activeSlide);
          }

          if (canScroll) {
            addClass(currentSection, ACTIVE);
            removeClass(siblings(currentSection), ACTIVE);

            if (isFunction(options.onLeave)) {
              fireCallback('onLeave', callbacksParams);
            }

            if (isFunction(options.afterLoad)) {
              fireCallback('afterLoad', callbacksParams);
            }

            stopMedia(leavingSection);
            lazyLoad(currentSection);
            playMedia(currentSection);
            activateMenuAndNav(anchorLink, sectionIndex - 1);

            if (options.anchors.length) {
              //needed to enter in hashChange event when using the menu with anchor links
              lastScrolledDestiny = anchorLink;
            }

            setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
          } //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet


          clearTimeout(scrollId);
          scrollId = setTimeout(function () {
            isScrolling = false;
          }, 100);
        }

        if (options.fitToSection) {
          //for the auto adjust of the viewport to fit a whole section
          clearTimeout(scrollId2);
          scrollId2 = setTimeout(function () {
            //checking it again in case it changed during the delay
            if (options.fitToSection && //is the destination element bigger than the viewport?
            $(SECTION_ACTIVE_SEL)[0].offsetHeight <= windowsHeight) {
              fitToSection();
            }
          }, options.fitToSectionDelay);
        }
      }
    }
    /**
    * Fits the site to the nearest active section
    */


    function fitToSection() {
      //checking fitToSection again in case it was set to false before the timeout delay
      if (canScroll) {
        //allows to scroll to an active section and
        //if the section is already active, we prevent firing callbacks
        isResizing = true;
        scrollPage($(SECTION_ACTIVE_SEL)[0]);
        isResizing = false;
      }
    }
    /**
    * Determines whether the active section has seen in its whole or not.
    */


    function isCompletelyInViewPort(movement) {
      var top = $(SECTION_ACTIVE_SEL)[0].offsetTop;
      var bottom = top + getWindowHeight();

      if (movement == 'up') {
        return bottom >= getScrollTop() + getWindowHeight();
      }

      return top <= getScrollTop();
    }
    /**
    * Determines whether a section is in the viewport or not.
    */


    function isSectionInViewport(el) {
      var rect = el.getBoundingClientRect();
      var top = rect.top;
      var bottom = rect.bottom; //sometimes there's a 1px offset on the bottom of the screen even when the 
      //section's height is the window.innerHeight one. I guess because pixels won't allow decimals.
      //using this prevents from lazyLoading the section that is not yet visible 
      //(only 1 pixel offset is)

      var pixelOffset = 2;
      var isTopInView = top + pixelOffset < windowsHeight && top > 0;
      var isBottomInView = bottom > pixelOffset && bottom < windowsHeight;
      return isTopInView || isBottomInView;
    }
    /**
    * Gets the directon of the the scrolling fired by the scroll event.
    */


    function getScrollDirection(currentScroll) {
      var direction = currentScroll > lastScroll ? 'down' : 'up';
      lastScroll = currentScroll; //needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination

      previousDestTop = currentScroll;
      return direction;
    }
    /**
    * Determines the way of scrolling up or down:
    * by 'automatically' scrolling a section or by using the default and normal scrolling.
    */


    function scrolling(type) {
      if (!isScrollAllowed.m[type]) {
        return;
      }

      var scrollSection = type === 'down' ? moveSectionDown : moveSectionUp;

      if (options.scrollOverflow) {
        var scrollable = options.scrollOverflowHandler.scrollable($(SECTION_ACTIVE_SEL)[0]);
        var check = type === 'down' ? 'bottom' : 'top';

        if (scrollable != null) {
          //is the scrollbar at the start/end of the scroll?
          if (options.scrollOverflowHandler.isScrolled(check, scrollable)) {
            scrollSection();
          } else {
            return true;
          }
        } else {
          // moved up/down
          scrollSection();
        }
      } else {
        // moved up/down
        scrollSection();
      }
    }
    /*
    * Preventing bouncing in iOS #2285
    */


    function preventBouncing(e) {
      if (options.autoScrolling && isReallyTouch(e) && isScrollAllowed.m.up) {
        //preventing the easing on iOS devices
        preventDefault(e);
      }
    }

    var touchStartY = 0;
    var touchStartX = 0;
    var touchEndY = 0;
    var touchEndX = 0;
    /* Detecting touch events
      * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
    * This way, the touchstart and the touch moves shows an small difference between them which is the
    * used one to determine the direction.
    */

    function touchMoveHandler(e) {
      var activeSection = closest(e.target, SECTION_SEL) || $(SECTION_ACTIVE_SEL)[0];

      if (isReallyTouch(e)) {
        if (options.autoScrolling) {
          //preventing the easing on iOS devices
          preventDefault(e);
        }

        var touchEvents = getEventsPage(e);
        touchEndY = touchEvents.y;
        touchEndX = touchEvents.x; //if movement in the X axys is greater than in the Y and the currect section has slides...

        if ($(SLIDES_WRAPPER_SEL, activeSection).length && Math.abs(touchStartX - touchEndX) > Math.abs(touchStartY - touchEndY)) {
          //is the movement greater than the minimum resistance to scroll?
          if (!slideMoving && Math.abs(touchStartX - touchEndX) > getWindowWidth() / 100 * options.touchSensitivity) {
            if (touchStartX > touchEndX) {
              if (isScrollAllowed.m.right) {
                moveSlideRight(activeSection); //next
              }
            } else {
              if (isScrollAllowed.m.left) {
                moveSlideLeft(activeSection); //prev
              }
            }
          }
        } //vertical scrolling (only when autoScrolling is enabled)
        else if (options.autoScrolling && canScroll) {
            //is the movement greater than the minimum resistance to scroll?
            if (Math.abs(touchStartY - touchEndY) > window.innerHeight / 100 * options.touchSensitivity) {
              if (touchStartY > touchEndY) {
                scrolling('down');
              } else if (touchEndY > touchStartY) {
                scrolling('up');
              }
            }
          }
      }
    }
    /**
    * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
    * this way we make sure that is really a touch event what IE is detecting.
    */


    function isReallyTouch(e) {
      //if is not IE   ||  IE is detecting `touch` or `pen`
      return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
    }
    /**
    * Handler for the touch start event.
    */


    function touchStartHandler(e) {
      //stopping the auto scroll to adjust to a section
      if (options.fitToSection) {
        activeAnimation = false;
      }

      if (isReallyTouch(e)) {
        var touchEvents = getEventsPage(e);
        touchStartY = touchEvents.y;
        touchStartX = touchEvents.x;
      }
    }
    /**
    * Gets the average of the last `number` elements of the given array.
    */


    function getAverage(elements, number) {
      var sum = 0; //taking `number` elements from the end to make the average, if there are not enought, 1

      var lastElements = elements.slice(Math.max(elements.length - number, 1));

      for (var i = 0; i < lastElements.length; i++) {
        sum = sum + lastElements[i];
      }

      return Math.ceil(sum / number);
    }
    /**
     * Detecting mousewheel scrolling
     *
     * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
     * http://www.sitepoint.com/html5-javascript-mouse-wheel/
     */


    var prevTime = new Date().getTime();

    function MouseWheelHandler(e) {
      var curTime = new Date().getTime();
      var isNormalScroll = hasClass($(COMPLETELY_SEL)[0], NORMAL_SCROLL); //is scroll allowed?

      if (!isScrollAllowed.m.down && !isScrollAllowed.m.up) {
        preventDefault(e);
        return false;
      } //autoscrolling and not zooming?


      if (options.autoScrolling && !controlPressed && !isNormalScroll) {
        // cross-browser wheel delta
        e = e || window.event;
        var value = e.wheelDelta || -e.deltaY || -e.detail;
        var delta = Math.max(-1, Math.min(1, value));
        var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
        var isScrollingVertically = Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta) || Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection; //Limiting the array to 150 (lets not waste memory!)

        if (scrollings.length > 149) {
          scrollings.shift();
        } //keeping record of the previous scrollings


        scrollings.push(Math.abs(value)); //preventing to scroll the site on mouse wheel when scrollbar is present

        if (options.scrollBar) {
          preventDefault(e);
        } //time difference between the last scroll and the current one


        var timeDiff = curTime - prevTime;
        prevTime = curTime; //haven't they scrolled in a while?
        //(enough to be consider a different scrolling action to scroll another section)

        if (timeDiff > 200) {
          //emptying the array, we dont care about old scrollings for our averages
          scrollings = [];
        }

        if (canScroll) {
          var averageEnd = getAverage(scrollings, 10);
          var averageMiddle = getAverage(scrollings, 70);
          var isAccelerating = averageEnd >= averageMiddle; //to avoid double swipes...

          if (isAccelerating && isScrollingVertically) {
            //scrolling down?
            if (delta < 0) {
              scrolling('down'); //scrolling up?
            } else {
              scrolling('up');
            }
          }
        }

        return false;
      }

      if (options.fitToSection) {
        //stopping the auto scroll to adjust to a section
        activeAnimation = false;
      }
    }
    /**
    * Slides a slider to the given direction.
    * Optional `section` param.
    */


    function moveSlide(direction, section) {
      var activeSection = section == null ? $(SECTION_ACTIVE_SEL)[0] : section;
      var slides = $(SLIDES_WRAPPER_SEL, activeSection)[0]; // more than one slide needed and nothing should be sliding

      if (slides == null || slideMoving || $(SLIDE_SEL, slides).length < 2) {
        return;
      }

      var currentSlide = $(SLIDE_ACTIVE_SEL, slides)[0];
      var destiny = null;

      if (direction === 'left') {
        destiny = prevUntil(currentSlide, SLIDE_SEL);
      } else {
        destiny = nextUntil(currentSlide, SLIDE_SEL);
      } //isn't there a next slide in the secuence?


      if (destiny == null) {
        //respect loopHorizontal settin
        if (!options.loopHorizontal) return;
        var slideSiblings = siblings(currentSlide);

        if (direction === 'left') {
          destiny = slideSiblings[slideSiblings.length - 1]; //last
        } else {
          destiny = slideSiblings[0]; //first
        }
      }

      slideMoving = true && !FP.test.isTesting;
      landscapeScroll(slides, destiny, direction);
    }
    /**
    * Maintains the active slides in the viewport
    * (Because the `scroll` animation might get lost with some actions, such as when using continuousVertical)
    */


    function keepSlidesPosition() {
      var activeSlides = $(SLIDE_ACTIVE_SEL);

      for (var i = 0; i < activeSlides.length; i++) {
        silentLandscapeScroll(activeSlides[i], 'internal');
      }
    }

    var previousDestTop = 0;
    /**
    * Returns the destination Y position based on the scrolling direction and
    * the height of the section.
    */

    function getDestinationPosition(element) {
      var elementHeight = element.offsetHeight;
      var elementTop = element.offsetTop; //top of the desination will be at the top of the viewport

      var position = elementTop;
      var isScrollingDown = elementTop > previousDestTop;
      var sectionBottom = position - windowsHeight + elementHeight;
      var bigSectionsDestination = options.bigSectionsDestination; //is the destination element bigger than the viewport?

      if (elementHeight > windowsHeight) {
        //scrolling up?
        if (!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom') {
          position = sectionBottom;
        }
      } //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
      else if (isScrollingDown || isResizing && next(element) == null) {
          //The bottom of the destination will be at the bottom of the viewport
          position = sectionBottom;
        }
      /*
      Keeping record of the last scrolled position to determine the scrolling direction.
      No conventional methods can be used as the scroll bar might not be present
      AND the section might not be active if it is auto-height and didnt reach the middle
      of the viewport.
      */


      previousDestTop = position;
      return position;
    }
    /**
    * Scrolls the site to the given element and scrolls to the slide if a callback is given.
    */


    function scrollPage(element, callback, isMovementUp) {
      if (element == null) {
        return;
      } //there's no element to scroll, leaving the function


      var dtop = getDestinationPosition(element);
      var slideAnchorLink;
      var slideIndex; //local variables

      var v = {
        element: element,
        callback: callback,
        isMovementUp: isMovementUp,
        dtop: dtop,
        yMovement: getYmovement(element),
        anchorLink: element.getAttribute('data-anchor'),
        sectionIndex: index(element, SECTION_SEL),
        activeSlide: $(SLIDE_ACTIVE_SEL, element)[0],
        activeSection: $(SECTION_ACTIVE_SEL)[0],
        leavingSection: index($(SECTION_ACTIVE_SEL), SECTION_SEL) + 1,
        //caching the value of isResizing at the momment the function is called
        //because it will be checked later inside a setTimeout and the value might change
        localIsResizing: isResizing
      }; //quiting when destination scroll is the same as the current one

      if (v.activeSection == element && !isResizing || options.scrollBar && getScrollTop() === v.dtop && !hasClass(element, AUTO_HEIGHT)) {
        return;
      }

      if (v.activeSlide != null) {
        slideAnchorLink = v.activeSlide.getAttribute('data-anchor');
        slideIndex = index(v.activeSlide);
      } //callback (onLeave) if the site is not just resizing and readjusting the slides


      if (!v.localIsResizing) {
        var direction = v.yMovement; //required for continousVertical

        if (typeof isMovementUp !== 'undefined') {
          direction = isMovementUp ? 'up' : 'down';
        } //for the callback


        v.direction = direction;

        if (isFunction(options.onLeave)) {
          if (fireCallback('onLeave', v) === false) {
            return;
          }
        }
      } // If continuousVertical && we need to wrap around


      if (options.autoScrolling && options.continuousVertical && typeof v.isMovementUp !== "undefined" && (!v.isMovementUp && v.yMovement == 'up' || // Intending to scroll down but about to go up or
      v.isMovementUp && v.yMovement == 'down')) {
        // intending to scroll up but about to go down
        v = createInfiniteSections(v);
      } //pausing media of the leaving section (if we are not just resizing, as destinatino will be the same one)


      if (!v.localIsResizing) {
        stopMedia(v.activeSection);
      }

      if (options.scrollOverflow) {
        options.scrollOverflowHandler.beforeLeave();
      }

      addClass(element, ACTIVE);
      removeClass(siblings(element), ACTIVE);
      lazyLoad(element);

      if (options.scrollOverflow) {
        options.scrollOverflowHandler.onLeave();
      } //preventing from activating the MouseWheelHandler event
      //more than once if the page is scrolling


      canScroll = false || FP.test.isTesting;
      setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);
      performMovement(v); //flag to avoid callingn `scrollPage()` twice in case of using anchor links

      lastScrolledDestiny = v.anchorLink; //avoid firing it twice (as it does also on scroll)

      activateMenuAndNav(v.anchorLink, v.sectionIndex);
    }
    /**
    * Dispatch events & callbacks making sure it does it on the right format, depending on
    * whether v2compatible is being used or not.
    */


    function fireCallback(eventName, v) {
      var eventData = getEventData(eventName, v);

      if (!options.v2compatible) {
        trigger(container, eventName, eventData);

        if (options[eventName].apply(eventData[(0, _keys.default)(eventData)[0]], toArray(eventData)) === false) {
          return false;
        }
      } else {
        if (options[eventName].apply(eventData[0], eventData.slice(1)) === false) {
          return false;
        }
      }

      return true;
    }
    /**
    * Makes sure to only create a Panel object if the element exist
    */


    function nullOrSection(el) {
      return el ? new Section(el) : null;
    }

    function nullOrSlide(el) {
      return el ? new Slide(el) : null;
    }
    /**
    * Gets the event's data for the given event on the right format. Depending on whether
    * v2compatible is being used or not.
    */


    function getEventData(eventName, v) {
      var paramsPerEvent;

      if (!options.v2compatible) {
        //using functions to run only the necessary bits within the object
        paramsPerEvent = {
          afterRender: function afterRender() {
            return {
              section: nullOrSection($(SECTION_ACTIVE_SEL)[0]),
              slide: nullOrSlide($(SLIDE_ACTIVE_SEL, $(SECTION_ACTIVE_SEL)[0])[0])
            };
          },
          onLeave: function onLeave() {
            return {
              origin: nullOrSection(v.activeSection),
              destination: nullOrSection(v.element),
              direction: v.direction
            };
          },
          afterLoad: function afterLoad() {
            return paramsPerEvent.onLeave();
          },
          afterSlideLoad: function afterSlideLoad() {
            return {
              section: nullOrSection(v.section),
              origin: nullOrSlide(v.prevSlide),
              destination: nullOrSlide(v.destiny),
              direction: v.direction
            };
          },
          onSlideLeave: function onSlideLeave() {
            return paramsPerEvent.afterSlideLoad();
          }
        };
      } else {
        paramsPerEvent = {
          afterRender: function afterRender() {
            return [container];
          },
          onLeave: function onLeave() {
            return [v.activeSection, v.leavingSection, v.sectionIndex + 1, v.direction];
          },
          afterLoad: function afterLoad() {
            return [v.element, v.anchorLink, v.sectionIndex + 1];
          },
          afterSlideLoad: function afterSlideLoad() {
            return [v.destiny, v.anchorLink, v.sectionIndex + 1, v.slideAnchor, v.slideIndex];
          },
          onSlideLeave: function onSlideLeave() {
            return [v.prevSlide, v.anchorLink, v.sectionIndex + 1, v.prevSlideIndex, v.direction, v.slideIndex];
          }
        };
      }

      return paramsPerEvent[eventName]();
    }
    /**
    * Performs the vertical movement (by CSS3 or by jQuery)
    */


    function performMovement(v) {
      var isFastSpeed = options.scrollingSpeed < 700;
      var transitionLapse = isFastSpeed ? 700 : options.scrollingSpeed; // using CSS3 translate functionality

      if (options.css3 && options.autoScrolling && !options.scrollBar) {
        // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
        // that's why we round it to 0.
        var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
        transformContainer(translate3d, true); //even when the scrollingSpeed is 0 there's a little delay, which might cause the
        //scrollingSpeed to change in case of using silentMoveTo();

        if (options.scrollingSpeed) {
          clearTimeout(afterSectionLoadsId);
          afterSectionLoadsId = setTimeout(function () {
            afterSectionLoads(v); //disabling canScroll when using fastSpeed

            canScroll = !isFastSpeed;
          }, options.scrollingSpeed);
        } else {
          afterSectionLoads(v);
        }
      } // using JS to animate
      else {
          var scrollSettings = getScrollSettings(v.dtop);
          FP.test.top = -v.dtop + 'px';
          css($htmlBody, {
            'scroll-behavior': 'unset'
          });
          scrollTo(scrollSettings.element, scrollSettings.options, options.scrollingSpeed, function () {
            if (options.scrollBar) {
              /* Hack!
              The timeout prevents setting the most dominant section in the viewport as "active" when the user
              scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.
                When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
              */
              setTimeout(function () {
                afterSectionLoads(v);
              }, 30);
            } else {
              afterSectionLoads(v); //disabling canScroll when using fastSpeed

              canScroll = !isFastSpeed;
            }
          });
        } // enabling canScroll after the minimum transition laps


      if (isFastSpeed) {
        clearTimeout(g_transitionLapseId);
        g_transitionLapseId = setTimeout(function () {
          canScroll = true;
        }, transitionLapse);
      }
    }
    /**
    * Gets the scrolling settings depending on the plugin autoScrolling option
    */


    function getScrollSettings(top) {
      var scroll = {}; //top property animation

      if (options.autoScrolling && !options.scrollBar) {
        scroll.options = -top;
        scroll.element = $(WRAPPER_SEL)[0];
      } //window real scrolling
      else {
          scroll.options = top;
          scroll.element = window;
        }

      return scroll;
    }
    /**
    * Adds sections before or after the current one to create the infinite effect.
    */


    function createInfiniteSections(v) {
      // Scrolling down
      if (!v.isMovementUp) {
        // Move all previous sections to after the active section
        after($(SECTION_ACTIVE_SEL)[0], prevAll(v.activeSection, SECTION_SEL).reverse());
      } else {
        // Scrolling up
        // Move all next sections to before the active section
        before($(SECTION_ACTIVE_SEL)[0], nextAll(v.activeSection, SECTION_SEL));
      } // Maintain the displayed position (now that we changed the element order)


      silentScroll($(SECTION_ACTIVE_SEL)[0].offsetTop); // Maintain the active slides visible in the viewport

      keepSlidesPosition(); // save for later the elements that still need to be reordered

      v.wrapAroundElements = v.activeSection; // Recalculate animation variables

      v.dtop = v.element.offsetTop;
      v.yMovement = getYmovement(v.element);
      return v;
    }
    /**
    * Fix section order after continuousVertical changes have been animated
    */


    function continuousVerticalFixSectionOrder(v) {
      // If continuousVertical is in effect (and autoScrolling would also be in effect then),
      // finish moving the elements around so the direct navigation will function more simply
      if (v.wrapAroundElements == null) {
        return;
      }

      if (v.isMovementUp) {
        before($(SECTION_SEL)[0], v.wrapAroundElements);
      } else {
        after($(SECTION_SEL)[$(SECTION_SEL).length - 1], v.wrapAroundElements);
      }

      silentScroll($(SECTION_ACTIVE_SEL)[0].offsetTop); // Maintain the active slides visible in the viewport

      keepSlidesPosition();
    }
    /**
    * Actions to do once the section is loaded.
    */


    function afterSectionLoads(v) {
      continuousVerticalFixSectionOrder(v); //callback (afterLoad) if the site is not just resizing and readjusting the slides

      if (isFunction(options.afterLoad) && !v.localIsResizing) {
        fireCallback('afterLoad', v);
      }

      if (options.scrollOverflow) {
        options.scrollOverflowHandler.afterLoad();
      }

      if (!v.localIsResizing) {
        playMedia(v.element);
      }

      addClass(v.element, COMPLETELY);
      removeClass(siblings(v.element), COMPLETELY);
      lazyLoadOthers();
      canScroll = true;

      if (isFunction(v.callback)) {
        v.callback();
      }
    }
    /**
    * Sets the value for the given attribute from the `data-` attribute with the same suffix
    * ie: data-srcset ==> srcset  |  data-src ==> src
    */


    function setSrc(element, attribute) {
      element.setAttribute(attribute, element.getAttribute('data-' + attribute));
      element.removeAttribute('data-' + attribute);
    }
    /**
    * Makes sure lazyload is done for other sections in the viewport that are not the
    * active one. 
    */


    function lazyLoadOthers() {
      var hasAutoHeightSections = $(AUTO_HEIGHT_SEL)[0] || isResponsiveMode() && $(AUTO_HEIGHT_RESPONSIVE_SEL)[0]; //quitting when it doesn't apply

      if (!options.lazyLoading || !hasAutoHeightSections) {
        return;
      } //making sure to lazy load auto-height sections that are in the viewport


      $(SECTION_SEL + ':not(' + ACTIVE_SEL + ')').forEach(function (section) {
        if (isSectionInViewport(section)) {
          lazyLoad(section);
        }
      });
    }
    /**
    * Lazy loads image, video and audio elements.
    */


    function lazyLoad(destiny) {
      if (!options.lazyLoading) {
        return;
      }

      var panel = getSlideOrSection(destiny);
      $('img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]', panel).forEach(function (element) {
        ['src', 'srcset'].forEach(function (type) {
          var attribute = element.getAttribute('data-' + type);

          if (attribute != null && attribute) {
            setSrc(element, type);
            element.addEventListener('load', function () {
              onMediaLoad(destiny);
            });
          }
        });

        if (matches(element, 'source')) {
          var elementToPlay = closest(element, 'video, audio');

          if (elementToPlay) {
            elementToPlay.load();

            elementToPlay.onloadeddata = function () {
              onMediaLoad(destiny);
            };
          }
        }
      });
    }
    /**
    * Callback firing when a lazy load media element has loaded.
    * Making sure it only fires one per section in normal conditions (if load time is not huge)
    */


    function onMediaLoad(section) {
      if (options.scrollOverflow) {
        clearTimeout(g_mediaLoadedId);
        g_mediaLoadedId = setTimeout(function () {
          if (!hasClass($body, RESPONSIVE)) {
            scrollBarHandler.createScrollBar(section);
          }
        }, 200);
      }
    }
    /**
    * Plays video and audio elements.
    */


    function playMedia(destiny) {
      var panel = getSlideOrSection(destiny); //playing HTML5 media elements

      $('video, audio', panel).forEach(function (element) {
        if (element.hasAttribute('data-autoplay') && typeof element.play === 'function') {
          element.play();
        }
      }); //youtube videos

      $('iframe[src*="youtube.com/embed/"]', panel).forEach(function (element) {
        if (element.hasAttribute('data-autoplay')) {
          playYoutube(element);
        } //in case the URL was not loaded yet. On page load we need time for the new URL (with the API string) to load.


        element.onload = function () {
          if (element.hasAttribute('data-autoplay')) {
            playYoutube(element);
          }
        };
      });
    }
    /**
    * Plays a youtube video
    */


    function playYoutube(element) {
      element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
    /**
    * Stops video and audio elements.
    */


    function stopMedia(destiny) {
      var panel = getSlideOrSection(destiny); //stopping HTML5 media elements

      $('video, audio', panel).forEach(function (element) {
        if (!element.hasAttribute('data-keepplaying') && typeof element.pause === 'function') {
          element.pause();
        }
      }); //youtube videos

      $('iframe[src*="youtube.com/embed/"]', panel).forEach(function (element) {
        if (/youtube\.com\/embed\//.test(element.getAttribute('src')) && !element.hasAttribute('data-keepplaying')) {
          element.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      });
    }
    /**
    * Gets the active slide (or section) for the given section
    */


    function getSlideOrSection(destiny) {
      var slide = $(SLIDE_ACTIVE_SEL, destiny);

      if (slide.length) {
        destiny = slide[0];
      }

      return destiny;
    }
    /**
    * Scrolls to the anchor in the URL when loading the site
    */


    function scrollToAnchor() {
      var anchors = getAnchorsURL();
      var sectionAnchor = anchors.section;
      var slideAnchor = anchors.slide;

      if (sectionAnchor) {
        //if theres any #
        if (options.animateAnchor) {
          scrollPageAndSlide(sectionAnchor, slideAnchor);
        } else {
          silentMoveTo(sectionAnchor, slideAnchor);
        }
      }
    }
    /**
    * Detecting any change on the URL to scroll to the given anchor link
    * (a way to detect back history button as we play with the hashes on the URL)
    */


    function hashChangeHandler() {
      if (!isScrolling && !options.lockAnchors) {
        var anchors = getAnchorsURL();
        var sectionAnchor = anchors.section;
        var slideAnchor = anchors.slide; //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)

        var isFirstSlideMove = typeof lastScrolledDestiny === 'undefined';
        var isFirstScrollMove = typeof lastScrolledDestiny === 'undefined' && typeof slideAnchor === 'undefined' && !slideMoving;

        if (sectionAnchor && sectionAnchor.length) {
          /*in order to call scrollpage() only once for each destination at a time
          It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
          event is fired on every scroll too.*/
          if (sectionAnchor && sectionAnchor !== lastScrolledDestiny && !isFirstSlideMove || isFirstScrollMove || !slideMoving && lastScrolledSlide != slideAnchor) {
            scrollPageAndSlide(sectionAnchor, slideAnchor);
          }
        }
      }
    } //gets the URL anchors (section and slide)


    function getAnchorsURL() {
      var section;
      var slide;
      var hash = window.location.hash;

      if (hash.length) {
        //getting the anchor link in the URL and deleting the `#`
        var anchorsParts = hash.replace('#', '').split('/'); //using / for visual reasons and not as a section/slide separator #2803

        var isFunkyAnchor = hash.indexOf('#/') > -1;
        section = isFunkyAnchor ? '/' + anchorsParts[1] : decodeURIComponent(anchorsParts[0]);
        var slideAnchor = isFunkyAnchor ? anchorsParts[2] : anchorsParts[1];

        if (slideAnchor && slideAnchor.length) {
          slide = decodeURIComponent(slideAnchor);
        }
      }

      return {
        section: section,
        slide: slide
      };
    } //Sliding with arrow keys, both, vertical and horizontal


    function keydownHandler(e) {
      clearTimeout(keydownId);
      var activeElement = document.activeElement;
      var keyCode = e.keyCode; //tab?

      if (keyCode === 9) {
        onTab(e);
      } else if (!matches(activeElement, 'textarea') && !matches(activeElement, 'input') && !matches(activeElement, 'select') && activeElement.getAttribute('contentEditable') !== "true" && activeElement.getAttribute('contentEditable') !== '' && options.keyboardScrolling && options.autoScrolling) {
        //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
        var keyControls = [40, 38, 32, 33, 34];

        if (keyControls.indexOf(keyCode) > -1) {
          preventDefault(e);
        }

        controlPressed = e.ctrlKey;
        keydownId = setTimeout(function () {
          onkeydown(e);
        }, 150);
      }
    }

    function tooltipTextHandler() {
      /*jshint validthis:true */
      trigger(prev(this), 'click');
    } //to prevent scrolling while zooming


    function keyUpHandler(e) {
      if (isWindowFocused) {
        //the keyup gets fired on new tab ctrl + t in Firefox
        controlPressed = e.ctrlKey;
      }
    } //binding the mousemove when the mouse's middle button is released


    function mouseDownHandler(e) {
      //middle button
      if (e.which == 2) {
        oldPageY = e.pageY;
        container.addEventListener('mousemove', mouseMoveHandler);
      }
    } //unbinding the mousemove when the mouse's middle button is released


    function mouseUpHandler(e) {
      //middle button
      if (e.which == 2) {
        container.removeEventListener('mousemove', mouseMoveHandler);
      }
    }
    /**
    * Makes sure the tab key will only focus elements within the current section/slide
    * preventing this way from breaking the page.
    * Based on "Modals and keyboard traps"
    * from https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
    */


    function onTab(e) {
      var isShiftPressed = e.shiftKey;
      var activeElement = document.activeElement;
      var focusableElements = getFocusables(getSlideOrSection($(SECTION_ACTIVE_SEL)[0]));

      function preventAndFocusFirst(e) {
        preventDefault(e);
        return focusableElements[0] ? focusableElements[0].focus() : null;
      } //outside any section or slide? Let's not hijack the tab!


      if (isFocusOutside(e)) {
        return;
      } //is there an element with focus?


      if (activeElement) {
        if (closest(activeElement, SECTION_ACTIVE_SEL + ',' + SECTION_ACTIVE_SEL + ' ' + SLIDE_ACTIVE_SEL) == null) {
          activeElement = preventAndFocusFirst(e);
        }
      } //no element if focused? Let's focus the first one of the section/slide
      else {
          preventAndFocusFirst(e);
        } //when reached the first or last focusable element of the section/slide
      //we prevent the tab action to keep it in the last focusable element


      if (!isShiftPressed && activeElement == focusableElements[focusableElements.length - 1] || isShiftPressed && activeElement == focusableElements[0]) {
        preventDefault(e);
      }
    }
    /**
    * Gets all the focusable elements inside the passed element.
    */


    function getFocusables(el) {
      return [].slice.call($(focusableElementsString, el)).filter(function (item) {
        return item.getAttribute('tabindex') !== '-1' //are also not hidden elements (or with hidden parents)
        && item.offsetParent !== null;
      });
    }
    /**
    * Determines whether the focus is outside fullpage.js sections/slides or not.
    */


    function isFocusOutside(e) {
      var allFocusables = getFocusables(document);
      var currentFocusIndex = allFocusables.indexOf(document.activeElement);
      var focusDestinationIndex = e.shiftKey ? currentFocusIndex - 1 : currentFocusIndex + 1;
      var focusDestination = allFocusables[focusDestinationIndex];
      var destinationItemSlide = nullOrSlide(closest(focusDestination, SLIDE_SEL));
      var destinationItemSection = nullOrSection(closest(focusDestination, SECTION_SEL));
      return !destinationItemSlide && !destinationItemSection;
    } //Scrolling horizontally when clicking on the slider controls.


    function slideArrowHandler() {
      /*jshint validthis:true */
      var section = closest(this, SECTION_SEL);
      /*jshint validthis:true */

      if (hasClass(this, SLIDES_PREV)) {
        if (isScrollAllowed.m.left) {
          moveSlideLeft(section);
        }
      } else {
        if (isScrollAllowed.m.right) {
          moveSlideRight(section);
        }
      }
    } // changing isWindowFocused to true on focus event


    function focusHandler() {
      isWindowFocused = true;
    } //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.


    function blurHandler() {
      isWindowFocused = false;
      controlPressed = false;
    } //Scrolls to the section when clicking the navigation bullet


    function sectionBulletHandler(e) {
      preventDefault(e);
      /*jshint validthis:true */

      var indexBullet = index(closest(this, SECTION_NAV_SEL + ' li'));
      scrollPage($(SECTION_SEL)[indexBullet]);
    } //Scrolls the slider to the given slide destination for the given section


    function slideBulletHandler(e) {
      preventDefault(e);
      /*jshint validthis:true */

      var slides = $(SLIDES_WRAPPER_SEL, closest(this, SECTION_SEL))[0];
      var destiny = $(SLIDE_SEL, slides)[index(closest(this, 'li'))];
      landscapeScroll(slides, destiny);
    } //Menu item handler when not using anchors or using lockAnchors:true


    function menuItemsHandler(e) {
      if ($(options.menu)[0] && (options.lockAnchors || !options.anchors.length)) {
        preventDefault(e);
        /*jshint validthis:true */

        moveTo(this.getAttribute('data-menuanchor'));
      }
    }
    /**
    * Keydown event
    */


    function onkeydown(e) {
      var shiftPressed = e.shiftKey;
      var activeElement = document.activeElement;
      var isMediaFocused = matches(activeElement, 'video') || matches(activeElement, 'audio'); //do nothing if we can not scroll or we are not using horizotnal key arrows.

      if (!canScroll && [37, 39].indexOf(e.keyCode) < 0) {
        return;
      }

      switch (e.keyCode) {
        //up
        case 38:
        case 33:
          if (isScrollAllowed.k.up) {
            moveSectionUp();
          }

          break;
        //down

        case 32:
          //spacebar
          if (shiftPressed && isScrollAllowed.k.up && !isMediaFocused) {
            moveSectionUp();
            break;
          }

        /* falls through */

        case 40:
        case 34:
          if (isScrollAllowed.k.down) {
            // space bar?
            if (e.keyCode !== 32 || !isMediaFocused) {
              moveSectionDown();
            }
          }

          break;
        //Home

        case 36:
          if (isScrollAllowed.k.up) {
            moveTo(1);
          }

          break;
        //End

        case 35:
          if (isScrollAllowed.k.down) {
            moveTo($(SECTION_SEL).length);
          }

          break;
        //left

        case 37:
          if (isScrollAllowed.k.left) {
            moveSlideLeft();
          }

          break;
        //right

        case 39:
          if (isScrollAllowed.k.right) {
            moveSlideRight();
          }

          break;

        default:
          return;
        // exit this handler for other keys
      }
    }
    /**
    * Detecting the direction of the mouse movement.
    * Used only for the middle button of the mouse.
    */


    var oldPageY = 0;

    function mouseMoveHandler(e) {
      if (!options.autoScrolling) {
        return;
      }

      if (canScroll) {
        // moving up
        if (e.pageY < oldPageY && isScrollAllowed.m.up) {
          moveSectionUp();
        } // moving down
        else if (e.pageY > oldPageY && isScrollAllowed.m.down) {
            moveSectionDown();
          }
      }

      oldPageY = e.pageY;
    }
    /**
    * Scrolls horizontal sliders.
    */


    function landscapeScroll(slides, destiny, direction) {
      var section = closest(slides, SECTION_SEL);
      var v = {
        slides: slides,
        destiny: destiny,
        direction: direction,
        destinyPos: {
          left: destiny.offsetLeft
        },
        slideIndex: index(destiny),
        section: section,
        sectionIndex: index(section, SECTION_SEL),
        anchorLink: section.getAttribute('data-anchor'),
        slidesNav: $(SLIDES_NAV_SEL, section)[0],
        slideAnchor: getAnchor(destiny),
        prevSlide: $(SLIDE_ACTIVE_SEL, section)[0],
        prevSlideIndex: index($(SLIDE_ACTIVE_SEL, section)[0]),
        //caching the value of isResizing at the momment the function is called
        //because it will be checked later inside a setTimeout and the value might change
        localIsResizing: isResizing
      };
      v.xMovement = getXmovement(v.prevSlideIndex, v.slideIndex);
      v.direction = v.direction ? v.direction : v.xMovement; //important!! Only do it when not resizing

      if (!v.localIsResizing) {
        //preventing from scrolling to the next/prev section when using scrollHorizontally
        canScroll = false;
      }

      if (options.onSlideLeave) {
        //if the site is not just resizing and readjusting the slides
        if (!v.localIsResizing && v.xMovement !== 'none') {
          if (isFunction(options.onSlideLeave)) {
            if (fireCallback('onSlideLeave', v) === false) {
              slideMoving = false;
              return;
            }
          }
        }
      }

      addClass(destiny, ACTIVE);
      removeClass(siblings(destiny), ACTIVE);

      if (!v.localIsResizing) {
        stopMedia(v.prevSlide);
        lazyLoad(destiny);
      }

      if (!options.loopHorizontal && options.controlArrows) {
        //hidding it for the fist slide, showing for the rest
        toggle($(SLIDES_ARROW_PREV_SEL, section), v.slideIndex !== 0); //hidding it for the last slide, showing for the rest

        toggle($(SLIDES_ARROW_NEXT_SEL, section), next(destiny) != null);
      } //only changing the URL if the slides are in the current section (not for resize re-adjusting)


      if (hasClass(section, ACTIVE) && !v.localIsResizing) {
        setState(v.slideIndex, v.slideAnchor, v.anchorLink, v.sectionIndex);
      }

      performHorizontalMove(slides, v, true);
    }

    function afterSlideLoads(v) {
      activeSlidesNavigation(v.slidesNav, v.slideIndex); //if the site is not just resizing and readjusting the slides

      if (!v.localIsResizing) {
        if (isFunction(options.afterSlideLoad)) {
          fireCallback('afterSlideLoad', v);
        } //needs to be inside the condition to prevent problems with continuousVertical and scrollHorizontally
        //and to prevent double scroll right after a windows resize


        canScroll = true;
        playMedia(v.destiny);
      } //letting them slide again


      slideMoving = false;
    }
    /**
    * Performs the horizontal movement. (CSS3 or jQuery)
    *
    * @param fireCallback {Bool} - determines whether or not to fire the callback
    */


    function performHorizontalMove(slides, v, fireCallback) {
      var destinyPos = v.destinyPos;

      if (options.css3) {
        var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';
        FP.test.translate3dH[v.sectionIndex] = translate3d;
        css(addAnimation($(SLIDES_CONTAINER_SEL, slides)), getTransforms(translate3d));
        afterSlideLoadsId = setTimeout(function () {
          if (fireCallback) {
            afterSlideLoads(v);
          }
        }, options.scrollingSpeed);
      } else {
        FP.test.left[v.sectionIndex] = Math.round(destinyPos.left);
        scrollTo(slides, Math.round(destinyPos.left), options.scrollingSpeed, function () {
          if (fireCallback) {
            afterSlideLoads(v);
          }
        });
      }
    }
    /**
    * Sets the state for the horizontal bullet navigations.
    */


    function activeSlidesNavigation(slidesNav, slideIndex) {
      if (options.slidesNavigation && slidesNav != null) {
        removeClass($(ACTIVE_SEL, slidesNav), ACTIVE);
        addClass($('a', $('li', slidesNav)[slideIndex]), ACTIVE);
      }
    }

    var previousHeight = windowsHeight;
    /*
    * Resize event handler.
    */

    function resizeHandler() {
      clearTimeout(resizeId); //in order to call the functions only when the resize is finished
      //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing    

      resizeId = setTimeout(function () {
        //issue #3336 
        //(some apps or browsers, like Chrome/Firefox for Mobile take time to report the real height)
        //so we check it 3 times with intervals in that case
        for (var i = 0; i < 4; i++) {
          resizeHandlerId = setTimeout(resizeActions, 200 * i);
        }
      }, 200);
    }
    /**
    * When resizing the site, we adjust the heights of the sections, slimScroll...
    */


    function resizeActions() {
      isResizing = true; //checking if it needs to get responsive

      responsive(); // rebuild immediately on touch devices

      if (isTouchDevice) {
        var activeElement = document.activeElement; //if the keyboard is NOT visible

        if (!matches(activeElement, 'textarea') && !matches(activeElement, 'input') && !matches(activeElement, 'select')) {
          var currentHeight = getWindowHeight(); //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)

          if (Math.abs(currentHeight - previousHeight) > 20 * Math.max(previousHeight, currentHeight) / 100) {
            reBuild(true);
            previousHeight = currentHeight;
          }
        }
      } else {
        adjustToNewViewport();
      }

      isResizing = false;
    }
    /**
    * Checks if the site needs to get responsive and disables autoScrolling if so.
    * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
    */


    function responsive() {
      var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity

      var heightLimit = options.responsiveHeight; //only calculating what we need. Remember its called on the resize event.

      var isBreakingPointWidth = widthLimit && window.innerWidth < widthLimit;
      var isBreakingPointHeight = heightLimit && window.innerHeight < heightLimit;

      if (widthLimit && heightLimit) {
        setResponsive(isBreakingPointWidth || isBreakingPointHeight);
      } else if (widthLimit) {
        setResponsive(isBreakingPointWidth);
      } else if (heightLimit) {
        setResponsive(isBreakingPointHeight);
      }
    }
    /**
    * Adds transition animations for the given element
    */


    function addAnimation(element) {
      var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;
      removeClass(element, NO_TRANSITION);
      return css(element, {
        '-webkit-transition': transition,
        'transition': transition
      });
    }
    /**
    * Remove transition animations for the given element
    */


    function removeAnimation(element) {
      return addClass(element, NO_TRANSITION);
    }
    /**
    * Activating the vertical navigation bullets according to the given slide name.
    */


    function activateNavDots(name, sectionIndex) {
      if (options.navigation && $(SECTION_NAV_SEL)[0] != null) {
        removeClass($(ACTIVE_SEL, $(SECTION_NAV_SEL)[0]), ACTIVE);

        if (name) {
          addClass($('a[href="#' + name + '"]', $(SECTION_NAV_SEL)[0]), ACTIVE);
        } else {
          addClass($('a', $('li', $(SECTION_NAV_SEL)[0])[sectionIndex]), ACTIVE);
        }
      }
    }
    /**
    * Activating the website main menu elements according to the given slide name.
    */


    function activateMenuElement(name) {
      $(options.menu).forEach(function (menu) {
        if (options.menu && menu != null) {
          removeClass($(ACTIVE_SEL, menu), ACTIVE);
          addClass($('[data-menuanchor="' + name + '"]', menu), ACTIVE);
        }
      });
    }
    /**
    * Sets to active the current menu and vertical nav items.
    */


    function activateMenuAndNav(anchor, index) {
      activateMenuElement(anchor);
      activateNavDots(anchor, index);
    }
    /**
    * Retuns `up` or `down` depending on the scrolling movement to reach its destination
    * from the current section.
    */


    function getYmovement(destiny) {
      var fromIndex = index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);
      var toIndex = index(destiny, SECTION_SEL);

      if (fromIndex == toIndex) {
        return 'none';
      }

      if (fromIndex > toIndex) {
        return 'up';
      }

      return 'down';
    }
    /**
    * Retuns `right` or `left` depending on the scrolling movement to reach its destination
    * from the current slide.
    */


    function getXmovement(fromIndex, toIndex) {
      if (fromIndex == toIndex) {
        return 'none';
      }

      if (fromIndex > toIndex) {
        return 'left';
      }

      return 'right';
    }

    function addTableClass(element) {
      //In case we are styling for the 2nd time as in with reponsiveSlides
      if (!hasClass(element, TABLE)) {
        var wrapper = document.createElement('div');
        wrapper.className = TABLE_CELL;
        wrapper.style.height = getTableHeight(element) + 'px';
        addClass(element, TABLE);
        wrapInner(element, wrapper);
      }
    }

    function getTableHeight(element) {
      var sectionHeight = windowsHeight;

      if (options.paddingTop || options.paddingBottom) {
        var section = element;

        if (!hasClass(section, SECTION)) {
          section = closest(element, SECTION_SEL);
        }

        var paddings = (0, _parseInt2.default)(getComputedStyle(section)['padding-top']) + (0, _parseInt2.default)(getComputedStyle(section)['padding-bottom']);
        sectionHeight = windowsHeight - paddings;
      }

      return sectionHeight;
    }
    /**
    * Adds a css3 transform property to the container class with or without animation depending on the animated param.
    */


    function transformContainer(translate3d, animated) {
      if (animated) {
        addAnimation(container);
      } else {
        removeAnimation(container);
      }

      css(container, getTransforms(translate3d));
      FP.test.translate3d = translate3d; //syncronously removing the class after the animation has been applied.

      setTimeout(function () {
        removeClass(container, NO_TRANSITION);
      }, 10);
    }
    /**
    * Gets a section by its anchor / index
    */


    function getSectionByAnchor(sectionAnchor) {
      var section = $(SECTION_SEL + '[data-anchor="' + sectionAnchor + '"]', container)[0];

      if (!section) {
        var sectionIndex = typeof sectionAnchor !== 'undefined' ? sectionAnchor - 1 : 0;
        section = $(SECTION_SEL)[sectionIndex];
      }

      return section;
    }
    /**
    * Gets a slide inside a given section by its anchor / index
    */


    function getSlideByAnchor(slideAnchor, section) {
      var slide = $(SLIDE_SEL + '[data-anchor="' + slideAnchor + '"]', section)[0];

      if (slide == null) {
        slideAnchor = typeof slideAnchor !== 'undefined' ? slideAnchor : 0;
        slide = $(SLIDE_SEL, section)[slideAnchor];
      }

      return slide;
    }
    /**
    * Scrolls to the given section and slide anchors
    */


    function scrollPageAndSlide(sectionAnchor, slideAnchor) {
      var section = getSectionByAnchor(sectionAnchor); //do nothing if there's no section with the given anchor name

      if (section == null) return;
      var slide = getSlideByAnchor(slideAnchor, section); //we need to scroll to the section and then to the slide

      if (getAnchor(section) !== lastScrolledDestiny && !hasClass(section, ACTIVE)) {
        scrollPage(section, function () {
          scrollSlider(slide);
        });
      } //if we were already in the section
      else {
          scrollSlider(slide);
        }
    }
    /**
    * Scrolls the slider to the given slide destination for the given section
    */


    function scrollSlider(slide) {
      if (slide != null) {
        landscapeScroll(closest(slide, SLIDES_WRAPPER_SEL), slide);
      }
    }
    /**
    * Creates a landscape navigation bar with dots for horizontal sliders.
    */


    function addSlidesNavigation(section, numSlides) {
      appendTo(createElementFromHTML('<div class="' + SLIDES_NAV + '"><ul></ul></div>'), section);
      var nav = $(SLIDES_NAV_SEL, section)[0]; //top or bottom

      addClass(nav, 'fp-' + options.slidesNavPosition);

      for (var i = 0; i < numSlides; i++) {
        var slide = $(SLIDE_SEL, section)[i];
        appendTo(createElementFromHTML('<li><a href="#"><span class="fp-sr-only">' + getBulletLinkName(i, 'Slide', slide) + '</span><span></span></a></li>'), $('ul', nav)[0]);
      } //centering it


      css(nav, {
        'margin-left': '-' + nav.innerWidth / 2 + 'px'
      });
      addClass($('a', $('li', nav)[0]), ACTIVE);
    }
    /**
    * Sets the state of the website depending on the active section/slide.
    * It changes the URL hash when needed and updates the body class.
    */


    function setState(slideIndex, slideAnchor, anchorLink, sectionIndex) {
      var sectionHash = '';

      if (options.anchors.length && !options.lockAnchors) {
        //isn't it the first slide?
        if (slideIndex) {
          if (anchorLink != null) {
            sectionHash = anchorLink;
          } //slide without anchor link? We take the index instead.


          if (slideAnchor == null) {
            slideAnchor = slideIndex;
          }

          lastScrolledSlide = slideAnchor;
          setUrlHash(sectionHash + '/' + slideAnchor); //first slide won't have slide anchor, just the section one
        } else if (slideIndex != null) {
          lastScrolledSlide = slideAnchor;
          setUrlHash(anchorLink);
        } //section without slides
        else {
            setUrlHash(anchorLink);
          }
      }

      setBodyClass();
    }
    /**
    * Sets the URL hash.
    */


    function setUrlHash(url) {
      if (options.recordHistory) {
        location.hash = url;
      } else {
        //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
        if (isTouchDevice || isTouch) {
          window.history.replaceState(undefined, undefined, '#' + url);
        } else {
          var baseUrl = window.location.href.split('#')[0];
          window.location.replace(baseUrl + '#' + url);
        }
      }
    }
    /**
    * Gets the anchor for the given slide / section. Its index will be used if there's none.
    */


    function getAnchor(element) {
      if (!element) {
        return null;
      }

      var anchor = element.getAttribute('data-anchor');
      var elementIndex = index(element); //Slide without anchor link? We take the index instead.

      if (anchor == null) {
        anchor = elementIndex;
      }

      return anchor;
    }
    /**
    * Sets a class for the body of the page depending on the active section / slide
    */


    function setBodyClass() {
      var section = $(SECTION_ACTIVE_SEL)[0];
      var slide = $(SLIDE_ACTIVE_SEL, section)[0];
      var sectionAnchor = getAnchor(section);
      var slideAnchor = getAnchor(slide);
      var text = String(sectionAnchor);

      if (slide) {
        text = text + '-' + slideAnchor;
      } //changing slash for dash to make it a valid CSS style


      text = text.replace('/', '-').replace('#', ''); //removing previous anchor classes

      var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
      $body.className = $body.className.replace(classRe, ''); //adding the current anchor

      addClass($body, VIEWING_PREFIX + '-' + text);
    }
    /**
    * Checks for translate3d support
    * @return boolean
    * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
    */


    function support3d() {
      var el = document.createElement('p'),
          has3d,
          transforms = {
        'webkitTransform': '-webkit-transform',
        'OTransform': '-o-transform',
        'msTransform': '-ms-transform',
        'MozTransform': '-moz-transform',
        'transform': 'transform'
      }; //preventing the style p:empty{display: none;} from returning the wrong result

      el.style.display = 'block'; // Add it to the body to get the computed style.

      document.body.insertBefore(el, null);

      for (var t in transforms) {
        if (el.style[t] !== undefined) {
          el.style[t] = 'translate3d(1px,1px,1px)';
          has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
      }

      document.body.removeChild(el);
      return has3d !== undefined && has3d.length > 0 && has3d !== 'none';
    }
    /**
    * Removes the auto scrolling action fired by the mouse wheel and trackpad.
    * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
    */


    function removeMouseWheelHandler() {
      if (document.addEventListener) {
        document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper

        document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox

        document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
      } else {
        document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
      }
    }
    /**
    * Adds the auto scrolling action for the mouse wheel and trackpad.
    * After this function is called, the mousewheel and trackpad movements will scroll through sections
    * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
    */


    function addMouseWheelHandler() {
      var prefix = '';

      var _addEventListener;

      if (window.addEventListener) {
        _addEventListener = "addEventListener";
      } else {
        _addEventListener = "attachEvent";
        prefix = 'on';
      } // detect available wheel event


      var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

      var passiveEvent = g_supportsPassive ? {
        passive: false
      } : false;

      if (support == 'DOMMouseScroll') {
        document[_addEventListener](prefix + 'MozMousePixelScroll', MouseWheelHandler, passiveEvent);
      } //handle MozMousePixelScroll in older Firefox
      else {
          document[_addEventListener](prefix + support, MouseWheelHandler, passiveEvent);
        }
    }
    /**
    * Binding the mousemove when the mouse's middle button is pressed
    */


    function addMiddleWheelHandler() {
      container.addEventListener('mousedown', mouseDownHandler);
      container.addEventListener('mouseup', mouseUpHandler);
    }
    /**
    * Unbinding the mousemove when the mouse's middle button is released
    */


    function removeMiddleWheelHandler() {
      container.removeEventListener('mousedown', mouseDownHandler);
      container.removeEventListener('mouseup', mouseUpHandler);
    }
    /**
    * Adds the possibility to auto scroll through sections on touch devices.
    */


    function addTouchHandler() {
      if (isTouchDevice || isTouch) {
        if (options.autoScrolling) {
          $body.removeEventListener(events.touchmove, preventBouncing, {
            passive: false
          });
          $body.addEventListener(events.touchmove, preventBouncing, {
            passive: false
          });
        }

        var touchWrapper = options.touchWrapper;
        touchWrapper.removeEventListener(events.touchstart, touchStartHandler);
        touchWrapper.removeEventListener(events.touchmove, touchMoveHandler, {
          passive: false
        });
        touchWrapper.addEventListener(events.touchstart, touchStartHandler);
        touchWrapper.addEventListener(events.touchmove, touchMoveHandler, {
          passive: false
        });
      }
    }
    /**
    * Removes the auto scrolling for touch devices.
    */


    function removeTouchHandler() {
      if (isTouchDevice || isTouch) {
        // normalScrollElements requires it off #2691
        if (options.autoScrolling) {
          $body.removeEventListener(events.touchmove, touchMoveHandler, {
            passive: false
          });
          $body.removeEventListener(events.touchmove, preventBouncing, {
            passive: false
          });
        }

        var touchWrapper = options.touchWrapper;
        touchWrapper.removeEventListener(events.touchstart, touchStartHandler);
        touchWrapper.removeEventListener(events.touchmove, touchMoveHandler, {
          passive: false
        });
      }
    }
    /*
    * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
    * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
    */


    function getMSPointer() {
      var pointer; //IE >= 11 & rest of browsers

      if (window.PointerEvent) {
        pointer = {
          down: 'pointerdown',
          move: 'pointermove'
        };
      } //IE < 11
      else {
          pointer = {
            down: 'MSPointerDown',
            move: 'MSPointerMove'
          };
        }

      return pointer;
    }
    /**
    * Gets the pageX and pageY properties depending on the browser.
    * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
    */


    function getEventsPage(e) {
      var events = [];
      events.y = typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY;
      events.x = typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX; //in touch devices with scrollBar:true, e.pageY is detected, but we have to deal with touch events. #1008

      if (isTouch && isReallyTouch(e) && options.scrollBar && typeof e.touches !== 'undefined') {
        events.y = e.touches[0].pageY;
        events.x = e.touches[0].pageX;
      }

      return events;
    }
    /**
    * Slides silently (with no animation) the active slider to the given slide.
    * @param noCallback {bool} true or defined -> no callbacks
    */


    function silentLandscapeScroll(activeSlide, noCallbacks) {
      setScrollingSpeed(0, 'internal');

      if (typeof noCallbacks !== 'undefined') {
        //preventing firing callbacks afterSlideLoad etc.
        isResizing = true;
      }

      landscapeScroll(closest(activeSlide, SLIDES_WRAPPER_SEL), activeSlide);

      if (typeof noCallbacks !== 'undefined') {
        isResizing = false;
      }

      setScrollingSpeed(originals.scrollingSpeed, 'internal');
    }
    /**
    * Scrolls silently (with no animation) the page to the given Y position.
    */


    function silentScroll(top) {
      // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
      // that's why we round it to 0.
      var roundedTop = Math.round(top);

      if (options.css3 && options.autoScrolling && !options.scrollBar) {
        var translate3d = 'translate3d(0px, -' + roundedTop + 'px, 0px)';
        transformContainer(translate3d, false);
      } else if (options.autoScrolling && !options.scrollBar) {
        css(container, {
          'top': -roundedTop + 'px'
        });
        FP.test.top = -roundedTop + 'px';
      } else {
        var scrollSettings = getScrollSettings(roundedTop);
        setScrolling(scrollSettings.element, scrollSettings.options);
      }
    }
    /**
    * Returns the cross-browser transform string.
    */


    function getTransforms(translate3d) {
      return {
        '-webkit-transform': translate3d,
        '-moz-transform': translate3d,
        '-ms-transform': translate3d,
        'transform': translate3d
      };
    }
    /**
    * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
    * @type  m (mouse) or k (keyboard)
    */


    function setIsScrollAllowed(value, direction, type) {
      //up, down, left, right
      if (direction !== 'all') {
        isScrollAllowed[type][direction] = value;
      } //all directions?
      else {
          (0, _keys.default)(isScrollAllowed[type]).forEach(function (key) {
            isScrollAllowed[type][key] = value;
          });
        }
    }
    /*
    * Destroys fullpage.js plugin events and optinally its html markup and styles
    */


    function destroy(all) {
      setAutoScrolling(false, 'internal');
      setAllowScrolling(true);
      setMouseHijack(false);
      setKeyboardScrolling(false);
      addClass(container, DESTROYED);
      [afterSlideLoadsId, afterSectionLoadsId, resizeId, scrollId, scrollId2, g_doubleCheckHeightId, resizeHandlerId, g_transitionLapseId].forEach(function (timeoutId) {
        clearTimeout(timeoutId);
      });
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('hashchange', hashChangeHandler);
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      ['click', 'touchstart'].forEach(function (eventName) {
        document.removeEventListener(eventName, delegatedEvents);
      });
      ['mouseenter', 'touchstart', 'mouseleave', 'touchend'].forEach(function (eventName) {
        document.removeEventListener(eventName, onMouseEnterOrLeave, true); //true is required!
      }); //lets make a mess!

      if (all) {
        destroyStructure();
      }
    }
    /*
    * Removes inline styles added by fullpage.js
    */


    function destroyStructure() {
      //reseting the `top` or `translate` properties to 0
      silentScroll(0); //loading all the lazy load content

      $('img[data-src], source[data-src], audio[data-src], iframe[data-src]', container).forEach(function (item) {
        setSrc(item, 'src');
      });
      $('img[data-srcset]').forEach(function (item) {
        setSrc(item, 'srcset');
      });
      remove($(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL + ', ' + SLIDES_ARROW_SEL)); //removing inline styles

      css($(SECTION_SEL), {
        'height': '',
        'background-color': '',
        'padding': ''
      });
      css($(SLIDE_SEL), {
        'width': ''
      });
      css(container, {
        'height': '',
        'position': '',
        '-ms-touch-action': '',
        'touch-action': ''
      });
      css($htmlBody, {
        'overflow': '',
        'height': ''
      }); // remove .fp-enabled class

      removeClass($html, ENABLED); // remove .fp-responsive class

      removeClass($body, RESPONSIVE); // remove all of the .fp-viewing- classes

      $body.className.split(/\s+/).forEach(function (className) {
        if (className.indexOf(VIEWING_PREFIX) === 0) {
          removeClass($body, className);
        }
      }); //removing added classes

      $(SECTION_SEL + ', ' + SLIDE_SEL).forEach(function (item) {
        if (options.scrollOverflowHandler && options.scrollOverflow) {
          options.scrollOverflowHandler.remove(item);
        }

        removeClass(item, TABLE + ' ' + ACTIVE + ' ' + COMPLETELY);
        var previousStyles = item.getAttribute('data-fp-styles');

        if (previousStyles) {
          item.setAttribute('style', item.getAttribute('data-fp-styles'));
        } //removing anchors if they were not set using the HTML markup


        if (hasClass(item, SECTION) && !g_initialAnchorsInDom) {
          item.removeAttribute('data-anchor');
        }
      }); //removing the applied transition from the fullpage wrapper

      removeAnimation(container); //Unwrapping content

      [TABLE_CELL_SEL, SLIDES_CONTAINER_SEL, SLIDES_WRAPPER_SEL].forEach(function (selector) {
        $(selector, container).forEach(function (item) {
          //unwrap not being use in case there's no child element inside and its just text
          unwrap(item);
        });
      }); //removing the applied transition from the fullpage wrapper

      css(container, {
        '-webkit-transition': 'none',
        'transition': 'none'
      }); //scrolling the page to the top with no animation

      window.scrollTo(0, 0); //removing selectors

      var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
      usedSelectors.forEach(function (item) {
        removeClass($('.' + item), item);
      });
    }
    /*
    * Sets the state for a variable with multiple states (original, and temporal)
    * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
    * This function is used to keep track of both states, the original and the temporal one.
    * If type is not 'internal', then we assume the user is globally changing the variable.
    */


    function setVariableState(variable, value, type) {
      options[variable] = value;

      if (type !== 'internal') {
        originals[variable] = value;
      }
    }
    /**
    * Displays warnings
    */


    function displayWarnings() {
      var l = options['li' + 'c' + 'enseK' + 'e' + 'y'];
      var msgStyle = 'font-size: 15px;background:yellow;';

      if (!isOK) {
        showError('error', 'Fullpage.js version 3 has changed its license to GPLv3 and it requires a `licenseKey` option. Read about it here:');
        showError('error', 'https://github.com/alvarotrigo/fullPage.js#options');
      } else if (l && l.length < 20) {
        console.warn('%c This website was made using fullPage.js slider. More info on the following website:', msgStyle);
        console.warn('%c https://alvarotrigo.com/fullPage/', msgStyle);
      }

      if (hasClass($html, ENABLED)) {
        showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
        return;
      } // Disable mutually exclusive settings


      if (options.continuousVertical && (options.loopTop || options.loopBottom)) {
        options.continuousVertical = false;
        showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
      }

      if (options.scrollOverflow && (options.scrollBar || !options.autoScrolling)) {
        showError('warn', 'Options scrollBar:true and autoScrolling:false are mutually exclusive with scrollOverflow:true. Sections with scrollOverflow might not work well in Firefox');
      }

      if (options.continuousVertical && (options.scrollBar || !options.autoScrolling)) {
        options.continuousVertical = false;
        showError('warn', 'Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
      }

      if (options.scrollOverflow && options.scrollOverflowHandler == null) {
        options.scrollOverflow = false;
        showError('error', 'The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.');
      } //using extensions? Wrong file!


      extensions.forEach(function (extension) {
        //is the option set to true?
        if (options[extension]) {
          showError('warn', 'fullpage.js extensions require fullpage.extensions.min.js file instead of the usual fullpage.js. Requested: ' + extension);
        }
      }); //anchors can not have the same value as any element ID or NAME

      options.anchors.forEach(function (name) {
        //case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
        var nameAttr = [].slice.call($('[name]')).filter(function (item) {
          return item.getAttribute('name') && item.getAttribute('name').toLowerCase() == name.toLowerCase();
        });
        var idAttr = [].slice.call($('[id]')).filter(function (item) {
          return item.getAttribute('id') && item.getAttribute('id').toLowerCase() == name.toLowerCase();
        });

        if (idAttr.length || nameAttr.length) {
          showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
          var propertyName = idAttr.length ? 'id' : 'name';

          if (idAttr.length || nameAttr.length) {
            showError('error', '"' + name + '" is is being used by another element `' + propertyName + '` property');
          }
        }
      });
    }
    /**
    * Getting the position of the element to scroll when using jQuery animations
    */


    function getScrolledPosition(element) {
      var position; //is not the window element and is a slide?

      if (element.self != window && hasClass(element, SLIDES_WRAPPER)) {
        position = element.scrollLeft;
      } else if (!options.autoScrolling || options.scrollBar) {
        position = getScrollTop();
      } else {
        position = element.offsetTop;
      } //gets the top property of the wrapper


      return position;
    }
    /**
    * Simulates the animated scrollTop of jQuery. Used when css3:false or scrollBar:true or autoScrolling:false
    * http://stackoverflow.com/a/16136789/1081396
    */


    function scrollTo(element, to, duration, callback) {
      var start = getScrolledPosition(element);
      var change = to - start;
      var currentTime = 0;
      var increment = 20;
      activeAnimation = true;

      var animateScroll = function animateScroll() {
        if (activeAnimation) {
          //in order to stope it from other function whenever we want
          var val = to;
          currentTime += increment;

          if (duration) {
            val = window.fp_easings[options.easing](currentTime, start, change, duration);
          }

          setScrolling(element, val);

          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          } else if (typeof callback !== 'undefined') {
            callback();
          }
        } else if (currentTime < duration) {
          callback();
        }
      };

      animateScroll();
    }
    /**
    * Scrolls the page / slider the given number of pixels.
    * It will do it one or another way dependiong on the library's config.
    */


    function setScrolling(element, val) {
      if (!options.autoScrolling || options.scrollBar || element.self != window && hasClass(element, SLIDES_WRAPPER)) {
        //scrolling horizontally through the slides?
        if (element.self != window && hasClass(element, SLIDES_WRAPPER)) {
          element.scrollLeft = val;
        } //vertical scroll
        else {
            element.scrollTo(0, val);
          }
      } else {
        element.style.top = val + 'px';
      }
    }
    /**
    * Gets the active slide.
    */


    function getActiveSlide() {
      var activeSlide = $(SLIDE_ACTIVE_SEL, $(SECTION_ACTIVE_SEL)[0])[0];
      return nullOrSlide(activeSlide);
    }
    /**
    * Gets the active section.
    */


    function getActiveSection() {
      return new Section($(SECTION_ACTIVE_SEL)[0]);
    }
    /**
    * Item. Slide or Section objects share the same properties.
    */


    function Item(el, selector) {
      this.anchor = el.getAttribute('data-anchor');
      this.item = el;
      this.index = index(el, selector);
      this.isLast = this.index === el.parentElement.querySelectorAll(selector).length - 1;
      this.isFirst = !this.index;
    }
    /**
    * Section object
    */


    function Section(el) {
      Item.call(this, el, SECTION_SEL);
    }
    /**
    * Slide object
    */


    function Slide(el) {
      Item.call(this, el, SLIDE_SEL);
    }

    return FP;
  } //end of $.fn.fullpage
  //utils

  /**
  * Shows a message in the console of the given type.
  */


  function showError(type, text) {
    window.console && window.console[type] && window.console[type]('fullPage: ' + text);
  }
  /**
  * Equivalent of jQuery function $().
  */


  function $(selector, context) {
    context = arguments.length > 1 ? context : document;
    return context ? context.querySelectorAll(selector) : null;
  }
  /**
  * Extends a given Object properties and its childs.
  */


  function deepExtend(out) {
    out = out || {};

    for (var i = 1, len = arguments.length; i < len; ++i) {
      var obj = arguments[i];

      if (!obj) {
        continue;
      }

      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        } // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/


        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          out[key] = deepExtend(out[key], obj[key]);
          continue;
        }

        out[key] = obj[key];
      }
    }

    return out;
  }
  /**
  * Checks if the passed element contains the passed class.
  */


  function hasClass(el, className) {
    if (el == null) {
      return false;
    }

    if (el.classList) {
      return el.classList.contains(className);
    }

    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
  /**
  * Gets the window height. Crossbrowser.
  */


  function getWindowHeight() {
    return 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
  }
  /**
  * Gets the window width.
  */


  function getWindowWidth() {
    return window.innerWidth;
  }
  /**
  * Set's the CSS properties for the passed item/s.
  * @param {NodeList|HTMLElement} items
  * @param {Object} props css properties and values.
  */


  function css(items, props) {
    items = getList(items);
    var key;

    for (key in props) {
      if (props.hasOwnProperty(key)) {
        if (key !== null) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.style[key] = props[key];
          }
        }
      }
    }

    return items;
  }
  /**
  * Generic function to get the previous or next element.
  */


  function until(item, selector, fn) {
    var sibling = item[fn];

    while (sibling && !matches(sibling, selector)) {
      sibling = sibling[fn];
    }

    return sibling;
  }
  /**
  * Gets the previous element to the passed element that matches the passed selector.
  */


  function prevUntil(item, selector) {
    return until(item, selector, 'previousElementSibling');
  }
  /**
  * Gets the next element to the passed element that matches the passed selector.
  */


  function nextUntil(item, selector) {
    return until(item, selector, 'nextElementSibling');
  }
  /**
  * Gets the previous element to the passed element.
  */


  function prev(item) {
    return item.previousElementSibling;
  }
  /**
  * Gets the next element to the passed element.
  */


  function next(item) {
    return item.nextElementSibling;
  }
  /**
  * Gets the last element from the passed list of elements.
  */


  function last(item) {
    return item[item.length - 1];
  }
  /**
  * Gets index from the passed element.
  * @param {String} selector is optional.
  */


  function index(item, selector) {
    item = isArrayOrList(item) ? item[0] : item;
    var children = selector != null ? $(selector, item.parentNode) : item.parentNode.childNodes;
    var num = 0;

    for (var i = 0; i < children.length; i++) {
      if (children[i] == item) return num;
      if (children[i].nodeType == 1) num++;
    }

    return -1;
  }
  /**
  * Gets an iterable element for the passed element/s
  */


  function getList(item) {
    return !isArrayOrList(item) ? [item] : item;
  }
  /**
  * Adds the display=none property for the passed element/s
  */


  function hide(el) {
    el = getList(el);

    for (var i = 0; i < el.length; i++) {
      el[i].style.display = 'none';
    }

    return el;
  }
  /**
  * Adds the display=block property for the passed element/s
  */


  function show(el) {
    el = getList(el);

    for (var i = 0; i < el.length; i++) {
      el[i].style.display = 'block';
    }

    return el;
  }
  /**
  * Checks if the passed element is an iterable element or not
  */


  function isArrayOrList(el) {
    return Object.prototype.toString.call(el) === '[object Array]' || Object.prototype.toString.call(el) === '[object NodeList]';
  }
  /**
  * Adds the passed class to the passed element/s
  */


  function addClass(el, className) {
    el = getList(el);

    for (var i = 0; i < el.length; i++) {
      var item = el[i];

      if (item.classList) {
        item.classList.add(className);
      } else {
        item.className += ' ' + className;
      }
    }

    return el;
  }
  /**
  * Removes the passed class to the passed element/s
  * @param {String} `className` can be multiple classnames separated by whitespace
  */


  function removeClass(el, className) {
    el = getList(el);
    var classNames = className.split(' ');

    for (var a = 0; a < classNames.length; a++) {
      className = classNames[a];

      for (var i = 0; i < el.length; i++) {
        var item = el[i];

        if (item.classList) {
          item.classList.remove(className);
        } else {
          item.className = item.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      }
    }

    return el;
  }
  /**
  * Appends the given element ot the given parent.
  */


  function appendTo(el, parent) {
    parent.appendChild(el);
  }
  /**
  Usage:
    var wrapper = document.createElement('div');
  wrapper.className = 'fp-slides';
  wrap($('.slide'), wrapper);
    https://jsfiddle.net/qwzc7oy3/15/ (vanilla)
  https://jsfiddle.net/oya6ndka/1/ (jquery equivalent)
  */


  function wrap(toWrap, wrapper, isWrapAll) {
    var newParent;
    wrapper = wrapper || document.createElement('div');

    for (var i = 0; i < toWrap.length; i++) {
      var item = toWrap[i];

      if (isWrapAll && !i || !isWrapAll) {
        newParent = wrapper.cloneNode(true);
        item.parentNode.insertBefore(newParent, item);
      }

      newParent.appendChild(item);
    }

    return toWrap;
  }
  /**
  Usage:
  var wrapper = document.createElement('div');
  wrapper.className = 'fp-slides';
  wrap($('.slide'), wrapper);
    https://jsfiddle.net/qwzc7oy3/27/ (vanilla)
  https://jsfiddle.net/oya6ndka/4/ (jquery equivalent)
  */


  function wrapAll(toWrap, wrapper) {
    wrap(toWrap, wrapper, true);
  }
  /**
  * Usage:
  * wrapInner(document.querySelector('#pepe'), '<div class="test">afdas</div>');
  * wrapInner(document.querySelector('#pepe'), element);
  *
  * https://jsfiddle.net/zexxz0tw/6/
  *
  * https://stackoverflow.com/a/21817590/1081396
  */


  function wrapInner(parent, wrapper) {
    if (typeof wrapper === "string") {
      wrapper = createElementFromHTML(wrapper);
    }

    parent.appendChild(wrapper);

    while (parent.firstChild !== wrapper) {
      wrapper.appendChild(parent.firstChild);
    }
  }
  /**
  * Usage:
  * unwrap(document.querySelector('#pepe'));
  * unwrap(element);
  *
  * https://jsfiddle.net/szjt0hxq/1/
  *
  */


  function unwrap(wrapper) {
    var wrapperContent = document.createDocumentFragment();

    while (wrapper.firstChild) {
      wrapperContent.appendChild(wrapper.firstChild);
    }

    wrapper.parentNode.replaceChild(wrapperContent, wrapper);
  }
  /**
  * http://stackoverflow.com/questions/22100853/dom-pure-javascript-solution-to-jquery-closest-implementation
  * Returns the element or `false` if there's none
  */


  function closest(el, selector) {
    if (el && el.nodeType === 1) {
      if (matches(el, selector)) {
        return el;
      }

      return closest(el.parentNode, selector);
    }

    return null;
  }
  /**
  * Places one element (rel) after another one or group of them (reference).
  * @param {HTMLElement} reference
  * @param {HTMLElement|NodeList|String} el
  * https://jsfiddle.net/9s97hhzv/1/
  */


  function after(reference, el) {
    insertBefore(reference, reference.nextSibling, el);
  }
  /**
  * Places one element (rel) before another one or group of them (reference).
  * @param {HTMLElement} reference
  * @param {HTMLElement|NodeList|String} el
  * https://jsfiddle.net/9s97hhzv/1/
  */


  function before(reference, el) {
    insertBefore(reference, reference, el);
  }
  /**
  * Based in https://stackoverflow.com/a/19316024/1081396
  * and https://stackoverflow.com/a/4793630/1081396
  */


  function insertBefore(reference, beforeElement, el) {
    if (!isArrayOrList(el)) {
      if (typeof el == 'string') {
        el = createElementFromHTML(el);
      }

      el = [el];
    }

    for (var i = 0; i < el.length; i++) {
      reference.parentNode.insertBefore(el[i], beforeElement);
    }
  } //http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll


  function getScrollTop() {
    var doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }
  /**
  * Gets the siblings of the passed element
  */


  function siblings(el) {
    return Array.prototype.filter.call(el.parentNode.children, function (child) {
      return child !== el;
    });
  } //for IE 9 ?


  function preventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }
  /**
  * Determines whether the passed item is of function type.
  */


  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }

    var type = Object.prototype.toString(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  /**
  * Trigger custom events
  */


  function trigger(el, eventName, data) {
    var event;
    data = typeof data === 'undefined' ? {} : data; // Native

    if (typeof window.CustomEvent === "function") {
      event = new CustomEvent(eventName, {
        detail: data
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, data);
    }

    el.dispatchEvent(event);
  }
  /**
  * Polyfill of .matches()
  */


  function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }
  /**
  * Toggles the visibility of the passed element el.
  */


  function toggle(el, value) {
    if (typeof value === "boolean") {
      for (var i = 0; i < el.length; i++) {
        el[i].style.display = value ? 'block' : 'none';
      }
    } //we don't use it in other way, so no else :)


    return el;
  }
  /**
  * Creates a HTMLElement from the passed HTML string.
  * https://stackoverflow.com/a/494348/1081396
  */


  function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim(); // Change this to div.childNodes to support multiple top-level nodes

    return div.firstChild;
  }
  /**
  * Removes the passed item/s from the DOM.
  */


  function remove(items) {
    items = getList(items);

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (item && item.parentElement) {
        item.parentNode.removeChild(item);
      }
    }
  }
  /**
  * Filters an array by the passed filter funtion.
  */


  function filter(el, filterFn) {
    Array.prototype.filter.call(el, filterFn);
  } //https://jsfiddle.net/w1rktecz/


  function untilAll(item, selector, fn) {
    var sibling = item[fn];
    var siblings = [];

    while (sibling) {
      if (matches(sibling, selector) || selector == null) {
        siblings.push(sibling);
      }

      sibling = sibling[fn];
    }

    return siblings;
  }
  /**
  * Gets all next elements matching the passed selector.
  */


  function nextAll(item, selector) {
    return untilAll(item, selector, 'nextElementSibling');
  }
  /**
  * Gets all previous elements matching the passed selector.
  */


  function prevAll(item, selector) {
    return untilAll(item, selector, 'previousElementSibling');
  }
  /**
  * Converts an object to an array.
  */


  function toArray(objectData) {
    return (0, _keys.default)(objectData).map(function (key) {
      return objectData[key];
    });
  }
  /**
  * forEach polyfill for IE
  * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Browser_Compatibility
  */


  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;

      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  } //utils are public, so we can use it wherever we want


  window.fp_utils = {
    $: $,
    deepExtend: deepExtend,
    hasClass: hasClass,
    getWindowHeight: getWindowHeight,
    css: css,
    until: until,
    prevUntil: prevUntil,
    nextUntil: nextUntil,
    prev: prev,
    next: next,
    last: last,
    index: index,
    getList: getList,
    hide: hide,
    show: show,
    isArrayOrList: isArrayOrList,
    addClass: addClass,
    removeClass: removeClass,
    appendTo: appendTo,
    wrap: wrap,
    wrapAll: wrapAll,
    wrapInner: wrapInner,
    unwrap: unwrap,
    closest: closest,
    after: after,
    before: before,
    insertBefore: insertBefore,
    getScrollTop: getScrollTop,
    siblings: siblings,
    preventDefault: preventDefault,
    isFunction: isFunction,
    trigger: trigger,
    matches: matches,
    toggle: toggle,
    createElementFromHTML: createElementFromHTML,
    remove: remove,
    filter: filter,
    untilAll: untilAll,
    nextAll: nextAll,
    prevAll: prevAll,
    showError: showError
  };
  return initialise;
});
/**
 * jQuery adapter for fullPage.js 3.0.0
 */


if (window.jQuery && window.fullpage) {
  (function ($, fullpage) {
    'use strict'; // No jQuery No Go

    if (!$ || !fullpage) {
      window.fp_utils.showError('error', 'jQuery is required to use the jQuery fullpage adapter!');
      return;
    }

    $.fn.fullpage = function (options) {
      options = $.extend({}, options, {
        '$': $
      });
      var instance = new fullpage(this[0], options);
    };
  })(window.jQuery, window.fullpage);
}
},{"@babel/runtime-corejs2/core-js/parse-int":"../node_modules/@babel/runtime-corejs2/core-js/parse-int.js","@babel/runtime-corejs2/core-js/object/keys":"../node_modules/@babel/runtime-corejs2/core-js/object/keys.js","@babel/runtime-corejs2/core-js/object/define-property":"../node_modules/@babel/runtime-corejs2/core-js/object/define-property.js","@babel/runtime-corejs2/helpers/typeof":"../node_modules/@babel/runtime-corejs2/helpers/typeof.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../src/sass/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./..\\..\\public\\images\\hero\\moonlight.svg":[["moonlight.3bff561e.svg","images/hero/moonlight.svg"],"images/hero/moonlight.svg"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/js/app.js":[function(require,module,exports) {
"use strict";

require("./menu.js");

var _parallax = _interopRequireDefault(require("./parallax.js"));

var _fullpage = _interopRequireDefault(require("../vendors/fullpage.js"));

require("../sass/style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import '../vendors/fullpage.min.css';
var moonParallax = new _parallax.default({
  wrapper: '.js-parallax-moon',
  layers: '.moon__layer'
}); // Initialize fullpage js

var fullPage = new _fullpage.default('#fullpage');
},{"./menu.js":"../src/js/menu.js","./parallax.js":"../src/js/parallax.js","../vendors/fullpage.js":"../src/vendors/fullpage.js","../sass/style.scss":"../src/sass/style.scss"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52053" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/js/app.js"], null)
//# sourceMappingURL=/app.5f3f5240.js.map