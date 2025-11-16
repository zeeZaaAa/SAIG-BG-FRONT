import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black font-sans">
            <div>
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-zinc-50">
                    Sign Up Page
                </h1>
            </div>
            <main className="flex w-full max-w-3xl items-center justify-between py-32 px-16 bg-black sm:items-start text-neutral-300">
                <SignUpForm />
            </main>
        </div>
    );
}