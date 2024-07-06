import { useNavigate, useParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch"
import { useEffect, useState } from "react"
import { Layout } from "antd"
import TextArea from "antd/es/input/TextArea"
import { Button, Textarea } from "@chakra-ui/react"
import apifetch from "../../util/axios"
import Swal from "sweetalert2"
import { CodeiumEditor } from "@codeium/react-code-editor";

export default function JawabSoal() {
    const params = useParams()
    const [data, loading, error2, refetch] = useFetch<{
        id: Number, nama: string, soal: string, codePenentu: string, jawabans: {
            code: string
        }[]
    }>("/user/soal/" + params.id)
    const [code, setCode] = useState("")
    const [cleanCode, setCleanCode] = useState("")
    const [stdOut, setStdOut] = useState("")
    const [error, setError] = useState<boolean | null>(null)
    const [memory, setMemory] = useState<number | null>(null)
    const [load, setLoading] = useState(false)
    const [time, setTime] = useState(null)
    const nav = useNavigate()
    async function coding() {
        if (code.length == 0) return
        setStdOut("")
        setTime(null)
        setError(null)
        setLoading(true)
        setCleanCode("")
        try {
            const feting = await apifetch.post("/user/code/" + data?.id, {
                code: code
            })

            console.log(feting.data)

            if (feting.data.stderr.length > 0) {
                setError(true)
                setStdOut(feting.data.stdout + "\n" + feting.data.stderr)
            } else {
                setError(false)
                setStdOut(feting.data.stdout)
                setMemory(feting.data.memoryUsage / 1024)
                setTime(feting.data.cpuUsage)
                setCleanCode(code)
            }

        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    async function creatJawaban() {
        if (code.length == 0) return
        if (memory == null) return
        if (error == null) return
        if (error == true) return
        try {
            const feting = await apifetch.post("/user/jawaban/" + params.id, {
                code : cleanCode,
                waktu: time+"ms",
                memori: memory,
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
                text: "Berhasil Menjawab Soal",
                icon: "success"
            })
            nav("/")


        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Ada Masalah",
                icon: "error"
            })
        }
    }



    useEffect(() => {
        console.log(data)
        if (data == null) return
        if (data.jawabans.length == 0) {
            setCode(data.codePenentu)
        } else {
            setCode(data.jawabans[0].code)
        }

    }, [data])
    return (
        <div style={{
            flexDirection: "row",
            display: "flex",
            minHeight: "100vh",
            gap: 10
        }}>
            {
                data != null && <>
                    <div style={{
                        width: "30%"
                    }}>
                        <h1 style={{
                            fontSize: 20
                        }}>{data.nama}</h1>
                        <p style={{
                            fontSize: 15
                        }}>{data.soal}</p>
                    </div>
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <CodeiumEditor  options={{
                            codeLens :false
                        }} value={code} onChange={(ev) => {
                            setCode(ev || "")
                        }} height={"80vh"} language="java" theme="vs-dark" />

                        {
                            error != null && error == false &&
                            <>
                                <h1 style={{
                                    fontSize: 20,
                                    color: "green"
                                }}>Penggunaan Memory : {memory} KB</h1>
                                <h1 style={{
                                    fontSize: 20,
                                    color: "green"
                                }}>Waktu Eksekusi : {time}ms</h1>
                            </>
                        }
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}>
                            <Button style={{
                                marginTop: 10,
                                marginBottom: 10,
                                width: error != null && error == false ? "40%" : "100%"
                            }} onClick={() => { coding() }} isLoading={load} >Jalankan</Button>
                            <Button colorScheme="green" style={{
                                marginTop: 10,
                                marginBottom: 10,
                                width: error != null && error == false ? "40%" : "0%",
                                display: error != null && error == false ? "block" : "none"

                            }} onClick={() => { creatJawaban() }} >Submit</Button>
                        </div>
                        <Textarea value={stdOut} disabled color={error ? "red" : "green"} />
                    </div>
                </>
            }

        </div>
    )
}