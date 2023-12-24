import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { AccessToken } from '../../recoil/atom';

import axios from '../../api/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const setAccessToken = useSetRecoilState(AccessToken);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // submit form data

    setError(null);
    try {
      const result = await axios.post(
        '/register',
        { email, password, name },
        { withCredentials: true }
      );
      if (result?.data?.accessToken) {
        setAccessToken(result?.data?.accessToken);
      }
      navigate(location.state?.from?.pathname || '/dash', {
        replace: true
      });
    } catch (err) {
      console.log(err);
      if (!err?.response?.status) {
        setError('No server response');
      } else if (err?.response?.data?.message) {
        setError(err?.response?.data?.message);
      } else if (err?.response?.status === 401) {
        setError('Unauthorized');
      } else {
        setError(err?.message);
      }
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />

          <div className="-space-y-px rounded-md shadow-sm">
            <div className="mt-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="Email address"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="name" className="sr-only">
                Email address
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full"
                placeholder="Name"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="Password"
              />
            </div>
            <p aria-live="assertive" className="text-rose-500">
              {error}
            </p>
          </div>

          <div className="text-sm text-left">
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
