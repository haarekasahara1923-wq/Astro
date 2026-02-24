import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class ZegoService {
    constructor(private configService: ConfigService) { }

    generateToken(userId: string, roomId: string): { token: string; appId: number; userId: string; roomId: string } {
        const appId = parseInt(this.configService.get<string>('ZEGOCLOUD_APP_ID') || '0');
        const serverSecret = this.configService.get<string>('ZEGOCLOUD_SERVER_SECRET') || '';

        const effectiveTimeInSeconds = 3600; // 1 hour
        const createTime = Math.floor(Date.now() / 1000);
        const expireTime = createTime + effectiveTimeInSeconds;

        const nonce = Math.floor(Math.random() * 2147483647);

        const payload = {
            app_id: appId,
            user_id: userId,
            nonce,
            ctime: createTime,
            expire: expireTime,
            payload: '',
        };

        const payloadStr = JSON.stringify(payload);
        const payloadHex = Buffer.from(payloadStr).toString('hex');

        const hmac = crypto.createHmac('sha256', serverSecret);
        const hash = hmac.update(payloadStr).digest('hex');

        const token = `04${appId.toString().padStart(8, '0')}${expireTime.toString(16).padStart(8, '0')}${nonce.toString(16).padStart(8, '0')}${hash}${payloadHex}`;

        return {
            token,
            appId,
            userId,
            roomId,
        };
    }
}
