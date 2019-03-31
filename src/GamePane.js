import React, { Component } from 'react';
import * as P5 from 'p5';
import * as matter from 'matter-js';

export default class GamePane extends Component {

    state = {
        /** @type {P5} */
        p5: undefined,

        /** @type {Element} */
        canvas: undefined,

        /** @type {P5.Color} */
        cylinderColor: undefined,

        isRotate: true,
        vx: 1,
        vy: 1,
        vz: 1,
        velocity: 0.01,
    }

    componentWillMount() {
        const p5 = new P5(sk => this.sketch(sk), 'p5_sketch');
        this.setState({ p5 });
    }

    toggleRotate() {
        let { isRotate } = this.state;

        isRotate = !isRotate;

        this.setState({ isRotate });
    }

    changeColor(colorString) {
        console.log({ colorString });

        let { p5, cylinderColor } = this.state;
        cylinderColor = p5.color(colorString);
        this.setState({ cylinderColor });
    }

    /**
     * 
     * @param {P5} p5 
     */
    sketch(p5) {

        // #region p5 instance
        p5.setup = setup.bind(this);
        p5.draw = draw.bind(this);

        const {
            createCanvas, clear, push, fill, textSize, text, textFont, createVector,
            color, background, stroke, strokeWeight, loadFont, pop, rotate, cylinder,
        } = new Proxy(p5, { get: (obj, prop) => obj[prop].bind ? obj[prop].bind(obj) : () => obj[prop] });
        // #endregion

        // #region p5 global
        // let p5 = window;
        // this.state = {};
        // this.setState = newState => this.state = {...this.state, ...newState};
        // #endregion

        let font;
        let rotationPos;

        /** @param {KeyboardEvent} evt */
        p5.keyPressed = evt => {
            let { vx, vy, vz, velocity, isRotate } = this.state;
            console.log({ evt });

            let delta;

            switch (evt.key) {
                case 'ArrowDown':
                    delta = 0.01;
                    [vx, vy, vz] = [1, 0, 0];
                    break;
                case 'ArrowUp':
                    delta = -0.01;
                    [vx, vy, vz] = [-1, 0, 0]
                    break;
                case 'ArrowLeft':
                    delta = 0.01;
                    [vx, vy, vz] = [0, 1, vx + vz]
                    break;
                case 'ArrowRight':
                    delta = -0.01;
                    [vx, vy, vz] = [0, -1, vx - vz]
                    break;
                default:
                    isRotate = !isRotate;
                    delta = 0;
            }

            velocity += delta;

            this.setState({ vx, vy, vz, velocity, isRotate });
        }

        function setup() {
            let canvas = createCanvas(640, 480, p5.WEBGL).elt;
            canvas.id = 'canvas_sketch';

            let cylinderColor = color('blue');

            this.setState({ canvas, cylinderColor });


            stroke(200);
            strokeWeight(3);

            font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-ExtraLight.otf')
            rotationPos = 0;
        }


        function draw() {

            background('aqua');

            push();
            fill(50);
            textSize(32);
            textFont(font);
            text(`frame count: ${p5.frameCount}`, -300, -100)
            textSize(14);
            text(Object.keys(this.state).map(k => `${k}: ${this.state[k]}`).join(',\n'), -300, 100)
            pop();

            push();
            let { cylinderColor } = this.state;
            fill(cylinderColor);
            stroke('black');

            let { isRotate, vx, vy, vz, velocity } = this.state;
            if (isRotate) rotationPos++;

            rotate(rotationPos * velocity, createVector(vx, vy, vz));

            cylinder();
            pop();

            this.setState({ p5, rotationPos })
        }
    }

    render() {

        return (
            <div>
                <p>this is GamePane</p>
                <div id="p5_sketch" />
                <p>this is the bottom of the game {this.state.rotationPos}</p>
                <button onClick={_ => this.toggleRotate()}>toggle rotate</button>
                <div>
                    <input type="text" placeholder="Color..." onChange={evt => this.setState({ cylinderColorString: evt.target.value })} />
                    <button onClick={_ => this.changeColor(this.state.cylinderColorString)}>change color</button>
                </div>
            </div>
        );
    }
}