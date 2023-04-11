import React, { useState } from "react";
import { getDatabase, set, ref } from "firebase/database";
import {
  getStorage,
<<<<<<< HEAD
=======
  uploadString,
>>>>>>> origin/master
  getDownloadURL,
  ref as ref2,
  uploadBytesResumable,
} from "firebase/storage";
<<<<<<< HEAD
import {HiUpload} from 'react-icons/hi';
=======
>>>>>>> origin/master

export default function AddProduct() {
  const [values, setValues] = useState({
    itemImg: "",
    itemName: "",
    itemPrice: "",
    itemCate: "",
    itemDesc: "",
    itemOption: "",
  });

  const [file, setFile] = useState();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFile(files && files[0]);
      console.log(files[0]);
      return;
    }
<<<<<<< HEAD
    if (name === "itemPrice") {
    const formattedValue = Number(value.replace(/,/g, '')).toLocaleString();
    setValues({
      ...values,
      [name]: formattedValue,
    });
    return;
  }
=======
>>>>>>> origin/master
    setValues({
      ...values,
      [name]: value,
    });
  };

<<<<<<< HEAD
  

  //이미지 업로드 관련
=======
  //이미지 업로드 관련

>>>>>>> origin/master
  const randomId = Math.random().toString(16).substring(2, 8);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = document.querySelector("#itemImg").files[0];
    const db = getDatabase();

    //firebase storage img 업로드 처리
    const metadata = {
      contentType: "image/jpeg",
    };
    console.log("업로드 처리");
    const storage = getStorage();
    const storageRef = ref2(storage, `product/` + file.name); //어떤 폴더 아래에 넣을지 설정
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("snapshot", snapshot);
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percent + "% done");
      },
      (error) => {
        console.log("err", error);
        alert("파일 업로드에 실패했습니다." + error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(ref(db, "products/" + randomId), {
            ...values,
            index: randomId,
            itemImg: file.name,
            itemImgUrl: downloadURL,
          })
            .then(() => {
              // Data saved successfully!
              alert("상품이 등록되었습니다.");
              setValues({
                itemImg: "",
                itemName: "",
                itemPrice: "",
                itemCate: "",
                itemDesc: "",
                itemOption: "",
              });
              setFile("");
              document.querySelector("#itemImg").value = null;
            })
            .catch((error) => {
              // The write failed...
              console.log(error);
              return;
            });
        });
      }
    );

    // console.log(file, file.name);
    // return;
  };

  return (
<<<<<<< HEAD
    <div className=' flex justify-center flex-wrap'>
      {file && <div className="flex w-full h-[400px] justify-center"><img src={URL.createObjectURL(file)} alt="local file img" className='w-[300px]  mt-[20px] mb-[30px] my-auto' /></div> }
      <form onSubmit={handleSubmit} className={`w-[500px] m-auto  ${ file ? ('mt-[0px]'):('mt-[400px]')}`}>
=======
    <div>
      {file && <img src={URL.createObjectURL(file)} alt="local file img" />}
      <form onSubmit={handleSubmit}>
>>>>>>> origin/master
        <input
          type="file"
          className="border-2 rounded text-gray-500 p-1 my-2 w-full"
          id="itemImg"
          accept="image/*"
          name="file"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="제품명"
          className="border-2 rounded text-gray-500 p-1 my-2 w-full"
          name="itemName"
          value={values.itemName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="가격"
          className="border-2 rounded text-gray-500 p-1 my-2 w-full"
<<<<<<< HEAD
          name="itemPrice"          
=======
          name="itemPrice"
>>>>>>> origin/master
          value={values.itemPrice}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="카테고리"
          className="border-2 rounded text-gray-500 p-1 my-2 w-full"
          name="itemCate"
          value={values.itemCate}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="제품 설명"
          className="border-2 rounded text-gray-500 p-1 my-2 w-full"
          name="itemDesc"
          value={values.itemDesc}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="옵션들(콤마(,))로 구분"
          className="border-2 rounded text-gray-500 p-1 my-2 w-full"
          name="itemOption"
          value={values.itemOption}
          onChange={handleChange}
        />
        <button
          type="submit"
<<<<<<< HEAD
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mt-8 mx-auto flex justify-center items-center gap-2"
        >
          <HiUpload/>
          상품 등록
=======
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          submit
>>>>>>> origin/master
        </button>
      </form>
    </div>
  );
}
