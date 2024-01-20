import Line from "./Line";
import "../style/Description.css"
export default function Description(){

    return(
        <>
        <div className="description-container">
            <img className="logo_ctr" src={process.env.PUBLIC_URL +"/XTNwhite.png"}/>
            <img src={process.env.PUBLIC_URL + "/textXTN2024.png"}/>
            <img className="logo_day" src={process.env.PUBLIC_URL + "/logo.png"}/>
            <p className="text-white mt-1">Liện hệ giải đáp: <a className="text-blue-400" href="https://www.facebook.com/people/M%E1%BB%B9-Duy%C3%AAn/pfbid09719SCBJPvwfbF8vAoNLc72QG6u2cFzuY8Jh5LP7KhCwMgnrGX9KXZKektSgpMLNl/">click vào đây</a>  </p>
            <p><span className="color_red">*</span>Bắt buộc</p>
        </div>
        </>
    )
}