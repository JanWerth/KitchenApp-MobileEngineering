import React, { useEffect, useState } from 'react';
import {
	Text,
	TouchableWithoutFeedback,
	Keyboard,
	View,
	StyleSheet,
	Image,
	Alert,
} from 'react-native';
import AddIngredientForm from '../components/form/addIngredientForm';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Dimensions } from 'react-native';
import saveScan from '../api/saveScan';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

export default function AddIngredientScreen() {
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [scanner, setScanner] = useState<boolean>(false);
	const [scanned, setScanned] = useState(false);

	//Dismiss Keyboard when click outside of TextInput
	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	if (hasPermission === null) {
		return (
			<>
				<Text>Requesting for camera permission.</Text>
				<Text>Scanning items is only possible through camera access.</Text>
			</>
		);
	}

	const toJson = (response: Response): Promise<any> => {
		if (!response.ok)
			throw new Error('error in the response: ' + response.status);
		return response.json();
	};

	const handleBarCodeScanned = async ({ data }: any) => {
		try {
			const response = await fetch(
				`https://world.openfoodfacts.org/api/v0/product/${data}`
			);
			const json = await toJson(response);
			setScanner(false);
			threeButtonAlert(json.product.product_name);
		} catch (err) {
			console.log('error', err);
			setScanner(false);
		}
		// alert(`Bar code with  data ${data} has been scanned!`);
	};

	const threeButtonAlert = (name: string) => {
		Alert.alert('Item Scanned', `Scanned Item ${name}`, [
			{
				text: `Cancel`,
				onPress: () => console.log('Cancel without saving'),
				style: 'cancel',
			},
			{
				text: 'Scan Again',
				onPress: () => setScanner(true),
			},
			{
				text: 'Save',
				onPress: () => {
					saveScan(name),
						showMessage({
							message: 'Success',
							description: 'Ingredient Saved',
							type: 'success',
							icon: 'success',
						});
				},
			},
		]);
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			{!scanner ? (
				<AddIngredientForm setScanner={() => setScanner(true)} />
			) : (
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'flex-end',
					}}
				>
					<BarCodeScanner
						style={[StyleSheet.absoluteFillObject, styles.container]}
						onBarCodeScanned={(data) => {
							handleBarCodeScanned(data);
						}}
					>
						<Text style={styles.description}>Scan your barcode</Text>
						<Image
							style={styles.qr}
							source={require('../assets/images/scan.png')}
						/>
						<Text onPress={() => setScanner(false)} style={styles.cancel}>
							Close
						</Text>
					</BarCodeScanner>
				</View>
			)}
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ecf0f1',
		padding: 8,
	},
	qr: {
		marginTop: '20%',
		marginBottom: '20%',
		width: qrSize,
		height: qrSize,
	},
	description: {
		fontSize: width * 0.09,
		marginTop: '5%',
		textAlign: 'center',
		width: '90%',
		color: 'white',
	},
	cancel: {
		fontSize: width * 0.05,
		textAlign: 'center',
		width: '70%',
		color: 'white',
		fontWeight: '800',
	},
});
