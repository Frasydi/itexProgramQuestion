import {z} from "zod"
export const ZLogin = z.object({
    username : z.string().min(1),
    password : z.string().min(1)
})

export type ILogin = z.infer<typeof ZLogin>