//This page controls the animations to be rendered on different actions of the page

//Initialize barba
barba.init({
    transitions: [
        {
            name: 'default',
            once(data) {
                setupClass(data);
            },
            
            enter(data) {
                setupClass(data);
            },

            leave: () => leaveAnimation(),

            beforeEnter({next}) {
                const doc = parseDOM(next.html);
                const nextLink = selectWith(doc, 'head link:last-of-type');
                const currentlink = select('head link:last-of-type');

                currentlink.href = nextLink.href;
            }
        }, {
            name: 'sign',
            from: {
                namespace: ['signup', 'login']
            },
            to: {
                namespace: ['signup', 'login']
            },

            enter() {
                signAnimIn()
            },

            leave: ({next}) => signAnimOut(next.html),

        }
    ]
})