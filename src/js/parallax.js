export default class {
    constructor(options) {
        this.options = options || {};
        this.nameSpaces = {
            wrapper: this.options.wrapper || '.parallax',
            layers: this.options.layers || '.parallax__layer',
            depth: this.options.depth || 'data-parallax-depth',

        }
        this.init();
    }


    init() {
        this.parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
        this.parallaxWrappers.forEach(wrapper => {
            wrapper.addEventListener('mousemove', (e) => {
                this.moveHandler(e, wrapper);
            });
            const layers = wrapper.querySelectorAll(this.nameSpaces.layers);
        });
    }

    moveHandler(e, wrapper) {
       // console.log(this);
        const x = e.clientX;
        const y = e.clientY;
        //console.log(x, y);
        const layers = wrapper.querySelectorAll(this.nameSpaces.layers);
        layers.forEach((layer) => {
            const depth = layer.getAttribute(this.nameSpaces.depth);
            const itemX = x / (+depth * 1000);
            const itemY = y / (+depth * 1000);
            console.log(`x: ${x}, y: ${y}, depth: ${+depth}`);
            layer.style.transform = `translate(${itemX}%, ${itemY}%)`;
        });
    }
}