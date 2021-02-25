import './menu.js';
import Parallax from  './parallax.js';
import fullpage from '../vendors/fullpage.js';
import barba from '@barba/core';
import { revealImage, slideFromLeft, leavePage, slideFromRight, enterPage, pageTransition } from './animations.js';



import '../sass/style.scss';


const SCROLL_SPEED = 1200;
let prevAnimation;
let fullpageVar;

// Initialize parallax
let moonParallax = new Parallax({
    wrapper: '.js-parallax-moon',
    layers: '.moon__layer',
});

// Initialize fullpage js
function fullpageInit() {
    fullpageVar = new fullpage('#fullpage', {
        scrollingSpeed: SCROLL_SPEED,
        recordHistory: false,
        easing: 'easeIn',
        onLeave(origin, destination, direction) {
            const section = origin.item;
            console.log('Leave', origin, destination, section.scAnimation);

            // Reset animation on leaving page after scrool speed
            if (section.scAnimation) {
                setTimeout(() => {
                    //console.log('Seek')
                    section.scAnimation.forEach(anim => {
                        anim.seek(0);
                    });
                },SCROLL_SPEED);
            }

        },

        afterLoad(origin, destination, direction) {
            const section = destination.item;
            //console.log('Load', destination.index);
            //console.dir(section);
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

function delay(n) {
	n = n || 2000;
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, n);
	});
}

//Initialize Barba js
// barba.init({
// 	transitions: [
//         {
//             name: 'default',
//             sync: true,
//             leave() {
//                 if (fullpageVar) {
//                     fullpageVar.destroy('all');
//                 }
//                 console.log("LEAVING THE PAGE");
//                 document.querySelector('.menu-icon').click();
//                 leavePage(document.querySelector('.curtain'));
//             },
//             enter() {
//                 fullpageInit();
//                 enterPage(document.querySelector('.curtain'));
//             },
//             // once() {
//             //     fullpageInit();
//             //     leavePage(document.querySelector('.curtain'));
//             //     enterPage(document.querySelector('.curtain'))
//             // }
//         },
//     ]
// });

// barba.init({
// 	sync: true,

// 	transitions: [{

// 		async leave(data) {
// 			console.log("LEAVE THE PAGE")
// 			if (fullpageVar) {
//                 fullpageVar.destroy('all');
//             }
//             document.querySelector('.menu-icon').click();
// 			const done = this.async();

// 			pageTransition('.curtain');
// 			await delay(1500);
// 			done();
// 		},

// 		async enter(data) {
// 			fullpageInit();
// 		}
		
// 	}]
// })

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
            sync: true,
            leave() {
                if (fullpageVar) {
                    fullpageVar.destroy('all');
                }
                console.log("LEAVING THE PAGE");
                pageTransition('.curtain');
            },
            enter() {
            	document.querySelector('.menu-icon').click();
                fullpageInit();
                moonParallax = new Parallax({
				    wrapper: '.js-parallax-moon',
				    layers: '.moon__layer',
				});
            },
        },
    ]
});