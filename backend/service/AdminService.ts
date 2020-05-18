import { LogUtils } from '../util/LogUtils';

import { NotifierResult } from '../../common/model/NotifierResult';
import { CacheService } from './CacheService';

export const AdminService = {

    getLatestNotification(): NotifierResult | null {
        LogUtils.log('AdminService.getLatestNotification');

        return CacheService.get<NotifierResult>('latest_notification');
    },
}
