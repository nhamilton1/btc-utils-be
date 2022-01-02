import { Skeleton, Typography } from 'antd'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { fetchPoolBlockCounterPerDay } from '../api'
import { GetNewZPercent, GetZPercent, getMean, getStdDeviation, generatePoints } from '../helpers/NDfunctions'
import { renderToolTip } from '../utils/renderToolTip'
import PoolSelector from './PoolSelector'
import Layout from 'antd/lib/layout/layout'

const NormalDistribution = () => {

  const [poolName, setPoolName] = useState('SlushPool')

  const { data: poolBlockCounterPerDay, isLoading } = useQuery(["fetchPoolBlockCounterPerDay", poolName], fetchPoolBlockCounterPerDay,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: Infinity
    })

  if (isLoading) {
    return <Skeleton paragraph={{ rows: 10 }} />
  }
  
  const dataPoints = Object.values(poolBlockCounterPerDay).sort((a, b) => a - b)

  const lowerBound = Math.min(...dataPoints), upperBound = Math.max(...dataPoints);

  const zScore = x => Number(((x - mean) / stdDev).toFixed(2))

  let mean = getMean(lowerBound, upperBound);
  let stdDev = getStdDeviation(lowerBound, upperBound);
  let points = generatePoints(lowerBound, upperBound);
  let removeDupes = [...new Set(points.map(x => Number(x.toFixed(0))))]
  let data = removeDupes.map(x => ({ x, y: zScore(x), z: GetZPercent(zScore(x)) }));
  let newDataSet = removeDupes.map(x => ({ x, y: zScore(x), z: GetNewZPercent(zScore(x)) }));

  return (
    <Layout>
      <Typography.Title style={{ fontSize: '1.5rem' }}>Normal Distribution for {poolName.replace('+', ' ')}</Typography.Title>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={newDataSet} >
          <Area dataKey="z" fill="#ffaa15" name='z' animationEasing='ease-in' type='monotone' />
          <XAxis dataKey="x" orientation='top' scale='band'/>
          <YAxis allowDataOverflow={true} type="number"/>
          <Tooltip content={renderToolTip} />
          <CartesianGrid opacity={0.1} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
      <Typography.Title style={{ fontSize: '1.5rem' }}>Cumulative Normal Distribution for {poolName.replace('+', ' ')}</Typography.Title>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} >
          <Area dataKey="z" fill="#ffaa15" name='z' animationEasing='ease-in' type='monotone' />
          <XAxis dataKey="x" orientation='bottom' scale='band' />
          <YAxis allowDataOverflow={true} type="number" domain={[0, 1]}/>
          <Tooltip labelFormatter={(x) => `${x} blocks`} />
          <CartesianGrid opacity={0.1} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
      < PoolSelector poolName={poolName} setPoolName={setPoolName} />
    </Layout>
  )
}



export default NormalDistribution
