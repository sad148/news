function translate(data, target, cb) {
    let translated = []
    fetch("https://translation.googleapis.com/language/translate/v2?key=AIzaSyDYhR6fBqhEavU-4IzJvlTj_lEPSY7w2U4",{
        method:'POST',
        headers:
            {
                Accept:'application/json',
                'Content-Type': 'application/json'
            },
        body:JSON.stringify(
            {
                "q":data,
                "target":target
            })
    })
        .then((response) => response.json())
        .then((responseJson) => {
            for(let  i = 0;i < responseJson.data.translations.length;i++) {
                translated.push(responseJson.data.translations[i].translatedText)
            }
            cb(translated);
        }).catch((error) => {
        console.log(error);
    })
}

module.exports.translate = translate;