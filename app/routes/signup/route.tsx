import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useActionData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Input, Label } from "~/components/Input";
import { validate } from './validate'
import { authCookie } from "~/auth";
import { createAccount } from "./queries";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    let email = String(formData.get('email'));
    let password = String(formData.get('password'));
    let errors = await validate(email, password)
    if (errors) {
        return { errors }
    }
    let user = await createAccount(email, password)
    // redirect causes fetch call network
    return redirect('/', {
        headers: {
            "set-Cookie": await authCookie.serialize(user.id)
        }
    })
}

export default function SignUp() {
    let actionData = useActionData<typeof action>()
    let emailError = actionData?.errors?.email
    let passwordError = actionData?.errors?.password

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                <Form className="space-y-6" method="post">
                    <div>
                        <Label htmlFor="email">
                            Email address{" "}
                            {emailError && (
                                <span id="email-error" className="text-brand-red" style={{ background: "red" }}>
                                    {emailError}
                                </span>
                            )}
                        </Label>
                        <Input
                            style={{ color: 'white' }}
                            autoFocus
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            // aria-describedby={
                            //   actionResult?.errors?.email ? "email-error" : "signup-header"
                            // }
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">
                            Password{" "}
                            {passwordError && (
                                <span id="password-error" className="text-brand-red" style={{ background: "red" }}>
                                    {passwordError}
                                </span>
                            )}
                        </Label>
                        <Input
                            style={{ color: 'white' }}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            aria-describedby="password-error"
                            required
                        />
                    </div>

                    <Button type="submit">Sign in</Button>

                    <div className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link className="underline" to="/login">
                            Log in
                        </Link>
                        .
                    </div>
                </Form>
            </div>
        </div>
    )
}