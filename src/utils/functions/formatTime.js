async function formatTime(time) {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    var ret = ``;
    if (hrs > 0) {
        ret += `${hrs}h `;
        // + (mins < 10 ? "0" : "")
    }
    //  + (secs < 10 ? "0" : "")
    ret += `${mins}m `;
    if (secs > 0) {
        ret += `${secs}s `;
    }
    return ret;
}

function removeElement(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }

    return arr;
    }

module.exports = {
    formatTime,
    removeElement,
}