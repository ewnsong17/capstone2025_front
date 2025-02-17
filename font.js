import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

export default function useFont() {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        Font.loadAsync({
            Ransom: require('./assets/fonts/Ransom.ttf'),
        }).then(() => setFontLoaded(true));
    }, []);

    return fontLoaded;
}
