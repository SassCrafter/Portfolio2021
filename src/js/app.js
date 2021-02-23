import './menu.js';
import Parallax from  './parallax.js';
 import fullpage from '../vendors/fullpage.js'


import '../sass/style.scss';
// import '../vendors/fullpage.min.css';


const moonParallax = new Parallax({
    wrapper: '.js-parallax-moon',
    layers: '.moon__layer',
});

// Initialize fullpage js
const fullPage = new fullpage('#fullpage');