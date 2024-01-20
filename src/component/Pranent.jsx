// Thành phần cha
import React, { useState } from "react";
import Popup from "./Tesx"; // Đường dẫn đến thành phần Popup

function ParentComponent() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup); // Đảo ngược trạng thái hiển thị popup
  };

  return (
    <div>
      <button onClick={togglePopup}>Open Popup</button>
      <Popup handleClose={togglePopup} show={showPopup} />
    </div>
  );
}

export default ParentComponent;
