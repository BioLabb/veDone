import { useEffect, useState } from "react";
import Ve from "./Ve";
import { v4 as uuidv4 } from "uuid";
import "../style/listve.css";
import Button from "./Button";
import { database } from "../utils/database";
import { onValue, ref } from "firebase/database";
import { readSoVe } from "../api/veXuanRealTime";

export default function ListVe({ handleClose, show, arrVe }) {
  const [listVe, setListVe] = useState([]);
  const [listVePicked, setListVePicked] = useState(new Set());
  const [veBuys, setVeBuys] = useState({});
  const showHideClassName = show ? "block" : "block_none";

  // only run first
  useEffect(() => {
    readSoVe().then((sove) => {
      setListVe(Array.from(new Array(sove)));
    });
    // cập nhật data vé đã mua thời gian thực
    fecthDataRealtiem();
  }, []);

  useEffect(() => {
    listVePicked.clear();
  });

  const fecthDataRealtiem = () => {
    const db = database;
    const dbRef = ref(db, "vexuan");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setVeBuys(data);
    });
  };

  // xử lý vé được chọn ở component ve
  const handlePickVe = async (numVe) => {
    // nếu sô vé chưa có trong danh sách tức người dùng click lần đầu
    // -> thêm vào danh sách
    // nếu số vé có trong danh sách tức người dùng hủy vé
    //-> xóa vé khỏi danh sách
    if (listVePicked.size > 0 && listVePicked.has(numVe)) {
      listVePicked.delete(numVe);
      await setListVePicked(listVePicked);
    } else {
      listVePicked.add(numVe);
      await setListVePicked(listVePicked);
    }
    // listVePicked đang là set chuyển sang arr để có thể sử dụng map()
    arrVe(Array.from(listVePicked));
  };

  // kiểm tra vé có tồn tại trong veBuys hay không
  // veBuys: danh danh sách vé get từ data
  const isExitsVe = (num) => {
    return veBuys[num] ? true : false;
  };

  return (
    <div className={showHideClassName + " list_ve_container border_radius"}>
      <button
        onClick={handleClose}
        className="button_close color_black border_radius background-yellow-linear p-2"
      >
        Đóng
      </button>
      <div className="list_ve_color">
        <div>
          <span className=" block_red border_radius"></span>
          <p className="text-white block_inline">Vé đã được mua</p>
        </div>
        <div>
          <span className="white block_white border_radius"></span>
          <p className="text-white block_inline">Vé chưa được mua</p>
        </div>
        <div>
          <span className="block_yellow_linear border_radius"></span>
          <p className="text-white block_inline">Vé đã chọn</p>
        </div>
      </div>
      <div className="list_ve m-2">
        {listVe.map((ve, index) => {
          let num = index + 1;
          return (
            <Ve
              isBuy={isExitsVe(num)}
              handlePick={handlePickVe}
              key={uuidv4()}
              value={num}
            />
          );
        })}
      </div>
      <Button
        styles={{ width: "95%", margin: "auto" }}
        name="Xác nhận"
        onClick={handleClose}
      />
    </div>
  );
}
