import { firebaseConfig } from "../env.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, doc, collection, setDoc, addDoc, getDocs, updateDoc, deleteDoc, deleteField,serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

window.onClickTestButton = () => {
  // addData();
  readData();
}

// DEBUG: Add data
async function addData() {
  try {
    const docRef = await addDoc(collection(db, 'user'), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log('Doc written with ID: ', docRef.id);
    readData();
    return true;
  } catch (e) {
    console.error('Adding doc error: ', e);
    return false;
  }
}

// DEBUG: Read data
async function readData() {
  console.log('--- Read data ---');
  try {
    const datas = [];
    // Init array
    datas.length = 0;
    // Read data
    const querySnapshot = await getDocs(collection(db, 'users'));
    // Add the read data
    querySnapshot.forEach((doc) => {
      datas.push({
        id: doc.id,
        first: doc.data()['first'],
        last: doc.data()['last'],
        born: doc.data()['born'],
      });
    });
    // DEBUG: Display
    if (datas.length == 0) {
      console.log('no data');
    } else {
      datas.forEach((data, index) => {
        console.log(`${index}. ${data.id} => ${data.first} ${data.last}(${data.born})`);
      });  
    }
    return true;
  } catch (e) {
    console.error('Reading doc error: ', e);
    return false;
  }
}

window.saveLocation = () => {
  console.log("save location");
}

window.alertButton = () => {
  alert('ok');
}