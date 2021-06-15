import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	Pressable,
	ScrollView,
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
import { format, add } from 'date-fns';
import { ripenessItems, ripenessPlaceholder } from '../../utils/ripenessPicker';
import { Button, Input } from 'react-native-elements';
import Label from '../textComponents/label';

const ItemModal = ({
	isVisible,
	setItemModalVisibility,
	data,
	expiringSoonScreen,
	index,
	setTab,
}: itemModalProps) => {
	const [name, setName] = useState<string>('');
	const [brand, setBrand] = useState<string>('');
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
		setBrand(data?.brand);
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
		await firebase
			.database()
			.ref(`Ingredients/${data.id}`)
			.update({
				name: name,
				brand: brand,
				category: selectedCategory,
				location: selectedLocation,
				confectionType: selectedConfectionType,
				expirationDate: dateString,
				editedOn: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
				open: isOpen,
				frozen: isFrozen,
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
						<Label title={'Edit Name:'} />
						<Input
							placeholder='Name'
							onChangeText={(text) => {
								setName(text);
							}}
							value={name}
							inputStyle={styles.input}
							errorStyle={{ height: 0 }}
						/>
						<Label title={'Edit Brand:'} />
						<Input
							placeholder='Brand'
							onChangeText={(text) => {
								setBrand(text);
							}}
							value={brand}
							inputStyle={styles.input}
							errorStyle={{ height: 0 }}
						/>
						<Label title={'Select Category:'} />
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
						<Label title={'Select Location:'} />
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
						<Label title={'Select Confection Type:'} />
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
						{!isFrozen && (
							<View>
								<View style={styles.openRow}>
									<Text style={styles.openLabel}>Open?</Text>
									{!isOpen ? (
										<Pressable onPress={toggleIsOpen}>
											<FontAwesome5 name='box' size={32} color='black' />
										</Pressable>
									) : (
										<FontAwesome5 name='box-open' size={32} color='black' />
									)}
								</View>
								{isOpen && (
									<Text style={styles.infoText}>
										Info: The product is open and can not be closed.
									</Text>
								)}
							</View>
						)}
						{selectedConfectionType === 'Fresh' && (
							<View>
								<Label title={'Select Ripeness:'} />
								<View>
									<RNPickerSelect
										placeholder={ripenessPlaceholder}
										onValueChange={(value) => {
											setSelectedRipeness(value);
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
						)}
						{selectedConfectionType === 'Fresh' && !isOpen && (
							<View>
								<Label title={'Is the product frozen?'} />
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
						)}
					</ScrollView>
					<View>
						<View style={styles.divider}></View>
						<View style={styles.modalButtonRow}>
							<Button
								title={'Close'}
								containerStyle={styles.buttonClose}
								onPress={() => {
									setItemModalVisibility();
									setMaximumDate(in5years);
								}}
							></Button>
							{!expiringSoonScreen ? (
								<Button
									containerStyle={styles.buttonSave}
									title={'Update'}
									onPress={() => {
										updateIngredient();
										setItemModalVisibility();
									}}
								>
									{' '}
								</Button>
							) : (
								<Button
									containerStyle={styles.buttonSave}
									title={'Update'}
									onPress={() => {
										updateIngredient();
										setItemModalVisibility();
										setMaximumDate(in5years);
										setTab(index);
									}}
								>
									{' '}
								</Button>
							)}
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
	modalTitleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
	},
	modalEditIcon: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
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
	input: {
		fontSize: 20,
		fontWeight: 'bold',
		height: 45,
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
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
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
	infoText: {
		fontSize: 12,
		color: 'grey',
		marginTop: 5,
		alignSelf: 'center',
	},
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
	},
	buttonSave: {
		width: '65%',
		height: 50,
	},
});

export default ItemModal;
