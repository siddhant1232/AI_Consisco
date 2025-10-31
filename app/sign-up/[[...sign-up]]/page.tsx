import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center w-full">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 sm:px-6 py-12 lg:py-24 lg:pt-12">
        <SignUp />
      </div>
    </section>
  );
}
