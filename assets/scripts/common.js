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
        this.setupText();
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
    }

    setupBars(num = 1) {
        for (let i = 0; i < num; i++) {
            let div = document.createElement("div");

            (i % 2) ? evenBars.push(div) : oddBars.push(div);

            div.classList.add("bars");
            this.loadingScreen.append(div);
        }
    }

    setupText() {
        //Add txt-anim to headers
        selectAll('.head h1, .head span, .options span').forEach(elem => {
            elem.classList.add("txt-anim");
        })

        const text = selectAll(".txt-anim");

        //attach spans to the texts then give it the same color as the text
        text.forEach(elem => {
            const color = window.getComputedStyle(elem).getPropertyValue("color");
            const span = document.createElement("span");

            span.style.backgroundColor = `${color}`;
            gsap.set(span, { xPercent: -110, color: 'transparent' })

            elem.classList.add("transparent")
            elem.append(span);
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
}

//Setup document
new SetupDocument();

function barsAnimation(condition = true) {
    const tl = gsap.timeline();

    tl.call(() => select('.loading-screen').classList.remove('on'))
        .to('.custom-loader', { duration: (condition) ? durations[0] : 0, opacity: 0, delay: (condition) ? 1 : 0 })
        .to(gsap.utils.shuffle(oddBars), { duration: durations[0], xPercent: 100, ease: "Power4.easeIn", delay: .5, stagger: 0.2 })
        .to(gsap.utils.shuffle(evenBars), { duration: durations[0], xPercent: -100, ease: "Power4.easeIn", stagger: 0.2 }, "<")
    if(condition) tl.call(() => scroller.scrollTo(0))

    return tl;
}

function showAlerts() {
    const tl = gsap.timeline();
    const alert = select('.alert');

    const img = selectWith(alert, 'img');
    const span = selectAllWith(alert, '.txt-anim span')

    tl.from(alert, { duration: 0.8, opacity: 0, yPercent: 100, ease: Back.easeOut })
        .to(span, { duration: 0.5, xPercent: 0, stagger: 0.1, delay: 0.5 })
        .call(() => selectAllWith(alert, '.txt-anim').forEach(e => e.classList.remove("transparent")))
        .to(span, { duration: 0.5, xPercent: 110, stagger: 0.2 })

    return tl;

}