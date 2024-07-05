import { z } from "zod";

export const ZJawaban = z.object({
    code: z.string().min(1),
    waktu: z.string().min(1),
    memori: z.number().min(1),
});


export type IJawaban = z.infer<typeof ZJawaban>

