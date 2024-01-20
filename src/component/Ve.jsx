import { useEffect, useState } from "react";
import "../style/buttonVe.css";

export default function Ve({ isBuy = false, value, handlePick }) {
  const classNameDefault = "background-white color_red";

  const [isSelect, setIsSelect] = useState(false);
  const [className, setClassName] = useState(classNameDefault);

  useEffect(() => {
    // nếu vé đã được mua thì chuyển sang đỏ

    setClassName("background-red ");
  }, [isBuy]);

  useEffect(() => {
    // nếu vé chưa được mua
    if (!isBuy) {
      if (isSelect) {
        setClassName("background-yellow-linear color_white");
      } else {
        setClassName(classNameDefault);
      }
    }
  }, [isSelect]);

  const handleSelect = async (e) => {
    await setIsSelect(!isSelect);
    // truyền giá trị vào prop để componet cha có thể lấy và sử dụng
    handlePick(e.target.value);
  };

  return (
    <input
      className={`button_ve border_radius ${className}`}
      autoComplete="true"
      type="button"
      value={value}
      disabled={isBuy}
      onClick={handleSelect}
    />
  );
}
