import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { labelProps } from '../../types';

const Label = ({ title }: labelProps) => {
	return <Text style={styles.Label}>{title}</Text>;
};

const styles = StyleSheet.create({
	Label: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
		paddingTop: 20,
	},
});

export default Label;
