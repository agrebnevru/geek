// https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging

export default class WindowDraggable {
    
    static draggable(e) {
        // console.log('Window::draggable')
        let target = e.target.closest('.js-window')
        if (false === target.classList.contains('js-window') || 'true' === target.dataset.fullsize) {
            return
        }

        target.moving = true;
        target.dataset.draggable = true

        //NOTICE THIS 👇 Check if Mouse events exist on users' device
        if (e.clientX) {
            target.oldX = e.clientX; // If they exist then use Mouse input
            target.oldY = e.clientY;
        } else {
            target.oldX = e.touches[0].clientX; // Otherwise use touch input
            target.oldY = e.touches[0].clientY;
        }
        //NOTICE THIS 👆 Since there can be multiple touches, you need to mention which touch to look for, we are using the first touch only in this case

        target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
        target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

        document.onmousemove = dr;
        //NOTICE THIS 👇
        document.ontouchmove = dr;
        //NOTICE THIS 👆

        function dr(event) {
            event.preventDefault();

            if (!target.moving) {
                return;
            }
            //NOTICE THIS 👇
            if (event.clientX) {
                target.distX = event.clientX - target.oldX;
                target.distY = event.clientY - target.oldY;
            } else {
                target.distX = event.touches[0].clientX - target.oldX;
                target.distY = event.touches[0].clientY - target.oldY;
            }
            //NOTICE THIS 👆

            target.style.left = target.oldLeft + target.distX + "px";
            target.style.top = target.oldTop + target.distY + "px";
        }

        function endDrag() {
            target.moving = false;
            target.dataset.draggable = false
        }
        target.onmouseup = endDrag;
        //NOTICE THIS 👇
        target.ontouchend = endDrag;
        //NOTICE THIS 👆
    }

}
