//Homepage setup
class Setup {
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

        const newestTl = gsap.timeline();

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

//Setup home page
new Setup();

function onceAnimation(condition = true) {
    const tl = gsap.timeline();
    const heroText = selectAll('.hero .txt-anim span');

    const barsAnim = barsAnimation(condition);
    const alertAnim = showAlerts();
    
    tl.add(barsAnim)
        .fromTo('.hero-img img', { scale: 1.5, opacity: 0 }, { duration: durations[1], scale: 1, opacity: 1 })
        .to(heroText, { duration: durations[1], xPercent: 0, stagger: 0.1 })
        .call(() => selectAll('.hero .txt-anim').forEach(elem => elem.classList.remove("transparent")))
        .to(heroText, { duration: durations[1], xPercent: 110, stagger: 0.2 })
        
    //Show alerts
    tl.add(alertAnim);

    return tl;
}