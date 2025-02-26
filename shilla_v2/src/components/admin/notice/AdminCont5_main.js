import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../scss/AdminCont5.scss";
import AdminCont5_form from "./AdminCont5_form";
import AdminCont5_list from "./AdminCont5_list";

const bkURL = process.env.REACT_APP_BACK_URL;

const AdminCont5 = () => {
    const [Noticelists, setNoticelists] = useState([]);
    const [Txtinput, setTxtinput] = useState("");
    const [Ntype, setNtype] = useState("all");

    //전체
    const fetchData = async () => {
        try {
            const res = await axios.get(`${bkURL}/notice`);
            console.log("갔다옴", res.data);
            setNoticelists(res.data);
        } catch (error) {
            console.error("에러메세지", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //검색
    const handleSearch = async e => {
        e.preventDefault();

        const frmData = new FormData(document.myfrm);
        const myData = Object.fromEntries(frmData);
        console.log("인풋텍스트", Txtinput);
        console.log("선택타입", Ntype);

        try {
            console.log("폼데이터", myData);
            const res = await axios.put(
                `${bkURL}/notice`,
                myData
            );
            console.log("필터데이터", res.data);
            alert("검색완료");
            setNoticelists(res.data);
        } catch (err) {
            console.error("에러메세지", err);
        }
    };

    return (
        <div className="cont cont5">
            <div className="search">
                <AdminCont5_form
                    Noticelists={Noticelists}
                    setNoticelists={setNoticelists}
                    Txtinput={Txtinput}
                    setTxtinput={setTxtinput}
                    Ntype={Ntype}
                    setNtype={setNtype}
                    handleSearch={handleSearch}
                />
            </div>
            <AdminCont5_list
                Noticelists={Noticelists}
                setNoticelists={setNoticelists}
            />
        </div>
    );
};

export default AdminCont5;
