
import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CarouselProps = {
  data: React.ReactNode[];
  style?: any;
  itemStyle?: any;
};

export function Carousel({ data, style, itemStyle }: CarouselProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const width = Dimensions.get('window').width;

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={[styles.carousel, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ width }}
      >
        {data.map((item, idx) => (
          <View key={idx} style={[styles.item, { width }, itemStyle]}>
            {item}
          </View>
        ))}
      </ScrollView>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
          disabled={activeIndex === 0}
          style={[styles.arrow, activeIndex === 0 && styles.arrowDisabled]}
        >
          <Text style={styles.arrowText}>{'‹'}</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          {data.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => scrollToIndex(Math.min(activeIndex + 1, data.length - 1))}
          disabled={activeIndex === data.length - 1}
          style={[styles.arrow, activeIndex === data.length - 1 && styles.arrowDisabled]}
        >
          <Text style={styles.arrowText}>{'›'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  arrow: {
    padding: 10,
    opacity: 1,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 28,
    color: '#222',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#222',
  },
});
