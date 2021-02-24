import './menu.js';
import Parallax from  './parallax.js';
import fullpage from '../vendors/fullpage.js';
import { revealImage, slideFromLeft } from './animations.js';


import '../sass/style.scss';
// import '../vendors/fullpage.min.css';


const SCROLL_SPEED = 1200;
let prevAnimation;

const moonParallax = new Parallax({
    wrapper: '.js-parallax-moon',
    layers: '.moon__layer',
});

// Initialize fullpage js
const fullPage = new fullpage('#fullpage', {
    scrollingSpeed: SCROLL_SPEED,
    recordHistory: false,
    easing: 'easeIn',
    onLeave(origin, destination, direction) {
    	if (prevAnimation) {
    		setTimeout(() => {
    			prevAnimation.seek(0)
    		},SCROLL_SPEED);
    	}
    },

    afterLoad(origin, destination, direction) {
        const section = destination.item;
        const imageElement = section.querySelector('.image--over');
        const elementsToSlide = section.querySelectorAll('.js-slide-left');
        if (imageElement) {
            prevAnimation = revealImage(imageElement, '.image__cover', elementsToSlide);
        }
        // if (elementsToSlide) {
        //     slideFromLeft(elementsToSlide);
        // }
    }
});