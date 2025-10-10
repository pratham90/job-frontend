
import * as React from 'react';
import { View } from 'react-native';
import { BarChart, PieChart } from 'react-native-svg-charts';

type BarChartProps = {
  data: number[];
  style?: any;
  barColor?: string;
  height?: number;
  contentInset?: { top?: number; bottom?: number };
};

export function SimpleBarChart({ data, style, barColor = '#4f46e5', height = 200, contentInset = { top: 20, bottom: 20 } }: BarChartProps) {
  return (
    <View style={style}>
      <BarChart
        style={{ height }}
        data={data}
        svg={{ fill: barColor }}
        contentInset={contentInset}
        spacingInner={0.3}
      />
    </View>
  );
}

type PieChartProps = {
  data: { value: number; svg?: any; key?: string }[];
  style?: any;
  height?: number;
};

export function SimplePieChart({ data, style, height = 200 }: PieChartProps) {
  return (
    <View style={style}>
      <PieChart style={{ height }} data={data} />
    </View>
  );
}
