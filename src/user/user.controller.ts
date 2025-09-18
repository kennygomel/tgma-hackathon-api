import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { SearchInput } from "src/shared/dto/search.input";
import { CreateUserInput } from "src/user/dto/create-user.input";
import { UpdateUserInput } from "src/user/dto/update-user.input";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getList(@Param() params: SearchInput): Observable<User[] | null> {
    return this.userService.find(params);
  }

  @Get(":id")
  getSingle(@Param("id") id: string): Observable<User | null> {
    return this.userService.findOne({ where: { id } });
  }

  @Post()
  create(@Body() input: CreateUserInput): Observable<User> {
    return this.userService.create(input);
  }

  @Patch()
  update(@Body() input: UpdateUserInput): Observable<User | null> {
    const { id, ...restInput } = input;

    return this.userService.updateOne({ id }, restInput);
  }

  @Delete(":id")
  delete(@Param("id") id: string): Observable<number | null | undefined> {
    return this.userService.delete({ id });
  }
}
