import './menu.js';
import Parallax from  './parallax.js';
import fullpage from '../vendors/fullpage.js';
import { revealImage, slideFromLeft } from './animations.js';


import '../sass/style.scss';
// import '../vendors/fullpage.min.css';


const moonParallax = new Parallax({
    wrapper: '.js-parallax-moon',
    layers: '.moon__layer',
});

// Initialize fullpage js
const fullPage = new fullpage('#fullpage', {
    scrollingSpeed: 1200,
    recordHistory: false,
    easing: 'easeIn',
    onLeave(origin, destination, direction) {
        // const section = destination.item;
        // const imageElement = section.querySelector('.image--over');
        // const elementsToSlide = section.querySelectorAll('.js-slide-left');
        // if (imageElement) {
        //     const covers = imageElement.querySelectorAll('.image__cover');
        //     covers.forEach(cover => {
        //         cover.style.transform = 'translateX(0)';
        //     });
        // }
        // if (elementsToSlide) {
        //     elementsToSlide.forEach(el => {
        //         el.style.transform = 'translateX(-100%)';
        //     })
        // }
    },

    afterLoad(origin, destination, direction) {
        const section = destination.item;
        const imageElement = section.querySelector('.image--over');
        const elementsToSlide = section.querySelectorAll('.js-slide-left');
        if (imageElement) {
            revealImage(imageElement, '.image__cover', elementsToSlide);
        }
        // if (elementsToSlide) {
        //     slideFromLeft(elementsToSlide);
        // }
    }
});