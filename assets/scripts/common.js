//Setting up parameters
const body = document.body;
const select = (elem) => document.querySelector(elem);
const selectAll = (elem) => document.querySelectorAll(elem);
const selectWith = (parent, elem) => parent.querySelector(elem);
const selectAllWith = (parent, elem) => parent.querySelectorAll(elem);

var scroller;
var evenBars = [];
var oddBars = [];
const durations = [.8, .5];
const barsColor = getComputedStyle(select(':root')).getPropertyValue('--red');

//Disables all buttons in the page
const disableBtns = (condition) => selectAll('button').forEach(elem => (condition) ? elem.disabled = true : elem.disabled = false);


//Register Scrolltrigger
gsap.registerPlugin(ScrollTrigger);

//Setup document for use
class SetupDocument {
    constructor() {
        this.loadingScreen = select('.loading-screen');

        //Initialize page setup
        this.init();
    }

    init() {
        //Document parameters
        this.bars = 5;
        this.stagger = 0.2;

        //Run document setup
        this.setupDependencies();
        this.setupBars(this.bars);
        this.constructor.setupText();
        this.setupNavbar();
        this.scrollAnimations();
    }

    setupDependencies() {
        //Add smooth scroll
        scroller = new LocomotiveScroll({
            el: select('[data-scroll-container]'),
            smooth: true,
            lenisOptions: {
                duration: 1.6
            }
        });

        //Add parallax to images
        selectAll(".parallax img").forEach(elem => {
            elem.setAttribute('data-scroll', '');
            elem.setAttribute('data-scroll-speed', '-0.15');
            elem.setAttribute('data-scroll-position', 'top');
        })

        //Set menu position
        // gsap.set('.navbar-menu', { xPercent: 110 })
    }

    setupBars(num = 1) {
        for (let i = 0; i < num; i++) {
            let div = document.createElement("div");

            (i % 2) ? evenBars.push(div) : oddBars.push(div);

            div.classList.add("bars");
            this.loadingScreen.append(div);
        }
    }

    static setupText(parent = false) {
        //Add txt-anim to headers
        selectAll('.head h1, .head span, .options span').forEach(elem => {
            elem.classList.add("txt-anim");
        })

        const text = (parent) ? selectAllWith(parent, '.txt-anim') : selectAll(".txt-anim");

        //attach spans to the texts then give it the same color as the text
        text.forEach(elem => {
            const color = getComputedStyle(elem).getPropertyValue("color");
            const span = document.createElement("span");

            span.style.backgroundColor = `${(color == "") ? 'black' : color}`;
            gsap.set(span, { xPercent: -110, color: 'transparent' })

            elem.classList.add("transparent")
            elem.append(span);
        })
    }

    setupNavbar() {
        selectAll('.navbar nav .txt-anim, .menu-close').forEach(elem => {
            elem.classList.remove('transparent');

            elem.addEventListener("mouseenter", function () {
                const span = selectWith(this, 'span');

                this.style.color = 'black';

                gsap.to(span, { xPercent: 0 })
            })

            elem.addEventListener("mouseleave", function () {
                const tl = gsap.timeline();
                const span = selectWith(this, 'span');

                this.style.color = 'white';

                tl.to(span, { xPercent: 110 })
                    .set(span, { xPercent: -110 })
            })
        })

        selectAll('.navbar li button').forEach(elem => {
            elem.addEventListener("click", function () {
                disableBtns(true);
                SetupDocument.changeBarsColor('white');

                const tl = gsap.timeline();
                const barsOption = {
                    set: 100,
                    type: 'one',
                }

                const barsAnim = barsAnimation(barsOption);

                tl.to('.navbar li button', { scale: 0 })
                    .set('.navbar-menu', { xPercent: 0 })
                    .add(barsAnim)
                    .to('.menu-close', { scale: 1 })
                    .call(() => disableBtns())

                tl.play();
            })
        })

        select('.menu-close').addEventListener("click", function () {
            disableBtns(true);

            const tl = gsap.timeline();
            const barsOption = {
                type: 'one',
                direction: -100
            }

            const barsAnim = barsAnimation(barsOption);

            tl.to(this, { scale: 0 })
                .set('.navbar-menu', { xPercent: 110 })
                .add(barsAnim)
                .to('.navbar li button', { scale: 1 })
                .call(() => disableBtns())

            tl.play();
        })
    }

    scrollAnimations() {
        selectAll('.head, .options').forEach(elem => {
            const textTl = gsap.timeline();
            const spans = selectAllWith(elem, '.txt-anim span');

            textTl.to(spans, { duration: 0.5, xPercent: 0, stagger: this.stagger })
                .call(() => spans.forEach((e) => e.parentNode.classList.remove('transparent')))
                .to(spans, { duration: 0.5, xPercent: 110, stagger: this.stagger })

            ScrollTrigger.create({
                trigger: elem,
                animation: textTl,
                start: 'top 80%',
            })
        })
    }

    static changeBarsColor(color = undefined) {
        if (!color) color = barsColor;
        selectAll('.bars').forEach(elem => elem.style.backgroundColor = color);
    }
}

//Setup document
new SetupDocument();

class Alert {
    constructor(params = {}) {
        Object.assign(this, params);
        this.alertBox = select('.alert-box')

        //Initialize the alert
        this.init();
    }

    init() {
        const tl = gsap.timeline();

        //Create new alert
        this.createAlert();

        //Setup newly added texts
        SetupDocument.setupText(this.newAlert);

        //Transition new alert
        const closeAnim = this.constructor.closeAlert();
        const showAnim = this.showAlert();


        //Add them to the timeline
        tl.add(closeAnim)
            .add(showAnim);

        //Play the animation
        tl.play();
    }

    createAlert() {
        //Create the elements
        const alert = document.createElement('div');
        const alertClose = document.createElement('button');
        const alertTextBox = document.createElement('div');
        const alertImgBox = document.createElement('div');

        //Create their contents
        let alertCloseContent = '<i class="fa-solid fa-xmark"></i>';

        let alertTextBoxContent =
            `<div class="alert-text">
                <h5 class="txt-anim">${this?.head || ''}</h5>
                <br>
                <h6 class="txt-anim">${this?.msg || ''}</h6>

                <div class="alert-action">
                    ${this.getAction({
                text: this?.text,
                type: this?.type,
                url: this?.url
            }).join(" ")}
                </div>
            </div>`

        let alertImgBoxContent =
            `<div class="alert-img">
                <img src="/images/avatars/${this?.image || 'default.png'}" alt="alert" draggable="false">
            </div>`

        //Attach their classes
        alert.classList.add('alert');
        alertClose.classList.add('alert-close');
        alertTextBox.classList.add('alert-text-box');
        alertImgBox.classList.add('alert-img-box');

        //Attach theit contents
        alertClose.addEventListener("click", Alert.closeAlert);
        alertClose.innerHTML = alertCloseContent;
        alertTextBox.innerHTML = alertTextBoxContent;
        alertImgBox.innerHTML = alertImgBoxContent;

        alert.append(alertClose, alertTextBox, alertImgBox);

        //Assign the new alert
        this.newAlert = alert;
    }

    getAction(params = {}) {
        if (params?.type == 'none') return [];

        const text = (params?.text) ? params?.text : 'No message';
        const type = (params?.type == 'btn') ? true : false;
        const url = (params?.url) ? params.url : undefined;
        const action = [];

        let texts = 0;
        let isArray = true;

        (Array.isArray(params?.text)) ? texts = params?.text.length : isArray = false;

        if (type) {
            if (isArray) for (let i = 0; i < texts; i++) action.push(`<button data-alert-btn>${text[i]}</button>`);
            else action.push(`<button data-alert-btn>${text}</button>`);
        } else {
            if (isArray) for (let i = 0; i < texts; i++) action.push((url) ? `<a href="${url}">${text[i]}</a>` : `<a>${text[i]} (No location)</a>`);
            else action.push((url) ? `<a href="${url}">${text}</a>` : `<a>${text} (No location)</a>`);
        }

        return action;
    }

    static closeAlert() {
        const currentAlert = select('.alert');
        const tl = gsap.timeline({
            defaults: {
                duration: durations[1]
            }
        });

        tl.to(currentAlert, { duration: durations[0], yPercent: 120, opacity: 0, ease: Back.easeIn })
            .call(() => currentAlert.remove());

        return tl;
    }

    showAlert() {
        const tl = gsap.timeline({
            defaults: {
                duration: durations[1]
            }
        });

        const img = selectWith(this.newAlert, 'img');
        const span = selectAllWith(this.newAlert, '.txt-anim span');

        //Attach alert to DOM
        tl.call(() => this.alertBox.append(this.newAlert))
            .set(img, { opacity: 0 })
            .to(this.newAlert, { duration: durations[0], opacity: 1, y: 0, ease: Back.easeOut })
            .to(span, { xPercent: 0, stagger: 0.1 })
            .to(img, { opacity: 1 }, '<')
            .call(() => selectAllWith(this.newAlert, '.txt-anim').forEach(e => e.classList.remove("transparent")))
            .to(span, { xPercent: 110, stagger: 0.2 })

        return tl;
    }
}

//Animation functions
//Syntax: { set, start(t/f), type, direction, skip(t/f) }
function barsAnimation(params = {}) {
    const tl = gsap.timeline();

    //Set original position of the bars if needed
    if (params?.set) {
        const position = params?.set || 0;

        tl.set('.bars', { xPercent: position })
    }

    //Check if start animation is needed
    if (params?.start) {
        tl.call(() => select('.loading-screen').classList.remove('on'))
            .to('.custom-loader', { duration: (params?.skip) ? durations[0] : 0, opacity: 0, delay: (params?.skip) ? 1 : 0 })

    }

    //Set the type of animation
    if (params?.type == 'one') {
        const direction = params?.direction || 0;

        tl.to('.bars', { duration: durations[0], xPercent: direction, ease: "Power4.easeIn", stagger: 0.2 })
    } else if (params?.type == 'both') {
        const direction = params?.direction || 0;

        tl.to(gsap.utils.shuffle(oddBars), { duration: durations[0], xPercent: direction, ease: "Power4.easeIn", delay: .5, stagger: 0.2 })
            .to(gsap.utils.shuffle(evenBars), { duration: durations[0], xPercent: -(direction), ease: "Power4.easeIn", stagger: 0.2 }, "<")
    } else {
        const direction = params?.direction || 0;

        tl.to(gsap.utils.shuffle([...oddBars, ...evenBars]), { duration: durations[0], xPercent: direction, ease: "Power4.easeIn", stagger: 0.2 })
    }

    if (params?.skip) tl.call(() => scroller.scrollTo(0))

    return tl;
}

function showAlerts() {
    const tl = gsap.timeline({
        defaults: {
            duration: durations[1]
        }
    });
    const alert = select('.alert');

    const img = selectWith(alert, 'img');
    const span = selectAllWith(alert, '.txt-anim span')

    tl.set(img, { opacity: 0 })
        .to(alert, { duration: durations[0], opacity: 1, y: 0, ease: Back.easeOut })
        .to(span, { xPercent: 0, stagger: 0.1 })
        .to(img, { opacity: 1 }, '<')
        .call(() => selectAllWith(alert, '.txt-anim').forEach(e => e.classList.remove("transparent")))
        .to(span, { xPercent: 110, stagger: 0.2 })

    return tl;

}