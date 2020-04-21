const padNumber = (n: number): string => {
    if (n > 9) return String(n);
    return `0${n}`;
};

const padLong = (n: number): string => {
    if (n > 99) return String(n);
    if (n > 9) return `0${n}`;
    return `00${n}`;
};

export const LogUtils = {

    log(message: string): void {
        const date = new Date();

        const day = padNumber(date.getDate());
        const month = padNumber(date.getMonth() + 1);
        const year = date.getFullYear();

        const hours = padNumber(date.getHours());
        const minutes = padNumber(date.getMinutes());
        const seconds = padNumber(date.getSeconds());
        const milliseconds = padLong(date.getMilliseconds());

        console.log(`[${day}/${month}/${year} @ ${hours}:${minutes}:${seconds}.${milliseconds}] - ${message}`);
    },
}
