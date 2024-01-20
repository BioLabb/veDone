import { useEffect, useState } from "react";
import Input from "./component/Input";
import InputGroup from "./component/InputGroup";

import Button from "./component/Button";
import Content from "./component/Content";
import Description from "./component/Description";
import "./style/app.css";


import { isVeExist, setVeXuanWithId } from "./api/storeVeXuan";
import ListVe from "./component/ListVe";

import { v4 as uuidv4 } from "uuid";
import ImageUpload from "./component/ImageUpload";
import { uploadImg } from "./api/image";
import { readAllowWithId, writeVeXuan } from "./api/veXuanRealTime";
import { Alert, AlertTitle, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


// icon
import { FcLeft, FcRight } from "react-icons/fc";
import { FcMultipleCameras } from "react-icons/fc";
import { FcCheckmark } from "react-icons/fc";
import axios from "axios";
import { signInWithGoogle } from "./api/auth";


function App() {

  // use state
  const [fullname, setFullname] = useState("");
  const [mssv, setMssv] = useState("");
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("");
  const [facebook, setFacebook] = useState("");
  const [listVe, setListVe] = useState([]);
  const [veBuying, setIsVeBuying] = useState([]);
  const [isHiddentVe, setIsHiddentVe] = useState(false);

  const [checkMssv,setCheckMssv] = useState("");
  const [isAlret, setIsAlert] = useState(false);
  const [alertState, setAlertState] = useState("")
  const [isLoading, setIsloading] = useState(false);

  const [img, setImg] = useState(null);
  const [imgDownloadUrl, setImgDownLoadUrl] = useState("");

  const [validateFullName, setValidateFullName] = useState("");
  const [validateMssv, setValidateMssv] = useState("");
  const [validateEmail, setValidateEmail] = useState("")
  const [validatePhone, setValidatePhone] = useState("");
  const [validateFacebook, setValidateFacebook] = useState("");

  const [isAllow,setIsAllow] = useState(true);

  const [isShowLogin, setIsShowLogin] = useState(true);
  const [isLogin, setIsLoginState] = useState(true);
  const [emailBuyer, setEmailBuyer] = useState("");
  let ves;
  let alertString = "";
  // only run first
  useEffect(() => {

  }, []);


  // lấy giá trị từ các event
  const getValueFromEventElement = (e) => {
    return e.target.value;
  }
  const handleInputName = (e) => {
    setFullname(getValueFromEventElement(e));
  }
  const handleInputMssv = (e) => {
    setMssv(getValueFromEventElement(e));
  }
  const handleEmail = (e) => {
    setEmail(getValueFromEventElement(e));
  }
  const handleInputPhone = (e) => {
    setPhone(getValueFromEventElement(e));
  }
  const handleInputFacebook = (e) => {
    setFacebook(getValueFromEventElement(e));
  }


  //============ check vaildate ===========
  // check chuỗi rông
  const isEmpty = (string) => {
    return string.trim() ? false : true;
  }

  const isEmail = (string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10,}$/; // Điện thoại gồm ít nhất 10 chữ số
    return phoneRegex.test(phoneNumber);
  }
  // chứa đối tượng thông báo các lỗi validate
  const validateAlert = {
    empty: "Không được bỏ trống",
    notEmail: "Email không hợp lệ",
    notPhone: "Số điện thoại không hợp lệ",
    buyFailse: "Mua vé thất bại",
    buying: "Vé bạn chọn đã có người mua",
    buySucces: "Mua vé thành công"
  }

  // xử lý validate của các input
  // return boolean
  const handleValidateInput = () => {
    let isValidate;
    // kiểm tra input elemement có bị rỗng hay không
    if (isEmpty(fullname) || isEmpty(mssv) || isEmpty(email)
      || isEmpty(phone) || isEmpty(facebook)) {
      if (isEmpty(fullname)) {
        setValidateFullName(validateAlert.empty);
      } else {
      }
      if (isEmpty(mssv)) {
        setValidateMssv(validateAlert.empty);
      } else {
      }
      if (isEmpty(email)) {
        setValidateEmail(validateAlert.empty);
      } else {
      }
      if (isEmpty(phone)) {
        setValidatePhone(validateAlert.empty)
      } else {
      }
      if (isEmpty(facebook)) {
        setValidateFacebook(validateAlert.empty)
      } else {
      }
      alert("Dữ liệu nhập vào không hợp lệ, kiểm tra lại nhé")
      return false;
    }
    setValidateFullName("");
    setValidatePhone("");
    setValidateEmail("");
    setValidateFacebook("");
    setValidateMssv("");

    if (!isEmail(email) || !isPhoneNumber(phone)) {
      // validte email
      if (!isEmail(email)) {
        setValidateEmail(validateAlert.notEmail);
        alert(validateAlert.notEmail)
      } else {
      }
      // validate phone
      if (!isPhoneNumber(phone)) {
        setValidatePhone(validateAlert.notPhone)
        alert(validateAlert.notPhone)
      } else {
      }
      return false;
    }
    setValidatePhone("");
    setValidateEmail("");
    return true;
  }

  const handleValidateVe = () => {
    if (!listVe || listVe.length === 0) {
      alert("Chưa chọn vé")
      return false;
    }
    return true;
  }

  const handleUploadImg = () => {
    if (!img) {
      alert("Chưa tải ảnh minh chứng");
      return false;
    }
    return true;
  }

  // khi người dùng nhấn nút mua vé
  const onSubmit = (e) => {
    // nếu validate không đúng thì dừng
    if (!handleValidateInput() || !handleValidateVe() || !handleUploadImg()) {
      return;
    }

    setIsloading(true);
    uploadImg(img, fullname)
      .then(url => {
        setImgDownLoadUrl(url);
        return url;
      }).
      then((url) => {
        const infoUser = {
          id: "",
          date: new Date(),
          fullname: fullname,
          mssv: mssv,
          email: email,
          phone: phone,
          facebook: facebook,
          img: url
        }
        return infoUser
      })
      .then((infoUser) => {
        // bật thông báo khi đang up data 
        // đưa thông tin vé lên database
        listVe.forEach((numVe) => {
          // nếu đưa vé lên db thành công 
          // thì tiến hành tiếp đưa đưa lên db realtime
          isVeExist(numVe)
            .then(isExist => {
              setIsloading(false);
              // Kiểm tra vé đã có người mua hay chưa
              if (!isExist) {
                infoUser.id = numVe;
                setVeXuanWithId(numVe, infoUser)
                  .then(isSuccess => {
                    // kiểm tra đưa vé lên data có bị lỗi hay không
                    if (isSuccess) {
                      writeVeXuan(numVe);
                      // string thông báo mua vé thành công
                      setAlertState(validateAlert.buySucces);
                      let userSheet = infoUser;
                      userSheet.id = numVe;
                      axios.post("https://sheet.best/api/sheets/29a9e69d-670c-4bfd-a89c-e7845ee50a2d",
                        userSheet)
                        .then(reponse => {
                          console.log(reponse);
                        })
                    }
                    else {
                      setAlertState(validateAlert.buyFailse);
                      alertString = validateAlert.buyFailse
                    }
                  })
              } else {
                setAlertState(validateAlert.buying);
                alertString = validateAlert.buying;
                console.log(numVe);
                setIsVeBuying(prevVeBuying => [...prevVeBuying, numVe]);
              }
            });

        })
        // hiện thông báo
        setIsAlert(true);
      })
      .then(() => {
      })
      .then(() => {
        setFullname("");
        setMssv("");
        setPhone("");
        setFacebook("");
        setEmail("");
        setListVe([]);
        // setImg(null);
        setAlertState("");
        setIsVeBuying([]);

      })
      .catch((err) => {
        console.log(err)
      })


  };

  const handleToggleVe = (e) => {
    setIsHiddentVe(!isHiddentVe);
    setListVe(ves);
  }


  const handleListVe = (arrVe) => {
    ves = arrVe

  }

  const handleImageUpload = (image) => {
    setImg(image);
  }

  const handleClosePoup = () => {
    setIsAlert(false);
  }

  const handleLoginwithGoogleOu = () => {
    signInWithGoogle()
      .then(user => {
        if (user) {
          setEmailBuyer(user.email);
          setIsShowLogin(false);
          setIsLoginState(true);
        } else {
          alert("Không phải email Ou");
        }
      });
  }
  
  const handleOnchangeAllow = (e)=>{
    setCheckMssv(e.target.value);
  }
  const handleAllow = (e)=>{

    readAllowWithId(checkMssv)
    .then(result=>{
      if(result){
          setIsAllow(!isAllow);
      }
      else{
        alert("MSSV không có trong danh sách");
      };
    })
    setCheckMssv("");
  }


  return (
    <div className="App background-red">
      <Dialog
        open={true}>
        <DialogTitle>Đóng link mua vé</DialogTitle>
        <DialogContent>
            <p className="text-gray-500 mt-1">Liện hệ giải đáp: <a className="text-blue-400" href="https://www.facebook.com/people/M%E1%BB%B9-Duy%C3%AAn/pfbid09719SCBJPvwfbF8vAoNLc72QG6u2cFzuY8Jh5LP7KhCwMgnrGX9KXZKektSgpMLNl/">click vào đây</a>  </p>
        </DialogContent>
      </Dialog>
      <Dialog
      open={false}
      >
        <DialogTitle>Nhập mã số sinh viên để tiếp tục mua</DialogTitle>
        <DialogContent>
          <Input value={checkMssv} validate={false} onChange={handleOnchangeAllow} />
          <Button onClick={handleAllow} styles={{paddingLeft: "2px",paddingRight: "2px"}} name ="Xác Nhận"/>
            <p className="text-gray-500">Lưu ý:</p>
            <p className="text-gray-500">-từ 10h00-18h00 ngày 18.01:Dành cho những bạn đã chuyển khoản nhưng chưa mua được vé ở đợt 1 </p>
            <p className="text-gray-500">-Nếu không vào được hãy liên hệ btc để mua được vé  </p>
            <p className="text-gray-500">+Liện hệ: <a className="text-blue-400" href="https://www.facebook.com/people/M%E1%BB%B9-Duy%C3%AAn/pfbid09719SCBJPvwfbF8vAoNLc72QG6u2cFzuY8Jh5LP7KhCwMgnrGX9KXZKektSgpMLNl/">click vào đây</a>  </p>
        </DialogContent>
      </Dialog>
      <ListVe handleClose={handleToggleVe} show={isHiddentVe} arrVe={handleListVe} />
      <Content>
        {/* Login */}
        {/* <Dialog
          open={isShowLogin}
          keepMounted
          aria-activedescendant="alert-dialog-slide-description"
        >
          <DialogTitle style={{paddingBottom:"5px"}}>Đăng nhập với email OU</DialogTitle>
          <Button onClick={handleLoginwithGoogleOu}
            styles={{ width: "80%", margin: "auto", marginBottom: "3px" }} name="Đăng nhập" />
          <DialogContentText>
            <div className="mx-2 px-2 pb-2">
              Liên hệ với BTC để mua vé nếu không có email Trường
            </div>
          </DialogContentText>
        </Dialog> */}
        {/* Thông báo mua vé */}
        <Dialog
          open={isAlret}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <FcRight style={{ display: "inline-block" }} />
            <p className="color_yellow_linear inline-block">Thông báo</p>
            <FcLeft style={{ display: "inline-block" }} />
          </DialogTitle>
          <DialogContent>
            <p className="color_yellow_linear text-lg font-medium">{alertState}</p>
            <p className="text-red-500 align-middle">{veBuying.join()}</p>
          </DialogContent>
          <Button
            classNameStyles="text-white mx-1 mb-1"
            onClick={handleClosePoup}
            name="Đóng" />
        </Dialog>
        {/* loading */}
        <Dialog
          open={isLoading}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <CircularProgress style={{ color: "#F8C262" }} />
        </Dialog>
        <Description />
        {/* <ParentComponent/> */}
        <InputGroup>
          <Input onChange={handleInputName} value={fullname} validate={validateFullName} maxLength={50}
            name="Họ và tên" placeholder="Ví dụ: Nguyễn Văn A" />
          <Input onChange={handleInputMssv} value={mssv} validate={validateMssv} maxLength={50}
            name="Mssv/Cccd " placeholder="Ví dụ: 2451010001" />
          <Input onChange={handleEmail} value={email} validate={validateEmail} maxLength={50}
            name="Email" placeholder="Ví dụ: 2451010001a@ou.edu.vn" />
          <Input onChange={handleInputPhone} value={phone} validate={validatePhone} maxLength={10}
            name="Số điện thoại " placeholder="Ví dụ: 0912 *** ****" />
          <Input onChange={handleInputFacebook} value={facebook} validate={validateFacebook} maxLength={50}
            name="Link Facebok " placeholder="Ví dụ: facebook.com/ouityouth" />
          <div className="flex">
            {
              isLogin ?
                <Button styles={{ padding: "5px", width: "85px", margin: "0" }} name="Chọn vé" onClick={handleToggleVe}></Button>
                : <h2 className="text-white text-lg">Đăng nhập để có thể mua vé</h2>
            }
            <div style={{ whiteSpace: "nowrap", scrollbarHeight: "none", height: "30px", marginTop: "auto", marginBottom: "auto", marginLeft: "5px", overflowX: "scroll" }}>
              {
                listVe &&
                listVe.map((numVe) => {
                  return (
                    <span key={uuidv4()} style={{ marginLeft: "5px", width: "30px", height: "30px", lineHeight: "30px", marginTop: "auto", marginBottom: "auto" }} className="block_yellow_linear  border_radius margin-auto">{numVe}</span>
                  );
                })
              }
            </div>
          </div>
          <label className="mt-2">
            <div>
              <FcMultipleCameras style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>Nộp file minh chứng đã chuyển khoản</p>
            </div>
            <div>
              <FcCheckmark style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>20k/vé</p>
            </div>
            <div>
              <FcCheckmark style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>Số vé bạn đang chọn: {listVe ? listVe.length : "0"}</p>
            </div>
            <div>
              <FcCheckmark style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>Thông tin thanh toán: </p>
            </div>
            <div className="ml-3">
              <FcRight style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>STK: 1028678660 - Vietcombank</p>
            </div>
            <div className="ml-3">
              <FcRight style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>Tên chủ tài khoản: Lê Thị Mỹ Duyên</p>
            </div>
            <div className="ml-3">
              <FcRight style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}> Nội dung chuyển khoản: Họ tên - DAY***</p>
            </div>
            <div className="ml-3">
              <FcRight style={{ display: "inline-block" }} />
              <p className="ml-1" style={{ display: "inline-block" }}>VD: Nguyễn Văn A - DAY001  </p>
            </div>
          </label>
          <ImageUpload imageUpload={handleImageUpload} />
          <Button name="Xác nhận mua" onClick={onSubmit} />
        </InputGroup>
      </Content>
    </div>
  );
}

export default App;
