// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'ai-notion.firebaseapp.com',
  projectId: 'ai-notion',
  storageBucket: 'ai-notion.appspot.com',
  messagingSenderId: '153225963051',
  appId: '1:153225963051:web:11aefb24217741016cec6e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

export async function uploadFileToFirebase(imageUrl: string, name: string) {
  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()
    const fileName = name.replace(' ', '') + Date.now + '.jpeg'
    const storageRef = ref(storage, fileName)
    await uploadBytes(storageRef, buffer, {
      contentType: 'image/jpeg',
    })
    const firebaseUrl = await getDownloadURL(storageRef)
    return firebaseUrl
  } catch (error) {
    console.error(error)
  }
}
