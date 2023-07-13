import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

export type ChartData =
  | {
      type: 'Controversial' | 'Popular' | 'Unpopular'
      percentage: number
    }[]
  | undefined

const Chart = ({ data }: { data?: ChartData }) => {
  if (!data || !data.length)
    return <p>No data available to generate the chart</p>

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey='type' />
        <Radar
          name='Intensities percentage'
          dataKey='percentage'
          className='fill-secondary stroke-secondary'
          fillOpacity={0.75}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default Chart
