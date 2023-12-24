import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Input as AntDInput, Space } from 'antd';
import { InputNumber as InputNumAntD } from 'antd';
import React from 'react';
import { Typography } from '.';
const { Search, TextArea: AntDTextArea } = AntDInput;

function Input({ label, value, setValue, variant = 'outlined', ...props }: any) {
    const onChangeHandle = (e: any) => { setValue(e.target.value) }
    return (
        <Space>
            <AntDInput addonBefore={label} value={value} onChange={onChangeHandle} {...props} />
        </Space>
    )
}


const TextArea = ({ label, value, setValue, rows = 6, ...props }: any) => {
    const onChangeHandle = (e: any) => { setValue(e.target.value) }
    return <>
        <Typography label={label} />
        <AntDTextArea onChange={onChangeHandle} value={value} style={{ width: '100%' }} rows={rows} {...props} />
    </>
}

const SearchInput = ({ value, setValue, placeholder, onSearch, ...props }: any) => {
    const onChangeHandle = (e: any) => {
        setValue(e.target.value)
    }
    const onSearchHandle = (value: string) => onSearch(value);
    return <Search
        placeholder={placeholder}
        allowClear
        enterButton="Search"
        value={value}
        onChange={onChangeHandle}
        onSearch={onSearchHandle}
        {...props}
    />
}


const InputNumber = ({ prefix, suffix, value, setValue, placeholder, max = 20 }: any) => {
    const onChangeHandle = (value: any) => {
        setValue(value)
    }
    return <Space>
        <InputNumAntD addonBefore={prefix} min={1} max={max} onChange={onChangeHandle} value={value} />
    </Space>
};


export { Input, TextArea, SearchInput, InputNumber }