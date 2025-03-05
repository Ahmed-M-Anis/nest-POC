import { Injectable, BadRequestException } from '@nestjs/common';
import { extname, join } from 'path';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class FileService {
  /**
   * Generates a unique filename based on the current timestamp and a random number.
   */
  generateUniqueFilename(originalName: string, fieldName: string): string {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = extname(originalName);
    return `${fieldName}-${uniqueSuffix}${ext}`;
  }

  /**
   * Saves the file to the specified directory, creating the directory if it does not exist.
   */
  async saveFileToDirectory(
    uploadDir: string,
    filename: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, filename);
    await fs.writeFile(filePath, fileBuffer);
    return filePath;
  }

  /**
   * Removes a file from the filesystem.
   */
  async removeFile(filePath: string): Promise<boolean> {
    try {
      const absolutePath = join(process.cwd(), filePath);
      if (existsSync(absolutePath)) {
        await fs.unlink(absolutePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error removing file: ${filePath}`, error);
      return false;
    }
  }

  /**
   * Validates if the uploaded file is an image.
   */
  imageValidation(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new BadRequestException('Only image files are allowed.'),
        false,
      );
    }
    callback(null, true);
  }

  /**
   * Validates if the uploaded file is a PDF or Word document.
   */
  fileValidation(req, file, callback) {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only PDFs and Word documents are allowed.'),
        false,
      );
    }
    callback(null, true);
  }
}
