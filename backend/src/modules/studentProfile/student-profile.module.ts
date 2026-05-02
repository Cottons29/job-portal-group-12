import {Module} from '@nestjs/common';
import {MulterModule} from '@nestjs/platform-express';
import {TypeOrmModule} from '@nestjs/typeorm';
import {memoryStorage} from 'multer';

import {SheepFileService} from '../../common/sheep-file.service';
import {User} from '../user/user.entity';
import {StudentProfile} from './student-profile.entity';
import {StudentProfileController} from './student-profile.controller';
import {StudentProfileService} from './student-profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentProfile, User]),
        MulterModule.register({
            storage: memoryStorage(),
            limits: {fileSize: 5 * 1024 * 1024},
        }),
    ],
    controllers: [StudentProfileController],
    providers: [StudentProfileService, SheepFileService],
    exports: [StudentProfileService],
})
export class StudentProfileModule {
}
