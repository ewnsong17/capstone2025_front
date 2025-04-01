import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [name, setName] = useState('홍길동');
    const [birthDate, setBirthDate] = useState('2000-01-01');
    const [profileImage, setProfileImage] = useState(null);

    return (
        <ProfileContext.Provider value={{ name, setName, birthDate, setBirthDate, profileImage, setProfileImage }}>
            {children}
        </ProfileContext.Provider>
    );
};
