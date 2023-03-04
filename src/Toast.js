export default class Toast {

    static show(text, duration = 2000) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.top = '0';
        div.style.left = '0';
        div.style.zIndex = 100;
        _Toast.show(text, duration);
        document.body.appendChild(div);
        setTimeout(() => {
            document.body.removeChild(div);
        }, duration);
    }

    static hide() {
        _Toast.hide();
    }
}