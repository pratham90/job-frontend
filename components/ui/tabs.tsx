
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Tab = {
  key: string;
  title: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  initialTab?: string;
  style?: any;
  tabListStyle?: any;
  tabStyle?: any;
  activeTabStyle?: any;
  contentStyle?: any;
};

export function Tabs({
  tabs,
  initialTab,
  style,
  tabListStyle,
  tabStyle,
  activeTabStyle,
  contentStyle,
}: TabsProps) {
  const [active, setActive] = React.useState(initialTab || tabs[0]?.key);

  const activeTab = tabs.find((tab) => tab.key === active);

  return (
    <View style={style}>
      <View style={[styles.tabList, tabListStyle]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              tabStyle,
              active === tab.key && [styles.activeTab, activeTabStyle],
            ]}
            onPress={() => setActive(tab.key)}
          >
            <Text style={active === tab.key ? styles.activeTabText : styles.tabText}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.content, contentStyle]}>
        {activeTab?.content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});
