export const getRandomProfileImg = () => {
    const list = ['blue', 'brown', 'green', 'magenta', 'orange', 'purple', 'red', 'turquoise']

    return `/images/${list[Math.floor(Math.random() * list.length)]}-square.svg`
}


export const sortObjByKey = (obj, key) => {
    obj.sort((a, b) => {
        let fa = a[key].toLowerCase(),
            fb = b[key].toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
}