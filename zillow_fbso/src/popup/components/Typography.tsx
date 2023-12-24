import { Space, Typography } from 'antd';

const { Text, Link } = Typography;

const App = ({ label }: any) => (
    <Space direction="vertical">
        <Text>{label}</Text>
    </Space>
);

export default App;