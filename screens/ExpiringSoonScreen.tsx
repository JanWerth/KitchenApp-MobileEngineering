import React, { useState } from 'react';
import {
	StyleSheet,
	Button,
	TextInput,
	TouchableOpacity,
	Text,
	View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from '@dietime/react-native-date-picker';

export default function ExpiringSoonScreen() {
	const [date, setDate] = useState();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Expiring Soon</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: Constants.statusBarHeight,
	},
	title: {},
});
