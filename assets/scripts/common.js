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
const disableLinksAndBtns = (condition = false) => {
    selectAll('a, button').forEach((element) => {
        if (condition) {
            element.setAttribute('disabled', 'true');

            if (element.tagName === 'A') {
                element.dataset.href = element.href;
                element.addEventListener('click', preventDefault);
            }
        } else {
            selectAll('a, button').forEach((element) => {
                element.removeAttribute('disabled');

                if (element.tagName === 'A') {
                    element.setAttribute('href', element.dataset.href);
                    element.removeEventListener('click', preventDefault);
                }
            });
        }
    });
}
const preventDefault = (event) => event.preventDefault();

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
        const hasLocomotive = select('[data-scroll-container]');

        if (hasLocomotive) selectAllWith(hasLocomotive, 'section').forEach(e => e.setAttribute('data-scroll-section', ''))

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
        selectAll('.head h1, .head span, .options span, .anim > *').forEach(elem => {
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
        selectAll('.menu-open, .cart-open').forEach(e => {
            e.addEventListener("click", function () {
                const navColor = getComputedStyle(select(':root')).getPropertyValue('--nav-color');
                disableLinksAndBtns(true);
                SetupDocument.changeBarsColor(navColor);
                SetupDocument.resetText(select(`#${Object.keys(this.dataset)}`))

                const tl = gsap.timeline();
                const barsOption = {
                    set: 100,
                    type: 'one',
                }

                const barsAnim = Animations.barsAnimation(barsOption);
                const navbarAnim = SetupDocument.navbarOpen(this);

                tl.to('.navbar li > *', { scale: 0 })
                    .add(barsAnim)
                    .add(navbarAnim)
                    .call(() => disableLinksAndBtns())

                tl.play();
            })
        })

        select('.menu-close').addEventListener("click", function () {
            disableLinksAndBtns(true);

            const tl = gsap.timeline();
            const barsOption = {
                type: 'one',
                direction: -100
            }

            const barsAnim = Animations.barsAnimation(barsOption);
            const navbarAnim = SetupDocument.navbarOpen(null, true);

            tl
                .add(navbarAnim)
                .add(barsAnim)
                .call(() => disableLinksAndBtns())

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

    static navbarOpen(trigger, condition = false) {
        const isAll = (trigger) ? false : true;
        const triggered = (isAll) ? selectAll('[data-navbar-open]') : select(`#${Object.keys(trigger.dataset)}`)
        const tl = gsap.timeline();

        if (condition) {
            tl
                .to(triggered, { opacity: 0 })
                .to('.menu-close', { scale: 0 }, '<')
                .set(triggered, { display: 'none' })
                .to('.navbar li > *', { scale: 1 }, 0)
        } else {
            const spans = selectAllWith(triggered, '.txt-anim span');
            const items = selectAllWith(triggered, '.cart-item');

            if(items.length) tl.set(items, { opacity: 0 })
            tl
                .set(triggered, { display: 'block', opacity: 1 })
                .call(() => SetupDocument.resetText(triggered))
                .to('.menu-close', { scale: 1 })
                .to(spans, { xPercent: 0, stagger: 0.1 }, '<')
                .call(() => selectAllWith(triggered, '.txt-anim').forEach(e => e.classList.remove("transparent")))
                .to(spans, { xPercent: 110, stagger: 0.2 })
                if(items.length) tl.to(items, { opacity: 1 }, '<')
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
        const showAnim = this.showNewAlert();


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

        if (!currentAlert) return null;

        const tl = gsap.timeline({
            defaults: {
                duration: durations[1]
            }
        });

        tl.to(currentAlert, { duration: durations[0], yPercent: 120, opacity: 0, ease: Back.easeIn })
            .call(() => currentAlert.remove());

        return tl;
    }

    showNewAlert() {
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

    static showAlert() {
        const tl = gsap.timeline({
            defaults: {
                duration: durations[1]
            }
        });
        const alert = select('.alert');

        if (!alert) return null;

        const img = selectWith(alert, 'img');
        const span = selectAllWith(alert, '.txt-anim span');

        tl.set(img, { opacity: 0 })
            .to(alert, { duration: durations[0], opacity: 1, y: 0, ease: Back.easeOut })
            .to(span, { xPercent: 0, stagger: 0.1 })
            .to(img, { opacity: 1 }, '<')
            .call(() => selectAllWith(alert, '.txt-anim').forEach(e => e.classList.remove("transparent")))
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
class Animations {
    constructor(params) {
        Object.assign(this, params);
        this.logs = {};

        this.init();

        return this.timeline;
    }

    init() {
        //Check all important parameters
        this.checkParams();

        //Setup animation
        this.animSetup();
    }

    checkParams() {
        const isNull = true;
        //Check data
        if (!this.data) this.logs.data = { isNull };
        if (!this.data?.next) this.logs.data.next = { isNull };
        if (!this.data?.next?.html) this.logs.data.next.html = { isNull };
        if (!this.data?.trigger) this.logs.data.trigger = { isNull };
        if (!this.data?.next?.container) this.logs.data.next.container = { isNull };

        //Check other params
        if (!this.type) this.logs.type = { isNull };
        if (!this.options) this.logs.options = { isNull };

        // if (Object.keys(this.logs).length) console.log(this.logs);
    }

    animSetup() {
        //Disable all buttons
        disableLinksAndBtns(true);

        //Define variables
        this.timeline = gsap.timeline();
        const type = (Array.isArray(this?.type)) ? this?.type.map(v => v.toLowerCase()) : [this?.type];
        const isLeave = (type && (type.includes('leave')));

        //Remove Existing alerts
        if (isLeave) {
            const closeAlerts = Alert.closeAlert();
            if (closeAlerts) this.timeline.add(closeAlerts);
        }
        //Setup the page
        if (!isLeave) this.pageSetup();

        //Setup animation for enter and leave
        if (type && type.includes('enter')) this.animConditions();
        if (type && type.includes('in')) this.signAnimIn();
        if (type && type.includes('out')) this.signAnimOut(this.data.next.html);
        if (type && type.includes('nav')) this.leaveAnim();

        //Custom bars animation
        if (type && type.includes('bars')) {
            if (this?.options) {
                const barsAnim = this.constructor.barsAnimation(this.options);
                this.timeline.add(barsAnim);
            }
        }

        //Enable buttons and links
        if (!isLeave) this.timeline.call(() => disableLinksAndBtns());

        //Setup alert animation
        if (!isLeave) {
            const alertAnim = Alert.showAlert();
            if (alertAnim) this.timeline.add(alertAnim);
        }
    }

    pageSetup() {
        //Setup Document
        new SetupDocument();

        //Disable special btns
        selectAll('[data-alert-btn]').forEach(elem => {
            elem.addEventListener("click", () => {
                disableLinksAndBtns(true);
                new Alert({
                    head: 'Sorry',
                    msg: "The page you are looking for hasn't been built yet.<br>Thanks for the understanding",
                    type: 'none',
                    image: 'pro-smile.png'
                });
                disableLinksAndBtns();
            })
        })
    }

    animConditions() {
        this.main = this.data.next.container;
        this.trigger = this.data.trigger;

        const isHome = (this.main.classList.contains('page-home'));

        if (isHome) new Home();
        else {
            newestTl.kill();
        };

        if ((this.trigger instanceof Element) ? this.trigger.hasAttribute('data-nav') : null) {
            this.navAnim(isHome);
        }
        else this.onceAnim(isHome);
    }

    heroAnim() {
        const tl = gsap.timeline();
        const heroText = selectAll('.hero .txt-anim span');

        tl
            .fromTo('.hero-img img', { scale: 1.5, opacity: 0 }, { duration: durations[1], scale: 1, opacity: 1 })
            .to(heroText, { duration: durations[1], xPercent: 0, stagger: 0.1 })
            .call(() => selectAll('.hero .txt-anim').forEach(elem => elem.classList.remove("transparent")))
            .to(heroText, { duration: durations[1], xPercent: 110, stagger: 0.2 })

        return tl;
    }

    //Main Animations
    static barsAnimation(params = {}) {
        const tl = gsap.timeline();

        //Set original position of the bars if needed
        if (params?.set) {
            const position = params?.set || 0;

            tl.set('.bars', { xPercent: position })
        }

        //Check if start animation is needed
        if (params?.start) {
            tl.to('.custom-loader', { duration: durations[0], opacity: 0 })
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

        if (params?.end) {
            tl.to('.custom-loader', { duration: durations[1], opacity: 1 })
        }

        return tl;
    }

    onceAnim(isHome = false) {
        const tl = gsap.timeline();
        const barsOptions = {
            start: true,
            type: 'both',
            direction: 100,
            skip: true
        }
        const barsAnim = this.constructor.barsAnimation(barsOptions);

        //Animation
        tl.add(barsAnim);
        //Add hero animation
        if (isHome) {
            const heroAnim = this.heroAnim();
            tl.add(heroAnim);
        }

        this.timeline.add(tl);
    }

    navAnim(isHome = false) {
        const tl = gsap.timeline();
        const barsOptions = {
            off: true,
            type: 'one',
            direction: -100,
            skip: true
        }
        const barsAnim = this.constructor.barsAnimation(barsOptions);

        //Animation
        tl.add(barsAnim)
        //Add hero animation
        if (isHome) {
            const heroAnim = this.heroAnim();
            tl.add(heroAnim);
        }

        this.timeline.add(tl);
    }

    //Static Animations
    leaveAnim() {
        const tl = gsap.timeline();

        const navbarAnim = SetupDocument.navbarOpen(null, true);

        tl.add(navbarAnim)

        this.timeline.add(tl);
    }

    signAnimIn() {
        const tl = gsap.timeline();

        tl
            .call(() => selectAll('.full-side').forEach(e => e.classList.add('hidden')))
            .from('.form-box h2, .form-box p, .form-box label, .form-box input, .form-box button', {
                y: '100vh',
                duration: 0.6,
                ease: 'Expo.easeOut',
                stagger: 0.1
            })
            .call(() => {
                selectAll('.full-side').forEach(e => e.classList.remove('hidden'));
                document.body.classList.remove('hidden');
            })

        this.timeline.add(tl);
    }

    signAnimOut(html) {
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
                duration: 0.6,
                ease: 'Expo.easeIn',
                stagger: 0.1
            })
            .to(img, {
                yPercent: -100,
                duration: durations[0]
            }, '-=0.7')

        this.timeline.add(tl);
    }
}