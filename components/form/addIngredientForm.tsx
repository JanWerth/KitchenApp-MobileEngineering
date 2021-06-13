import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Pressable,
	Platform,
	StatusBar,
} from 'react-native';
import { categoryItems, categoryPlaceholder } from '../../utils/categoryPicker';
import { locationItems, locationPlaceholder } from '../../utils/locationPicker';
import {
	confectionItems,
	confectionPlaceholder,
} from '../../utils/confectionPicker';
import { ripenessItems, ripenessPlaceholder } from '../../utils/ripenessPicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import FlashMessage, {
	showMessage,
	hideMessage,
} from 'react-native-flash-message';
import { add } from 'date-fns';
import { Switch, Input, Button } from 'react-native-elements';
import AddIngredientButtons from './addIngredientButtons';
import { formProps } from '../../types';

const AddIngredientForm = ({ setScanner }: formProps) => {
	const [name, setName] = useState<string>('');
	const [brand, setBrand] = useState<string>('');
	const [additionalInformation, setAdditionalInformation] =
		useState<boolean>(false);
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
				duration: 3500,
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

	const isEmpty = (input: string): boolean => {
		if (input.trim() === '') {
			return true;
		}
		return false;
	};

	const clear = () => {
		setName('');
		setBrand('');
		setSelectedCategory('Not selected');
		setSelectedLocation('Not selected');
		setSelectedConfectionType('Not selected');
		setSelectedRipeness('Not selected');
		setDate(today);
		setIsFrozen(false);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle={'dark-content'} />
			<View style={styles.body}>
				<ScrollView style={{ width: '100%' }}>
					<View style={{ width: '80%', alignSelf: 'center' }}>
						<Text style={styles.Label}>Enter Item Name:</Text>
						<Input
							placeholder='Name'
							errorMessage={isEmpty(name) ? `* Name is required` : ''}
							onChangeText={(text) => {
								setName(text);
							}}
							value={name}
							inputStyle={styles.input}
							rightIcon={
								isEmpty(name) ? (
									<MaterialCommunityIcons
										name='asterisk'
										size={12}
										color='red'
									/>
								) : (
									<></>
								)
							}
						/>
						<Button
							title={
								!additionalInformation
									? 'Add more information'
									: 'Hide more information'
							}
							type='outline'
							onPress={() => setAdditionalInformation(!additionalInformation)}
						/>
						{!additionalInformation ? (
							<></>
						) : (
							<View>
								<Text style={styles.Label}>Brand:</Text>
								<Input
									placeholder='Brand'
									onChangeText={(text) => {
										setBrand(text);
									}}
									value={brand}
									inputStyle={styles.input}
									errorStyle={{ height: 0 }}
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
						)}
					</View>
				</ScrollView>
			</View>
			<AddIngredientButtons
				name={name}
				brand={brand}
				category={selectedCategory}
				location={selectedLocation}
				confectionType={selectedConfectionType}
				expirationDate={date}
				ripeness={selectedRipeness}
				frozen={isFrozen}
				open={isOpen}
				clear={clear}
				setScanner={setScanner}
			/>

			<FlashMessage position='bottom' floating={true} />
		</View>
	);
};

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
	},
	body: {
		flex: 9,
		// backgroundColor: 'blue',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		marginBottom: 60,
	},
	Label: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
		paddingTop: 20,
	},
	input: {
		fontSize: 20,
		fontWeight: 'bold',
		height: 45,
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

export default AddIngredientForm;
