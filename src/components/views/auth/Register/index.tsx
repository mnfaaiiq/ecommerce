import Link from "next/link";
import styles from "./Register.module.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

const RegisterView = () => {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target as HTMLFormElement;
    const data = {
      email: form.email.value,
      fullname: form.fullname.value,
      phone: form.phone.value,
      password: form.password.value,
    };
    const result = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      form.reset();
      setIsLoading(false);
      push("/auth/login");
    } else {
      setIsLoading(false);
      setError("Email is already registered");
    }
  };

  return (
    <div className={styles.register}>
      <h1 className={styles.register__title}>Register</h1>
      {error && <p className={styles.register__error}>{error}</p>}
      <div className={styles.register__form}>
        <form action="" onSubmit={handleSubmit}>
          <div className={`${styles.register__form__item} flex flex-col`}>
            <label htmlFor="fullname">Fullname</label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className={`${styles.register__form__item} bg-gray-200 mb-2 mt-2 h-[30px] p-3`}
            />
          </div>
          <div className={`${styles.register__form__item} flex flex-col`}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className={`${styles.register__form__item} bg-gray-200 mb-2 mt-2 h-[30px] p-3`}
            />
          </div>
          <div className={`${styles.register__form__item} flex flex-col`}>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className={`${styles.register__form__item} bg-gray-200 mb-2 mt-2 h-[30px] p-3`}
            />
          </div>
          <div className={`${styles.register__form__item} flex flex-col`}>
            <label htmlFor="password">password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={`${styles.register__form__item} bg-gray-200 mb-2 mt-2 h-[30px] p-3`}
            />
          </div>
          <button
            type="submit"
            className={`${styles.register__button} hover:opacity-85 transition-all`}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
      <p>
        Have an account? Sign in{" "}
        <Link href={"/auth/login"} className={styles.register__link}>
          here
        </Link>
      </p>
    </div>
  );
};

export default RegisterView;
