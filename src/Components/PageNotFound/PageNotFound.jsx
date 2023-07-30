import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from "./PAgeNotFound.module.css"
const PageNotFound = () => {
    const nav=useNavigate()
    const onRedirectclick=()=>{
        nav("/");
    }
    return (
        <>
            <section className={Styles.section}>
                <div>
                    <h1>404</h1>
                    <p>I am sorry, but the page you are requested was not found :(</p>
                    <button onClick={onRedirectclick} className={Styles.button}>Redirect</button>
                </div>
            </section>
        </>
    );
}

export default PageNotFound;