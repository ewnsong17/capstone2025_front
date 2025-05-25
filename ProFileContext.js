// ProFileContext.js
import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState(''); 
    const [image, setImage] = useState(null);

    return (
        <ProfileContext.Provider value={{ name, setName, birthDate, setBirthDate, email, setEmail, image, setImage }}>
            {children}
        </ProfileContext.Provider>
    );
};