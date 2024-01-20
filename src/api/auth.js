import { GoogleAuthProvider, getRedirectResult, signInWithPopup,signInWithRedirect } from "firebase/auth";
import { auth } from "../utils/database";
import "firebase/auth";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    // try {
    //     // Mở cửa sổ đăng nhập Google
    //     const result = await signInWithPopup(auth, provider);

    //     // Lấy thông tin người dùng từ kết quả đăng nhập
    //     const user = result.user;

    //     // Kiểm tra địa chỉ email có đuôi là ".ou.edu.vn" hay không
    //     if (user.email.endsWith('@ou.edu.vn')) {
    //         // window.close();
    //         // Thực hiện các bước tiếp theo sau khi đăng nhập thành công
    //         return user;
    //     } else {
    //         // Địa chỉ email không hợp lệ, có thể thông báo lỗi hoặc đăng xuất người dùng
    //         await auth.signOut(); // Đăng xuất người dùng nếu địa chỉ email không hợp lệ
    //         return null;
    //     }
    // } catch (error) {
    //     // Xử lý lỗi đăng nhập
    //     console.error(error.code, error.message);
    // }

    try {
        // Chuyển hướng đến trang đăng nhập Google
        await signInWithRedirect(auth, provider);
        

        // Sau khi xác thực, xử lý chuyển hướng trở lại
        const result = await getRedirectResult(auth);

        // Lấy thông tin người dùng từ kết quả đăng nhập
        const user = result.user;

        // Kiểm tra địa chỉ email có đuôi là ".ou.edu.vn" hay không
        if (user.email.endsWith('@ou.edu.vn')) {
            // Thực hiện các bước tiếp theo sau khi đăng nhập thành công
            return user;
        } else {
            // Địa chỉ email không hợp lệ, có thể thông báo lỗi hoặc đăng xuất người dùng
            await auth.signOut(); // Đăng xuất người dùng nếu địa chỉ email không hợp lệ
            return null;
        }
    } catch (error) {
        // Xử lý lỗi đăng nhập
        console.error(error.code, error.message);
    }
};

