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
const disableBtns = (condition = false) => selectAll('button').forEach(elem => (condition) ? elem.disabled = true : elem.disabled = false);

//Dom parser
const parseDOM = (html) => {
    const parser = new DOMParser;
    return parser.parseFromString(html, 'text/html');
}

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
        gsap.set('.navbar-menu', { xPercent: 110 })
    }

    setupBars(num = 1) {
        const bars = selectAllWith(this.loadingScreen, '.bars')
        num -= bars.length;

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
            if (selectWith(elem, 'span')) return;
            const color = getComputedStyle(elem).getPropertyValue("color");
            const span = document.createElement("span");

            span.style.backgroundColor = `${(color == "") ? 'black' : color}`;
            gsap.set(span, { xPercent: -110, color: 'transparent' })

            elem.classList.add("transparent")
            elem.append(span);
        })
    }

    setupNavbar() {
        selectAll('.navbar button').forEach(elem => {
            elem.classList.remove('transparent');

            elem.addEventListener("mouseenter", function () {
                const icon = selectWith(this, 'i');

                gsap.to(icon, { duration: 0.2, scale: 1.1 })
            })

            elem.addEventListener("mouseleave", function () {
                const icon = selectWith(this, 'i');

                gsap.to(icon, { duration: 0.2, scale: 1 })
            })
        })

        selectAll('.navbar li button').forEach(elem => {
            elem.addEventListener("click", function () {
                disableBtns(true);
                SetupDocument.changeBarsColor('white');
                SetupDocument.resetText(select('.navbar-menu'))

                const tl = gsap.timeline();
                const barsOption = {
                    set: 100,
                    type: 'one',
                }

                const barsAnim = barsAnimation(barsOption);
                const navbarMenuAnim = SetupDocument.navbarMenuAnim();

                tl.to('.navbar li button', { scale: 0 })
                    .add(barsAnim)
                    .add(navbarMenuAnim)
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
            const navbarMenuAnim = SetupDocument.navbarMenuAnim(true);

            tl
                .add(navbarMenuAnim)
                .add(barsAnim)
                .call(() => disableBtns())

            tl.play();
        })
    }

    static resetText(parent = false) {
        if (!parent) return;

        selectAllWith(parent, '.txt-anim').forEach(elem => {
            const span = selectAllWith(elem, 'span');

            elem.classList.add('transparent');
            gsap.set(span, { xPercent: -110, color: 'transparent' })
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

    static navbarMenuAnim(condition = false) {
        const navbarMenu = select('.navbar-menu');
        const spans = selectAllWith(navbarMenu, '.txt-anim span');
        const tl = gsap.timeline();

        if (condition) {
            tl
                .to(navbarMenu, { opacity: 0 })
                .to('.menu-close', { scale: 0 }, '<')
                .set(navbarMenu, { xPercent: 110 })
                .to('.navbar li button', { scale: 1 })
        } else {
            tl
                .set(navbarMenu, { xPercent: 0, opacity: 1 })
                .call(() => SetupDocument.resetText(navbarMenu))
                .to('.menu-close', { scale: 1 })
                .to(spans, { xPercent: 0, stagger: 0.1 })
                .call(() => selectAllWith(navbarMenu, '.txt-anim').forEach(e => e.classList.remove("transparent")))
                .to(spans, { xPercent: 110, stagger: 0.2 })
        }

        return tl;
    }
}

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

//All page setups
//-------------------------------------------------------------------

//Homepage setup
const newestTl = gsap.timeline();
class Home {
    constructor() {
        this.newest = select('.newest');

        //Initialize page setup
        this.init();
    }

    init() {
        //Newest slider parameters
        this.newestImgBox = selectWith(this.newest, ".newest-img-box");
        this.newestImages = selectAllWith(this.newest, '.newest-images img');
        this.navBefore = selectWith(this.newest, '.newest-nav-before');
        this.navAfter = selectWith(this.newest, '.newest-nav-after');

        //Functional parameters
        this.activeSlider = 0;
        this.start = parseInt(getComputedStyle(select(':root')).getPropertyValue('--new-span-height'), 10);
        this.timer = 0;

        //changes active slider
        this.changeActiveSlider = () => ((this.activeSlider + 1) > this.newestImages.length) ? this.activeSlider = 1 : this.activeSlider++;
        //changes active image
        this.attachActiveImg = () => {
            if (!this.newestImages.length) return;
            let clone = this.newestImages[(((this.activeSlider - 1) < 0) ? 0 : (this.activeSlider - 1))].cloneNode(true)
            this.newestImgBox.append(clone);
            gsap.set(clone, { scale: 1.2, opacity: 0 });
        }
        //reset sliders
        this.resetSliders = () => {
            let tl = gsap.timeline();
            tl.call(() => selectAll('.newest-nav-slider').forEach(elem => elem.children[0].remove()))
            tl.set('.newest-nav-slider', { duration: 0, y: 0 })
        }

        //Run setup
        this.setupNewest();
        this.startNewest();
    }

    setupNewest() {
        if (!this.newestImages.length) return;

        //add slider and slider container to the navs
        for (let i = 0; i < this.newestImages.length; i++) {
            let navBoxClone;

            let navBox = document.createElement("span");
            let navSlider = document.createElement("div");

            navBox.classList.add("newest-nav-box");
            navSlider.classList.add("newest-nav-slider");

            navBox.appendChild(navSlider)
            navBoxClone = navBox.cloneNode(true);

            this.navBefore.append(navBox);
            this.navAfter.append(navBoxClone);
        }

        //attach appropriate spans and images
        this.attachNewestSpans();
        this.attachActiveImg();
    }

    attachNewestSpans() {
        const before = [];
        const after = [];

        selectAllWith(this.navBefore, '.newest-nav-slider').forEach(elem => before.push(elem));

        selectAllWith(this.navAfter, '.newest-nav-slider').forEach(elem => after.push(elem));

        //Reverse navs before to count like: '1,2,3', instead of '3,2,1'
        before.reverse();

        //attach spans based on the current active slider
        //then attach invisible attribute to the ones not needed, then add to slider
        before.forEach((elem, index) => {
            let span = document.createElement("span");
            let condition = (this.activeSlider - index <= 0);

            span.innerHTML = condition ? '00' : `0${(this.activeSlider - index)}`;

            condition ? span.setAttribute('data-invisible', '') : null;
            (this.activeSlider - index == this.activeSlider) ? span.style.color = 'red' : null;

            elem.append(span);
        })

        after.forEach((elem, index) => {
            let span = document.createElement("span");
            let condition = (this.activeSlider + (index + 1) > this.newestImages.length);

            span.innerHTML = condition ? '00' : `0${(this.activeSlider + (index + 1))}`;
            condition ? span.setAttribute('data-invisible', '') : null;

            elem.append(span);
        })
    }

    changeNewest() {
        if (!this.newestImages.length) return;

        //Change active slider and attch new spans under current ones
        this.changeActiveSlider()
        this.attachNewestSpans();

        //Change image
        this.attachActiveImg();

        //Move the sliders and reset them after
        newestTl.to(selectAllWith(this.newestImgBox, 'img'), { scale: 1, opacity: 1, delay: this.timer })
            .to(selectAllWith(this.newest, '.newest-nav-slider'), { duration: 0.2, y: -(this.start), stagger: 0.2 })
            .call(() => {
                if (!this.timer) this.timer = 1;
                this.newestImgBox.children[0].remove();
                this.resetSliders();
                this.changeNewest();
            })
    }

    startNewest() {
        const tl = gsap.timeline();

        //Start slider animations
        tl.call(() => {
            //Start newest animation
            this.changeNewest();
        })

        ScrollTrigger.create({
            trigger: this.newest,
            animation: tl,
            start: 'top 50%',
        })
    }
}

//-------------------------------------------------------------------

//Animation functions
//Syntax: { set, start(t/f), type, direction, skip(t/f) }
function onceAnim(condition = false) {
    //Disable all buttons
    disableBtns(true);

    const tl = gsap.timeline();
    const heroText = selectAll('.hero .txt-anim span');
    const barsOptions = {
        start: true,
        type: 'both',
        direction: 100,
        skip: true
    }

    const barsAnim = barsAnimation(barsOptions);
    const alertAnim = showAlerts();

    tl.add(barsAnim)
    if (condition) {
        tl
            .fromTo('.hero-img img', { scale: 1.5, opacity: 0 }, { duration: durations[1], scale: 1, opacity: 1 })
            .to(heroText, { duration: durations[1], xPercent: 0, stagger: 0.1 })
            .call(() => selectAll('.hero .txt-anim').forEach(elem => elem.classList.remove("transparent")))
            .to(heroText, { duration: durations[1], xPercent: 110, stagger: 0.2 })
    }
    tl.call(() => disableBtns())

    //Show alerts
    if (!alertAnim) tl.add(alertAnim);

    return tl;
}

function navAnim(condition = false) {
    //Disable all buttons
    disableBtns(true);

    const tl = gsap.timeline();
    const heroText = selectAll('.hero .txt-anim span');
    const barsOptions = {
        off: true,
        type: 'one',
        direction: -100,
    }

    const barsAnim = barsAnimation(barsOptions)

    tl.add(barsAnim)
    if (condition) {
        tl
            .fromTo('.hero-img img', { scale: 1.5, opacity: 0 }, { duration: durations[1], scale: 1, opacity: 1 })
            .to(heroText, { duration: durations[1], xPercent: 0, stagger: 0.1 })
            .call(() => selectAll('.hero .txt-anim').forEach(elem => elem.classList.remove("transparent")))
            .to(heroText, { duration: durations[1], xPercent: 110, stagger: 0.2 })
    }
    tl.call(() => disableBtns())
}

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

    if (params.off) {
        tl.set('.custom-loader', { opacity: 0 })
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

    if (!alert) return null;

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

function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

function leaveAnimation() {
    //Disable all buttons
    disableBtns(true);

    const tl = gsap.timeline();

    const navbarMenuAnim = SetupDocument.navbarMenuAnim(true);

    tl.add(navbarMenuAnim)

    return tl;
}

function signAnimOut(html) {
    //Disable all buttons
    disableBtns(true);

    const tl = gsap.timeline();
    const doc = parseDOM(html);
    const fullSide = select('.full-side.img-here');
    const img = selectWith(doc, '.full-side.img-here img');

    img.classList.add('full', 'top');
    fullSide.append(img);

    tl
        .call(() => {
            selectAll('.full-side').forEach(e => e.classList.add('hidden'))
            document.body.classList.add('hidden');
        })
        .to('.form-box h2, .form-box p, .form-box label, .form-box input, .form-box button', {
            y: '-100vh',
            duration: durations[0],
            ease: 'Back.easeIn',
            stagger: 0.1
        })
        .to(img, {
            yPercent: -100,
            duration: durations[0]
        }, '<')

    return tl;
}

function signAnimIn() {
    //Disable all buttons
    disableBtns(true);

    const tl = gsap.timeline();

    tl
        .call(() => selectAll('.full-side').forEach(e => e.classList.add('hidden')))
        .from('.form-box h2, .form-box p, .form-box label, .form-box input, .form-box button', {
            y: '100vh',
            duration: durations[0],
            ease: 'Back.easeOut',
            stagger: 0.1
        })
        .call(() => {
            selectAll('.full-side').forEach(e => e.classList.remove('hidden'));
            document.body.classList.remove('hidden');
            disableBtns();
        })

    return tl;
}

//Setup the page
function setupClass(data) {
    const main = data.next.container;
    const trigger = data.trigger;
    const condition = (main.classList.contains('page-home'));

    pageSetup();

    if (condition) new Home();
    else newestTl.kill();

    if ((trigger instanceof Element) ? trigger.hasAttribute('data-nav') : null) {
        navAnim(condition);
    }
    else onceAnim(condition);
}

function pageSetup() {
    new SetupDocument();

    selectAll('[data-alert-btn]').forEach(elem => {
        elem.addEventListener("click", () => {
            disableBtns(true);
            new Alert({
                head: 'Sorry',
                msg: "The page you are looking for hasn't been built yet.<br>Thanks for the understanding",
                type: 'none',
                image: 'pro-smile.png'
            });
            disableBtns();
        })
    })

}