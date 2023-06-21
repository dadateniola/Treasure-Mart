const evenBars = [];
const oddBars = [];

setBars(5);
setupText();

//Newest Slider
const newestImgBox = select(".newest-img");
const newestBtns = selectAll("[data-newest-btn]");

newestBtns.forEach(elem => {
    elem.addEventListener("click", function () {
        (this.getAttribute('data-newest-btn') == 'next') ? changeNewest(true) : changeNewest(false)
    })
})

//Newest Functions
function changeNewest(condition = undefined) {
    
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