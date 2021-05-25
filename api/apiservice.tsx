// import { firebase, database } from './fbconfig';

// export const submitIngredient = (
//   ID,
//   name,
//   selectedCategory,
//   selectedLocation,
//   selectedConfectionType,
//   date
// ) => {
//   return new Promise(function (resolve, reject) {
//     let key;
//     if (ID != null) {
//       key = ID;
//     } else {
//       key = firebase.database().ref().push().key;
//     }

//     let dataToSave = {
//       // ID: key,
//       name: name,
//       selectedCategory: selectedCategory,
//       selectedLocation: selectedLocation,
//       selectedConfectionType: selectedConfectionType,
//       date: date,
//     };

//     firebase
//       .database()
//       .ref('KitchenApp/' + key)
//       .update(dataToSave)
//       .then((snapshot) => {
//         resolve(snapshot);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

// export const writeIngredient = (
//   id,
//   name,
//   selectedCategory,
//   selectedLocation,
//   selectedConfectionType,
//   date
// ) => {
//   firebase.database().ref('');
// };
