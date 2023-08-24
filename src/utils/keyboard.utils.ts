import { InlineKeyboardMarkup } from "typegram/markup";

export class Keyboard {
  buildInlineKeyboard(
    buttons: Array<string> = [],
    cols: number | "auto" = "auto"
  ): InlineKeyboardMarkup {
    return {
      inline_keyboard: [[]],
    };
  }
}
