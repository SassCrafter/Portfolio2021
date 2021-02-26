import './menu.js';
import Parallax from  './parallax.js';
import fullpage from '../vendors/fullpage.js';
import barba from '@barba/core';
import { closeMenu, revealImage, slideFromLeft, leavePage, slideFromRight, imageToSection, pageTransition } from './animations.js';
import { removeClasses } from './utils.js';



import '../sass/style.scss';


const SCROLL_SPEED = 1200;
let fullpageVar;

// Initialize parallax
let moonParallax = new Parallax({
    wrapper: '.js-parallax-moon',
    layers: '.moon__layer',
});

// Initialize fullpage js
function fullpageInit() {
    fullpageVar = new fullpage('#fullpage', {
        anchors: ['hero', 'work'],
        menu: '#fullpage-menu',
        scrollingSpeed: SCROLL_SPEED,
        recordHistory: false,
        easing: 'easeIn',
        onLeave(origin, destination, direction) {
            const section = origin.item;
            console.log('Leave', origin, destination, section.scAnimation);

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

fullpageInit();


const links = document.querySelectorAll('a[href]');
const cbk = function(e) {
 if(e.currentTarget.href === window.location.href) {
 	console.log("SAME");	
   e.preventDefault();
   e.stopPropagation();
   pageTransition('.curtain');
   setTimeout(() => {
   	document.querySelector('.menu-icon').click();
   }, 175)
 }
};

for(let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', cbk);
}

barba.init({
	transitions: [
        {
            name: 'default',
            leave(data) {
                const { current } = data;
                // Destroy fullpage instance;
                if (fullpageVar) {
                    fullpageVar.destroy('all');
                    fullpageVar = null;
                }
                const menuBtn = document.querySelector('.menu-icon');
                if (menuBtn.classList.contains('open')) {
                    setTimeout(() => {
                        menuBtn.click();
                    }, 500);
                }

                pageTransition('.curtain');
            },

            enter({next}) {
                if (next.namespace === 'home') {
                    fullpageInit();
                     moonParallax = new Parallax({
                        wrapper: '.js-parallax-moon',
                        layers: '.moon__layer',
                     });
                }
            }
        },
        // {
        //     name: 'imageToSection',
        //     from: {
        //         custom: ({trigger}) => {
        //             return trigger.closest('.fullpage__slide') &&  trigger.closest('.fullpage__slide').classList.contains('imageToSection');
        //         }
        //     },
        //     leave({trigger}) {
        //         let imageEl;
        //         if (trigger.classList.contains('image')) {
        //             imageEl = trigger;
        //         }
        //         console.log(imageEl);
        //         if (imageEL) {
        //             console.log('YEP')
        //             //imageToSection(imageEl);
        //         }
        //     }
        // }
    ]
});
