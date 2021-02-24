export default class {
    constructor(options) {
        this.layers = [];
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
            this.layers.push(...Array.from(wrapper.querySelectorAll(this.nameSpaces.layers)));
        });
    }

    moveHandler(e, wrapper) {
        const x = e.clientX;
        const y = e.clientY;
        this.layers.forEach((layer) => {
            console.log(layer);
            const rect = layer.getBoundingClientRect();
            const { top, left } = rect;
            //console.log(top, left);
            const depth = layer.getAttribute(this.nameSpaces.depth);
            const itemX = x / (+depth * 300);
            const itemY = y / (+depth * 300);
            //console.log(`x: ${x}, y: ${y}, depth: ${+depth}`);
            layer.style.transform = `translate(${itemX}%, ${itemY}%)`;
        });
    }
}