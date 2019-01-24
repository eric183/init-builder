import { TweenMax, TimelineLite, CSSPlugin, ScrollToPlugin, Draggable, Elastic } from "gsap/all";

export const AnimationController = {

    show: function(target) { TweenMax.to(target, 0.2, { height: 140 }) },
    hide: function(target) { TweenMax.to(target, 0.2, { height: 0 }) },

    animalUp: function(event) {
        let imgNode = event.currentTarget.getElementsByTagName('img')[0];
        TweenMax.to(imgNode, 0.1, { transform: 'translateY(0px)' })
    },
    animalDown: function(event) {
        let imgNode = event.currentTarget.getElementsByTagName('img')[0];
        TweenMax.to(imgNode, 0.1, { transform: 'translateY(80px)' })
    },

    backButtonEnter: function(event) {
        TweenMax.to(event.currentTarget, 0.1, { transform: 'translateX(0px)' })
    },
    backButtonLeave: function(event) {
        TweenMax.to(event.currentTarget, 0.1, { transform: 'translateX(-46px)' })
    },

    animal_up: function(event) {
        let imgNode = event.currentTarget.getElementsByTagName('img')[0];
        TweenMax.to(imgNode, 0.1, { transform: 'translateY(0px)' })
    },
    animal_down: function(event) {
        let imgNode = event.currentTarget.getElementsByTagName('img')[0];
        TweenMax.to(imgNode, 0.1, { transform: 'translateY(98px)' })
    },



};