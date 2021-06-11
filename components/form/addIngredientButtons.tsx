import React from 'react';
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
}: addIngredientProps) => {
	const today = new Date();

	const saveData = () => {
		if (name === null || name === '' || name.trim() === '') {
			alert('Name is required');
		} else {
			alert('Ok');
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
				format(new Date(), "yyy-MM-dd'T'HH:mm"),
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
	},
	barcodeButton: {
		width: '17.5%',
		borderRadius: 75,
	},
	addIngredientButton: {
		width: '65%',
		borderRadius: 75,
	},
	addIngredientText: {
		fontSize: 22,
		color: 'white',
	},
});

export default AddIngredientButtons;
