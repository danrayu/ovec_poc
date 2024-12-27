import { Context } from "../../Context/Types/Context";
export type Action = (context: Context) => Promise<Context>;
