const formatMessage = (msg) => {
    const time = new Date().getTime();
    return ("[" + time + "] " + msg);
}

export const logger = {
    info: (msg, status) => {
        console.log(formatMessage("INFO: " + msg + " [" + status + "]"));
    },
    debug: (msg) => {
        console.log(formatMessage("DEBUG: " + msg));
    }
}