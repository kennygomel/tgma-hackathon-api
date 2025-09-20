import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  MethodNotAllowedException,
  Param,
  Patch,
  UseInterceptors,
} from "@nestjs/common";
import { Observable, switchMap } from "rxjs";
import { CurrentUser } from "src/auth/shared/current-user.decorator";
import { MaskSensitiveDataInterceptor } from "src/shared/interceptors/mask-sensitive-data.interceptor";
import { UpdateUserInput } from "src/user/dto/update-user.input";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Controller("user")
@UseInterceptors(MaskSensitiveDataInterceptor, ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(":id")
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() input: UpdateUserInput,
  ): Observable<User | null> {
    const { email, ...restInput } = input;

    if (user.id !== id) {
      throw new MethodNotAllowedException("Action is not allowed");
    }

    return this.userService.findOne({ where: { id } }).pipe(
      switchMap((user: User) =>
        this.userService.updateOne(
          { id },
          {
            ...restInput,
            ...(email !== user.email
              ? { email: email ?? null, email_confirmed: false }
              : {}),
          },
        ),
      ),
    );
  }
}
