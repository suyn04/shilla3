import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import '../../scss/sub06_03_03.scss';

const bkURL = process.env.REACT_APP_BACK_URL;

const BoardModify = () => {
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const { num } = useParams();

    const [detailText, setDetailText] = useState(null);

    useEffect(() => {
        if (!num) {
            console.log('num 없음');
            return;
        }

        axios
            .get(`${bkURL}/board/detail/${num}`)
            .then((res) => {
                console.log('정보받기 성공', res.data);
                setDetailText(res.data);
                console.log('detailText :', detailText);
            })
            .catch((err) => {
                console.error('정보받기 실패', err);
            });
    }, [num]);

    function textChg(key, me) {
        setDetailText({ ...detailText, [key]: me.value });
    }

    function submitGo(e) {
        e.preventDefault();
        const frmData = new FormData(document.myFrm);
        const myData = Object.fromEntries(frmData);
        console.log(myData);

        if (editorRef.current) {
            myData.context = editorRef.current.getContent();
        }

        axios
            .put(`${bkURL}/board/modify/${num}`, myData)
            .then((res) => {
                console.log('정보 수정 성공', res.data);
                alert('수정되었습니다.');
                navigate(`/board/detail/${num}`);
            })
            .catch((err) => {
                console.error('정보 수정 실패', err);
            });
    }

    if (!detailText) {
        console.log('num 없음');
        return <div>로딩중...</div>;
    }

    return (
        <div className="container">
            <div className="center">
                <form id="frm" name="myFrm">
                    <h2 className="ask">문의내용 수정</h2>
                    <div className="text-container">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={detailText.title}
                            onChange={(e) => textChg('title', e.target)}
                        />
                        {/* <textarea id="content" name="context" autofocus="autofocus" onChange={(e)=>textChg('context',e.target)}>{detailText.context}</textarea> */}
                        <Editor
                            name="context"
                            id="content"
                            onChange={(e) => textChg('context', e.target)}
                            apiKey="aqn3pn6elseepzwxjuftifz4jhqdky0u8xlzc4sv2kl4pe8l"
                            onInit={(_evt, editor) => (editorRef.current = editor)}
                            initialValue={detailText.context}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist',
                                    'autolink',
                                    'lists',
                                    'link',
                                    'image',
                                    'charmap',
                                    'preview',
                                    'anchor',
                                    'searchreplace',
                                    'visualblocks',
                                    'code',
                                    'fullscreen',
                                    'insertdatetime',
                                    'media',
                                    'table',
                                    'code',
                                    'help',
                                    'wordcount',
                                ],
                                toolbar:
                                    'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'image emoticons preview | ' +
                                    'searchreplace help ',
                                file_picker_callback: (callback, value, meta) => {
                                    if (meta.filetype === 'image') {
                                        const input = document.createElement('input');
                                        input.setAttribute('type', 'file');
                                        input.setAttribute('accept', 'image/*');
                                        input.onchange = function () {
                                            const file = this.files[0];
                                            const reader = new FileReader();
                                            reader.onload = function () {
                                                callback(reader.result, { alt: file.name });
                                            };
                                            reader.readAsDataURL(file);
                                        };
                                        input.click();
                                    }
                                },
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            }}
                            required
                        />
                    </div>
                    <div className="button-container">
                        <Link to={'/board'} id="cancel">
                            목록
                        </Link>
                        <button id="submit" onClick={submitGo}>
                            수정완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BoardModify;
