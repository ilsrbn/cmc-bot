import { UserRepository } from "@/repositories/user";
import { Injectable, Inject } from "@nestjs/common";

class registerDTO {
  tg_id: number;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerForm: registerDTO) {
    return await this.userRepository.createUser({ ...registerForm });
  }

  async getUser(id: number) {
    return await this.userRepository.getUserById(id);
  }
}
