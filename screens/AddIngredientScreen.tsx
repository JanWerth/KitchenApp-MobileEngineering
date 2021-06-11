import React, { useEffect, useState } from 'react';
import {
	Text,
	TouchableWithoutFeedback,
	Keyboard,
	View,
	StyleSheet,
} from 'react-native';
import AddIngredientForm from '../components/form/addIngredientForm';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from 'react-native-elements';

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
		setScanned(true);
		try {
			const response = await fetch(
				`https://world.openfoodfacts.org/api/v0/product/${data}`
			);
			const json = await toJson(response);
			console.log(json);
			// console.log(json.product.product_name);
			// console.log(response);
			setScanner(false);
		} catch (err) {
			console.log('error', err);
			setScanner(false);
		}
		// alert(`Bar code with  data ${data} has been scanned!`);
	};

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<View style={{ width: '100%', height: '100%' }}>
				<AddIngredientForm setScanner={() => setScanner(true)} />
				{scanner ? (
					<BarCodeScanner
						style={StyleSheet.absoluteFillObject}
						onBarCodeScanned={handleBarCodeScanned}
					>
						<Text>Scan Barcode</Text>
						<Button
							type={'solid'}
							title='Close'
							onPress={() => setScanner(false)}
							// style={{ position: 'absolute', bottom: 0 }}
						/>
						{scanned && (
							<Button
								title={'Tap to Scan Again'}
								onPress={() => setScanned(false)}
							/>
						)}
					</BarCodeScanner>
				) : (
					<></>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
}
