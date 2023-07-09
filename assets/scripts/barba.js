//This page controls the animations to be rendered on different actions of the page

//Initialize barba
barba.hooks.beforeEnter(({ next }) => {
    const doc = parseDOM(next.html);
    const nextLink = selectWith(doc, 'head link:last-of-type');
    const currentlink = select('head link:last-of-type');

    currentlink.href = nextLink.href;
});

barba.init({
    transitions: [
        {
            once(data) {
                new Animations({
                    data,
                    type: 'enter',
                })
            },

            enter(data) {
                new Animations({
                    data,
                    type: 'enter',
                })
            },

            leave: () => new Animations({
                type: ['leave', 'bars'],
                options: {
                    set: -100,
                    end: true,
                    type: 'one',
                    direction: 0,
                }

            })
        }, {
            //Navbar leave animation
            from: {
                custom: ({ trigger }) => {
                    return trigger.hasAttribute('data-nav');
                },
            },

            enter(data) {
                new Animations({
                    data,
                    type: 'enter',
                })
            },

            leave: () => new Animations({
                type: ['leave', 'nav'],
            }),
        }, {
            //Animation for login and sign up page
            from: {
                custom: ({ trigger }) => {
                    return trigger.hasAttribute('data-sign');
                },
                namespace: ['signup', 'login']
            },
            to: {
                namespace: ['signup', 'login']
            },

            enter() {
                new Animations({
                    type: 'in',
                });
            },

            leave: (data) => new Animations({
                data,
                type: ['leave', 'out'],
            }),

        }
    ]
})