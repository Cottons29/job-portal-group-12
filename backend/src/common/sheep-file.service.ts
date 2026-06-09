import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
    private readonly logger = new Logger(SheepFileService.name);
    private readonly uploadDir = path.join(process.cwd(), 'uploads');
    
    private readonly baseUrl = this.normalizeBaseUrl(
        process.env.SHEEP_URL || 'http://127.0.0.1:3001',
    );
    private readonly apiKey = process.env.SHEEP_API_KEY;

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            try {
                fs.mkdirSync(this.uploadDir, { recursive: true });
            } catch (err) {
                this.logger.error(`Failed to create uploads directory: ${err.message}`);
            }
        }
    }

    async upload(file: Express.Multer.File): Promise<SheepUploadedFile> {
        // 1. Try remote Sheep File Service if configured and not pointing to ourselves
        const isRemoteAvailable = this.apiKey && 
            !this.baseUrl.includes('3080') && 
            !this.baseUrl.includes('localhost:3000') && 
            !this.baseUrl.includes('127.0.0.1:3000');

        if (isRemoteAvailable) {
            try {
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

                const response = await fetch(`${this.baseUrl}/upload`, {
                    method: 'POST',
                    headers: {
                        'x-api-key': this.apiKey!,
                    },
                    body: form,
                });

                if (response.ok) {
                    const uploaded = (await response.json()) as SheepUploadResponse;
                    return {
                        filename: uploaded.filename,
                        originalName: uploaded.original_name,
                        size: uploaded.size,
                        contentType: uploaded.content_type,
                        url: this.saveFileUrl(uploaded.filename),
                        streamUrl: this.saveStreamUrl(uploaded.filename),
                    };
                } else {
                    const body = await response.text().catch(() => '');
                    this.logger.warn(`Remote upload failed (${response.status}: ${body}). Falling back to local storage.`);
                }
            } catch (error) {
                this.logger.warn(`Remote upload threw error: ${error.message}. Falling back to local storage.`);
            }
        } else {
            this.logger.log('Sheep API key not configured or pointing to backend. Using local storage.');
        }

        // 2. Local fallback storage
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${baseName}-${uniqueSuffix}${ext}`;
        const filePath = path.join(this.uploadDir, filename);

        try {
            fs.writeFileSync(filePath, file.buffer);
            return {
                filename,
                originalName: file.originalname,
                size: file.size,
                contentType: file.mimetype,
                url: this.saveFileUrl(filename),
                streamUrl: this.saveStreamUrl(filename),
            };
        } catch (err) {
            this.logger.error(`Failed to save file locally: ${err.message}`);
            throw err;
        }
    }

    async fetchFile(filename: string, range?: string): Promise<Response> {
        // 1. Try local storage first
        const filePath = path.join(this.uploadDir, filename);
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const contentType = this.getMimeType(filename);

            if (range) {
                try {
                    const parts = range.replace(/bytes=/, "").split("-");
                    const start = parseInt(parts[0], 10);
                    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                    const chunksize = (end - start) + 1;

                    const fd = fs.openSync(filePath, 'r');
                    const buffer = Buffer.alloc(chunksize);
                    fs.readSync(fd, buffer, 0, chunksize, start);
                    fs.closeSync(fd);

                    return new Response(buffer, {
                        status: 206,
                        headers: {
                            'Content-Type': contentType,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': chunksize.toString(),
                            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        }
                    }) as any;
                } catch (e) {
                    this.logger.error(`Error reading partial file: ${e.message}`);
                }
            }

            const buffer = fs.readFileSync(filePath);
            return new Response(buffer, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': fileSize.toString(),
                }
            }) as any;
        }

        // 2. Fall back to remote Sheep File Service
        if (this.apiKey) {
            const headers: Record<string, string> = {
                'x-api-key': this.apiKey,
            };
            if (range) {
                headers.Range = range;
            }

            try {
                const response = await fetch(this.fileUrl(filename), { headers });
                if (response.ok || response.status === 206) {
                    return response;
                }
            } catch (error) {
                this.logger.error(`Failed to fetch file from remote sheep service: ${error.message}`);
            }
        }

        return new Response('File not found', { status: 404 }) as any;
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

    private getMimeType(filename: string): string {
        const ext = path.extname(filename).toLowerCase();
        const map: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
            '.pdf': 'application/pdf',
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.txt': 'text/plain',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
        };
        return map[ext] || 'application/octet-stream';
    }
}
