"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group@1.1.2";
import { type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",

  import * as React from 'react';
  import { View, StyleSheet } from 'react-native';
  import { Toggle } from './toggle';

  type ToggleGroupProps = {
    values: boolean[];
    onValueChange: (index: number, value: boolean) => void;
    labels?: string[];
    style?: any;
    disabled?: boolean;
  };

  export function ToggleGroup({ values, onValueChange, labels, style, disabled }: ToggleGroupProps) {
    return (
      <View style={[styles.group, style]}>
        {values.map((val, idx) => (
          <Toggle
            key={idx}
            value={val}
            onValueChange={v => onValueChange(idx, v)}
            label={labels ? labels[idx] : undefined}
            disabled={disabled}
          />
        ))}
      </View>
    );
  }

  const styles = StyleSheet.create({
    group: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
}

export { ToggleGroup, ToggleGroupItem };
