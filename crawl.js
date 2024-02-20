// The base of this implementation was taken from the video:
// https://www.youtube.com/watch?v=C0pXaNchNTA&t=3101s
function normalizeUrl(url_string) {
    const url_obj = new URL(url_string);
    const host_path = `${url_obj.hostname}${url_obj.pathname}`;
    if(host_path.length > 0 && host_path.slice(-1) === '/') {
        return host_path.slice(0, -1);
    }

    return host_path;
}

module.exports = {
    normalizeUrl
}