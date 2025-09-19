import {
  Body,
  Controller,
  MethodNotAllowedException,
  Patch,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { CurrentUser } from "src/auth/shared/current-user.decorator";
import { UpdateUserInput } from "src/user/dto/update-user.input";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Patch()
  update(
    @CurrentUser() user: User,
    @Body() input: UpdateUserInput,
  ): Observable<User | null> {
    const { id, ...restInput } = input;

    if (user.id !== id) {
      throw new MethodNotAllowedException("Action is not allowed");
    }

    return this.userService.updateOne({ id }, restInput);
  }
}
