//Setting up
const body = document.body;
const select = (elem) => document.querySelector(elem);
const selectAll = (elem) => document.querySelectorAll(elem);
const selectWith = (parent, elem) => parent.querySelector(elem);
const selectAllWith = (parent, elem) => parent.querySelectorAll(elem);

//Register Scrolltrigger
gsap.registerPlugin(ScrollTrigger);

//All smooth scroll
const scroller = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    lenisOptions: {
        duration: 1.6
    }
});

//Attch parallax to images
const parallaxImages = document.querySelectorAll(".parallax img").forEach(elem => {
    elem.setAttribute('data-scroll', '');
    elem.setAttribute('data-scroll-speed', '-0.15');
    elem.setAttribute('data-scroll-position', 'top');
})