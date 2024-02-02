import { firebaseConfig } from "../env.js";
import { getCurrentPosition } from "./ls.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, doc, collection, setDoc, addDoc, getDocs, updateDoc, deleteDoc, deleteField,serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

window.onClickTestButton = () => {
  saveLocation();
  readData();
}

// DEBUG: Add data
async function addData() {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log('Doc written with ID: ', docRef.id);
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
        name: doc.data()['name'],
        lat: doc.data()['lat'],
        lng: doc.data()['lng'],
      });
    });
    // DEBUG: Display
    if (datas.length == 0) {
      console.log('no data');
    } else {
      datas.forEach((data, index) => {
        console.log(`${index}. ${data.id} => ${data.name}: (${data.lat}, ${data.lng})`);
      });  
    }
    return true;
  } catch (e) {
    console.error('Reading doc error: ', e);
    return false;
  }
}

async function saveLocation() {
  console.log("--- save location ---");
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name: document.getElementById('user-name').value,
      lat: getCurrentPosition().lat,
      lng: getCurrentPosition().lng
    });
    console.log('Doc written with ID: ', docRef.id);
    return true;
  } catch (e) {
    console.error('Adding doc error: ', e);
    return false;
  }

}

window.alertButton = () => {
  alert(`lat:${getCurrentPosition().lat}, lng:${getCurrentPosition().lng}`);
}