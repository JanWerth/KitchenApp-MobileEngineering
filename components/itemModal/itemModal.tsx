import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	Pressable,
	ScrollView,
	TextInput,
	Platform,
} from 'react-native';
import { itemModalProps } from '../../types';
import { categoryItems, categoryPlaceholder } from '../../utils/categoryPicker';
import { locationItems, locationPlaceholder } from '../../utils/locationPicker';
import {
	confectionItems,
	confectionPlaceholder,
} from '../../utils/confectionPicker';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../../api/fbconfig';
import { format, add, min } from 'date-fns';
import { ripenessItems, ripenessPlaceholder } from '../../utils/ripenessPicker';
import { Button } from 'react-native-elements';

const ItemModal = ({
	isVisible,
	setItemModalVisibility,
	data,
}: itemModalProps) => {
	const [name, setName] = useState<string>('');
	const [selectedCategory, setSelectedCategory] =
		useState<string>('Not selected');
	const [selectedLocation, setSelectedLocation] =
		useState<string>('Not selected');
	const [selectedConfectionType, setSelectedConfectionType] =
		useState<string>('Not selected');
	const [selectedRipeness, setSelectedRipeness] =
		useState<string>('Not selected');
	const [isFrozen, setIsFrozen] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const today = new Date();
	const in6months = add(today, { months: 6 });
	const in1week = add(today, { weeks: 1 });
	const in5years = add(today, { years: 5 });
	const [minimumDate, setMinimumDate] = useState(today);
	const [maximumDate, setMaximumDate] = useState(in5years);

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
		{
			isOpen ? setMaximumDate(in1week) : setMaximumDate(in5years);
		}
	};

	useEffect(() => {
		setName(data?.name);
		setSelectedCategory(data?.category);
		setSelectedLocation(data?.location);
		setSelectedConfectionType(data?.confectionType);
		setIsOpen(data?.open);
		setIsFrozen(data?.frozen);
		if (data?.expirationDate === 'Not selected') {
			setDate(new Date());
		} else {
			setDate(new Date(data?.expirationDate));
		}
	}, [isVisible]);

	const updateIngredient = async () => {
		let dateString;
		if (
			date.toDateString() === today.toDateString() ||
			date.toDateString() === 'Invalid Date'
		) {
			dateString = 'Not selected';
		} else {
			dateString = format(date, "yyyy-MM-dd'T'HH:mm");
		}
		await firebase.database().ref(`Ingredients/${data.id}`).update({
			name: name,
			category: selectedCategory,
			location: selectedLocation,
			confectionType: selectedConfectionType,
			expirationDate: dateString,
			open: isOpen,
		});
	};

	const toggleIsOpen = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			setShow(true);
			setMaximumDate(in1week);
			setDate(today);
		} else {
			setMaximumDate(in5years);
		}
	};

	const toggleIsFrozenSwitch = () => {
		setIsFrozen(!isFrozen);
		if (!isFrozen) {
			setMinimumDate(in6months);
			setDate(in6months);
		} else {
			setMinimumDate(today);
			setDate(today);
		}
	};

	return (
		<Modal
			animationType='none'
			transparent={true}
			visible={isVisible}
			onRequestClose={() => {
				!isVisible;
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.modalTopRow}>
						<View style={styles.modalCloseIcon}>
							<Ionicons
								name={'ios-close-outline'}
								size={28}
								onPress={() => {
									setItemModalVisibility();
									setMaximumDate(in5years);
								}}
							/>
						</View>
						<View style={styles.modalTitle}>
							<Text style={styles.modalTitleText}>Edit Ingredient!</Text>
						</View>
						<View style={styles.modalEditIcon}>
							<MaterialIcons name={'edit'} size={25} />
						</View>
					</View>
					<View style={styles.divider}></View>
					<ScrollView style={styles.scrollStyle}>
						<Text style={styles.Label}>Enter Item Name:</Text>
						<TextInput
							placeholder='Name'
							style={styles.NameInput}
							onChangeText={(text) => setName(text)}
							value={name}
						/>
						<Text style={styles.Label}>Select Category:</Text>
						<View>
							<RNPickerSelect
								placeholder={categoryPlaceholder}
								onValueChange={(value) => setSelectedCategory(value)}
								// style={styles.pickerSelectStyles}
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
								// style={styles.pickerSelectStyles}
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
						<View style={styles.openRow}>
							<Text style={styles.openLabel}>Open?</Text>
							{!isOpen ? (
								<Pressable style={styles.boxIcon} onPress={toggleIsOpen}>
									<FontAwesome5 name='box' size={32} color='black' />
								</Pressable>
							) : (
								<FontAwesome5
									style={styles.boxIcon}
									name='box-open'
									size={32}
									color='black'
								/>
							)}
						</View>
						{selectedConfectionType === 'Fresh' ? (
							<View>
								<Text style={styles.Label}>Ripeness</Text>
								<View>
									<RNPickerSelect
										placeholder={ripenessPlaceholder}
										onValueChange={(value) => {
											setSelectedRipeness(value);
											// setEdited(today);
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
												<Ionicons name='md-arrow-down' size={24} color='gray' />
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
								{!isFrozen ? (
									<View style={{ paddingBottom: 10 }}>
										<Button
											type={'outline'}
											title={'Freeze'}
											onPress={toggleIsFrozenSwitch}
										/>
									</View>
								) : (
									<View style={{ paddingBottom: 10 }}>
										<Button
											type={'outline'}
											title={'Unfreeze'}
											onPress={toggleIsFrozenSwitch}
										/>
									</View>
								)}
							</View>
						) : (
							<></>
						)}
					</ScrollView>
					<View style={styles.modalFooter}>
						<View style={styles.divider}></View>
						<View style={styles.modalButtonRow}>
							<Button
								title={'Close'}
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									setItemModalVisibility();
									setMaximumDate(in5years);
								}}
							></Button>
							<Button
								containerStyle={styles.buttonSave}
								title={'Save'}
								style={[styles.button, styles.buttonSave]}
								onPress={() => {
									updateIngredient();
									setItemModalVisibility();
									setMaximumDate(in5years);
								}}
							>
								{' '}
							</Button>
						</View>
					</View>
				</View>
			</View>
		</Modal>
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
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
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
	boxIcon: {},
	dateText: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},
	modalView: {
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		alignItems: 'center',
		borderColor: 'black',
		borderWidth: 0,
		width: '90%',
		height: '90%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTopRow: {
		flexDirection: 'row',
		padding: 10,
	},
	modalCloseIcon: {
		flex: 1,
		alignSelf: 'flex-start',
		justifyContent: 'center',
	},
	modalTitle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalEditIcon: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalTitleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: 'lightgray',
	},
	scrollStyle: {
		width: '100%',
		paddingLeft: '10%',
		paddingRight: '10%',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	modalFooter: {},
	modalButtonRow: {
		width: '100%',
		flexDirection: 'row',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		marginTop: 5,
	},
	buttonClose: {
		width: '17.5%',
		height: 50,
		backgroundColor: '#353fcc',
		borderRadius: 75,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonSave: {
		width: '65%',
	},
	openRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	openLabel: {
		flex: 0.5,
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
	},
	switchView: {
		alignItems: 'flex-start',
	},
});

export default ItemModal;
