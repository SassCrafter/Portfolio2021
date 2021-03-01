import './menu.js';
import { checkIfMenuOpen } from './menu.js';
import Parallax from  './parallax.js';
import fullpage from '../vendors/fullpage.js';
import barba from '@barba/core';
import { closeMenu, revealImage, slideFromLeft, leavePage, enterPage, slideFromRight, imageToSection, pageTransition } from './animations.js';
import CursorFollower from './CursorFollower';


import '../sass/style.scss';


const SCROLL_SPEED = 1200;
let fullpageVar;

// Initialize parallax
let moonParallax = new Parallax({
    wrapper: '.js-parallax-moon',
    layers: '.moon__layer',
});

let follower = new CursorFollower();

// Initialize fullpage js
function fullpageInit() {
    fullpageVar = new fullpage('#fullpage', {
        anchors: ['hero', 'work', 'about', 'contact'],
        menu: '#fullpage-menu',
        scrollingSpeed: SCROLL_SPEED,
        recordHistory: false,
        easing: 'easeIn',
        onLeave(origin, destination, direction) {
            const section = origin.item;

            // Reset animation on leaving page after scrool speed
            if (section.scAnimation) {
                setTimeout(() => {
                    section.scAnimation.forEach(anim => {
                        anim.seek(0);
                    });
                },SCROLL_SPEED);
            }

        },

        afterLoad(origin, destination, direction) {
            const section = destination.item;
            // If section doesn't have custom animation property (array) than add one else play all of them
            if (!section.scAnimation) {
                if (destination.index === 0) {
                    section.scAnimation = [slideFromLeft(document.querySelector('.hero__text')), slideFromRight(document.querySelectorAll('.moon .moon__layer'))];
                } else {
                    const imageElement = section.querySelector('.image--over');
                    const elementsToSlide = section.querySelectorAll('.js-slide-left');
                    if (imageElement) {
                        section.scAnimation = [revealImage(imageElement, '.image__cover', elementsToSlide)];
                    }
                }
            }else {
                console.log('Play')
                section.scAnimation.forEach(anim => {
                    anim.play();
                });
            }
        }
    });
}

// If user goes to the same page than prevent default and just show transition
const links = document.querySelectorAll('a[href]');
const cbk = function(e) {
    // Remove fullpage menu hashes from page href
 if(e.currentTarget.href === window.location.href.split('#')[0]) {
   e.preventDefault();
   e.stopPropagation();
   pageTransition('.curtain');
   if (checkIfMenuOpen()) {
    setTimeout(() => {
        document.querySelector('.menu-icon').click();
    }, 500);
   }
 }
};

for(let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', cbk);
}

barba.init({
	transitions: [
        {
            name: 'default',
            leave({current}) {
                const done = this.async();
                
                const menuBtn = document.querySelector('.menu-icon');
                if (menuBtn.classList.contains('open')) {
                    console.log("Contains")
                    setTimeout(() => {
                        menuBtn.click();
                    }, 500);
                }

                pageTransition('.curtain', function() {
                    done();
                    // Destroy fullpage instance;
                    if (fullpageVar && (fullpageVar !== null && Object.keys(fullpageVar).length > 0)) {
                        console.log('fullpageVar = ', fullpageVar);
                        fullpageVar.destroy('all');
                        fullpageVar = null;
                    }
                    follower.destroy();

                });
            },

            enter({next}) {
                if (next.namespace === 'home') {
                    fullpageInit();
                     moonParallax = new Parallax({
                        wrapper: '.js-parallax-moon',
                        layers: '.moon__layer',
                     });
                }
                follower = new CursorFollower();
            }
        },
    ]
});


fullpageInit();