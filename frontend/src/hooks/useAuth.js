import { useRecoilValue } from 'recoil';
import jwtDecode from 'jwt-decode';
import { AccessToken } from '../recoil/atom';

const useAuth = () => {
  const accessToken = useRecoilValue(AccessToken);

  if (accessToken) {
    const decode = jwtDecode(accessToken);
    const { email, id } = decode.UserInfo;

    return {
      email,
      id
    };
  }
  return {
    email: '',
    id: null
  };
};
export default useAuth;
