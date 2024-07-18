import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity/user.entity';
import { Repository } from 'typeorm';
import { UserCreateRequestDto } from '../dto/user-create-request.dto/user-create-request.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

// import { UserUpdateRequestDto } from '../dto/user-update-request.dto/user-update-request.dto';

@Injectable()

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {};

    async createUser(user: UserCreateRequestDto): Promise<void>{
        let newUser = new UserEntity();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.password = user.password;
        newUser = await this.userRepository.save(newUser);
    }

    async findAll(): Promise<UserEntity[]>{
        return await this.userRepository.find();
    }

   
    async findOne(uuid: string): Promise<UserEntity>{

        Logger.log("uuid");
        Logger.log(uuid);

        let cachedName = await this.cacheManager.get<UserEntity>(uuid);
        Logger.log(cachedName);
        if(cachedName){
            console.log("cached---------------------------------------");
            return cachedName;
        }

        const user = await this.userRepository.findOne({where: {uuid: uuid}});
        Logger.log(user);
        Logger.log("cached---------------------------------------");
        await this.cacheManager.set(user.uuid, user);
        cachedName = await this.cacheManager.get<UserEntity>(uuid);
        Logger.log(JSON.stringify(cachedName));
        return user;
        
        // return await this.userRepository.findOne({where: {uuid: uuid}});
    }

    // async update(user: UserUpdateRequestDto): Promise<void>{
    //     let userEntity = await this.userRepository.findOne({where: {uuid: user.uuid}});
    //     userEntity.name = user.name==null?userEntity.name:user.name;
    //     userEntity.email = user.email==null?userEntity.email:user.email;
    //     userEntity.password = user.password==null?userEntity.password:user.password;
    //     userEntity = await this.userRepository.save(userEntity);
    // }

    async delete(uuid: string): Promise<void>{
        const user = await this.userRepository.findOne({where: {uuid: uuid}});
        await this.userRepository.remove(user);
    }




}
