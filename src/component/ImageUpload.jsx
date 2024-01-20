import React, { useEffect, useState } from "react";
import { uploadImg } from "../api/image";
const metadata = {
  contentType: "image/jpeg",
};
const ImageUpload = ({imageUpload}) => {
  const [image, setImage] = useState(null); // state lưu ảnh sau khi chọn
  const [progress, setProgress] = useState(0); // state hiển thị phần trăm tải ảnh lên store
  const handleChange = async (e) => {
    if (e.target.files[0]) {
      await setImage(e.target.files[0]);
    }
  };

  useEffect(()=>{
      imageUpload(image);
  },[image])

  return (
    <div className="py-3">
      <div className=" max-w-md mx-auto p-3 bg-white rounded-lg shadow-lg">
        <div className=" mt-3 mb-4">
          <input
            type="file"
            onChange={handleChange}
            className="hidden"
            id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="block background-yellow-linear text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Select Image
          </label>
          {image && <p className="mt-2 text-gray-400">Selected: {image.name}</p>}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 rounded-lg shadow-md"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}
        </div>
        {progress > 0 && (
          <progress value={progress} max="100" className="w-full" />
        )}
      </div>
    </div>
  );
};
export default ImageUpload;
