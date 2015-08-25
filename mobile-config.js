// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
    id: 'com.example.nick',
    name: 'Nicks app',
    description: 'Testing notifications',
    author: 'RapidWare',
    email: 'contact@example.com',
    website: 'http://example.com'
});

// Set up resources such as icons and launch screens.
App.icons({
    'android_ldpi': 'icons/avant-window-navigator.png',
    'android_mdpi': 'icons/avant-window-navigator.png',
    'android_hdpi': 'icons/avant-window-navigator.png',
    // ... more screen sizes and platforms ...
});

/*
App.launchScreens({
    'iphone': 'splash/Default~iphone.png',
    'iphone_2x': 'splash/Default@2x~iphone.png',
    // ... more screen sizes and platforms ...
});
*/


// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
