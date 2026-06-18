export function translateEvery(every: string): string {

    if (!every) {

        return "";

    }

    const [minutes, hours, dayOfMonth, month, dayOfWeek] = every.split(" ");

    let result = "";

    if (dayOfWeek === "1-5") {

        result += "Du lundi au vendredi\n";

    }

    else if (dayOfWeek === "*") {

        result += "Tous les jours\n";

    }

    if (hours === "*") {

        result += "Toutes les heures\n";

    }

    else {

        result += `À ${hours}h\n`;

    }

    if (minutes.includes(",")) {

        result += `Aux minutes ${minutes}`;

    }

    else {

        result += `À la minute ${minutes}`;

    }

    return result;

}