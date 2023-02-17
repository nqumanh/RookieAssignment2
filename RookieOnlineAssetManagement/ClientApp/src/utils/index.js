const GetAge = (dateString) => {
    var today = new Date();
    var age = today.getFullYear() - dateString.getFullYear();
    var m = today.getMonth() - dateString.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateString.getDate())) {
        age--;
    }
    return age;
}

const GetDate = (dateString) => {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1; //January is 0!
    var year = date.getFullYear();

    if (day < 10) {
        day = `0${day}`
    }

    if (month < 10) {
        month = `0${month}`
    }

    return `${year}-${month}-${day}`;
}

const GetDateDMY = (dateString) => {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1; //January is 0!
    var year = date.getFullYear();

    if (day < 10) {
        day = `0${day}`
    }

    if (month < 10) {
        month = `0${month}`
    }

    return `${day}/${month}/${year}`;
}

const MapObject = (obj, properties) => {
    let result = {};
    properties.forEach(property => {
        result[property] = obj[property]
    });
    return result
}

function CompactText(text, maxlength = 15) {
    var result = "";

    if (text != null) {
        if (text.length <= maxlength)
            return text;

        else {
            for (var i = 0; i < maxlength; i++) {
                result = result.concat(text.split('')[i])
            }
            return result + "...";
        }
    }
    else
        return result;
}

function CompactString(text) {
    if (!text) text = ""
    return (text.length < 31) ? text : text.substring(0, 30) + "..."
}

function UTCWithoutHour(date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        )
    );
}

export {
    GetAge,
    GetDate,
    GetDateDMY,
    UTCWithoutHour,
    CompactText,
    MapObject,
    CompactString,
}