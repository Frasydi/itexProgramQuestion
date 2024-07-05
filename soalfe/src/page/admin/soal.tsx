import { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { Layout, Space, Table } from "antd"
import {
   
    Button,
} from '@chakra-ui/react'
import Swal from "sweetalert2"
import apifetch from "../../util/axios"
import { useNavigate } from "react-router-dom"
import { Textarea } from '@chakra-ui/react'

export default function AdminSoal() {

    const [data, loading, error, refetch] = useFetch<{ id: number, username: string }[]>("/admin/soal")
    const btnRef = useRef()
    const rout = useNavigate()
    useEffect(() => {

    }, [])

  
    async function hapusData(id : number) {

        const result = await Swal.fire({
            title: 'Apakah Anda Yakin Ingin Menghapus Data ini?',
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Tidak',
            
          })

          if(result.isConfirmed == false) return

        try {
            const feting = await apifetch.delete("/admin/soal/"+id)

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
                text: "Berhasil Menghapus Soal",
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
            }} ref={btnRef as any} colorScheme='teal' onClick={() => {
                rout("/admin/soal/create")
            }}>
                Buat Soal
            </Button>
            
            <Table dataSource={data || []} columns={[
                {
                    title: "Id",
                    dataIndex: "id",
                    key: "id"
                },
                {
                    title: "Nama",
                    dataIndex: "nama",
                    key: "nama"
                },
                {
                    title: "Aksi",
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={() => {
                                rout("/admin/jawaban/"+record.id)
                            }}>Lihat Jawaban</a>
                            <a onClick={() => {
                                hapusData(record.id)
                            }}>Hapus</a>
                            <a onClick={() => {
                                rout("/admin/soal/"+record.id)
                            }}>Edit</a>
                        </Space>
                    ),
                }
            ]} />

        </Layout>
    )
}