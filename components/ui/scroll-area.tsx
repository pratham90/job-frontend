import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

type ScrollAreaProps = {
  children: React.ReactNode;
  style?: any;
  horizontal?: boolean;
};

export function ScrollArea({ children, style, horizontal }: ScrollAreaProps) {
  return (
    <ScrollView style={style} horizontal={horizontal} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
