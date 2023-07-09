//This page controls the animations to be rendered on different actions of the page

//Initialize barba
barba.init({
    preventRunning: true,
    transitions: [
        {
            from: {
                custom: ({ trigger }) => {
                    return ((trigger instanceof Element) ? (trigger.hasAttribute('data-sign') ? false : true) : true)
                },
            },
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
                type: 'leave',
            }),

            beforeEnter({ next }) {
                const doc = parseDOM(next.html);
                const nextLink = selectWith(doc, 'head link:last-of-type');
                const currentlink = select('head link:last-of-type');

                currentlink.href = nextLink.href;
            }
        }, {
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
                type: 'out',
            }),

        }
    ]
})