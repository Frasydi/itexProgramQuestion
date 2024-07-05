import { useParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch"
import { useEffect, useRef, useState } from "react"
import { Layout } from "antd"
import TextArea from "antd/es/input/TextArea"
import apifetch from "../../util/axios"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
import { CodeiumEditor } from "@codeium/react-code-editor"

export default function LihatJawaban() {
    const params = useParams()
    const [stdOut, setStdOut] = useState("")
    const [error, setError] = useState<boolean | null>(null)
    const [memory, setMemory] = useState<number | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const cancelRef = useRef()
    const [data, loading2, error2, refetch] = useFetch<{
        jawabans: {
            code: string,
            waktu: string,
            memori: string,
            user: {
                username: string
            }
        }[], nama: string, soal: string, codeAwal: string
    }>("/admin/jawaban/" + params.id)
    useEffect(() => {
        console.log(data)
    }, [data])

    async function coding(code: string) {
        setStdOut("")
        setError(null)
        setLoading(true)
        try {
            const feting = await apifetch.post("/user/code/" + params.id, {
                code: code
            })

            console.log(feting.data)

            if (feting.data.stderr.length > 0) {
                setError(true)
                console.log(feting.data.stderr)
                setStdOut(feting.data.stdout + "\n" + feting.data.stderr)
            } else {
                setError(false)
                setStdOut(feting.data.stdout)
                setMemory(feting.data.memoryUsage / 1024)
            }
            onOpen()

        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    return (
        <div>
            {
                data != null && <>
                    <h1 style={{
                        fontSize: 20
                    }}>
                        {data.nama}
                    </h1>
                    <p>
                        {data.soal}
                    </p>

                    <h3 style={{
                        fontSize: 15
                    }}>Kode Panitia</h3>
                    <CodeiumEditor options={{
                        readOnly: true
                    }} value={data.codeAwal} height={"80vh"} language="java" theme="vs-dark" />

                    <h3 style={{
                        fontSize: 20,
                        marginTop: "10vh"
                    }}>Jawaban</h3>
                    {
                        data.jawabans.map(el => <div>
                            <h3 style={{
                                fontSize: 15,
                            }}>Dari {el.user.username}</h3>
                            <CodeiumEditor options={{
                                readOnly: true
                            }} value={el.code} height={"70vh"} language="java" theme="vs-dark" />

                            <Button isLoading={loading} onClick={() => {
                                coding(el.code)
                            }}>Jalankan</Button>
                        </div>)
                    }
                </>
            }

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as any}
                onClose={() => {
                    onClose()
                    setStdOut("")
                    setError(false)
                    setMemory(null)
                }}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Output
                        </AlertDialogHeader>

                        <AlertDialogBody style={{
                            color: error != null && error == false ? "green" : "red"
                        }}>
                            <h3 style={{
                                fontSize: 15
                            }}>Output</h3>
                            <p>
                                {stdOut}
                            </p>
                            <h3 style={{
                                fontSize: 15
                            }}>Memori : {memory}KB</h3>

                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Oke
                            </Button>

                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </div>
    )
}