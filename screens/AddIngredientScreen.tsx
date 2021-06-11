import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import AddIngredientForm from '../components/form/addIngredientForm';

export default function AddIngredientScreen() {
	//Dismiss Keyboard when click outside of TextInput
	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<AddIngredientForm />
		</TouchableWithoutFeedback>
	);
}
