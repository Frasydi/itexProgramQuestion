import { z } from "zod";

export const ZSoal = z.object({
    nama: z.string().min(1),
    codeAwal: z.string().min(1),
    codePenentu: z.string().min(1),
    soal: z.string().min(1)
})

export type ISoal = z.infer<typeof ZSoal>