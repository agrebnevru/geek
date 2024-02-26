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

        if (e.clientX) {
            target.oldX = e.clientX;
            target.oldY = e.clientY;
        } else {
            target.oldX = e.touches[0].clientX;
            target.oldY = e.touches[0].clientY;
        }

        target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
        target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

        document.onmousemove = dr;
        document.ontouchmove = dr;

        function dr(event) {
            event.preventDefault();

            if (!target.moving) {
                return;
            }

            if (event.clientX) {
                target.distX = event.clientX - target.oldX;
                target.distY = event.clientY - target.oldY;
            } else {
                target.distX = event.touches[0].clientX - target.oldX;
                target.distY = event.touches[0].clientY - target.oldY;
            }


            target.style.left = target.oldLeft + target.distX + "px";
            target.style.top = target.oldTop + target.distY + "px";
        }

        function endDrag() {
            target.moving = false;
            target.dataset.draggable = false
        }
        target.onmouseup = endDrag;
        target.ontouchend = endDrag;
    }

}
