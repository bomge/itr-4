import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { MdLogout } from 'react-icons/md';
import { Ring } from '@uiball/loaders';
import { AccessToken } from '../../recoil/atom';
import axios from '../../api/axios';
import styles from '../../App.module.css';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const setAccessToken = useSetRecoilState(AccessToken);
  const [isloading, setIsloading] = useState(false);
  const logoutHandler = async () => {
    // send logout request
    setIsloading(true);
    await axios
      .post('/auth/logout')
      .then(() => {
        setAccessToken(null);
        setIsloading(false);
        navigate('/');
      })
      .catch(() => {
        setIsloading(false);
      });
  };
  return (
    <div>
      <h1 className="text-center">TASK-4</h1>
      <div className={styles.center}>
        <button
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={logoutHandler}
          disabled={isloading}
          type="button">
          {!isloading ? (
            <div className={styles.center}>
              <MdLogout size={30} style={{ marginRight: 10 }} />
              Logout
            </div>
          ) : (
            <div className={styles.center}>
              <Ring size={18} color="white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
