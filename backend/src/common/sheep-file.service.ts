import {Injectable, InternalServerErrorException, ServiceUnavailableException,} from '@nestjs/common';

export interface SheepUploadedFile {
    filename: string;
    originalName: string;
    size: number;
    contentType: string;
    url: string;
    streamUrl: string;
}

interface SheepUploadResponse {
    filename: string;
    original_name: string;
    size: number;
    content_type: string;
    url: string;
    stream_url: string;
}

@Injectable()
export class SheepFileService {
    private readonly baseUrl = this.normalizeBaseUrl(
        process.env.SHEEP_URL || 'http://127.0.0.1:3001',
    );
    private readonly apiKey = process.env.SHEEP_API_KEY;

    async upload(file: Express.Multer.File): Promise<SheepUploadedFile> {
        if (!this.apiKey) {
            throw new ServiceUnavailableException(
                'Sheep file service API key is not configured',
            );
        }

        const fileBytes = file.buffer.buffer.slice(
            file.buffer.byteOffset,
            file.buffer.byteOffset + file.buffer.byteLength,
        ) as ArrayBuffer;
        const form = new FormData();
        form.append(
            'file',
            new Blob([fileBytes], {
                type: file.mimetype || 'application/octet-stream',
            }),
            file.originalname,
        );

        let response: Response;
        try {
            response = await fetch(`${this.baseUrl}/upload`, {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                },
                body: form,
            });
        } catch (error) {
            console.error('Failed to upload file to sheep file service:', error);
            throw new ServiceUnavailableException(
                'Sheep file service is unavailable',
            );
        }

        if (!response.ok) {
            const body = await response.text().catch(() => '');
            console.error('Sheep file service upload failed:', response.status, body);
            throw new InternalServerErrorException(
                'Failed to upload file to sheep file service',
            );
        }

        const uploaded = (await response.json()) as SheepUploadResponse;
        return {
            filename: uploaded.filename,
            originalName: uploaded.original_name,
            size: uploaded.size,
            contentType: uploaded.content_type,
            url: this.saveFileUrl(uploaded.filename),
            streamUrl: this.saveStreamUrl(uploaded.filename),
        };
    }

    async fetchFile(filename: string, range?: string): Promise<Response> {
        if (!this.apiKey) {
            throw new ServiceUnavailableException(
                'Sheep file service API key is not configured',
            );
        }

        const headers: Record<string, string> = {
            'x-api-key': this.apiKey,
        };

        if (range) {
            headers.Range = range;
        }

        let response: Response;
        try {
            response = await fetch(this.fileUrl(filename), {headers});
        } catch (error) {
            console.error('Failed to fetch file from sheep file service:', error);
            throw new ServiceUnavailableException(
                'Sheep file service is unavailable',
            );
        }

        if (!response.ok && response.status !== 206) {
            const body = await response.text().catch(() => '');
            console.log("Url ", this.fileUrl(filename), {headers})
            console.error('Sheep file service fetch failed:', response.status, body);
            throw new InternalServerErrorException(
                'Failed to fetch file from sheep file service',
            );
        }

        return response;
    }

    // don't fucking change this again
    saveFileUrl(filename: string): string {
        return `/files/${encodeURIComponent(filename)}`;
    }

    // don't fucking change this again
    saveStreamUrl(filename: string): string {
        return `/files/${encodeURIComponent(filename)}`;
    }

    fileUrl(filename: string): string {
        if (filename.includes(this.baseUrl)) {
            return filename;
        }

        return this.toAbsoluteUrl(this.saveFileUrl(filename));
    }

    streamUrl(filename: string): string {
        if (filename.includes(this.baseUrl)) {
            return filename;
        }
        return this.toAbsoluteUrl(this.saveStreamUrl(filename));
    }

    private normalizeBaseUrl(rawUrl: string): string {
        const withScheme = /^https?:\/\//i.test(rawUrl)
            ? rawUrl
            : `http://${rawUrl}`;
        return withScheme.replace(/\/+$/, '');
    }

    public toAbsoluteUrl(pathOrUrl: string): string {
        if (/^https?:\/\//i.test(pathOrUrl)) {
            return pathOrUrl;
        }

        return `${this.baseUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
    }
}
