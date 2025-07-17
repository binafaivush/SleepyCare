import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getFeedingData } from '../contexts/feeding.service';
import { FeedingRecord, FeedingType } from '../types/feedingRecord.type';
import { typeColors, typeLabels } from '../feedingChart.config';
import styles from '../styles/feedingChart.styles';

const FeedingChart: React.FC = () => {
  const [data, setData] = useState<FeedingRecord[]>([]);
  const screenWidth = Dimensions.get('window').width;
  const chartHeight = Dimensions.get('window').height * 0.6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFeedingData();
        setData(result);
      } catch (error) {
        console.error('Error fetching feeding data:', error);
      }
    };
    fetchData();
  }, []);

  if (data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading chart...</Text>
      </View>
    );
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const labels = sortedData.map((item) => item.time.slice(11, 16));
  const amounts = sortedData.map((item) => item.amount);
  const colorsArray = sortedData.map(
    (item) => () => typeColors[item.type] || '#888'
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={{ backgroundColor: '#fff' }}>
        <BarChart
          data={{ labels, datasets: [{ data: amounts, colors: colorsArray }] }}
          width={Math.max(screenWidth, labels.length * 60)}
          height={chartHeight}
          fromZero
          showBarTops
          verticalLabelRotation={30}
          withCustomBarColorFromData
          flatColor
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => '#000',
            labelColor: () => '#333',
            barPercentage: 0.6,
            propsForBackgroundLines: { stroke: '#e3e3e3' },
          }}
          style={styles.chart}
        />
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {(Object.keys(typeColors) as FeedingType[]).map((key) => (
          <View key={key} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: typeColors[key] },
              ]}
            />
            <Text style={styles.legendLabel}>{typeLabels[key]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FeedingChart;
