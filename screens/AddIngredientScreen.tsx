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
import { ripenessItems, ripenessPlaceholder } from '../utils/ripenessPicker';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../api/fbconfig';
import FlashMessage, {
	showMessage,
	hideMessage,
} from 'react-native-flash-message';
import { format, add } from 'date-fns';
import { Switch } from 'react-native-elements';

export default function AddIngredientScreen() {
	const [name, setName] = useState<string>('');
	const [selectedCategory, setSelectedCategory] =
		useState<string>('Not selected');

	const [selectedLocation, setSelectedLocation] =
		useState<string>('Not selected');

	const [selectedConfectionType, setSelectedConfectionType] =
		useState('Not selected');

	const today = new Date();
	const in6months = add(today, { months: 6 });
	const in1week = add(today, { weeks: 1 });
	const in5years = add(today, { years: 5 });
	const [isFrozen, setIsFrozen] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [minimumDate, setMinimumDate] = useState(today);
	const [maximumDate, setMaximumDate] = useState(in5years);

	const toggleIsFrozenSwitch = () => {
		setIsFrozen(!isFrozen);
		if (!isFrozen) {
			setMinimumDate(in6months);
			setDate(in6months);
			showMessage({
				message: 'Expiration Date',
				description: 'Expiration Date set for in 6 months',
				type: 'info',
				icon: 'info',
			});
		} else {
			setMinimumDate(today);
			setDate(today);
			hideMessage();
		}
	};

	const toggleIsOpenSwitch = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			setShow(true);
			setMaximumDate(in1week);
			showMessage({
				message: 'Expiration Date',
				description:
					'Please select an Expiration Date. \nAn open product can not be closed once it is saved.',
				type: 'info',
				duration: 2500,
				icon: 'info',
			});
		} else {
			setShow(false);
			setMaximumDate(in5years);
			hideMessage();
		}
	};

	const [selectedRipeness, setSelectedRipeness] =
		useState<string>('Not selected');

	const [edited, setEdited] = useState<number | Date | undefined>();

	//DateTimePicker
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);

	const onChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showMode = () => {
		setShow(true);
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
			let expiry;
			if (date.toDateString() === today.toDateString()) {
				expiry = 'Not selected';
			} else {
				expiry = format(date, "yyyy-MM-dd'T'HH:mm");
			}

			let now = format(new Date(), "yyyy-MM-dd'T'HH:mm");
			const ingredientRef = firebase.database().ref(`/Ingredients`);
			const ing = {
				name: name,
				category: selectedCategory,
				location: selectedLocation,
				confectionType: selectedConfectionType,
				expirationDate: expiry,
				ripeness: selectedRipeness,
				editedOn: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
				frozen: isFrozen,
				open: isOpen,
				addedOn: now,
			};
			ingredientRef.push(ing);
			Keyboard.dismiss();
			showMessage({
				message: 'Success',
				description: 'Ingredient Saved',
				type: 'success',
				icon: 'success',
			});
		}
	};

	const saveIngredient = async () => {
		await saveData();
		setName('');
		setSelectedCategory('Not selected');
		setSelectedLocation('Not selected');
		setSelectedConfectionType('Not selected');
		setSelectedRipeness('Not selected');
		setDate(today);
		setIsFrozen(false);
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<View style={styles.container}>
				<StatusBar barStyle={'dark-content'} />
				<View style={styles.body}>
					<ScrollView style={{ width: '100%' }}>
						<View style={{ width: '80%', alignSelf: 'center' }}>
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
									minimumDate={minimumDate}
									maximumDate={maximumDate}
								/>
							)}
							{!isFrozen ? (
								<View>
									<Text style={styles.Label}>Open</Text>
									<View style={styles.switchView}>
										<Switch
											value={isOpen}
											onValueChange={toggleIsOpenSwitch}
											color='blue'
										/>
									</View>
								</View>
							) : (
								<View></View>
							)}
							{selectedConfectionType === 'Fresh' ? (
								<View>
									<Text style={styles.Label}>Ripeness</Text>
									<View>
										<RNPickerSelect
											placeholder={ripenessPlaceholder}
											onValueChange={(value) => {
												setSelectedRipeness(value), setEdited(today);
											}}
											items={ripenessItems}
											useNativeAndroidPickerStyle={false}
											value={selectedRipeness}
											style={{
												...pickerSelectStyles,
												iconContainer: { top: 15, right: 12 },
											}}
											Icon={() => {
												return (
													<Ionicons
														name='md-arrow-down'
														size={24}
														color='gray'
													/>
												);
											}}
										/>
									</View>
								</View>
							) : (
								<></>
							)}
							{selectedConfectionType === 'Fresh' && !isOpen ? (
								<View>
									<Text style={styles.Label}>Is the product frozen?</Text>
									<View style={styles.switchView}>
										<Switch
											value={isFrozen}
											onValueChange={toggleIsFrozenSwitch}
											color='blue'
										/>
									</View>
								</View>
							) : (
								<></>
							)}
						</View>
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
	switchView: {
		alignItems: 'flex-start',
	},
});
