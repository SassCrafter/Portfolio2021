import {elementsAddClasses} from './utils';
export default class {
    constructor() {
        this.maxWidth = 60;
        this.maxHeight = 60;
        this.hoverClass = 'hoverable';
        this.hoverElements = [];
        this.body = document.body;
        this.render();
        this.init();
    }

    

    init() {
        
        // this.maxWidth = this.width * 2;
        // this.maxHeight = this.height * 2;
        this.body.addEventListener('mousemove', this.followHandler.bind(this));
        this.setHoverableClass();
        this.hoverElements.forEach(el => {
            el.addEventListener('mouseenter', this.enterHandler.bind(this));
            el.addEventListener('mouseleave', this.leaveHandler.bind(this));
        })
    }

    enterHandler() {
        if (this.follower.offsetWidth <= this.maxWidth) {
            this.follower.style.width = this.maxWidth + 'px';
            this.follower.style.height = this.maxHeight + 'px';
        }
    }

    leaveHandler() {
        this.follower.style.width = this.maxWidth / 2  + 'px';
        this.follower.style.height = this.maxHeight / 2 + 'px';
    }


    setHoverableClass() {
        this.hoverElements.push(...Array.from(document.querySelectorAll('.hoverable')));
        this.hoverElements.push(...Array.from(document.querySelectorAll('a')));
        this.hoverElements.push(...Array.from(document.querySelectorAll('button')));
        this.hoverElements.push(...Array.from(document.querySelectorAll('input')));
        this.hoverElements.push(...Array.from(document.querySelectorAll('.btn')));
       console.log(this.hoverElements.filter(el => !el.classList.contains('hoverable')))
        elementsAddClasses(this.hoverElements.filter((el) => {
            return !el.classList.contains('hoverable')
        }), this.hoverClass);
    }




    followHandler(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.width = this.follower.offsetWidth;
        this.height = this.follower.offsetHeight;
        const translateX = this.x - this.width / 2;
        const translateY = this.y - this.height / 2;
        this.follower.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    render() {
        this.follower = document.createElement('div');
        this.follower.className = 'follower';
        this.body.appendChild(this.follower);
    }

    destroy() {
        this.follower.remove();
    }
} 