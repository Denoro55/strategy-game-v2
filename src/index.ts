import 'assets/styles/index.scss';

import { App } from 'core';
import { CONFIG } from 'constants/config';
import { getQuery } from 'helpers';
import { IClient } from 'types';

const ONLY_DEV = true;

const MODE =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';
const isDevMode = MODE === 'development';
const ENV = CONFIG.env[MODE];

const LOGS = true;
const VK_API_VERSION = '5.130';
const SOCKET_HOST = ENV.SOCKET_HOST;

const MOCK_CLIENT: IClient = {
  id: 1,
  authKey: '123456789',
  firstName: 'Denis',
  lastName: 'Chertenko',
};

if (!isDevMode) {
  console.log = () => {
    return;
  };
}

const $container: HTMLDivElement | null = document.querySelector('#app');

if ($container) {
  const BASE_APP_OPTIONS = {
    container: $container,
    isDevMode,
    socketHost: SOCKET_HOST,
    logs: LOGS,
  };

  if (isDevMode || ONLY_DEV) {
    new App({
      ...BASE_APP_OPTIONS,
      client: MOCK_CLIENT,
    });
  } else {
    VK.init(
      function () {
        const userId = getQuery(window.location.search, 'viewer_id');
        const authKey = getQuery(window.location.search, 'auth_key');

        // console.log('connected to vk, your id is:', userId);

        if (userId && authKey) {
          VK.api(
            'users.get',
            {
              user_ids: userId,
            },
            function (data: any) {
              const userData = data.response[0];
              const { first_name, last_name } = userData;

              new App({
                ...BASE_APP_OPTIONS,
                client: {
                  id: +userId,
                  authKey,
                  firstName: first_name,
                  lastName: last_name,
                },
              });
            }
          );
        }
      },
      function () {
        // API initialization failed
        // Can reload page here
      },
      VK_API_VERSION
    );
  }
}
