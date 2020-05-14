const isProduction = process.env.NODE_ENV === 'production';

export const Env = {

    value<T>(productionValue: T, otherValue: T): T {
        if (isProduction) {
            return productionValue;
        }

        return otherValue;
    },
}
