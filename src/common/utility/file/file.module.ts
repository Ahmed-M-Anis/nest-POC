import { Module } from '@nestjs/common';
import { FileService } from './file.service';

@Module({
  providers: [FileService],
  exports: [FileService], // Export FileService for use in other modules
})
export class FileModule {}
