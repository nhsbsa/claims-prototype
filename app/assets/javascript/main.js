import Tabs from './tabs.js';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    Tabs();
});

// ES6 or Vanilla JavaScript
const selectElement = document.querySelector('#select-autocomplete');

if(selectElement) {
    accessibleAutocomplete.enhanceSelectElement({
        selectElement: selectElement
    })
}

// Table row expander
const $details = document.querySelectorAll('details[rowExpander]');

if($details.length > 0) {
    console.log('length');
    $details.forEach(($detail) => {
        $detail.addEventListener("click", () => {
            document.getElementById($detail.getAttribute('rowExpander')).classList.toggle("nhsuk-u-visually-hidden");
        })
    })
}

!function() {
    "use strict";
    function t(t, e) {
        if (window.NodeList.prototype.forEach)
            return t.forEach(e);
        for (var n = 0; n < t.length; n++)
            e.call(window, t[n], n, t)
    }
    function e() {
        for (var t = function(t) {
                var e = {},
                    n = function(t, i) {
                        for (var o in t)
                            if (Object.prototype.hasOwnProperty.call(t, o)) {
                                var s = t[o],
                                    r = i ? i + "." + o : o;
                                "object" == typeof s ? n(s, r) : e[r] = s
                            }
                    };
                return n(t), e
            }, e = {}, n = 0; n < arguments.length; n++) {
            var i = t(arguments[n]);
            for (var o in i)
                Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o])
        }
        return e
    }
    function n(t, e) {
        if (!t || "object" != typeof t)
            throw new Error('Provide a `configObject` of type "object".');
        if (!e || "string" != typeof e)
            throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.');
        var n = {};
        for (var i in t) {
            var o = i.split(".");
            if (Object.prototype.hasOwnProperty.call(t, i) && o[0] === e)
                o.length > 1 && o.shift(),
                n[o.join(".")] = t[i]
        }
        return n
    }
    function i(t) {
        if ("string" != typeof t)
            return t;
        var e = t.trim();
        return "true" === e || "false" !== e && (e.length > 0 && isFinite(Number(e)) ? Number(e) : t)
    }
    function o(t) {
        var e = {};
        for (var n in t)
            e[n] = i(t[n]);
        return e
    }
    function s(t, e) {
        this.translations = t || {},
        this.locale = e && e.locale || document.documentElement.lang || "en"
    }
    (function(t) {
        var e,
            n,
            i,
            o;
        "defineProperty" in Object && function() {
            try {
                return Object.defineProperty({}, "test", {
                    value: 42
                }), !0
            } catch (t) {
                return !1
            }
        }() || (e = Object.defineProperty, n = Object.prototype.hasOwnProperty("__defineGetter__"), i = "Getters & setters cannot be defined on this javascript engine", o = "A property cannot both have accessors and be writable or have a value", Object.defineProperty = function(t, s, r) {
            if (e && (t === window || t === document || t === Element.prototype || t instanceof Element))
                return e(t, s, r);
            if (null === t || !(t instanceof Object || "object" == typeof t))
                throw new TypeError("Object.defineProperty called on non-object");
            if (!(r instanceof Object))
                throw new TypeError("Property description must be an object");
            var a = String(s),
                l = "value" in r || "writable" in r,
                c = "get" in r && typeof r.get,
                u = "set" in r && typeof r.set;
            if (c) {
                if ("function" !== c)
                    throw new TypeError("Getter must be a function");
                if (!n)
                    throw new TypeError(i);
                if (l)
                    throw new TypeError(o);
                Object.__defineGetter__.call(t, a, r.get)
            } else
                t[a] = r.value;
            if (u) {
                if ("function" !== u)
                    throw new TypeError("Setter must be a function");
                if (!n)
                    throw new TypeError(i);
                if (l)
                    throw new TypeError(o);
                Object.__defineSetter__.call(t, a, r.set)
            }
            return "value" in r && (t[a] = r.value), t
        })
    }).call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "Document" in this || "undefined" == typeof WorkerGlobalScope && "function" != typeof importScripts && (this.HTMLDocument ? this.Document = this.HTMLDocument : (this.Document = this.HTMLDocument = document.constructor = new Function("return function Document() {}")(), this.Document.prototype = document))
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "Element" in this && "HTMLElement" in this || function() {
            if (!window.Element || window.HTMLElement) {
                window.Element = window.HTMLElement = new Function("return function Element() {}")();
                var t,
                    e = document.appendChild(document.createElement("body")),
                    n = e.appendChild(document.createElement("iframe")).contentWindow.document,
                    i = Element.prototype = n.appendChild(n.createElement("*")),
                    o = {},
                    s = function(t, e) {
                        var n,
                            i,
                            r,
                            a = t.childNodes || [],
                            l = -1;
                        if (1 === t.nodeType && t.constructor !== Element)
                            for (n in t.constructor = Element, o)
                                i = o[n],
                                t[n] = i;
                        for (; r = e && a[++l];)
                            s(r, e);
                        return t
                    },
                    r = document.getElementsByTagName("*"),
                    a = document.createElement,
                    l = 100;
                i.attachEvent("onpropertychange", (function(t) {
                    for (var e, n = t.propertyName, s = !o.hasOwnProperty(n), a = i[n], l = o[n], c = -1; e = r[++c];)
                        1 === e.nodeType && (s || e[n] === l) && (e[n] = a);
                    o[n] = a
                })),
                i.constructor = Element,
                i.hasAttribute || (i.hasAttribute = function(t) {
                    return null !== this.getAttribute(t)
                }),
                c() || (document.onreadystatechange = c, t = setInterval(c, 25)),
                document.createElement = function(t) {
                    var e = a(String(t).toLowerCase());
                    return s(e)
                },
                document.removeChild(e)
            } else
                window.HTMLElement = window.Element;
            function c() {
                return l-- || clearTimeout(t), !(!document.body || document.body.prototype || !/(complete|interactive)/.test(document.readyState)) && (s(document, !0), t && document.body.prototype && clearTimeout(t), !!document.body.prototype)
            }
        }()
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        (function() {
            if (!document.documentElement.dataset)
                return !1;
            var t = document.createElement("div");
            return t.setAttribute("data-a-b", "c"), t.dataset && "c" == t.dataset.aB
        })() || Object.defineProperty(Element.prototype, "dataset", {
            get: function() {
                for (var t = this.attributes, e = {}, n = 0; n < t.length; n++) {
                    var i = t[n];
                    if (i && i.name && /^data-\w[.\w-]*$/.test(i.name)) {
                        var o = i.name,
                            s = i.value,
                            r = o.substr(5).replace(/-./g, (function(t) {
                                return t.charAt(1).toUpperCase()
                            }));
                        "__defineGetter__" in Object.prototype && "__defineSetter__" in Object.prototype ? Object.defineProperty(e, r, {
                            enumerable: !0,
                            get: function() {
                                return this.value
                            }.bind({
                                value: s || ""
                            }),
                            set: function(t, e) {
                                void 0 !== e ? this.setAttribute(t, e) : this.removeAttribute(t)
                            }.bind(this, o)
                        }) : e[r] = s
                    }
                }
                return e
            }
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "trim" in String.prototype || (String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    s.prototype.t = function(t, e) {
        if (!t)
            throw new Error("i18n: lookup key missing");
        e && "number" == typeof e.count && (t = t + "." + this.getPluralSuffix(t, e.count));
        var n = this.translations[t];
        if ("string" == typeof n) {
            if (n.match(/%{(.\S+)}/)) {
                if (!e)
                    throw new Error("i18n: cannot replace placeholders in string if no option data provided");
                return this.replacePlaceholders(n, e)
            }
            return n
        }
        return t
    },
    s.prototype.replacePlaceholders = function(t, e) {
        var n;
        return this.hasIntlNumberFormatSupport() && (n = new Intl.NumberFormat(this.locale)), t.replace(/%{(.\S+)}/g, (function(t, i) {
            if (Object.prototype.hasOwnProperty.call(e, i)) {
                var o = e[i];
                return !1 === o || "number" != typeof o && "string" != typeof o ? "" : "number" == typeof o ? n ? n.format(o) : o.toString() : o
            }
            throw new Error("i18n: no data found to replace " + t + " placeholder in string")
        }))
    },
    s.prototype.hasIntlPluralRulesSupport = function() {
        return Boolean(window.Intl && "PluralRules" in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length)
    },
    s.prototype.hasIntlNumberFormatSupport = function() {
        return Boolean(window.Intl && "NumberFormat" in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length)
    },
    s.prototype.getPluralSuffix = function(t, e) {
        if (e = Number(e), !isFinite(e))
            return "other";
        var n;
        if (t + "." + (n = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(e) : this.selectPluralFormUsingFallbackRules(e)) in this.translations)
            return n;
        if (t + ".other" in this.translations)
            return console && "warn" in console && console.warn('i18n: Missing plural form ".' + n + '" for "' + this.locale + '" locale. Falling back to ".other".'), "other";
        throw new Error('i18n: Plural form ".other" is required for "' + this.locale + '" locale')
    },
    s.prototype.selectPluralFormUsingFallbackRules = function(t) {
        t = Math.abs(Math.floor(t));
        var e = this.getPluralRulesForLocale();
        return e ? s.pluralRules[e](t) : "other"
    },
    s.prototype.getPluralRulesForLocale = function() {
        var t = this.locale,
            e = t.split("-")[0];
        for (var n in s.pluralRulesMap)
            if (Object.prototype.hasOwnProperty.call(s.pluralRulesMap, n))
                for (var i = s.pluralRulesMap[n], o = 0; o < i.length; o++)
                    if (i[o] === t || i[o] === e)
                        return n
    },
    s.pluralRulesMap = {
        arabic: ["ar"],
        chinese: ["my", "zh", "id", "ja", "jv", "ko", "ms", "th", "vi"],
        french: ["hy", "bn", "fr", "gu", "hi", "fa", "pa", "zu"],
        german: ["af", "sq", "az", "eu", "bg", "ca", "da", "nl", "en", "et", "fi", "ka", "de", "el", "hu", "lb", "no", "so", "sw", "sv", "ta", "te", "tr", "ur"],
        irish: ["ga"],
        russian: ["ru", "uk"],
        scottish: ["gd"],
        spanish: ["pt-PT", "it", "es"],
        welsh: ["cy"]
    },
    s.pluralRules = {
        arabic: function(t) {
            return 0 === t ? "zero" : 1 === t ? "one" : 2 === t ? "two" : t % 100 >= 3 && t % 100 <= 10 ? "few" : t % 100 >= 11 && t % 100 <= 99 ? "many" : "other"
        },
        chinese: function() {
            return "other"
        },
        french: function(t) {
            return 0 === t || 1 === t ? "one" : "other"
        },
        german: function(t) {
            return 1 === t ? "one" : "other"
        },
        irish: function(t) {
            return 1 === t ? "one" : 2 === t ? "two" : t >= 3 && t <= 6 ? "few" : t >= 7 && t <= 10 ? "many" : "other"
        },
        russian: function(t) {
            var e = t % 100,
                n = e % 10;
            return 1 === n && 11 !== e ? "one" : n >= 2 && n <= 4 && !(e >= 12 && e <= 14) ? "few" : 0 === n || n >= 5 && n <= 9 || e >= 11 && e <= 14 ? "many" : "other"
        },
        scottish: function(t) {
            return 1 === t || 11 === t ? "one" : 2 === t || 12 === t ? "two" : t >= 3 && t <= 10 || t >= 13 && t <= 19 ? "few" : "other"
        },
        spanish: function(t) {
            return 1 === t ? "one" : t % 1e6 == 0 && 0 !== t ? "many" : "other"
        },
        welsh: function(t) {
            return 0 === t ? "zero" : 1 === t ? "one" : 2 === t ? "two" : 3 === t ? "few" : 6 === t ? "many" : "other"
        }
    },
    function(t) {
        var e;
        "DOMTokenList" in this && (!("classList" in (e = document.createElement("x"))) || !e.classList.toggle("x", !1) && !e.className) || function(e) {
            var n;
            "DOMTokenList" in e && e.DOMTokenList && (!document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg") || document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList) || (e.DOMTokenList = function() {
                var e = !0,
                    i = function(t, n, i, o) {
                        Object.defineProperty ? Object.defineProperty(t, n, {
                            configurable: !1 === e || !!o,
                            get: i
                        }) : t.__defineGetter__(n, i)
                    };
                try {
                    i({}, "support")
                } catch (n) {
                    e = !1
                }
                return function(e, n) {
                    var o = this,
                        s = [],
                        r = {},
                        a = 0,
                        l = 0,
                        c = function(t) {
                            i(o, t, (function() {
                                return d(), s[t]
                            }), !1)
                        },
                        u = function() {
                            if (a >= l)
                                for (; l < a; ++l)
                                    c(l)
                        },
                        d = function() {
                            var t,
                                i,
                                o = arguments,
                                l = /\s+/;
                            if (o.length)
                                for (i = 0; i < o.length; ++i)
                                    if (l.test(o[i]))
                                        throw (t = new SyntaxError('String "' + o[i] + '" contains an invalid character')).code = 5, t.name = "InvalidCharacterError", t;
                            for ("" === (s = "object" == typeof e[n] ? ("" + e[n].baseVal).replace(/^\s+|\s+$/g, "").split(l) : ("" + e[n]).replace(/^\s+|\s+$/g, "").split(l))[0] && (s = []), r = {}, i = 0; i < s.length; ++i)
                                r[s[i]] = !0;
                            a = s.length,
                            u()
                        };
                    return d(), i(o, "length", (function() {
                        return d(), a
                    })), o.toLocaleString = o.toString = function() {
                        return d(), s.join(" ")
                    }, o.item = function(t) {
                        return d(), s[t]
                    }, o.contains = function(t) {
                        return d(), !!r[t]
                    }, o.add = function() {
                        d.apply(o, t = arguments);
                        for (var t, i, l = 0, c = t.length; l < c; ++l)
                            r[i = t[l]] || (s.push(i), r[i] = !0);
                        a !== s.length && (a = s.length >>> 0, "object" == typeof e[n] ? e[n].baseVal = s.join(" ") : e[n] = s.join(" "), u())
                    }, o.remove = function() {
                        d.apply(o, t = arguments);
                        for (var t, i = {}, l = 0, c = []; l < t.length; ++l)
                            i[t[l]] = !0,
                            delete r[t[l]];
                        for (l = 0; l < s.length; ++l)
                            i[s[l]] || c.push(s[l]);
                        s = c,
                        a = c.length >>> 0,
                        "object" == typeof e[n] ? e[n].baseVal = s.join(" ") : e[n] = s.join(" "),
                        u()
                    }, o.toggle = function(e, n) {
                        return d.apply(o, [e]), t !== n ? n ? (o.add(e), !0) : (o.remove(e), !1) : r[e] ? (o.remove(e), !1) : (o.add(e), !0)
                    }, o
                }
            }()),
            "classList" in (n = document.createElement("span")) && (n.classList.toggle("x", !1), n.classList.contains("x") && (n.classList.constructor.prototype.toggle = function(e) {
                var n = arguments[1];
                if (n === t) {
                    var i = !this.contains(e);
                    return this[i ? "add" : "remove"](e), i
                }
                return this[(n = !!n) ? "add" : "remove"](e), n
            })),
            function() {
                var t = document.createElement("span");
                if ("classList" in t && (t.classList.add("a", "b"), !t.classList.contains("b"))) {
                    var e = t.classList.constructor.prototype.add;
                    t.classList.constructor.prototype.add = function() {
                        for (var t = arguments, n = arguments.length, i = 0; i < n; i++)
                            e.call(this, t[i])
                    }
                }
            }(),
            function() {
                var t = document.createElement("span");
                if ("classList" in t && (t.classList.add("a"), t.classList.add("b"), t.classList.remove("a", "b"), t.classList.contains("b"))) {
                    var e = t.classList.constructor.prototype.remove;
                    t.classList.constructor.prototype.remove = function() {
                        for (var t = arguments, n = arguments.length, i = 0; i < n; i++)
                            e.call(this, t[i])
                    }
                }
            }()
        }(this)
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        var e;
        "document" in this && "classList" in document.documentElement && "Element" in this && "classList" in Element.prototype && ((e = document.createElement("span")).classList.add("a", "b"), e.classList.contains("b")) || function(t) {
            var n = !0,
                i = function(t, e, i, o) {
                    Object.defineProperty ? Object.defineProperty(t, e, {
                        configurable: !1 === n || !!o,
                        get: i
                    }) : t.__defineGetter__(e, i)
                };
            try {
                i({}, "support")
            } catch (e) {
                n = !1
            }
            var o = function(t, e, s) {
                i(t.prototype, e, (function() {
                    var t,
                        r = this,
                        a = "__defineGetter__DEFINE_PROPERTY" + e;
                    if (r[a])
                        return t;
                    if (r[a] = !0, !1 === n) {
                        for (var l, c = o.mirror || document.createElement("div"), u = c.childNodes, d = u.length, h = 0; h < d; ++h)
                            if (u[h]._R === r) {
                                l = u[h];
                                break
                            }
                        l || (l = c.appendChild(document.createElement("div"))),
                        t = DOMTokenList.call(l, r, s)
                    } else
                        t = new DOMTokenList(r, s);
                    return i(r, e, (function() {
                        return t
                    })), delete r[a], t
                }), !0)
            };
            o(t.Element, "classList", "className"),
            o(t.HTMLElement, "classList", "className"),
            o(t.HTMLLinkElement, "relList", "rel"),
            o(t.HTMLAnchorElement, "relList", "rel"),
            o(t.HTMLAreaElement, "relList", "rel")
        }(this)
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "document" in this && "matches" in document.documentElement || (Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function(t) {
            for (var e = this, n = (e.document || e.ownerDocument).querySelectorAll(t), i = 0; n[i] && n[i] !== e;)
                ++i;
            return !!n[i]
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "document" in this && "closest" in document.documentElement || (Element.prototype.closest = function(t) {
            for (var e = this; e;) {
                if (e.matches(t))
                    return e;
                e = "SVGElement" in window && e instanceof SVGElement ? e.parentNode : e.parentElement
            }
            return null
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "Window" in this || "undefined" == typeof WorkerGlobalScope && "function" != typeof importScripts && function(t) {
            t.constructor ? t.Window = t.constructor : (t.Window = t.constructor = new Function("return function Window() {}")()).prototype = this
        }(this)
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        (function(t) {
            if (!("Event" in t))
                return !1;
            if ("function" == typeof t.Event)
                return !0;
            try {
                return new Event("click"), !0
            } catch (e) {
                return !1
            }
        })(this) || function() {
            var e = {
                click: 1,
                dblclick: 1,
                keyup: 1,
                keypress: 1,
                keydown: 1,
                mousedown: 1,
                mouseup: 1,
                mousemove: 1,
                mouseover: 1,
                mouseenter: 1,
                mouseleave: 1,
                mouseout: 1,
                storage: 1,
                storagecommit: 1,
                textinput: 1
            };
            if ("undefined" != typeof document && "undefined" != typeof window) {
                var n = window.Event && window.Event.prototype || null;
                window.Event = Window.prototype.Event = function(e, n) {
                    if (!e)
                        throw new Error("Not enough arguments");
                    var i;
                    if ("createEvent" in document) {
                        i = document.createEvent("Event");
                        var o = !(!n || n.bubbles === t) && n.bubbles,
                            s = !(!n || n.cancelable === t) && n.cancelable;
                        return i.initEvent(e, o, s), i
                    }
                    return (i = document.createEventObject()).type = e, i.bubbles = !(!n || n.bubbles === t) && n.bubbles, i.cancelable = !(!n || n.cancelable === t) && n.cancelable, i
                },
                n && Object.defineProperty(window.Event, "prototype", {
                    configurable: !1,
                    enumerable: !1,
                    writable: !0,
                    value: n
                }),
                "createEvent" in document || (window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function() {
                    var t = this,
                        n = arguments[0],
                        o = arguments[1];
                    if (t === window && n in e)
                        throw new Error("In IE8 the event: " + n + " is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.");
                    t._events || (t._events = {}),
                    t._events[n] || (t._events[n] = function(e) {
                        var n,
                            o = t._events[e.type].list,
                            s = o.slice(),
                            r = -1,
                            a = s.length;
                        for (e.preventDefault = function() {
                            !1 !== e.cancelable && (e.returnValue = !1)
                        }, e.stopPropagation = function() {
                            e.cancelBubble = !0
                        }, e.stopImmediatePropagation = function() {
                            e.cancelBubble = !0,
                            e.cancelImmediate = !0
                        }, e.currentTarget = t, e.relatedTarget = e.fromElement || null, e.target = e.target || e.srcElement || t, e.timeStamp = (new Date).getTime(), e.clientX && (e.pageX = e.clientX + document.documentElement.scrollLeft, e.pageY = e.clientY + document.documentElement.scrollTop); ++r < a && !e.cancelImmediate;)
                            r in s && -1 !== i(o, n = s[r]) && "function" == typeof n && n.call(t, e)
                    }, t._events[n].list = [], t.attachEvent && t.attachEvent("on" + n, t._events[n])),
                    t._events[n].list.push(o)
                }, window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function() {
                    var t,
                        e = this,
                        n = arguments[0],
                        o = arguments[1];
                    e._events && e._events[n] && e._events[n].list && -1 !== (t = i(e._events[n].list, o)) && (e._events[n].list.splice(t, 1), e._events[n].list.length || (e.detachEvent && e.detachEvent("on" + n, e._events[n]), delete e._events[n]))
                }, window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function(t) {
                    if (!arguments.length)
                        throw new Error("Not enough arguments");
                    if (!t || "string" != typeof t.type)
                        throw new Error("DOM Events Exception 0");
                    var e = this,
                        n = t.type;
                    try {
                        if (!t.bubbles) {
                            t.cancelBubble = !0;
                            var i = function(t) {
                                t.cancelBubble = !0,
                                (e || window).detachEvent("on" + n, i)
                            };
                            this.attachEvent("on" + n, i)
                        }
                        this.fireEvent("on" + n, t)
                    } catch (o) {
                        t.target = e;
                        do {
                            t.currentTarget = e,
                            "_events" in e && "function" == typeof e._events[n] && e._events[n].call(e, t),
                            "function" == typeof e["on" + n] && e["on" + n].call(e, t),
                            e = 9 === e.nodeType ? e.parentWindow : e.parentNode
                        } while (e && !t.cancelBubble)
                    }
                    return !0
                }, document.attachEvent("onreadystatechange", (function() {
                    "complete" === document.readyState && document.dispatchEvent(new Event("DOMContentLoaded", {
                        bubbles: !0
                    }))
                })))
            }
            function i(t, e) {
                for (var n = -1, i = t.length; ++n < i;)
                    if (n in t && t[n] === e)
                        return n;
                return -1
            }
        }()
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "bind" in Function.prototype || Object.defineProperty(Function.prototype, "bind", {
            value: function(t) {
                var e,
                    n = Array,
                    i = Object,
                    o = i.prototype,
                    s = n.prototype,
                    r = function() {},
                    a = o.toString,
                    l = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag,
                    c = Function.prototype.toString;
                e = function(t) {
                    if ("function" != typeof t)
                        return !1;
                    if (l)
                        return function(t) {
                            try {
                                return c.call(t), !0
                            } catch (e) {
                                return !1
                            }
                        }(t);
                    var e = a.call(t);
                    return "[object Function]" === e || "[object GeneratorFunction]" === e
                };
                var u = s.slice,
                    d = s.concat,
                    h = s.push,
                    p = Math.max,
                    m = this;
                if (!e(m))
                    throw new TypeError("Function.prototype.bind called on incompatible " + m);
                for (var f, v = u.call(arguments, 1), b = p(0, m.length - v.length), g = [], y = 0; y < b; y++)
                    h.call(g, "$" + y);
                return f = Function("binder", "return function (" + g.join(",") + "){ return binder.apply(this, arguments); }")((function() {
                    if (this instanceof f) {
                        var e = m.apply(this, d.call(v, u.call(arguments)));
                        return i(e) === e ? e : this
                    }
                    return m.apply(t, d.call(v, u.call(arguments)))
                })), m.prototype && (r.prototype = m.prototype, f.prototype = new r, r.prototype = null), f
            }
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {});
    var r = {
        hideAllSections: "Hide all sections",
        hideSection: "Hide",
        hideSectionAriaLabel: "Hide this section",
        showAllSections: "Show all sections",
        showSection: "Show",
        showSectionAriaLabel: "Show this section"
    };
    function a(t, i) {
        if (!(t instanceof HTMLElement))
            return this;
        this.$module = t;
        var a = {
            i18n: r,
            rememberExpanded: !0
        };
        this.config = e(a, i || {}, o(t.dataset)),
        this.i18n = new s(n(this.config, "i18n")),
        this.controlsClass = "govuk-accordion__controls",
        this.showAllClass = "govuk-accordion__show-all",
        this.showAllTextClass = "govuk-accordion__show-all-text",
        this.sectionClass = "govuk-accordion__section",
        this.sectionExpandedClass = "govuk-accordion__section--expanded",
        this.sectionButtonClass = "govuk-accordion__section-button",
        this.sectionHeaderClass = "govuk-accordion__section-header",
        this.sectionHeadingClass = "govuk-accordion__section-heading",
        this.sectionHeadingDividerClass = "govuk-accordion__section-heading-divider",
        this.sectionHeadingTextClass = "govuk-accordion__section-heading-text",
        this.sectionHeadingTextFocusClass = "govuk-accordion__section-heading-text-focus",
        this.sectionShowHideToggleClass = "govuk-accordion__section-toggle",
        this.sectionShowHideToggleFocusClass = "govuk-accordion__section-toggle-focus",
        this.sectionShowHideTextClass = "govuk-accordion__section-toggle-text",
        this.upChevronIconClass = "govuk-accordion-nav__chevron",
        this.downChevronIconClass = "govuk-accordion-nav__chevron--down",
        this.sectionSummaryClass = "govuk-accordion__section-summary",
        this.sectionSummaryFocusClass = "govuk-accordion__section-summary-focus",
        this.sectionContentClass = "govuk-accordion__section-content";
        var c = this.$module.querySelectorAll("." + this.sectionClass);
        if (!c.length)
            return this;
        this.$sections = c,
        this.browserSupportsSessionStorage = l.checkForSessionStorage(),
        this.$showAllButton = null,
        this.$showAllIcon = null,
        this.$showAllText = null
    }
    a.prototype.init = function() {
        if (this.$module && this.$sections) {
            this.initControls(),
            this.initSectionHeaders();
            var t = this.checkIfAllSectionsOpen();
            this.updateShowAllButton(t)
        }
    },
    a.prototype.initControls = function() {
        this.$showAllButton = document.createElement("button"),
        this.$showAllButton.setAttribute("type", "button"),
        this.$showAllButton.setAttribute("class", this.showAllClass),
        this.$showAllButton.setAttribute("aria-expanded", "false"),
        this.$showAllIcon = document.createElement("span"),
        this.$showAllIcon.classList.add(this.upChevronIconClass),
        this.$showAllButton.appendChild(this.$showAllIcon);
        var t = document.createElement("div");
        t.setAttribute("class", this.controlsClass),
        t.appendChild(this.$showAllButton),
        this.$module.insertBefore(t, this.$module.firstChild),
        this.$showAllText = document.createElement("span"),
        this.$showAllText.classList.add(this.showAllTextClass),
        this.$showAllButton.appendChild(this.$showAllText),
        this.$showAllButton.addEventListener("click", this.onShowOrHideAllToggle.bind(this)),
        "onbeforematch" in document && document.addEventListener("beforematch", this.onBeforeMatch.bind(this))
    },
    a.prototype.initSectionHeaders = function() {
        var e = this;
        t(this.$sections, (function(t, n) {
            var i = t.querySelector("." + e.sectionHeaderClass);
            i && (e.constructHeaderMarkup(i, n), e.setExpanded(e.isExpanded(t), t), i.addEventListener("click", e.onSectionToggle.bind(e, t)), e.setInitialState(t))
        }))
    },
    a.prototype.constructHeaderMarkup = function(t, e) {
        var n = t.querySelector("." + this.sectionButtonClass),
            i = t.querySelector("." + this.sectionHeadingClass),
            o = t.querySelector("." + this.sectionSummaryClass);
        if (n && i) {
            var s = document.createElement("button");
            s.setAttribute("type", "button"),
            s.setAttribute("aria-controls", this.$module.id + "-content-" + (e + 1).toString());
            for (var r = 0; r < n.attributes.length; r++) {
                var a = n.attributes.item(r);
                "id" !== a.nodeName && s.setAttribute(a.nodeName, a.nodeValue)
            }
            var l = document.createElement("span");
            l.classList.add(this.sectionHeadingTextClass),
            l.id = n.id;
            var c = document.createElement("span");
            c.classList.add(this.sectionHeadingTextFocusClass),
            l.appendChild(c),
            c.innerHTML = n.innerHTML;
            var u = document.createElement("span");
            u.classList.add(this.sectionShowHideToggleClass),
            u.setAttribute("data-nosnippet", "");
            var d = document.createElement("span");
            d.classList.add(this.sectionShowHideToggleFocusClass),
            u.appendChild(d);
            var h = document.createElement("span"),
                p = document.createElement("span");
            if (p.classList.add(this.upChevronIconClass), d.appendChild(p), h.classList.add(this.sectionShowHideTextClass), d.appendChild(h), s.appendChild(l), s.appendChild(this.getButtonPunctuationEl()), o) {
                var m = document.createElement("span"),
                    f = document.createElement("span");
                f.classList.add(this.sectionSummaryFocusClass),
                m.appendChild(f);
                for (var v = 0, b = o.attributes.length; v < b; ++v) {
                    var g = o.attributes.item(v).nodeName,
                        y = o.attributes.item(v).nodeValue;
                    m.setAttribute(g, y)
                }
                f.innerHTML = o.innerHTML,
                o.parentNode.replaceChild(m, o),
                s.appendChild(m),
                s.appendChild(this.getButtonPunctuationEl())
            }
            s.appendChild(u),
            i.removeChild(n),
            i.appendChild(s)
        }
    },
    a.prototype.onBeforeMatch = function(t) {
        var e = t.target;
        if (e instanceof Element) {
            var n = e.closest("." + this.sectionClass);
            n && this.setExpanded(!0, n)
        }
    },
    a.prototype.onSectionToggle = function(t) {
        var e = this.isExpanded(t);
        this.setExpanded(!e, t),
        this.storeState(t)
    },
    a.prototype.onShowOrHideAllToggle = function() {
        var e = this,
            n = this.$sections,
            i = !this.checkIfAllSectionsOpen();
        t(n, (function(t) {
            e.setExpanded(i, t),
            e.storeState(t)
        })),
        e.updateShowAllButton(i)
    },
    a.prototype.setExpanded = function(t, e) {
        var n = e.querySelector("." + this.upChevronIconClass),
            i = e.querySelector("." + this.sectionShowHideTextClass),
            o = e.querySelector("." + this.sectionButtonClass),
            s = e.querySelector("." + this.sectionContentClass);
        if (n && i instanceof HTMLElement && o && s) {
            var r = t ? this.i18n.t("hideSection") : this.i18n.t("showSection");
            i.innerText = r,
            o.setAttribute("aria-expanded", t.toString());
            var a = [],
                l = e.querySelector("." + this.sectionHeadingTextClass);
            l instanceof HTMLElement && a.push(l.innerText.trim());
            var c = e.querySelector("." + this.sectionSummaryClass);
            c instanceof HTMLElement && a.push(c.innerText.trim());
            var u = t ? this.i18n.t("hideSectionAriaLabel") : this.i18n.t("showSectionAriaLabel");
            a.push(u),
            o.setAttribute("aria-label", a.join(" , ")),
            t ? (s.removeAttribute("hidden"), e.classList.add(this.sectionExpandedClass), n.classList.remove(this.downChevronIconClass)) : (s.setAttribute("hidden", "until-found"), e.classList.remove(this.sectionExpandedClass), n.classList.add(this.downChevronIconClass));
            var d = this.checkIfAllSectionsOpen();
            this.updateShowAllButton(d)
        }
    },
    a.prototype.isExpanded = function(t) {
        return t.classList.contains(this.sectionExpandedClass)
    },
    a.prototype.checkIfAllSectionsOpen = function() {
        return this.$sections.length === this.$module.querySelectorAll("." + this.sectionExpandedClass).length
    },
    a.prototype.updateShowAllButton = function(t) {
        var e = t ? this.i18n.t("hideAllSections") : this.i18n.t("showAllSections");
        this.$showAllButton.setAttribute("aria-expanded", t.toString()),
        this.$showAllText.innerText = e,
        t ? this.$showAllIcon.classList.remove(this.downChevronIconClass) : this.$showAllIcon.classList.add(this.downChevronIconClass)
    };
    var l = {
        checkForSessionStorage: function() {
            var t,
                e = "this is the test string";
            try {
                return window.sessionStorage.setItem(e, e), t = window.sessionStorage.getItem(e) === e.toString(), window.sessionStorage.removeItem(e), t
            } catch (n) {
                return !1
            }
        }
    };
    a.prototype.storeState = function(t) {
        if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
            var e = t.querySelector("." + this.sectionButtonClass);
            if (e) {
                var n = e.getAttribute("aria-controls"),
                    i = e.getAttribute("aria-expanded");
                n && i && window.sessionStorage.setItem(n, i)
            }
        }
    },
    a.prototype.setInitialState = function(t) {
        if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
            var e = t.querySelector("." + this.sectionButtonClass);
            if (e) {
                var n = e.getAttribute("aria-controls"),
                    i = n ? window.sessionStorage.getItem(n) : null;
                null !== i && this.setExpanded("true" === i, t)
            }
        }
    },
    a.prototype.getButtonPunctuationEl = function() {
        var t = document.createElement("span");
        return t.classList.add("govuk-visually-hidden", this.sectionHeadingDividerClass), t.innerHTML = ", ", t
    };
    function c(t, n) {
        if (!(t instanceof HTMLElement))
            return this;
        this.$module = t,
        this.debounceFormSubmitTimer = null;
        this.config = e({
            preventDoubleClick: !1
        }, n || {}, o(t.dataset))
    }
    c.prototype.init = function() {
        this.$module && (this.$module.addEventListener("keydown", this.handleKeyDown), this.$module.addEventListener("click", this.debounce.bind(this)))
    },
    c.prototype.handleKeyDown = function(t) {
        var e = t.target;
        32 === t.keyCode && e instanceof HTMLElement && "button" === e.getAttribute("role") && (t.preventDefault(), e.click())
    },
    c.prototype.debounce = function(t) {
        if (this.config.preventDoubleClick)
            return this.debounceFormSubmitTimer ? (t.preventDefault(), !1) : void (this.debounceFormSubmitTimer = setTimeout(function() {
                this.debounceFormSubmitTimer = null
            }.bind(this), 1e3))
    },
    function(t) {
        "Date" in self && "now" in self.Date && "getTime" in self.Date.prototype || (Date.now = function() {
            return (new Date).getTime()
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {});
    var u = {
        charactersUnderLimit: {
            one: "You have %{count} character remaining",
            other: "You have %{count} characters remaining"
        },
        charactersAtLimit: "You have 0 characters remaining",
        charactersOverLimit: {
            one: "You have %{count} character too many",
            other: "You have %{count} characters too many"
        },
        wordsUnderLimit: {
            one: "You have %{count} word remaining",
            other: "You have %{count} words remaining"
        },
        wordsAtLimit: "You have 0 words remaining",
        wordsOverLimit: {
            one: "You have %{count} word too many",
            other: "You have %{count} words too many"
        },
        textareaDescription: {
            other: ""
        }
    };
    function d(t, i) {
        if (!(t instanceof HTMLElement))
            return this;
        var r = t.querySelector(".govuk-js-character-count");
        if (!(r instanceof HTMLTextAreaElement || r instanceof HTMLInputElement))
            return this;
        var a,
            l,
            c,
            d = {
                threshold: 0,
                i18n: u
            },
            h = o(t.dataset),
            p = {};
        if (("maxwords" in h || "maxlength" in h) && (p = {
            maxlength: !1,
            maxwords: !1
        }), this.config = e(d, i || {}, p, h), this.i18n = new s(n(this.config, "i18n"), {
            locale: (a = t, l = "lang", c = a.closest("[" + l + "]"), c ? c.getAttribute(l) : null)
        }), this.maxLength = 1 / 0, "maxwords" in this.config && this.config.maxwords)
            this.maxLength = this.config.maxwords;
        else {
            if (!("maxlength" in this.config) || !this.config.maxlength)
                return;
            this.maxLength = this.config.maxlength
        }
        this.$module = t,
        this.$textarea = r,
        this.$visibleCountMessage = null,
        this.$screenReaderCountMessage = null,
        this.lastInputTimestamp = null,
        this.lastInputValue = "",
        this.valueChecker = null
    }
    function h(t) {
        if (!(t instanceof HTMLElement))
            return this;
        var e = t.querySelectorAll('input[type="checkbox"]');
        if (!e.length)
            return this;
        this.$module = t,
        this.$inputs = e
    }
    d.prototype.init = function() {
        if (this.$module && this.$textarea) {
            var t = this.$textarea,
                e = document.getElementById(t.id + "-info");
            if (e) {
                e.innerText.match(/^\s*$/) && (e.innerText = this.i18n.t("textareaDescription", {
                    count: this.maxLength
                })),
                t.insertAdjacentElement("afterend", e);
                var n = document.createElement("div");
                n.className = "govuk-character-count__sr-status govuk-visually-hidden",
                n.setAttribute("aria-live", "polite"),
                this.$screenReaderCountMessage = n,
                e.insertAdjacentElement("afterend", n);
                var i = document.createElement("div");
                i.className = e.className,
                i.classList.add("govuk-character-count__status"),
                i.setAttribute("aria-hidden", "true"),
                this.$visibleCountMessage = i,
                e.insertAdjacentElement("afterend", i),
                e.classList.add("govuk-visually-hidden"),
                t.removeAttribute("maxlength"),
                this.bindChangeEvents(),
                window.addEventListener("onpageshow" in window ? "pageshow" : "DOMContentLoaded", this.updateCountMessage.bind(this)),
                this.updateCountMessage()
            }
        }
    },
    d.prototype.bindChangeEvents = function() {
        var t = this.$textarea;
        t.addEventListener("keyup", this.handleKeyUp.bind(this)),
        t.addEventListener("focus", this.handleFocus.bind(this)),
        t.addEventListener("blur", this.handleBlur.bind(this))
    },
    d.prototype.handleKeyUp = function() {
        this.updateVisibleCountMessage(),
        this.lastInputTimestamp = Date.now()
    },
    d.prototype.handleFocus = function() {
        this.valueChecker = setInterval(function() {
            (!this.lastInputTimestamp || Date.now() - 500 >= this.lastInputTimestamp) && this.updateIfValueChanged()
        }.bind(this), 1e3)
    },
    d.prototype.handleBlur = function() {
        clearInterval(this.valueChecker)
    },
    d.prototype.updateIfValueChanged = function() {
        this.$textarea.value !== this.lastInputValue && (this.lastInputValue = this.$textarea.value, this.updateCountMessage())
    },
    d.prototype.updateCountMessage = function() {
        this.updateVisibleCountMessage(),
        this.updateScreenReaderCountMessage()
    },
    d.prototype.updateVisibleCountMessage = function() {
        var t = this.$textarea,
            e = this.$visibleCountMessage,
            n = this.maxLength - this.count(t.value);
        this.isOverThreshold() ? e.classList.remove("govuk-character-count__message--disabled") : e.classList.add("govuk-character-count__message--disabled"),
        n < 0 ? (t.classList.add("govuk-textarea--error"), e.classList.remove("govuk-hint"), e.classList.add("govuk-error-message")) : (t.classList.remove("govuk-textarea--error"), e.classList.remove("govuk-error-message"), e.classList.add("govuk-hint")),
        e.innerText = this.getCountMessage()
    },
    d.prototype.updateScreenReaderCountMessage = function() {
        var t = this.$screenReaderCountMessage;
        this.isOverThreshold() ? t.removeAttribute("aria-hidden") : t.setAttribute("aria-hidden", "true"),
        t.innerText = this.getCountMessage()
    },
    d.prototype.count = function(t) {
        return "maxwords" in this.config && this.config.maxwords ? (t.match(/\S+/g) || []).length : t.length
    },
    d.prototype.getCountMessage = function() {
        var t = this.maxLength - this.count(this.$textarea.value),
            e = "maxwords" in this.config && this.config.maxwords ? "words" : "characters";
        return this.formatCountMessage(t, e)
    },
    d.prototype.formatCountMessage = function(t, e) {
        if (0 === t)
            return this.i18n.t(e + "AtLimit");
        var n = t < 0 ? "OverLimit" : "UnderLimit";
        return this.i18n.t(e + n, {
            count: Math.abs(t)
        })
    },
    d.prototype.isOverThreshold = function() {
        if (!this.config.threshold)
            return !0;
        var t = this.$textarea,
            e = this.count(t.value);
        return this.maxLength * this.config.threshold / 100 <= e
    },
    h.prototype.init = function() {
        if (this.$module && this.$inputs) {
            var e = this.$module;
            t(this.$inputs, (function(t) {
                var e = t.getAttribute("data-aria-controls");
                e && document.getElementById(e) && (t.setAttribute("aria-controls", e), t.removeAttribute("data-aria-controls"))
            })),
            window.addEventListener("onpageshow" in window ? "pageshow" : "DOMContentLoaded", this.syncAllConditionalReveals.bind(this)),
            this.syncAllConditionalReveals(),
            e.addEventListener("click", this.handleClick.bind(this))
        }
    },
    h.prototype.syncAllConditionalReveals = function() {
        t(this.$inputs, this.syncConditionalRevealWithInputState.bind(this))
    },
    h.prototype.syncConditionalRevealWithInputState = function(t) {
        var e = t.getAttribute("aria-controls");
        if (e) {
            var n = document.getElementById(e);
            if (n && n.classList.contains("govuk-checkboxes__conditional")) {
                var i = t.checked;
                t.setAttribute("aria-expanded", i.toString()),
                n.classList.toggle("govuk-checkboxes__conditional--hidden", !i)
            }
        }
    },
    h.prototype.unCheckAllInputsExcept = function(e) {
        var n = this;
        t(document.querySelectorAll('input[type="checkbox"][name="' + e.name + '"]'), (function(t) {
            e.form === t.form && t !== e && (t.checked = !1, n.syncConditionalRevealWithInputState(t))
        }))
    },
    h.prototype.unCheckExclusiveInputs = function(e) {
        var n = this;
        t(document.querySelectorAll('input[data-behaviour="exclusive"][type="checkbox"][name="' + e.name + '"]'), (function(t) {
            e.form === t.form && (t.checked = !1, n.syncConditionalRevealWithInputState(t))
        }))
    },
    h.prototype.handleClick = function(t) {
        var e = t.target;
        e instanceof HTMLInputElement && "checkbox" === e.type && (e.getAttribute("aria-controls") && this.syncConditionalRevealWithInputState(e), e.checked && ("exclusive" === e.getAttribute("data-behaviour") ? this.unCheckAllInputsExcept(e) : this.unCheckExclusiveInputs(e)))
    };
    function p(t) {
        if (!(t instanceof HTMLElement))
            return this;
        this.$module = t,
        this.$summary = null,
        this.$content = null
    }
    function m(t, n) {
        if (!(t instanceof HTMLElement))
            return this;
        this.$module = t;
        this.config = e({
            disableAutoFocus: !1
        }, n || {}, o(t.dataset))
    }
    p.prototype.init = function() {
        this.$module && ("HTMLDetailsElement" in window && this.$module instanceof HTMLDetailsElement || this.polyfillDetails())
    },
    p.prototype.polyfillDetails = function() {
        var t,
            e = this.$module,
            n = this.$summary = e.getElementsByTagName("summary").item(0),
            i = this.$content = e.getElementsByTagName("div").item(0);
        n && i && (i.id || (i.id = "details-content-" + (t = (new Date).getTime(), void 0 !== window.performance && "function" == typeof window.performance.now && (t += window.performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
            var n = (t + 16 * Math.random()) % 16 | 0;
            return t = Math.floor(t / 16), ("x" === e ? n : 3 & n | 8).toString(16)
        })))), e.setAttribute("role", "group"), n.setAttribute("role", "button"), n.setAttribute("aria-controls", i.id), n.tabIndex = 0, this.$module.hasAttribute("open") ? n.setAttribute("aria-expanded", "true") : (n.setAttribute("aria-expanded", "false"), i.style.display = "none"), this.polyfillHandleInputs(this.polyfillSetAttributes.bind(this)))
    },
    p.prototype.polyfillSetAttributes = function() {
        return this.$module.hasAttribute("open") ? (this.$module.removeAttribute("open"), this.$summary.setAttribute("aria-expanded", "false"), this.$content.style.display = "none") : (this.$module.setAttribute("open", "open"), this.$summary.setAttribute("aria-expanded", "true"), this.$content.style.display = ""), !0
    },
    p.prototype.polyfillHandleInputs = function(t) {
        this.$summary.addEventListener("keypress", (function(e) {
            var n = e.target;
            13 !== e.keyCode && 32 !== e.keyCode || n instanceof HTMLElement && "summary" === n.nodeName.toLowerCase() && (e.preventDefault(), n.click ? n.click() : t(e))
        })),
        this.$summary.addEventListener("keyup", (function(t) {
            var e = t.target;
            32 === t.keyCode && e instanceof HTMLElement && "summary" === e.nodeName.toLowerCase() && t.preventDefault()
        })),
        this.$summary.addEventListener("click", t)
    },
    m.prototype.init = function() {
        if (this.$module) {
            var t = this.$module;
            this.setFocus(),
            t.addEventListener("click", this.handleClick.bind(this))
        }
    },
    m.prototype.setFocus = function() {
        var t = this.$module;
        this.config.disableAutoFocus || (t.setAttribute("tabindex", "-1"), t.addEventListener("blur", (function() {
            t.removeAttribute("tabindex")
        })), t.focus())
    },
    m.prototype.handleClick = function(t) {
        var e = t.target;
        this.focusTarget(e) && t.preventDefault()
    },
    m.prototype.focusTarget = function(t) {
        if (!(t instanceof HTMLAnchorElement))
            return !1;
        var e = this.getFragmentFromUrl(t.href);
        if (!e)
            return !1;
        var n = document.getElementById(e);
        if (!n)
            return !1;
        var i = this.getAssociatedLegendOrLabel(n);
        return !!i && (i.scrollIntoView(), n.focus({
                preventScroll: !0
            }), !0)
    },
    m.prototype.getFragmentFromUrl = function(t) {
        if (-1 !== t.indexOf("#"))
            return t.split("#").pop()
    },
    m.prototype.getAssociatedLegendOrLabel = function(t) {
        var e = t.closest("fieldset");
        if (e) {
            var n = e.getElementsByTagName("legend");
            if (n.length) {
                var i = n[0];
                if (t instanceof HTMLInputElement && ("checkbox" === t.type || "radio" === t.type))
                    return i;
                var o = i.getBoundingClientRect().top,
                    s = t.getBoundingClientRect();
                if (s.height && window.innerHeight)
                    if (s.top + s.height - o < window.innerHeight / 2)
                        return i
            }
        }
        return document.querySelector("label[for='" + t.getAttribute("id") + "']") || t.closest("label")
    };
    var f = {
        activated: "Loading.",
        timedOut: "Exit this page expired.",
        pressTwoMoreTimes: "Shift, press 2 more times to exit.",
        pressOneMoreTime: "Shift, press 1 more time to exit."
    };
    function v(t, i) {
        var r = {
            i18n: f
        };
        if (!(t instanceof HTMLElement))
            return this;
        var a = t.querySelector(".govuk-exit-this-page__button");
        if (!(a instanceof HTMLElement))
            return this;
        this.config = e(r, i || {}, o(t.dataset)),
        this.i18n = new s(n(this.config, "i18n")),
        this.$module = t,
        this.$button = a,
        this.$skiplinkButton = document.querySelector(".govuk-js-exit-this-page-skiplink"),
        this.$updateSpan = null,
        this.$indicatorContainer = null,
        this.$overlay = null,
        this.keypressCounter = 0,
        this.lastKeyWasModified = !1,
        this.timeoutTime = 5e3,
        this.keypressTimeoutId = null,
        this.timeoutMessageId = null
    }
    function b(t) {
        if (!(t instanceof HTMLElement))
            return this;
        this.$module = t,
        this.$menuButton = t.querySelector(".govuk-js-header-toggle"),
        this.$menu = this.$menuButton && t.querySelector("#" + this.$menuButton.getAttribute("aria-controls")),
        this.menuIsOpen = !1,
        this.mql = null
    }
    function g(t, n) {
        if (!(t instanceof HTMLElement))
            return this;
        this.$module = t;
        this.config = e({
            disableAutoFocus: !1
        }, n || {}, o(t.dataset))
    }
    function y(t) {
        if (!(t instanceof HTMLElement))
            return this;
        var e = t.querySelectorAll('input[type="radio"]');
        if (!e.length)
            return this;
        this.$module = t,
        this.$inputs = e
    }
    function w(t) {
        if (!(t instanceof HTMLAnchorElement))
            return this;
        this.$module = t,
        this.$linkedElement = null,
        this.linkedElementListener = !1
    }

    function E(t) {
        if (!(t instanceof HTMLElement))
            return this;
        var e = t.querySelectorAll("a.govuk-tabs__tab");
        if (!e.length)
            return this;
        this.$module = t,
        this.$tabs = e,
        this.keys = {
            left: 37,
            right: 39,
            up: 38,
            down: 40
        },
        this.jsHiddenClass = "govuk-tabs__panel--hidden",
        this.boundTabClick = this.onTabClick.bind(this),
        this.boundTabKeydown = this.onTabKeydown.bind(this),
        this.boundOnHashChange = this.onHashChange.bind(this),
        this.changingHash = !1
    }
    v.prototype.initUpdateSpan = function() {
        this.$updateSpan = document.createElement("span"),
        this.$updateSpan.setAttribute("role", "status"),
        this.$updateSpan.className = "govuk-visually-hidden",
        this.$module.appendChild(this.$updateSpan)
    },
    v.prototype.initButtonClickHandler = function() {
        this.$button.addEventListener("click", this.handleClick.bind(this)),
        this.$skiplinkButton && this.$skiplinkButton.addEventListener("click", this.handleClick.bind(this))
    },
    v.prototype.buildIndicator = function() {
        this.$indicatorContainer = document.createElement("div"),
        this.$indicatorContainer.className = "govuk-exit-this-page__indicator",
        this.$indicatorContainer.setAttribute("aria-hidden", "true");
        for (var t = 0; t < 3; t++) {
            var e = document.createElement("div");
            e.className = "govuk-exit-this-page__indicator-light",
            this.$indicatorContainer.appendChild(e)
        }
        this.$button.appendChild(this.$indicatorContainer)
    },
    v.prototype.updateIndicator = function() {
        this.keypressCounter > 0 ? this.$indicatorContainer.classList.add("govuk-exit-this-page__indicator--visible") : this.$indicatorContainer.classList.remove("govuk-exit-this-page__indicator--visible"),
        t(this.$indicatorContainer.querySelectorAll(".govuk-exit-this-page__indicator-light"), function(t, e) {
            t.classList.toggle("govuk-exit-this-page__indicator-light--on", e < this.keypressCounter)
        }.bind(this))
    },
    v.prototype.exitPage = function() {
        this.$updateSpan.innerText = "",
        document.body.classList.add("govuk-exit-this-page-hide-content"),
        this.$overlay = document.createElement("div"),
        this.$overlay.className = "govuk-exit-this-page-overlay",
        this.$overlay.setAttribute("role", "alert"),
        document.body.appendChild(this.$overlay),
        this.$overlay.innerText = this.i18n.t("activated"),
        window.location.href = this.$button.getAttribute("href")
    },
    v.prototype.handleClick = function(t) {
        t.preventDefault(),
        this.exitPage()
    },
    v.prototype.handleKeypress = function(t) {
        "Shift" !== t.key && 16 !== t.keyCode && 16 !== t.which || this.lastKeyWasModified ? null !== this.keypressTimeoutId && this.resetKeypressTimer() : (this.keypressCounter += 1, this.updateIndicator(), null !== this.timeoutMessageId && (clearTimeout(this.timeoutMessageId), this.timeoutMessageId = null), this.keypressCounter >= 3 ? (this.keypressCounter = 0, null !== this.keypressTimeoutId && (clearTimeout(this.keypressTimeoutId), this.keypressTimeoutId = null), this.exitPage()) : 1 === this.keypressCounter ? this.$updateSpan.innerText = this.i18n.t("pressTwoMoreTimes") : this.$updateSpan.innerText = this.i18n.t("pressOneMoreTime"), this.setKeypressTimer()),
        this.lastKeyWasModified = t.shiftKey
    },
    v.prototype.setKeypressTimer = function() {
        clearTimeout(this.keypressTimeoutId),
        this.keypressTimeoutId = setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime)
    },
    v.prototype.resetKeypressTimer = function() {
        clearTimeout(this.keypressTimeoutId),
        this.keypressTimeoutId = null,
        this.keypressCounter = 0,
        this.$updateSpan.innerText = this.i18n.t("timedOut"),
        this.timeoutMessageId = setTimeout(function() {
            this.$updateSpan.innerText = ""
        }.bind(this), this.timeoutTime),
        this.updateIndicator()
    },
    v.prototype.resetPage = function() {
        document.body.classList.remove("govuk-exit-this-page-hide-content"),
        this.$overlay && (this.$overlay.remove(), this.$overlay = null),
        this.$updateSpan.setAttribute("role", "status"),
        this.$updateSpan.innerText = "",
        this.updateIndicator(),
        this.keypressTimeoutId && clearTimeout(this.keypressTimeoutId),
        this.timeoutMessageId && clearTimeout(this.timeoutMessageId)
    },
    v.prototype.init = function() {
        this.buildIndicator(),
        this.initUpdateSpan(),
        this.initButtonClickHandler(),
        "govukFrontendExitThisPageKeypress" in document.body.dataset || (document.addEventListener("keyup", this.handleKeypress.bind(this), !0), document.body.dataset.govukFrontendExitThisPageKeypress = "true"),
        window.addEventListener("onpageshow" in window ? "pageshow" : "DOMContentLoaded", this.resetPage.bind(this))
    },
    b.prototype.init = function() {
        this.$module && this.$menuButton && this.$menu && ("matchMedia" in window ? (this.mql = window.matchMedia("(min-width: 48.0625em)"), "addEventListener" in this.mql ? this.mql.addEventListener("change", this.syncState.bind(this)) : this.mql.addListener(this.syncState.bind(this)), this.syncState(), this.$menuButton.addEventListener("click", this.handleMenuButtonClick.bind(this))) : this.$menuButton.setAttribute("hidden", ""))
    },
    b.prototype.syncState = function() {
        this.mql.matches ? (this.$menu.removeAttribute("hidden"), this.$menuButton.setAttribute("hidden", "")) : (this.$menuButton.removeAttribute("hidden"), this.$menuButton.setAttribute("aria-expanded", this.menuIsOpen.toString()), this.menuIsOpen ? this.$menu.removeAttribute("hidden") : this.$menu.setAttribute("hidden", ""))
    },
    b.prototype.handleMenuButtonClick = function() {
        this.menuIsOpen = !this.menuIsOpen,
        this.syncState()
    },
    g.prototype.init = function() {
        this.$module && this.setFocus()
    },
    g.prototype.setFocus = function() {
        var t = this.$module;
        this.config.disableAutoFocus || "alert" === t.getAttribute("role") && (t.getAttribute("tabindex") || (t.setAttribute("tabindex", "-1"), t.addEventListener("blur", (function() {
            t.removeAttribute("tabindex")
        }))), t.focus())
    },
    y.prototype.init = function() {
        if (this.$module && this.$inputs) {
            var e = this.$module;
            t(this.$inputs, (function(t) {
                var e = t.getAttribute("data-aria-controls");
                e && document.getElementById(e) && (t.setAttribute("aria-controls", e), t.removeAttribute("data-aria-controls"))
            })),
            window.addEventListener("onpageshow" in window ? "pageshow" : "DOMContentLoaded", this.syncAllConditionalReveals.bind(this)),
            this.syncAllConditionalReveals(),
            e.addEventListener("click", this.handleClick.bind(this))
        }
    },
    y.prototype.syncAllConditionalReveals = function() {
        t(this.$inputs, this.syncConditionalRevealWithInputState.bind(this))
    },
    y.prototype.syncConditionalRevealWithInputState = function(t) {
        var e = t.getAttribute("aria-controls");
        if (e) {
            var n = document.getElementById(e);
            if (n && n.classList.contains("govuk-radios__conditional")) {
                var i = t.checked;
                t.setAttribute("aria-expanded", i.toString()),
                n.classList.toggle("govuk-radios__conditional--hidden", !i)
            }
        }
    },
    y.prototype.handleClick = function(e) {
        var n = this,
            i = e.target;
        if (i instanceof HTMLInputElement && "radio" === i.type) {
            var o = document.querySelectorAll('input[type="radio"][aria-controls]'),
                s = i.form,
                r = i.name;
            t(o, (function(t) {
                var e = t.form === s;
                t.name === r && e && n.syncConditionalRevealWithInputState(t)
            }))
        }
    },
    w.prototype.init = function() {
        if (this.$module) {
            var t = this.getLinkedElement();
            t && (this.$linkedElement = t, this.$module.addEventListener("click", this.focusLinkedElement.bind(this)))
        }
    },
    w.prototype.getLinkedElement = function() {
        var t = this.getFragmentFromUrl();
        return t ? document.getElementById(t) : null
    },
    w.prototype.focusLinkedElement = function() {
        var t = this.$linkedElement;
        t.getAttribute("tabindex") || (t.setAttribute("tabindex", "-1"), t.classList.add("govuk-skip-link-focused-element"), this.linkedElementListener || (this.$linkedElement.addEventListener("blur", this.removeFocusProperties.bind(this)), this.linkedElementListener = !0)),
        t.focus()
    },
    w.prototype.removeFocusProperties = function() {
        this.$linkedElement.removeAttribute("tabindex"),
        this.$linkedElement.classList.remove("govuk-skip-link-focused-element")
    },
    w.prototype.getFragmentFromUrl = function() {
        if (this.$module.hash)
            return this.$module.hash.split("#").pop()
    },
    function(t) {
        "document" in this && "nextElementSibling" in document.documentElement || Object.defineProperty(Element.prototype, "nextElementSibling", {
            get: function() {
                for (var t = this.nextSibling; t && 1 !== t.nodeType;)
                    t = t.nextSibling;
                return t
            }
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    function(t) {
        "document" in this && "previousElementSibling" in document.documentElement || Object.defineProperty(Element.prototype, "previousElementSibling", {
            get: function() {
                for (var t = this.previousSibling; t && 1 !== t.nodeType;)
                    t = t.previousSibling;
                return t
            }
        })
    }.call("object" == typeof window && window || "object" == typeof self && self || "object" == typeof global && global || {}),
    E.prototype.init = function() {
        this.$module && this.$tabs && ("function" == typeof window.matchMedia ? this.setupResponsiveChecks() : this.setup())
    },
    E.prototype.setupResponsiveChecks = function() {
        this.mql = window.matchMedia("(min-width: 40.0625em)"),
        this.mql.addListener(this.checkMode.bind(this)),
        this.checkMode()
    },
    E.prototype.checkMode = function() {
        this.mql.matches ? this.setup() : this.teardown()
    },
    E.prototype.setup = function() {
        var e = this,
            n = this.$module,
            i = this.$tabs,
            o = n.querySelector(".govuk-tabs__list"),
            s = n.querySelectorAll(".govuk-tabs__list-item");
        if (i && o && s) {
            o.setAttribute("role", "tablist"),
            t(s, (function(t) {
                t.setAttribute("role", "presentation")
            })),
            t(i, (function(t) {
                e.setAttributes(t),
                t.addEventListener("click", e.boundTabClick, !0),
                t.addEventListener("keydown", e.boundTabKeydown, !0),
                e.hideTab(t)
            }));
            var r = this.getTab(window.location.hash) || this.$tabs[0];
            r && (this.showTab(r), window.addEventListener("hashchange", this.boundOnHashChange, !0))
        }
    },
    E.prototype.teardown = function() {
        var e = this,
            n = this.$module,
            i = this.$tabs,
            o = n.querySelector(".govuk-tabs__list"),
            s = n.querySelectorAll("a.govuk-tabs__list-item");
        i && o && s && (o.removeAttribute("role"), t(s, (function(t) {
            t.removeAttribute("role")
        })), t(i, (function(t) {
            t.removeEventListener("click", e.boundTabClick, !0),
            t.removeEventListener("keydown", e.boundTabKeydown, !0),
            e.unsetAttributes(t)
        })), window.removeEventListener("hashchange", this.boundOnHashChange, !0))
    },
    E.prototype.onHashChange = function() {
        var t = window.location.hash,
            e = this.getTab(t);
        if (e)
            if (this.changingHash)
                this.changingHash = !1;
            else {
                var n = this.getCurrentTab();
                n && (this.hideTab(n), this.showTab(e), e.focus())
            }
    },
    E.prototype.hideTab = function(t) {
        this.unhighlightTab(t),
        this.hidePanel(t)
    },
    E.prototype.showTab = function(t) {
        this.highlightTab(t),
        this.showPanel(t)
    },
    E.prototype.getTab = function(t) {
        return this.$module.querySelector('a.govuk-tabs__tab[href="' + t + '"]')
    },
    E.prototype.setAttributes = function(t) {
        var e = this.getHref(t).slice(1);
        t.setAttribute("id", "tab_" + e),
        t.setAttribute("role", "tab"),
        t.setAttribute("aria-controls", e),
        t.setAttribute("aria-selected", "false"),
        t.setAttribute("tabindex", "-1");
        var n = this.getPanel(t);
        n && (n.setAttribute("role", "tabpanel"), n.setAttribute("aria-labelledby", t.id), n.classList.add(this.jsHiddenClass))
    },
    E.prototype.unsetAttributes = function(t) {
        t.removeAttribute("id"),
        t.removeAttribute("role"),
        t.removeAttribute("aria-controls"),
        t.removeAttribute("aria-selected"),
        t.removeAttribute("tabindex");
        var e = this.getPanel(t);
        e && (e.removeAttribute("role"), e.removeAttribute("aria-labelledby"), e.classList.remove(this.jsHiddenClass))
    },
    E.prototype.onTabClick = function(t) {
        var e = this.getCurrentTab(),
            n = t.currentTarget;
        e && n instanceof HTMLAnchorElement && (t.preventDefault(), this.hideTab(e), this.showTab(n), this.createHistoryEntry(n))
    },
    E.prototype.createHistoryEntry = function(t) {
        var e = this.getPanel(t);
        if (e) {
            var n = e.id;
            e.id = "",
            this.changingHash = !0,
            window.location.hash = this.getHref(t).slice(1),
            e.id = n
        }
    },
    E.prototype.onTabKeydown = function(t) {
        switch (t.keyCode) {
        case this.keys.left:
        case this.keys.up:
            this.activatePreviousTab(),
            t.preventDefault();
            break;
        case this.keys.right:
        case this.keys.down:
            this.activateNextTab(),
            t.preventDefault()
        }
    },
    E.prototype.activateNextTab = function() {
        var t = this.getCurrentTab();
        if (t && t.parentElement) {
            var e = t.parentElement.nextElementSibling;
            if (e) {
                var n = e.querySelector("a.govuk-tabs__tab");
                n && (this.hideTab(t), this.showTab(n), n.focus(), this.createHistoryEntry(n))
            }
        }
    },
    E.prototype.activatePreviousTab = function() {
        var t = this.getCurrentTab();
        if (t && t.parentElement) {
            var e = t.parentElement.previousElementSibling;
            if (e) {
                var n = e.querySelector("a.govuk-tabs__tab");
                n && (this.hideTab(t), this.showTab(n), n.focus(), this.createHistoryEntry(n))
            }
        }
    },
    E.prototype.getPanel = function(t) {
        return this.$module.querySelector(this.getHref(t))
    },
    E.prototype.showPanel = function(t) {
        var e = this.getPanel(t);
        e && e.classList.remove(this.jsHiddenClass)
    },
    E.prototype.hidePanel = function(t) {
        var e = this.getPanel(t);
        e && e.classList.add(this.jsHiddenClass)
    },
    E.prototype.unhighlightTab = function(t) {
        t.parentElement && (t.setAttribute("aria-selected", "false"), t.parentElement.classList.remove("govuk-tabs__list-item--selected"), t.setAttribute("tabindex", "-1"))
    },
    E.prototype.highlightTab = function(t) {
        t.parentElement && (t.setAttribute("aria-selected", "true"), t.parentElement.classList.add("govuk-tabs__list-item--selected"), t.setAttribute("tabindex", "0"))
    },
    E.prototype.getCurrentTab = function() {
        return this.$module.querySelector(".govuk-tabs__list-item--selected a.govuk-tabs__tab")
    },
    E.prototype.getHref = function(t) {
        var e = t.getAttribute("href");
        return e.slice(e.indexOf("#"), e.length)
    },
    function(e) {
        var n = (e = void 0 !== e ? e : {}).scope instanceof HTMLElement ? e.scope : document;
        t(n.querySelectorAll('[data-module="govuk-accordion"]'), (function(t) {
            new a(t, e.accordion).init()
        })),
        t(n.querySelectorAll('[data-module="govuk-button"]'), (function(t) {
            new c(t, e.button).init()
        })),
        t(n.querySelectorAll('[data-module="govuk-character-count"]'), (function(t) {
            new d(t, e.characterCount).init()
        })),
        t(n.querySelectorAll('[data-module="govuk-checkboxes"]'), (function(t) {
            new h(t).init()
        })),
        t(n.querySelectorAll('[data-module="govuk-details"]'), (function(t) {
            new p(t).init()
        }));
        var i = n.querySelector('[data-module="govuk-error-summary"]');
        i && new m(i, e.errorSummary).init(),
        t(n.querySelectorAll('[data-module="govuk-exit-this-page"]'), (function(t) {
            new v(t, e.exitThisPage).init()
        }));
        var o = n.querySelector('[data-module="govuk-header"]');
        o && new b(o).init(),
        t(n.querySelectorAll('[data-module="govuk-notification-banner"]'), (function(t) {
            new g(t, e.notificationBanner).init()
        })),
        t(n.querySelectorAll('[data-module="govuk-radios"]'), (function(t) {
            new y(t).init()
        }));
        var s = n.querySelector('[data-module="govuk-skip-link"]');
        s && new w(s).init(),
        t(n.querySelectorAll('[data-module="govuk-tabs"]'), (function(t) {
            new E(t).init()
        }))
    }({
        errorSummary: {
            disableAutoFocus: !0
        },
        notificationBanner: {
            disableAutoFocus: !0
        }
    })
}();
//# sourceMappingURL=govuk-frontend-069e73dfb31aacad687703e346188e8c.js.map

class CharacterCount {
	constructor($module) {
		this.$module = $module;
		this.$textarea = $module.querySelector(".nhsuk-js-character-count");
		this.$visibleCountMessage = null;
		this.$screenReaderCountMessage = null;
		this.lastInputTimestamp = null;
	}

	// Initialize component
	init() {
		// Check that required elements are present
		if (!this.$textarea) {
			return;
		}

		// Check for module
		const { $module } = this;
		const { $textarea } = this;
		const $fallbackLimitMessage = document.getElementById(
			`${$textarea.id}-info`
		);

		// Move the fallback count message to be immediately after the textarea
		// Kept for backwards compatibility
		$textarea.insertAdjacentElement("afterend", $fallbackLimitMessage);

		// Create the *screen reader* specific live-updating counter
		// This doesn't need any styling classes, as it is never visible
		const $screenReaderCountMessage = document.createElement("div");
		$screenReaderCountMessage.className =
			"nhsuk-character-count__sr-status nhsuk-u-visually-hidden";
		$screenReaderCountMessage.setAttribute("aria-live", "polite");
		this.$screenReaderCountMessage = $screenReaderCountMessage;
		$fallbackLimitMessage.insertAdjacentElement(
			"afterend",
			$screenReaderCountMessage
		);

		// Create our live-updating counter element, copying the classes from the
		// fallback element for backwards compatibility as these may have been configured
		const $visibleCountMessage = document.createElement("div");
		$visibleCountMessage.className = $fallbackLimitMessage.className;
		$visibleCountMessage.classList.add("nhsuk-character-count__status");
		$visibleCountMessage.setAttribute("aria-hidden", "true");
		this.$visibleCountMessage = $visibleCountMessage;
		$fallbackLimitMessage.insertAdjacentElement(
			"afterend",
			$visibleCountMessage
		);

		// Hide the fallback limit message
		$fallbackLimitMessage.classList.add("nhsuk-u-visually-hidden");

		// Read options set using dataset ('data-' values)
		this.options = CharacterCount.getDataset($module);

		// Determine the limit attribute (characters or words)
		let countAttribute = this.defaults.characterCountAttribute;
		if (this.options.maxwords) {
			countAttribute = this.defaults.wordCountAttribute;
		}

		// Save the element limit
		this.maxLength = $module.getAttribute(countAttribute);

		// Check for limit
		if (!this.maxLength) {
			return;
		}

		// Remove hard limit if set
		$textarea.removeAttribute("maxlength");

		this.bindChangeEvents();

		// When the page is restored after navigating 'back' in some browsers the
		// state of the character count is not restored until *after* the DOMContentLoaded
		// event is fired, so we need to manually update it after the pageshow event
		// in browsers that support it.
		if ("onpageshow" in window) {
			window.addEventListener("pageshow", this.updateCountMessage.bind(this));
		} else {
			window.addEventListener(
				"DOMContentLoaded",
				this.updateCountMessage.bind(this)
			);
		}
		this.updateCountMessage();
	}

	// Read data attributes
	static getDataset(element) {
		const dataset = {};
		const { attributes } = element;
		if (attributes) {
			for (let i = 0; i < attributes.length; i++) {
				const attribute = attributes[i];
				const match = attribute.name.match(/^data-(.+)/);
				if (match) {
					dataset[match[1]] = attribute.value;
				}
			}
		}
		return dataset;
	}

	// Counts characters or words in text
	count(text) {
		let length;
		if (this.options.maxwords) {
			const tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars
			length = tokens.length; // eslint-disable-line prefer-destructuring
		} else {
			length = text.length; // eslint-disable-line prefer-destructuring
		}
		return length;
	}

	// Bind input propertychange to the elements and update based on the change
	bindChangeEvents() {
		const { $textarea } = this;
		$textarea.addEventListener("keyup", this.handleKeyUp.bind(this));

		// Bind focus/blur events to start/stop polling
		$textarea.addEventListener("focus", this.handleFocus.bind(this));
		$textarea.addEventListener("blur", this.handleBlur.bind(this));
	}

	// Speech recognition software such as Dragon NaturallySpeaking will modify the
	// fields by directly changing its `value`. These changes don't trigger events
	// in JavaScript, so we need to poll to handle when and if they occur.
	checkIfValueChanged() {
		if (!this.$textarea.oldValue) {
			this.$textarea.oldValue = "";
		}
		if (this.$textarea.value !== this.$textarea.oldValue) {
			this.$textarea.oldValue = this.$textarea.value;
			this.updateCountMessage();
		}
	}

	// Helper function to update both the visible and screen reader-specific
	// counters simultaneously (e.g. on init)
	updateCountMessage() {
		this.updateVisibleCountMessage();
		this.updateScreenReaderCountMessage();
	}

	// Update visible counter
	updateVisibleCountMessage() {
		const { $textarea } = this;
		const { $visibleCountMessage } = this;
		const remainingNumber = this.maxLength - this.count($textarea.value);

		// If input is over the threshold, remove the disabled class which renders the
		// counter invisible.
		if (this.isOverThreshold()) {
			$visibleCountMessage.classList.remove(
				"nhsuk-character-count__message--disabled"
			);
		} else {
			$visibleCountMessage.classList.add(
				"nhsuk-character-count__message--disabled"
			);
		}

		// Update styles
		if (remainingNumber < 0) {
			$textarea.classList.add("nhsuk-textarea--error");
			$visibleCountMessage.classList.remove("nhsuk-hint");
			$visibleCountMessage.classList.add("nhsuk-error-message");
		} else {
			$textarea.classList.remove("nhsuk-textarea--error");
			$visibleCountMessage.classList.remove("nhsuk-error-message");
			$visibleCountMessage.classList.add("nhsuk-hint");
		}

		// Update message
		$visibleCountMessage.innerHTML = this.formattedUpdateMessage();
	}

	// Update screen reader-specific counter
	updateScreenReaderCountMessage() {
		const { $screenReaderCountMessage } = this;

		// If over the threshold, remove the aria-hidden attribute, allowing screen
		// readers to announce the content of the element.
		if (this.isOverThreshold()) {
			$screenReaderCountMessage.removeAttribute("aria-hidden");
		} else {
			$screenReaderCountMessage.setAttribute("aria-hidden", true);
		}

		// Update message
		$screenReaderCountMessage.innerHTML = this.formattedUpdateMessage();
	}

	// Format update message
	formattedUpdateMessage() {
		const { $textarea } = this;
		const { options } = this;
		const remainingNumber = this.maxLength - this.count($textarea.value);

		let charVerb = "remaining";
		let charNoun = "character";
		let displayNumber = remainingNumber;
		if (options.maxwords) {
			charNoun = "word";
		}
		charNoun += remainingNumber === -1 || remainingNumber === 1 ? "" : "s";

		charVerb = remainingNumber < 0 ? "too many" : "remaining";
		displayNumber = Math.abs(remainingNumber);

		return `You have ${displayNumber} ${charNoun} ${charVerb}`;
	}

	// Checks whether the value is over the configured threshold for the input.
	// If there is no configured threshold, it is set to 0 and this function will
	// always return true.
	isOverThreshold() {
		const { $textarea } = this;
		const { options } = this;

		// Determine the remaining number of characters/words
		const currentLength = this.count($textarea.value);
		const { maxLength } = this;

		// Set threshold if presented in options
		const thresholdPercent = options.threshold ? options.threshold : 0;
		const thresholdValue = (maxLength * thresholdPercent) / 100;

		return thresholdValue <= currentLength;
	}

	// Update the visible character counter and keep track of when the last update
	// happened for each keypress
	handleKeyUp() {
		this.updateVisibleCountMessage();
		this.lastInputTimestamp = Date.now();
	}

	handleFocus() {
		// If the field is focused, and a keyup event hasn't been detected for at
		// least 1000 ms (1 second), then run the manual change check.
		// This is so that the update triggered by the manual comparison doesn't
		// conflict with debounced KeyboardEvent updates.
		this.valueChecker = setInterval(() => {
			if (
				!this.lastInputTimestamp ||
				Date.now() - 500 >= this.lastInputTimestamp
			) {
				this.checkIfValueChanged();
			}
		}, 1000);
	}

	handleBlur() {
		// Cancel value checking on blur
		clearInterval(this.valueChecker);
	}
}

CharacterCount.prototype.defaults = {
	characterCountAttribute: "data-maxlength",
	wordCountAttribute: "data-maxwords",
};

const characterCounts = document.querySelectorAll(
	'[data-module="nhsuk-character-count"]'
);
characterCounts.forEach((el) => {
	new CharacterCount(el).init();
});






