import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { tagProps } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';

const Tag = ({ title }: tagProps) => {
	return (
		<LinearGradient colors={['#4EC5FF', '#0DFFC9']} style={styles.tagGradient}>
			<Text style={styles.tagText}>{title}</Text>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	tagGradient: {
		borderWidth: 1,
		borderColor: 'lightblue',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 5,
		minWidth: '20%',
		maxWidth: '22.5%',
	},
	tagText: {
		textAlign: 'center',
		color: 'black',
		padding: 5,
	},
});

export default Tag;
