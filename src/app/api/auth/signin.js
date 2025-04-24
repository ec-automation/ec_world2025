// pages/auth/signin.js
import { getProviders, signIn } from 'next-auth/react';

export default function SignIn({ providers }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <img src="/system_images/logo_png.png" alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
      <h1>Sign Inx</h1>
      <div className="text-white grid grid-cols-1 grid-rows-auto ">
        {providers && Object.values(providers).map((provider) => (
            <button className="text-white mb-6 mt-6 p-8"key={provider.name} onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}>
            Sign in with {provider.name}
          </button>
        ))}
      </div>

    </div>
  );
}

SignIn.getInitialProps = async () => {
  const providers = await getProviders();
  console.log('Providers:', providers); // Log providers
  return { providers };
};