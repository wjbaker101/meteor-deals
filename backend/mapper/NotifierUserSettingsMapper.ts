import { NotifierUserSettings } from '../../common/model/NotifierUserSettings';

export const NotifierUserSettingsMapper = {

    fromFirestore(id: string, settings: any): NotifierUserSettings {
        return {
            ...settings,
        }
    },
}
