import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { Dropbox } from 'dropbox';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class DropboxService {

  constructor() {
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const dbx = new Dropbox({
      accessToken: process.env.DBX_ACCESS_TOKEN,
    });
    const uniqueFileName = DropboxService.generateUniqueFileName(file.originalname);

    const uploadedFileMetadata = await dbx.filesUpload({
      path: `/${ uniqueFileName }`,
      contents: file.buffer,
    });
    const sharedFileMetadata = await dbx.sharingCreateSharedLinkWithSettings({
      path: uploadedFileMetadata.result.path_lower,
    });

    return DropboxService.convertSharedLinkToPermanent(sharedFileMetadata.result.url);
  }

  private static generateUniqueFileName(oldFileName: string): string {
    return crypto.randomBytes(64)
      .toString('hex') + path.extname(oldFileName);
  }

  private static convertSharedLinkToPermanent(sharedLink: string): string {
    return sharedLink.split('?')[0] + '?raw=1';
  }
}
