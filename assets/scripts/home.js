const evenBars = [];
const oddBars = [];

setBars(5);
setupText();

//Newest Slider
const newestImgBox = select(".newest-img-box");
const newestImages = selectAll('.newest-images img');
const navBefore = select('.newest-nav-before');
const navAfter = select('.newest-nav-after');

var activeSlider = 0;
var start = parseInt(getComputedStyle(select(':root')).getPropertyValue('--new-span-height'), 10);
const timer = 2;

//changes active slider
const changeActiveSlider = () => ((activeSlider + 1) > newestImages.length) ? activeSlider = 1 : activeSlider++;

//changes active image
const attachActiveImg = () => {
    let clone = newestImages[(((activeSlider - 1) < 0) ? 0 : (activeSlider - 1))].cloneNode(true)
    newestImgBox.append(clone)
    gsap.set(clone, { scale: 1.2, opacity: 0 })
};

//resets all sliders
const resetSliders = () => {
    let tl = gsap.timeline();
    tl.call(() => selectAll('.newest-nav-slider').forEach(elem => elem.children[0].remove()))
    tl.set('.newest-nav-slider', { duration: 0, y: 0 })
}

//setup newest section
setupNewest();

//Newest Functions
function setupNewest() {
    for (let i = 0; i < newestImages.length; i++) {
        let navBoxClone;

        let navBox = document.createElement("span");
        let navSlider = document.createElement("div");

        navBox.classList.add("newest-nav-box");
        navSlider.classList.add("newest-nav-slider");

        navBox.appendChild(navSlider)
        navBoxClone = navBox.cloneNode(true);

        navBefore.append(navBox);
        navAfter.append(navBoxClone);
    }

    //attach appropriate spans
    attachNewestSpans();
    attachActiveImg();

    //Start animation
    changeNewest();
}

function attachNewestSpans() {
    const before = [];
    const after = [];

    selectAllWith(navBefore,'.newest-nav-slider').forEach(elem => before.push(elem));

    selectAllWith(navAfter, '.newest-nav-slider').forEach(elem => after.push(elem));

    //reverse before
    before.reverse();

    //attach spans based on the current active slider
    //then attach invisible attribute to the ones not needed, then add to slider
    before.forEach((elem, index) => {
        let span = document.createElement("span");
        let condition = (activeSlider - index <= 0);
        
        span.innerHTML = condition ? '00' : `0${(activeSlider - index)}`;

        condition ? span.setAttribute('data-invisible', '') : null;
        (activeSlider - index == activeSlider) ? span.style.color = 'red' : null;
        
        elem.append(span);
    })

    after.forEach((elem, index) => {
        let span = document.createElement("span");
        let condition = (activeSlider + (index + 1) > newestImages.length);

        span.innerHTML = condition ? '00' : `0${(activeSlider + (index + 1))}`;
        condition ? span.setAttribute('data-invisible', '') : null;

        elem.append(span);
    })
}

function changeNewest() {
    const newestTl = gsap.timeline();

    //Change active slider and attch new spans under current ones
    changeActiveSlider()
    attachNewestSpans();

    //Change image
    attachActiveImg();

    //Move the sliders and reset them after
    newestTl.to('.newest-img-box img', { scale: 1, opacity: 1, delay: timer })
        .to('.newest-nav-slider', { y: -start, stagger: 0.1 })
        .call(() => {
            newestImgBox.children[0].remove();
            resetSliders();
            changeNewest();
        })

}


barba.init({
    sync: true,

    transitions: [
        {
            name: 'default',
            once() {
                pageTransition({ reloaded: true });
            }
        }
    ]
})

//Page animations
function setBars(num = 1) {
    const parent = select(".loading-screen");

    if (!parent) return;

    for (let i = 0; i < num; i++) {
        let div = document.createElement("div");

        (i % 2) ? evenBars.push(div) : oddBars.push(div);

        div.classList.add("bars");
        parent.append(div);
    }
}

function setupText() {
    const text = selectAll(".txt-anim");

    if (!text) return;

    text.forEach((elem) => {
        const color = window.getComputedStyle(elem).getPropertyValue("color");
        const span = document.createElement("span");

        span.style.backgroundColor = `${color}`;
        gsap.set(span, { xPercent: -110 })

        elem.classList.add("transparent")
        elem.append(span);
    })
}

function pageTransition(params = {}) {
    const tl = gsap.timeline();
    const reloaded = params?.reloaded;
    const durations = [.8, .5]

    if (reloaded) {
        tl.set('.loading-screen, .custom-loader', { yPercent: 0, opacity: 0 })
            // .to('.custom-loader', { duration: durations[0], opacity: 0, delay: 1 })
            // .to(gsap.utils.shuffle(oddBars), { duration: durations[0], xPercent: 100, ease: "Power4.easeIn", delay: .5, stagger: 0.2 })
            // .to(gsap.utils.shuffle(evenBars), { duration: durations[0], xPercent: -100, ease: "Power4.easeIn", stagger: 0.2 }, "<")
            // .call(() => scroller.scrollTo(0))
            .fromTo('.hero-img img', { scale: 1.5, opacity: 0 }, { duration: durations[1], scale: 1, opacity: 1 })
            .to('.txt-anim span', { duration: durations[1], xPercent: 0, stagger: 0.1 })
            .call(() => document.querySelectorAll('.txt-anim').forEach(elem => elem.classList.remove("transparent")))
            .to('.txt-anim span', { duration: durations[1], xPercent: 110, stagger: 0.2 })
    }
}