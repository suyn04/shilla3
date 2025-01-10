import React, { useState, useEffect } from 'react';

const JoinPhone = ({ valid, setValid, setPhone }) => {
    const [startNum, setStartNum] = useState(''); // 시작 번호
    const [middleNum, setMiddleNum] = useState(''); // 중간 번호
    const [lastNum, setLastNum] = useState(''); // 마지막 번호
    const [cphone, setcPhone] = useState(''); // 인증번호
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
    const [phoneErrorMsg, setPhoneErrorMsg] = useState(''); // 에러 메시지 상태 - 인증번호 일치/불일치
    const [isPhoneChk, setPhoneChk] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [randomNum, setRandomNum] = useState('');

    const bkURL = process.env.REACT_APP_BACK_URL;

    // 본인인증번호 발송
    const handlePhoneChk = () => {
        validatePhoneNumber(startNum, middleNum, lastNum); // 유효성 검사 실행
        if (valid) {
            setPhoneChk(true);
            const phoneNum = `${startNum}${middleNum}${lastNum}`.trim();
            alert(`인증번호 발송되었습니다.`);
            axios
                .post(`${bkURL}/check/sms`, { phoneNum: phoneNum }, { headers: { 'Content-Type': 'application/json' } })
                .then((res) => {
                    setRandomNum(res.data);
                })
                .catch((err) => {
                    console.error('에러발생 : ', err);
                });
        } else {
            setErrorMessage('유효한 전화번호를 입력해주세요.');
        }
    };

    // 본인인증 번호 확인
    const handlePhoneSubmit = () => {
        console.log('cphone', cphone, 'randomNum', randomNum);
        if (cphone == randomNum) {
            setIsReadOnly(true);
            alert('본인인증 되었습니다.');
        } else {
            alert('일치하지 않습니다');
        }
    };

    // 전화번호 시작 번호 옵션 (예시)
    const startNumbers = [
        '010',
        '02',
        '031',
        '032',
        '033',
        '041',
        '042',
        '043',
        '044',
        '051',
        '052',
        '053',
        '054',
        '055',
        '061',
        '062',
        '063',
        '064',
    ];

    // 유효성 검사 함수
    const validatePhoneNumber = (start, middle, last) => {
        const isStartNum010 = start === '010';
        const isMiddleValid = isStartNum010 ? /^\d{4}$/.test(middle) : /^\d{3,4}$/.test(middle);
        const isLastValid = /^\d{4}$/.test(last);

        // 전체 유효성 검사
        if (!start || !middle || !last) {
            setValid(false);
            // setErrorMessage('모든 필드를 입력해주세요.');
        } else if (!isMiddleValid) {
            setValid(false);
            setErrorMessage('중간 번호는 3~4자리 숫자여야 합니다.');
        } else if (!isLastValid) {
            setValid(false);
            setErrorMessage('마지막 번호는 4자리 숫자여야 합니다.');
        } else {
            setValid(true);
            setErrorMessage('');
        }
    };

    // 입력값 처리 함수
    const handleStartNumChange = (e) => {
        setStartNum(e.target.value);
    };

    const handleMiddleNumChange = (e) => {
        setMiddleNum(e.target.value);
    };

    const handleLastNumChange = (e) => {
        setLastNum(e.target.value);
    };
    const handlephoneNumChange = (e) => {
        setcPhone(e.target.value);
    };

    // 전화번호가 변경될 때마다 유효성 검사 실행
    useEffect(() => {
        const phoneNum = `${startNum}-${middleNum}-${lastNum}`.trim();
        setPhone(phoneNum);

        validatePhoneNumber(startNum, middleNum, lastNum);
    }, [startNum, middleNum, lastNum]);

    return (
        <div>
            <div className="info-group">
                <div className="input-container">
                    <label htmlFor="tel">
                        연락처 <font color="#F00">*</font>
                    </label>
                    <div className="input-wrap">
                        <div className="tel-num">
                            <select
                                name="startNum"
                                id="start"
                                value={startNum}
                                required
                                onChange={handleStartNumChange}
                            >
                                <option value="">선택</option>
                                {startNumbers.map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="middleNum"
                                type="text"
                                id="middle"
                                value={middleNum}
                                onChange={handleMiddleNumChange}
                                maxLength="4"
                                required
                                placeholder="중간 번호"
                            />
                            <input
                                name="lastNum"
                                type="text"
                                id="last"
                                value={lastNum}
                                onChange={handleLastNumChange}
                                maxLength="4"
                                required
                                placeholder="마지막 번호"
                            />
                            <button type="button" id="id-chk" data-lybtn="pop-using" onClick={handlePhoneChk}>
                                인증번호발송
                            </button>
                            <span className="error-message" id="tel-error">
                                {errorMessage}
                            </span>
                        </div>
                    </div>
                </div>
                {isPhoneChk && (
                    <div className="input-container">
                        <label htmlFor="telChk"></label>
                        <div className="input-wrap">
                            <div className="telChk-input">
                                <input
                                    name="member_id"
                                    type="text"
                                    id="cphone"
                                    minLength="5"
                                    placeholder="인증번호 입력"
                                    value={cphone}
                                    onChange={handlephoneNumChange}
                                    readOnly={isReadOnly}
                                />
                                <button type="button" id="id-chk" data-lybtn="pop-using" onClick={handlePhoneSubmit}>
                                    확인
                                </button>
                                <span className="error-message" id="tel-error">
                                    {phoneErrorMsg}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JoinPhone;
