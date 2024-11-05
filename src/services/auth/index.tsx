/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import bcrypt from "bcrypt";
import app from "@/lib/firebase/init";

export interface User {
  id: string;
  email?: string;
  password?: string;
  fullname?: string;
  phone?: string;
  role?: string;
}

const firestore = getFirestore(app);

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    password: string;
    phone: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
  },
  callback: (status: boolean) => void
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback(false);
  } else {
    if (!userData.role) {
      userData.role = "member";
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    userData.created_at = new Date();
    userData.updated_at = new Date();

    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        callback(false);
        console.log(error);
      });
  }
}

export async function SignIn(email: string): Promise<User | null> {
  const q = query(collection(firestore, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];

  // Pastikan objek memiliki email dan password sebelum mengembalikan
  if (data.length > 0 && data[0].email && data[0].password) {
    return data[0]; // Return User directly
  } else {
    console.error("User found, but required fields are missing");
    return null;
  }
}

export async function loginWithGoogle(
  data: { email: string; role?: string },
  callback: any
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (user.length > 0) {
    callback(user[0]);
  } else {
    data.role = "member";
    await addDoc(collection(firestore, "user"), data).then(() => {
      callback(data);
    });
  }
}
