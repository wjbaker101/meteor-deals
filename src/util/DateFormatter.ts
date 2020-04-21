const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];

const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;

export const DateFormatter = {

    formatDate(date: Date): string {
        const day = days[date.getDay()];
        const _date = date.getDate();

        const hours = this.padNumber(date.getHours());
        const minutes = this.padNumber(date.getMinutes());

        return `${day} ${_date} @ ${hours}:${minutes}`;
    },

    getDaysRemaining(from: Date, to: Date): number {
        const fromT = from.getTime();
        const toT = to.getTime();

        const diff = toT - fromT;

        // 1000 * 60 * 60 * 24 => 86400000
        return Math.round(diff / 86400000);
    },

    getRemainingText(startDate: Date, endDate: Date): string {
        const diff = endDate.getTime() - startDate.getTime();

        if (diff >= 0) {
            if (diff > ONE_WEEK * 2) {
                const output = Math.round(diff / ONE_WEEK);
                const plural = output === 1 ? '' : 's'

                return `${output} Week${plural} Remaining`;
            }

            if (diff > ONE_DAY * 2) {
                const output = Math.round(diff / ONE_DAY);
                const plural = output === 1 ? '' : 's'

                return `${output} Day${plural} Remaining`;
            }

            if (diff > ONE_HOUR) {
                const output = Math.round(diff / ONE_HOUR);
                const plural = output === 1 ? '' : 's'

                return `${output} Hour${plural} Remaining`;
            }

            return `Less Than 1 Hour Remaining`;
        }
        else {
            const diffAbs = Math.abs(diff);

            if (diffAbs > ONE_WEEK * 2) {
                const output = Math.round(diffAbs / ONE_WEEK);
                const plural = output === 1 ? '' : 's'

                return `Ended ${output} Week${plural} Ago`;
            }

            if (diffAbs > ONE_DAY * 2) {
                const output = Math.round(diffAbs / ONE_DAY);
                const plural = output === 1 ? '' : 's'

                return `Ended ${output} Day${plural} Ago`;
            }

            if (diffAbs > ONE_HOUR) {
                const output = Math.round(diffAbs / ONE_HOUR);
                const plural = output === 1 ? '' : 's'

                return `Ended ${output} Hour${plural} Ago`;
            }

            return `Ended Less Than 1 Hour Ago`;
        }
    },

    getTimeAsInputValue(): string {
        const now = new Date();
        return `${now.getHours()}:${now.getMinutes()}`;
    },

    getDateAsInputValue(): string {
        const date = new Date();
        return `${date.getDate()}/${this.padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
    },

    padNumber(n: number): string {
        if (n > 9) {
            return String(n);
        }

        return `0${n}`;
    },

    isValidDate(date: Date): boolean {
        return date instanceof Date && !Number.isNaN(date.getTime());
    },
}
