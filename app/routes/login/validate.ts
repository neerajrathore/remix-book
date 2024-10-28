// work a module for this route 
// this will not became a route
// nice spot to put stuff related to route signup

export function validate(email: string, password: string) {
    let errors: { email?: string, password?: string } = {}

    if (!email) {
        errors.email = "email required"
    }
    else if (!email.includes("@")) {
        errors.email = "valid email required"
    }

    // if (await accountExists(email)) {
    //     errors.email = "An account with this email already exists.";
    // }

    if (!password) {
        errors.password = "password required"
    }
    else if (password.length < 8) {
        errors.password = "8 + password required"
    }

    return Object.keys(errors).length ? errors : null
}