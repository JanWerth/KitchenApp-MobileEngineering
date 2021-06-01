import React, { useState } from 'react';
import {
	StyleSheet,
	TextInput,
	Text,
	View,
	ScrollView,
	Pressable,
	Keyboard,
	TouchableWithoutFeedback,
	Platform,
	SafeAreaView,
	StatusBar,
} from 'react-native';
import { categoryItems, categoryPlaceholder } from '../utils/categoryPicker';
import { locationItems, locationPlaceholder } from '../utils/locationPicker';
import {
	confectionItems,
	confectionPlaceholder,
} from '../utils/confectionPicker';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../api/fbconfig';
import FlashMessage, {
	showMessage,
	hideMessage,
} from 'react-native-flash-message';
import { format } from 'date-fns';

export default function AddIngredientScreen() {
	const [name, setName] = useState<string>('');
	const [selectedCategory, setSelectedCategory] =
		useState<string>('Not selected');

	const [selectedLocation, setSelectedLocation] =
		useState<string>('Not selected');

	const [selectedConfectionType, setSelectedConfectionType] =
		useState('Not selected');

	const today = new Date();
	//DateTimePicker
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);

	const onChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showMode = () => {
		setShow(true);
		setMode('date');
	};

	const showDatepicker = () => {
		showMode();
	};

	//Dismiss Keyboard when click outside of TextInput
	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	//Save Input Data to Firebase
	const saveData = () => {
		if (name === null || name === '' || name.trim() === '') {
			alert('Name is required');
		} else {
			let dateString;
			if (date.toDateString() === today.toDateString()) {
				dateString = 'Not selected';
			} else {
				dateString = date.toDateString();
			}
			const ingredientRef = firebase.database().ref(`/Ingredients`);
			const ing = {
				name: name,
				category: selectedCategory,
				location: selectedLocation,
				confectionType: selectedConfectionType,
				expirationDate: dateString,
				expiry: format(date!, "yyyy-MM-dd'T'HH:mm"),
			};
			ingredientRef.push(ing);
			Keyboard.dismiss();
			showMessage({
				message: 'Success',
				description: 'Ingredient Saved',
				type: 'success',
			});
		}
	};

	const saveIngredient = async () => {
		await saveData();
		setName('');
		setSelectedCategory('Not selected');
		setSelectedLocation('Not selected');
		setSelectedConfectionType('Not selected');
		setDate(today);
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<View style={styles.container}>
				<StatusBar barStyle={'dark-content'} />
				<View style={styles.body}>
					<ScrollView>
						<Text style={styles.Label}>Enter Item Name:</Text>
						<TextInput
							placeholder='Name'
							style={styles.NameInput}
							onChangeText={(text) => setName(text)}
							value={name}
							placeholderTextColor={'lightgrey'}
						/>
						<Text style={styles.Label}>Select Category:</Text>
						<View>
							<RNPickerSelect
								placeholder={categoryPlaceholder}
								onValueChange={(value) => setSelectedCategory(value)}
								items={categoryItems}
								useNativeAndroidPickerStyle={false}
								value={selectedCategory}
								style={{
									...pickerSelectStyles,
									iconContainer: { top: 15, right: 12 },
								}}
								Icon={() => {
									return (
										<Ionicons name='md-arrow-down' size={24} color='gray' />
									);
								}}
							/>
						</View>
						<Text style={styles.Label}>Select Location:</Text>
						<View>
							<RNPickerSelect
								placeholder={locationPlaceholder}
								onValueChange={(value) => setSelectedLocation(value)}
								items={locationItems}
								useNativeAndroidPickerStyle={false}
								value={selectedLocation}
								style={{
									...pickerSelectStyles,
									iconContainer: { top: 15, right: 12 },
								}}
								Icon={() => {
									return (
										<Ionicons name='md-arrow-down' size={24} color='gray' />
									);
								}}
							/>
						</View>
						<Text style={styles.Label}>Select Confection:</Text>
						<View>
							<RNPickerSelect
								placeholder={confectionPlaceholder}
								onValueChange={(value) => setSelectedConfectionType(value)}
								items={confectionItems}
								useNativeAndroidPickerStyle={false}
								value={selectedConfectionType}
								style={{
									...pickerSelectStyles,
									iconContainer: { top: 15, right: 12 },
								}}
								Icon={() => {
									return (
										<Ionicons name='md-arrow-down' size={24} color='gray' />
									);
								}}
							/>
						</View>
						<Pressable style={styles.dateButton} onPress={showDatepicker}>
							<Text style={styles.dateText}>Select Expiration Date!</Text>
						</Pressable>
						{show && (
							<DateTimePicker
								testID='dateTimePicker'
								value={date}
								mode='date'
								display='default'
								onChange={onChange}
								minimumDate={today}
							/>
						)}
					</ScrollView>
				</View>
				<View style={styles.buttonRow}>
					<Pressable style={styles.barcodeButton}>
						<Ionicons name='ios-barcode-outline' size={42} color='white' />
					</Pressable>
					<Pressable
						style={styles.addIngredientButton}
						onPress={saveIngredient}
					>
						<Text style={styles.addIngredientText}>Add Ingredient</Text>
					</Pressable>
				</View>
				<FlashMessage position='bottom' floating={true} />
			</View>
		</TouchableWithoutFeedback>
	);
}

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30,
		marginTop: 5,
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: 'black',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30,
		marginTop: 5,
	},
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		// paddingTop: Constants.statusBarHeight
	},
	body: {
		flex: 9,
		backgroundColor: 'white',
		alignItems: 'center',
		paddingTop: 10,
	},
	Label: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
		paddingTop: 20,
	},
	NameInput: {
		fontSize: 20,
		fontWeight: 'bold',
		borderBottomWidth: 1,
		width: 300,
		height: 45,
		borderRadius: 10,
		padding: 10,
	},
	buttonRow: {
		flex: 1.25,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		// backgroundColor: "green",
	},
	barcodeButton: {
		width: '17.5%',
		height: 50,
		backgroundColor: '#353fcc',
		borderRadius: 75,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addIngredientButton: {
		width: '65%',
		height: 50,
		backgroundColor: '#353fcc',
		borderRadius: 75,
		marginLeft: '4.5%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	addIngredientText: {
		fontSize: 22,
		color: 'white',
	},
	Picker: {
		width: 300,
		height: 300,
		backgroundColor: 'black',
		borderColor: 'yellow',
		borderWidth: 10,
		fontSize: 20,
	},
	datepicker: {
		marginTop: 100,
	},
	dateButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: 'blue',
		margin: 15,
	},
	dateText: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},
});
