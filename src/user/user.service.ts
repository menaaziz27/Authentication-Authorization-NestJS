import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') readonly userModel: Model<IUser>) {}

  async create(user): Promise<IUser> {
    return await this.userModel.create(user);
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findByPayload(payload: any) {
    return await this.userModel.findOne(payload);
  }

  async update(userId, userData) {
    return await this.userModel.updateOne({ _id: userId }, userData);
  }
}
