import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, notification } from 'antd';

import AuthProvider from '../providers/AuthProvider';
import NavigationProvider from '../providers/NavigationProvider';
import NavigationHeader from '../components/NavigationHeader';
import Card from '../components/Card';

const { Content, Footer } = Layout;

const Navigation = () => {
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const [title, setTitle] = useState(null);

    const [notificationApi, notificationContextHolder] = notification.useNotification();

    return (
        <AuthProvider>
            <NavigationProvider
                value={{
                    breadcrumbItems,
                    setBreadcrumbItems,
                    title,
                    setTitle,
                    notificationApi,
                }}
            >
                <Layout>
                    {notificationContextHolder}
                    <Layout>
                        <NavigationHeader/>
                        <Content
                            className="nav-content"
                            style={{
                                padding: '15px 15px 0px 315px',
                                marginTop: 64,
                            }}
                        >
                            <Card title={title}>
                                <Outlet/>
                            </Card>
                        </Content>
                        <Footer
                            className="nav-content"
                            style={{ textAlign: 'center', padding: '10px 0px 0px 300px' }}
                        >
                            © 2024 Mayorga National High School. All rights reserved.
                        </Footer>
                    </Layout>
                </Layout>
            </NavigationProvider>
        </AuthProvider>
    );
};

export default Navigation;