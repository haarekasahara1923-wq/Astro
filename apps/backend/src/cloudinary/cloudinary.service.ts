import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async generateUploadSignature() {
        const timestamp = Math.round(Date.now() / 1000);
        const folder = 'cosmic-gems';

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return {
            signature,
            timestamp,
            folder,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        };
    }

    async uploadImage(base64String: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(base64String, {
                folder: 'cosmic-gems',
                resource_type: 'image',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });
            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Failed to upload image');
        }
    }

    async uploadMultipleImages(base64Strings: string[]): Promise<string[]> {
        try {
            const uploadPromises = base64Strings.map(base64 => this.uploadImage(base64));
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Cloudinary batch upload error:', error);
            throw new Error('Failed to upload images');
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new Error('Failed to delete image');
        }
    }
}
