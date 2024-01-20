import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utils/database";

export const uploadImg = async (image,nameUser) => {
    const metadata = {
        contentType: "image/jpeg",
    };
    const storageRef = ref(storage, `images/${nameUser}/${image.name}`); // tạo 1 địa chỉ để chứa ảnh chuẩn bị tải lên store
    try {
        const uploadTask = await uploadBytesResumable(storageRef, image, metadata); // hàm tải ảnh lên store
        const downloadUrl = await getDownloadURL(uploadTask.ref);
        return downloadUrl;
    }catch(err){
        console.error("err uploading img: " + err);
    }
};