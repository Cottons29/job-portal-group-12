import {
  Controller,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request, Response as ExpressResponse } from 'express';

import { SheepFileService } from '../common/sheep-file.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly sheepFileService: SheepFileService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const uploadedFile = await this.sheepFileService.upload(file);
    const fileUrl = this.backendFileUrl(request, uploadedFile.filename);

    return {
      message: 'File uploaded successfully',
      file: {
        originalname: uploadedFile.originalName,
        filename: uploadedFile.filename,
        size: uploadedFile.size,
        mimetype: uploadedFile.contentType,
        url: fileUrl,
        streamUrl: fileUrl,
      },
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: Request,
  ) {
    const uploadedFiles = await Promise.all(
      files.map((file) => this.sheepFileService.upload(file)),
    );

    return {
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles.map((f) => ({
        originalname: f.originalName,
        filename: f.filename,
        size: f.size,
        mimetype: f.contentType,
        url: this.backendFileUrl(request, f.filename),
        streamUrl: this.backendFileUrl(request, f.filename),
      })),
    };
  }

  @Get('files/:filename')
  @Header('Accept-Ranges', 'bytes')
  async proxyFile(
    @Param('filename') filename: string,
    @Headers('range') range: string | undefined,
    @Res() response: ExpressResponse,
  ) {
    const sheepResponse = await this.sheepFileService.fetchFile(
      filename,
      range,
    );
    response.status(sheepResponse.status);

    for (const header of [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'etag',
      'last-modified',
    ]) {
      const value = sheepResponse.headers.get(header);
      if (value) response.setHeader(header, value);
    }

    if (!sheepResponse.body) {
      return response.end();
    }

    const body = Buffer.from(await sheepResponse.arrayBuffer());
    return response.send(body);
  }

  private backendFileUrl(request: Request, filename: string): string {
    return `${request.protocol}://${request.get('host')}/api/upload/files/${encodeURIComponent(filename)}`;
  }
}
