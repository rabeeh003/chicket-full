import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Form Data:", formData, data);

    try {
      const response = await fetch("https://chicketarabia.com/api/login", {
      // const response = await fetch("https://chicketarabia.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure JSON is sent
          "Accept": "application/json",
        },
        body: JSON.stringify({
          // name: data.name,
          email: data.email,
          password: data.password,
          // confirm_password: data.password
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Login successful", result);
        localStorage.setItem("token", result.token);
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error Login:", error);
    }
  };
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Login</h1>
          <Form className="w-screen max-w-[90vw] mt-10 md:max-w-sm space-y-4" onSubmit={onSubmit} >
            <Input
              isRequired
              label="Email"
              name="email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="email"
            />
            <Input
              isRequired
              label="Password"
              name="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              type="password"
            />

            <Button type="submit" variant="shadow" color="danger" fullWidth>Login</Button>
          </Form>
        </div>
      </section>
    </DefaultLayout>
  );
}
