let TAG = '[GSNotificationCenter]';
let GSNotificationCenter = {
    events: {},
    listen: function (eName, handler, scope) {
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },

    ignore: function (eName, handler, scope) {
        scope = scope || this;
        var fns = this.events[eName];

        if (!fns)
            return;

        this.events[eName] = fns.filter(function (fn) {
            return fn.scope != scope || fn.handler != handler;
        });
    },

    ignoreScope: function (scope) {
        for (var msg in this.events) {
            var obs = this.events[msg];
            if (obs) {
                this.events[msg] = obs.filter(function (fn) {
                    if (fn.scope != scope) {
                        return true;
                    } else {
                        GS.GLOG.debug(TAG, 'GSNotificationCenter : remove listener by Scope: ' + msg);
                        return false;
                    }
                });
            }
        }
    },

    trigger: function (eventName, params) {
        GS.GLOG.debug(TAG, 'EventTrigger:' + eventName);
        var fns = this.events[eventName];
        if (!fns) {
            return;
        }
        var fn;
        for (var i = 0; i < fns.length; i++) {
            fn = fns[i];
            fn.handler.call(fn.scope, params);
        }
    }
};

module.exports = GSNotificationCenter;

