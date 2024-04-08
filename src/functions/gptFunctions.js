export const executeActionWithParams = async (action, params) => {
    switch (action) {
        case 'email':
            return await email(params);
        case 'greet':
            return await greet(...params);
        default:
            return "Action not found";
    }
};

const email = async params => {
    let email = params.email;
    console.log(email);
    return `Ya tenemos tu email '${email}' de contacto, pronto te vamos a enviar una invitación para la charla técnica y explicarte como continuar con el proceso. `
}

const greet = async (name) => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`Hello, ${name}!`);
        }, 1000);
    });
};