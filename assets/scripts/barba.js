//This page controls the animations to be rendered on different actions of the page
//Initialize barba
barba.init({
    sync: true,

    transitions: [
        {
            name: 'default',
            once() {
                //Run page animation
                const onceAnim = onceAnimation();
                onceAnim.play();
            },

            enter() {
                //Run page animation
                const onceAnim = onceAnimation();
                onceAnim.play();
            }
            
        }
    ]
})