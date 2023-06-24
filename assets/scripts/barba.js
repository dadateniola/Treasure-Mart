//Initialize barba
barba.init({
    sync: true,

    transitions: [
        {
            name: 'default',
            once() {
                setupPage();
                pageTransition({ reloaded: true });
            }
        }
    ]
})