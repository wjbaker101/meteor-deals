import fs from 'fs';
import path from 'path';

export const ResourceUtils = {

    getResource(file: string): string {
        const fileLocation = path.join(__dirname, '../resources/', file);

        return fs.readFileSync(fileLocation, 'utf8');
    },
}

