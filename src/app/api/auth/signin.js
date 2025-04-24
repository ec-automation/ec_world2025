import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
  return (
    <div>
      <h1>Login</h1>
      {providers &&
        Object.values(providers).map((provider) => (
          <button key={provider.name} onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
