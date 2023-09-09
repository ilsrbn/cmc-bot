import { Ctx, Start, Update } from "nestjs-telegraf";
import { HOME_SCENE_ID } from "@/app.constants";
import { Context } from "@/interfaces/context.interface";
import { UserService } from "@services";

@Update()
export class AppService {
  constructor(private readonly userService: UserService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    // Initialize custom session values

    const userId = ctx.from.id;
    const user = await this.userService.getUser(userId);

    if (!user) await this.userService.register({ tg_id: userId });

    await ctx.scene.enter(HOME_SCENE_ID);
  }
}
