import { ref, child, get, onValue } from "firebase/database";
import { database } from "../utils/database";

const db = database;


// data cập nhật theo thời gian thực
export async function readAllRealTime(url,id="") {

    return new Promise((resolve, reject) => {
        const starCountRef = ref(db, `${url}/${id}`);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}