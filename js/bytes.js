function formatBytes(bytes) {
    if (bytes >= 1099511627776) {
        bytes = Math.round(bytes / 1099511627776, 2) + ' TB';
    } else if (bytes >= 1073741824) {
        bytes = Math.round(bytes / 1073741824, 2) + ' GB';
    } else if (bytes >= 1048576) {
        bytes = Math.round(bytes / 1048576, 2) + ' MB';
    } else if (bytes >= 1024) {
        bytes = Math.round(bytes / 1024, 2) + ' kB';
    } else if (bytes > 1) {
        bytes = bytes + ' bytes';
    } else if (bytes == 1)  {
        bytes = bytes + ' byte';
    } else {
        bytes = '0 bytes';
    }
    return bytes;
}