import { Body, Controller, Delete, Get, Inject, Logger, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserCreateRequestDto } from '../dto/user-create-request.dto/user-create-request.dto';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity/user.entity';
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL, Cache } from '@nestjs/cache-manager';
// import { UserUpdateRequestDto } from '../dto/user-update-request.dto/user-update-request.dto';


@Controller('user')
export class UserController {

    constructor(private userServices: UserService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}
    
    @Post()
    public postUser(@Body() user: UserCreateRequestDto): Promise<void> {
        this.userServices.createUser(user);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    

    @Get()
    public getUser(@Body('uuid') uuid: string) {

        Logger.log('-------------------------');
        Logger.log('uuid', uuid);

        let getCache = this.cacheManager.get("uuid")
        Logger.log(getCache);
        let setCache = this.cacheManager.set("uuid", UserEntity);
        getCache = this.cacheManager.get("uuid")
        Logger.log(getCache);


        return this.userServices.findOne(uuid);
    }

    @Get('/all')
    public getUserAll(): Promise<UserEntity[]> {
        return this.userServices.findAll();
    }

    @Delete()
    public deleteUser(@Body('uuid') uuid:string): Promise<void> {
        this.userServices.delete(uuid);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    // @Put()
    // public updateUser(@Body() user: UserUpdateRequestDto): Promise<void> {
    //     this.userServices.update(user);
    //     return new Promise<void>((resolve, reject) => {
    //         resolve();
    //     });
    // }


}