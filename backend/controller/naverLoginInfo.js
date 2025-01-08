const CLIENT_ID = '0qPsakx_WEZQuBwtEcAv';
const CLIENT_SECRET = 'f8TYOCPl3e';
// REDIRECT_URI은 네이버에 등록된 콜백 URL을 입력해야한다
const REDIRECT_URI = 'http://localhost:5002/bk/naverLogin/callback';
const STATE = Math.random().toString(36).substring(7);

module.exports = {//네이버 로그인 정보 - .env
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    STATE
};