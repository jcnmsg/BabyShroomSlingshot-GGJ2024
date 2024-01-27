export function EventManager() {
    const events = {};

    function on(ev, cb) {
        if (!events[ev]) {
            events[ev] = [];
        }
        events[ev].push(cb);
    }

    function dispatch(ev, values) {
        if (events[ev]) {
            events[ev].forEach(function (cb) {
                cb(values);
            });
        }
    }

    function off(ev, cb) {
        if (events[ev]) {
            events[ev].forEach(function (callback, i) {
                if (cb && cb == callback) {
                    events[ev].splice(i, 1);
                }
                else {
                    events[ev].splice(i, 1);
                }
            });
        }
    }

    return {
        dispatch,
        on,
        off,
    };
}  