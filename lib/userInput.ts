import inquirer from "inquirer";

export const getAnswer = async (name: string, message: string): Promise<string> => {
    const answers = await inquirer.prompt([
        {
            type: "input",
            message,
            name,
            validate(input, answers) {
                return input && input !== "" ? true : `Invalid answer`
            },
        },
        {
            type: "confirm",
            name: "Confirm",
            message(answers) {
                return `Please confirm ${answers[name]}`
            },
        }
    ]);

    if (!answers['Confirm']) {
        return await getAnswer(name, message);
    }
    return answers[name];
}

export const requestConfirmation = async (message: string, cond?: () => boolean) => {
    await inquirer.prompt([{
        name: "conf",
        message,
        when: cond && cond(),
        type: "confirm",
        async validate(input, answers) {
            if (!input) {
                await requestConfirmation(message, cond);
            }
        },
    }]);

}