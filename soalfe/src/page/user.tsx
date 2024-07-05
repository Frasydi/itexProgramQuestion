import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/auth';

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['Home', 'About', ''].map((key) => ({
    key,
    label: `${key}`,
}));



const User: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const loc = useLocation()
    const rout = useNavigate()
    const auth = useAuth()

    const items2: MenuProps['items'] = [
        {

            key: "sub0",
            label: "Home",
            onClick: () => {
                rout("/")
            }
        },
        {
            key: "sub3",
            label: "Log Out",
            onClick: () => {
                auth.logout()
            }
        }
      
    ]



    return (
        <Layout style={{
            minHeight: "100vh"
        }}>

            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items2}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        {
                            loc.pathname.split("/").map(el => <Breadcrumb.Item key={el}>{el}</Breadcrumb.Item>).slice(1)
                        }
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default User;