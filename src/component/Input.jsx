import { useEffect } from "react";
import "../style/Input.css";

export default function Input({
  name,
  value,
  maxLength,
  placeholder,
  onChange,
  validate,
}) {
  return (
    <div className="container_input">
      {name && (
        <label>
          {`${name}: `}
          <span className="color_red">*</span>
        </label>
      )}
      {validate && (
        <span className=" color_red input_validate">{validate}</span>
      )}
      <div className="input_wrap">
        <input onChange={onChange} value={value} placeholder={placeholder} />
        {maxLength && (
          <span className="text-gray-400">
            {value.length}/{maxLength}
          </span>
        )}
        {validate && <span className="text-red-600 text-xl ml-4">!</span>}
      </div>
    </div>
  );
}
