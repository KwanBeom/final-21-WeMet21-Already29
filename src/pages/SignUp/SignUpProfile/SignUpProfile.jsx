import React, { useState, useEffect, useRef, useContext } from "react";
import { ProfileInfo, ImgUploadBtn, UploadInput, EditForm, Label, Img, ImgIcon, ProfileSettingForm, ProfileTitle } from "./SignUpProfileStyle";
import { useLocation, useNavigate } from "react-router-dom";
import basicProfileImage from "../../../assets/images/basicProfileImg.png";
import uploadIcon from "../../../assets/images/uploadFile.png";
import Button from "../../../components/Button/Button";
import Header from "../../../components/Header/Header";
import UserInput from "../../../components/UserInput/UserInput";
import fetchApi from "../../../utils/fetchApi";
import UserInfo from "../../../contexts/LoginContext";
import useDebounce from "../../../hooks/useDebounce";

export default function ProfileSettings({ email, password }) {
  const navigate = useNavigate();
  const uploadInputRef = useRef(null);
  const [image, setImage] = useState(basicProfileImage);
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태 추가

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [idValid, setIdValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [idError, setIdError] = useState("");
  const location = useLocation();
  const isModify = location.pathname.includes("modify");
  const { userInfo, setUserInfo } = useContext(UserInfo);
  const { output: accountResult, setKeyword: setAccountKeyword } = useDebounce(
    "user/accountnamevalid",
    JSON.stringify({
      user: {
        accountname: id,
      },
    })
  );

  const modifyUserProfile = () => {
    fetchApi(
      "user",
      "PUT",
      JSON.stringify({
        user: {
          username: name,
          accountname: id,
          intro: introduce,
          image: imageUrl,
        },
      })
    ).then((res) => {
      console.log(res.user);
      const accountname = res.user.accountname,
        image = res.user.image,
        username = res.user.username,
        intro = res.user.intro;

      setUserInfo((prev) => {
        console.log(prev);
        return { ...prev, accountname, image, username, intro };
      });
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      navigate(`/profile/${res.user.accountname}`);
    });
  };

  const join = async () => {
    const userData = {
      user: {
        email: email,
        password: password,
        image: imageUrl,
        username: name,
        accountname: id,
        intro: introduce,
      },
    };

    try {
      const json = await fetchApi("user", "POST", JSON.stringify(userData)); // fetch 호출을 fetchApi로 대체합니다.
      console.log(json);
    } catch (error) {
      console.error("가입 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (isModify) {
      try {
        fetchApi("user/myinfo", "GET").then((res) => {
          setId(res.user.accountname);
          setName(res.user.username);
          setIntroduce(res.user.intro);
          setImageUrl(res.user.image);
        });
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
      }
    }
  }, [isModify]);

  const handleImgClick = () => {
    uploadInputRef.current.click();
  };

  //프로필 사진 업로드
  const handleFile = async (event) => {
    const file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      reader.result && setImage(reader.result);
    };

    reader.readAsDataURL(event.target.files[0]);

    const url = "https://api.mandarin.weniv.co.kr/";

    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("https://api.mandarin.weniv.co.kr/image/uploadfile", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log(data);
      const path = url + data.filename;
      setImageUrl(path);
    } catch (error) {
      console.error(error);
    }
  };

  // 사용자 이름 유효성 검사
  const handleNameInput = (event) => {
    const valueName = event.target.value;
    setName(valueName);
    if (valueName.length >= 2 && valueName.length <= 10) {
      setNameError("");
      setNameValid(true);
    } else {
      setNameError("2~10자 이내여야 합니다.");
      setNameValid(false);
    }
  };

  useEffect(() => {
    setAccountKeyword(id);

    const pat = /^[A-Za-z0-9._]+$/;
    if (id && pat.test(id)) {
      switch (accountResult.message) {
        case "사용 가능한 계정ID 입니다.":
          setIdValid(true);
          setIdError("");
          break;
        default:
          setIdValid(false);
          setIdError(accountResult.message);
          break;
      }
    } else if (id && !pat.test(id)) {
      setIdValid(false);
      setIdError("영문, 숫자, 특수문자(.),(_)만 사용 가능합니다");
    } else {
      setIdValid(false);
      setIdError("");
    }
  }, [id, setAccountKeyword, accountResult]);

  // 계정 유효성 검사
  const handleIdInput = async (event) => {
    const value = event.target.value;
    setId(value); // 입력된 값을 그대로 유지 (첫번째 글자 지워지지 않는 오류 해결)
  };

  // 소개 입력란 핸들러
  const handleIntroduceInput = (event) => {
    setIntroduce(event.target.value);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (nameValid && idValid) {
      await join(); // 이미지 업로드 및 회원가입 API 요청
      navigate("/login");
    }
  };

  return (
    <>
      {isModify && (
        <Header type="submitHeader">
          <Button category="basic" width="9rem" height="3.2rem" onClick={() => modifyUserProfile()} disabled={name && id && introduce ? false : true} form="profileForm">
            저장
          </Button>
        </Header>
      )}

      <ProfileSettingForm onSubmit={handleForm}>
        <ProfileTitle className={isModify && "a11y-hidden"}>{isModify ? "프로필 수정" : "프로필 설정"}</ProfileTitle>
        {!isModify && <ProfileInfo>나중에 언제든지 변경할 수 있습니다.</ProfileInfo>}
        <Label htmlFor="file-sync" className="file-sync" onClick={handleImgClick}>
          <ImgUploadBtn>
            <Img src={imageUrl || image} alt="uploadFile" />
            <ImgIcon src={uploadIcon} alt="업로드아이콘" />
          </ImgUploadBtn>
        </Label>
        <UploadInput ref={uploadInputRef} id="profile" type="file" accept=".png, .jpg, .jpeg" multiple hidden onChange={handleFile} />

        <EditForm id="profileForm">
          <UserInput id={"user-name"} type={"text"} minLength={2} maxLength={10} placeholder={"2~10자 이내여야 합니다."} value={name} alertMsg={setNameError} onChange={handleNameInput} onBlur={handleNameInput} required>
            사용자이름
          </UserInput>
          {nameError && (
            <p
              style={{
                marginBottom: "2rem",
                marginTop: "-1rem",
                fontSize: "1.2rem",
                color: "var(--font-red-color)",
              }}
            >
              {nameError}
            </p>
          )}
          <UserInput id={"user-id"} type={"text"} placeholder={"영문, 숫자, 특수문자(.),(_)만 사용 가능합니다.."} value={id} valid={idValid} alertMsg={setIdError} onChange={handleIdInput} onBlur={handleIdInput} required>
            계정 ID
          </UserInput>
          {!isModify && idError && (
            <p
              style={{
                marginBottom: "2rem",
                marginTop: "-1rem",
                fontSize: "1.2rem",
                color: "var(--font-red-color)",
              }}
            >
              {idError}
            </p>
          )}
          <UserInput id={"user-introduce"} type={"text"} placeholder={"좋아하는 브랜드와 룩을 알려주세요."} value={introduce} onChange={handleIntroduceInput} required>
            소개
          </UserInput>
          {!isModify && (
            <Button category="basic" type="submit" onClick={handleForm} disabled={!(nameValid && idValid)}>
              입9팔9 즐기러 가기
            </Button>
          )}
        </EditForm>
      </ProfileSettingForm>
    </>
  );
}
