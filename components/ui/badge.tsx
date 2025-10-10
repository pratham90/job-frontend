import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


type BadgeProps = {
	children: React.ReactNode;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
	style?: any;
};

export function Badge({ children, variant = 'default', style }: BadgeProps) {
	return (
		<View style={[styles.base, styles[variant], style]}>
			<Text style={[styles.text, (variant === 'destructive' || variant === 'default') && { color: '#fff' }]}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	base: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginVertical: 2,
		borderWidth: 1,
		minHeight: 22,
		backgroundColor: '#eef2ff',
	},
	text: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0f172a',
	},
	default: {
		backgroundColor: '#3b82f6',
		borderColor: '#3b82f6',
	},
	secondary: {
		backgroundColor: 'rgba(59,130,246,0.08)',
		borderColor: '#93c5fd',
	},
	destructive: {
		backgroundColor: '#ef4444',
		borderColor: '#ef4444',
	},
	outline: {
		backgroundColor: 'transparent',
		borderColor: '#93c5fd',
	},
	success: {
		backgroundColor: '#16a34a',
		borderColor: '#16a34a',
	},
	warning: {
		backgroundColor: '#f59e0b',
		borderColor: '#f59e0b',
	},
});
