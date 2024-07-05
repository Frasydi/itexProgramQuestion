import React, { useEffect, useMemo } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Space, Table, type MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/auth';
import { useFetch } from '../hooks/useFetch';




const UserHome: React.FC = () => {


    const [data, loading, error, refetch] = useFetch<{
        id: number, username: string, jawabans: {
            code: string,
            memori: number,
            waktu: string
        }[]
    }[]>("/user/soal")
    const rout = useNavigate()



    const procData: {
        id: number, username: string,
        memori: number | string,
        waktu: string

    }[] = useMemo(() => {
        console.log(data)
        if (data == null) return []
        return data.map(el => {
            const { jawabans, ...newEl } = el
            console.log(jawabans)
            if (jawabans.length > 0) {
                return {
                    ...newEl,
                    memori: jawabans[0].memori+"Kb",
                    waktu: jawabans[0].waktu,

                }
            }

            return { ...newEl, memori: "Belum Terjawab", waktu: "Belum Terjawab" }
        })
    }, [data])

    return (
        <Layout style={{
            minHeight: "100vh"
        }}>

            <Table dataSource={procData || []} columns={[
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
                    title: "Penggunaan Memori",
                    dataIndex: "memori",
                    key: "memori"
                },
                {
                    title: "Waktu",
                    dataIndex: "waktu",
                    key: "waktu"
                },
                {
                    title: "Aksi",
                    render: (_, record) => (
                        <Space size="middle">

                            <a onClick={() => {
                                rout("/jawab/" + record.id)
                            }}>Jawab</a>
                        </Space>
                    ),
                }
            ]} />
        </Layout>
    );
};

export default UserHome;