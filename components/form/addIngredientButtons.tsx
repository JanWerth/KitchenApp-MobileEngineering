import React, { useState } from 'react';
import { addIngredientProps } from '../../types';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';
import { format, add } from 'date-fns';
import { Button } from 'react-native-elements';
import { addIngredient } from '../../api/addIngredient';

const AddIngredientButtons = ({
	name,
	brand,
	category,
	location,
	confectionType,
	expirationDate,
	ripeness,
	frozen,
	open,
	clear,
	setScanner,
}: addIngredientProps) => {
	const today = new Date();

	const saveData = () => {
		if (name === null || name === '' || name.trim() === '') {
			alert('Name is required');
		} else {
			let expiry;
			if (expirationDate.toDateString() === today.toDateString()) {
				expiry = 'Not selected';
			} else {
				expiry = format(expirationDate, "yyyy-MM-dd'T'HH:mm");
			}

			let now = format(new Date(), "yyyy-MM-dd'T'HH:mm");
			addIngredient(
				name,
				brand,
				category,
				location,
				confectionType,
				expiry,
				ripeness,
				now,
				frozen,
				open,
				now
			);
			Keyboard.dismiss();
			showMessage({
				message: 'Success',
				description: 'Ingredient Saved',
				type: 'success',
				icon: 'success',
			});
		}
	};

	return (
		<View style={styles.buttonRow}>
			<Button
				containerStyle={styles.barcodeButton}
				type={'clear'}
				icon={<Ionicons name='ios-barcode-outline' size={42} color='black' />}
				onPress={setScanner}
			/>
			<Button
				containerStyle={styles.addIngredientButton}
				type={'solid'}
				titleStyle={styles.addIngredientText}
				title='Add Ingredient'
				onPress={() => {
					saveData();
					clear();
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonRow: {
		flex: 1.25,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		bottom: 0,
		position: 'absolute',
		width: '100%',
		// backgroundColor: 'white',
	},
	barcodeButton: {
		width: '17.5%',
	},
	addIngredientButton: {
		width: '65%',
	},
	addIngredientText: {
		fontSize: 22,
		color: 'white',
	},
});

export default AddIngredientButtons;
