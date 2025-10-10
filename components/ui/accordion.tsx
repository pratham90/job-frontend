
import * as React from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionSection = {
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  sections: AccordionSection[];
  style?: any;
};

export function Accordion({ sections, style }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <View style={style}>
      {sections.map((section, idx) => (
        <AccordionItem
          key={idx}
          title={section.title}
          open={openIndex === idx}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setOpenIndex(openIndex === idx ? null : idx);
          }}
        >
          {section.content}
        </AccordionItem>
      ))}
    </View>
  );
}

type AccordionItemProps = {
  title: string;
  open: boolean;
  onPress: () => void;
  children: React.ReactNode;
};

function AccordionItem({ title, open, onPress, children }: AccordionItemProps) {
  return (
    <View style={styles.item}>
      <Pressable style={styles.header} onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>⌄</Text>
      </Pressable>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  chevron: {
    fontSize: 18,
    color: '#888',
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#f9fafb',
  },
});
