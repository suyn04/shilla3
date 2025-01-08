import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


function LoginCallback(props) {
    const navigate = useNavigate();
    useEffect(()=>{
        let code = new URL(window.location.href).searchParams.get('code')
        // console.log(code);
    },[])

    return (
        <div>
            콜백링크
        </div>
    );
}

export default LoginCallback;