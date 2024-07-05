import { Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apifetch from "../../util/axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

export default function EditSoal() {
    const [codeAwal, setCodeAwal] = useState("")
    const [codeAkhir, setCodeAkhir] = useState("")
    const [namaSoal, setNamaSoal] = useState("")
    const [soalMaker, setSoalMaker] = useState("")
    const [stdOut, setStdOut] = useState("")
    const [error, setError] = useState<boolean | null>(null)

    const params = useParams()
    const [data, loading, error2, refetch] = useFetch<any>("/admin/soal/"+params.id)
    const nav = useNavigate()

    useEffect(() => {
        if(data == null) return
        setCodeAwal(data.codeAwal)
        setCodeAkhir(data.codePenentu)
        setNamaSoal(data.nama)
        setSoalMaker(data.soal)
    }, [data])

    async function createSoal() {
        if (codeAwal.length == 0) return
        if (codeAkhir.length == 0) return
        if (namaSoal.length == 0) return
        if (soalMaker.length == 0) return
        try {
            const feting = await apifetch.put("/admin/soal/"+params.id, {
                nama : namaSoal,
                soal : soalMaker,
                codeAwal : codeAwal,
                codePenentu : codeAkhir
            })

            if (feting.status >= 400) {
                Swal.fire({
                    title: "Error",
                    text: feting.data.message,
                    icon: "error"
                })
                return
            }

            Swal.fire({
                title: "Berhasil",
                text: "Berhasil Menambahkan Soal",
                icon: "success"
            })
            nav("/admin/soal")


        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Ada Masalah",
                icon: "error"
            })
        }
    }

    async function coding() {
        if (codeAwal.length == 0) return
        if (codeAkhir.length == 0) return
        setStdOut("")
        setError(null)
        try {
            const feting = await apifetch.post("/user/code", {
                code: codeAwal + "\n" + codeAkhir
            })

            console.log(feting.data)

            if (feting.data.stderr.length > 0) {
                setError(true)
                console.log(feting.data.stderr)
                setStdOut(feting.data.stdout+"\n"+feting.data.stderr)

            } else {
                setError(false)
                setStdOut(feting.data.stdout)

            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div style={{
            flexDirection: "column",
            gap: 10,
        }}>
            <FormControl>
                <FormLabel>Nama Soal</FormLabel>
                <Input value={namaSoal} style={{
                    marginTop: 20,
                    marginBottom: 20
                }} onChange={(ev) => setNamaSoal(ev.target.value)} placeholder="Nama Soal" />
            </FormControl>

            <FormControl>
                <FormLabel>Deskripsi Soal</FormLabel>
                <Textarea style={{
                    marginTop: 20,
                    marginBottom: 20
                }} minHeight={300} value={soalMaker} onChange={(ev) => setSoalMaker(ev.target.value)} placeholder='Deskripsi Soal' />
            </FormControl>
            <FormControl>
                <FormLabel>Program Panitia</FormLabel>
                <Textarea style={{
                    marginTop: 20,
                    marginBottom: 20
                }} minHeight={500} value={codeAwal} onChange={(ev) => setCodeAwal(ev.target.value)} placeholder='Program Untuk Penginputan Data Dan Pengecekan' />
            </FormControl>
            <FormControl>
                <FormLabel>Program Untuk Peserta</FormLabel>
                <Textarea style={{
                    marginTop: 20,
                    marginBottom: 20
                }} minHeight={500} value={codeAkhir} onChange={(ev) => setCodeAkhir(ev.target.value)} placeholder='Program Awal Untuk Peserta' />
            </FormControl>
            <Button onClick={() => { coding() }} >Jalankan</Button>
            <Textarea value={stdOut} disabled color={error ? "red" : "green"} />

            <Button onClick={() => {
                createSoal()
            }} colorScheme="green">Edit Soal</Button>
        </div>

    )
}