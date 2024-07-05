import { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { Layout, Space, Table } from "antd"
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    useDisclosure,
} from '@chakra-ui/react'
import Swal from "sweetalert2"
import apifetch from "../../util/axios"


export default function AdminUser() {

    const [data, loading, error, refetch] = useFetch<{ id: number, username: string }[]>("/admin/user")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {

    }, [])

    async function submitData(ev: FormEvent) {
        ev.preventDefault()
        if (username.length == 0) return
        if (password.length == 0) return
        try {
            const feting = await apifetch.post("/admin/user", {
                username,
                password
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
                text: "Berhasil Menambahkan User",
                icon: "success"
            })
            onClose()

            refetch()

        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Ada Masalah",
                icon: "error"
            })
        }
    }
    async function hapusData(id : number) {

        const result = await Swal.fire({
            title: 'Apakah Anda Yakin Ingin Menghapus Data ini?',
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Tidak',
            
          })

          if(result.isConfirmed == false) return

        try {
            const feting = await apifetch.delete("/admin/user/"+id)

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
                text: "Berhasil Menghapus User",
                icon: "success"
            })

            refetch()

        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Ada Masalah",
                icon: "error"
            })
        }
    }
    return (
        <Layout>

            <Button style={{
                width: "30%"
            }} ref={btnRef as any} colorScheme='teal' onClick={onOpen}>
                Buat User
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef as any}
            >
                <form onSubmit={submitData}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Buat Akun</DrawerHeader>

                        <DrawerBody >
                            <Input value={username} onChange={ev => setUsername(ev.target.value)} placeholder='User' />
                            <Input value={password} onChange={ev => setPassword(ev.target.value)} placeholder='Password' />
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} type="button" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' type="submit">Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </form>
            </Drawer>
            <Table dataSource={data || []} columns={[
                {
                    title: "Id",
                    dataIndex: "id",
                    key: "id"
                },
                {
                    title: "Nama",
                    dataIndex: "username",
                    key: "username"
                },
                {
                    title: "Aksi",
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={() => {
                                hapusData(record.id)
                            }}>Hapus</a>
                        </Space>
                    ),
                }
            ]} />

        </Layout>
    )
}