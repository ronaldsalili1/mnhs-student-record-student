import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Flex, theme, Typography, Button, Alert } from 'antd';

import backgroundImg from '../../images/mnhs-bg.webp';
import mnhsLogo from '../../images/mnhs-logo.webp';
import { post } from '../../helpers/request';
import { getParamsFromUrl } from '../../helpers/general';
import { getAuthenticated, setAuthenticated } from '../../helpers/localStorage';

const { Text, Link } = Typography;

const LoginPage = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const [meta, setMeta] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loadingOtpResend, setLoadingOtpResend] = useState(false);

    const requestOtp = async (resend) => {
        !resend && setLoadingSubmit(true);
        resend && setLoadingOtpResend(true);
    
        const body = {
            email,
            resend,
        };
    
        const response = await post({
            uri: '/student/auth/request-otp',
            body,
            navigate,
            location,
        });
    
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            setLoadingOtpResend(false);
            return;
        }
    
        setMeta({
            code: 200,
            message: 'An OTP has been sent to your email.',
        });
        setTimeout(() => setMeta(null), 3000);
        setLoadingSubmit(false);
        setLoadingOtpResend(false);
        setOtpSent(true);
    };

    const login = async (otp) => {
        setLoadingSubmit(true);
    
        const body = {
            email,
            otp,
        };
    
        const response = await post({
            uri: '/student/auth/login',
            body,
            navigate,
            location,
        });
    
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            setTimeout(() => setMeta(null), 3000);
            return;
        }
    
        setLoadingSubmit(false);
        setAuthenticated();

        const query = getParamsFromUrl();
        if (query.path) {
            navigate(query.path, { replace: true });
            return;
        }

        navigate('/grades', { replace: true });
    };

    useEffect(() => {
        const authenticated = getAuthenticated();
        if (authenticated === 'yes') {
            const query = getParamsFromUrl();
            if (query.path) {
                navigate(query.path, { replace: true });
            } else {
                navigate('/grades');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
            }}
        >
            <Flex
                vertical
                gap={10}
                style={{
                    maxWidth: 400,
                    width: '100%',
                    backgroundColor: token.colorSider,
                    padding: 20,
                    borderRadius: 10,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    opacity: 0.96,
                }}
            >
                {
                    meta &&
                    <Alert
                        message={meta.message}
                        type={meta?.code === 200 ? 'success' : 'error'}
                        showIcon
                    />
                }
                <Flex
                    align="center"
                    style={{ marginBottom: 15 }}
                >
                    <img
                        src={mnhsLogo}
                        alt="MNHS Logo"
                        width={100}
                    />
                    <div
                        style={{
                            height: 80,
                            width: 1,
                            backgroundColor: '#ce1a21',
                            margin: '0px 10px',
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 35,
                            fontWeight: 600,
                            lineHeight: 1.1,
                        }}
                    >
                        MNHS Student Record System
                    </Text>
                </Flex>
                {
                    otpSent ?
                        <div>
                            <Text>Please provide the one-time password (OTP) that was sent to your email.</Text> <br/><br/>
                            <Flex justify="center">
                                <Input.OTP
                                    length={6}
                                    size="large"
                                    onChange={value => login(value)}
                                />
                            </Flex>
                            <br/><Text>Did not receive code?</Text> <Link onClick={() => requestOtp(true)}>{loadingOtpResend ? 'Sending...' : 'Send again'}</Link>
                        </div>
                        : <div>
                            <Text strong>Email:</Text>
                            <Input
                                size="large"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                }
                {
                    !otpSent &&
                    <Button
                        disabled={!email || email === ''}
                        loading={loadingSubmit}
                        type="primary"
                        size="large"
                        style={{ marginTop: 20 }}
                        onClick={() => requestOtp(false)}
                    >
                        Login
                    </Button>
                }
            </Flex>
        </Flex>
    );
};

export default LoginPage;