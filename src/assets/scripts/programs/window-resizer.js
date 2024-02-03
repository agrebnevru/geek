// https://stackoverflow.com/questions/8960193/how-to-make-html-element-resizable-using-pure-javascript

const MIN_WIDTH = 640
const MIN_HEIGHT = 480

function getIntStyle(element, key) {
    return parseInt(window.getComputedStyle(element).getPropertyValue(key))
}

export default class WindowResizer {

    static resizeXPositive(element) {
        let offsetX
        function dragMouseDown(e) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            element.dataset.resize = true
            const { clientX } = e;
            offsetX = clientX - element.offsetLeft - getIntStyle(element, 'width');
            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
        }

        function elementDrag(e) {
            const { clientX } = e;
            let x = clientX - element.offsetLeft - offsetX
            if (x < MIN_WIDTH) x = MIN_WIDTH;
            element.style.width = x + 'px';
        }

        function closeDragElement(e) {
            element.dataset.resize = false
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

    static resizeYPositive(element) {
        let offsetY
        function dragMouseDown(e) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            element.dataset.resize = true
            const { clientY } = e;
            offsetY = clientY - element.offsetTop - getIntStyle(element, 'height');

            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
        }

        function elementDrag(e) {
            const { clientY } = e;
            let y = clientY - element.offsetTop - offsetY;
            if (y < MIN_HEIGHT) y = MIN_HEIGHT;
            element.style.height = y + 'px';
        }

        function closeDragElement() {
            element.dataset.resize = false
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

    static resizeXNegative(element) {
        let offsetX
        let startX
        let startW
        let maxX
        function dragMouseDown(e) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            element.dataset.resize = true
            const { clientX } = e;
            startX = getIntStyle(element, 'left')
            startW = getIntStyle(element, 'width')
            offsetX = clientX - startX;
            maxX = startX + startW - MIN_WIDTH

            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
        }

        function elementDrag(e) {
            const { clientX } = e;
            let x = clientX - offsetX
            let w = startW + startX - x
            if (w < MIN_WIDTH) w = MIN_WIDTH;
            if (x > maxX) x = maxX;
            element.style.left = x + 'px';
            element.style.width = w + 'px';
        }

        function closeDragElement() {
            element.dataset.resize = false
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

    static resizeYNegative(element) {
        let offsetY
        let startY
        let startH
        let maxY
        function dragMouseDown(e) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            element.dataset.resize = true
            const { clientY } = e;
            startY = getIntStyle(element, 'top')
            startH = getIntStyle(element, 'height')
            offsetY = clientY - startY;
            maxY = startY + startH - MIN_HEIGHT

            document.addEventListener('mouseup', closeDragElement, false)
            document.addEventListener('mousemove', elementDrag, false)
        }

        function elementDrag(e) {
            const { clientY } = e;
            let y = clientY - offsetY
            let h = startH + startY - y
            if (h < MIN_HEIGHT) h = MIN_HEIGHT;
            if (y > maxY) y = maxY;
            element.style.top = y + 'px';
            element.style.height = h + 'px';
        }

        function closeDragElement() {
            element.dataset.resize = false
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

}
