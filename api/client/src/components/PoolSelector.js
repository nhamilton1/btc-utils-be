import { Select } from 'antd'
import React from 'react'

const PoolSelector = props => {
    const pools = ['SlushPool', 'F2Pool', 'ViaBTC', 'Poolin', 'AntPool', 'Luxor', 'Foundry USA', 'Binance Pool', 'BTC.com', 'MARA Pool', 'SBI Crypto']
    const { poolName, setPoolName } = props
    return (
        <Select defaultValue={poolName} style={{ width: 120, color: 'white' }} onChange={e => setPoolName(e)}>
        {
          pools.map((poolName, idx) => <Select.Option key={idx} value={poolName.replace(' ', '+')}>{poolName}</Select.Option>)
        }
      </Select>
    )
}

export default PoolSelector
