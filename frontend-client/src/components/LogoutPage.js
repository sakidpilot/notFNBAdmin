import React, { useState } from 'react';

const LogoutPage = () => {

    
    localStorage.clear();
    window.location.href = "/";


};


export default LogoutPage;