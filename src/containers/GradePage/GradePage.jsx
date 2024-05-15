import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Flex, Grid, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { NavigationContext } from '../../providers/NavigationProvider';
import { capitalizeFirstLetter, getParamsFromUrl } from '../../helpers/general';
import SemesterSelection from '../../components/SearchFormItems/SemesterSelection';
import { get } from '../../helpers/request';

const commonItemStyle = {
    margin: 0,
};

const GradePage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle } = layoutState;
    const { xs } = Grid.useBreakpoint();
    const formRef = useRef(null);

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();

    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState([]);

    const columns = [
        {
            title: 'Subject',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: data => capitalizeFirstLetter(data),
        },
        {
            title: 'Grades',
            children: [
                {
                    title: 'Q1',
                    dataIndex: 'quarter_1',
                    key: 'quarter_1',
                    render: (_, record) => record?.grade?.quarter_1 || '-',
                },
                {
                    title: 'Q2',
                    dataIndex: 'quarter_2',
                    key: 'quarter_2',
                    render: (_, record) => record?.grade?.quarter_2 || '-',
                },
                {
                    title: 'Final',
                    dataIndex: 'final_grade',
                    key: 'final_grade',
                    render: (_, record) => {
                        const { quarter_1, quarter_2 } = record?.grade || {};

                        let grade;
                        if (quarter_1 && quarter_2) {
                            grade = (quarter_1 + quarter_2) / 2;
                        }

                        return grade ? Math.round(grade) : '-';
                    },
                },
            ],
        },
    ];

    const getGrades = async (query) => {
        setLoading(true);

        const response = await get({ uri: '/student/grades', query, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoading(false);
            return;
        }

        setGrades(response?.data?.grades);
        setLoading(false);
    };

    useEffect(() => {
        setTitle('Grades');
        getGrades();

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Flex
                justify="end"
                wrap="wrap"
                gap={10}
                style={{ margin: '10px 0px' }}
            >
                <Form
                    ref={formRef}
                    onFinish={values => {
                        const { semester_id } = values;
                        getGrades({ semester_id });
                    }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 10,
                    }}
                >
                    <Form.Item
                        name="semester_id"
                        style={{
                            ...commonItemStyle,
                            ...(xs && { width: '100%' }),
                        }}
                    >
                        <SemesterSelection
                            formRef={formRef}
                            name="semester_id"
                            on
                        />
                    </Form.Item>
                    <Form.Item
                        style={{
                            ...commonItemStyle,
                            ...(xs && { width: '100%' }),
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<SearchOutlined/>}
                            htmlType="submit"
                            style={{ ...(xs && { width: '100%' }) }}
                        >
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
            <Table
                loading={loading}
                scroll={ { x: true } }
                dataSource={grades.map(grade => {
                    return { ...grade, key: grade._id };
                })}
                size="middle"
                bordered
                columns={columns}
                pagination={false}
            />
        </>
    );
};

export default GradePage;