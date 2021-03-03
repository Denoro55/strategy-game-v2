interface ModeEnvironment {
  SOCKET_HOST: string;
}

interface IEnv {
  development: ModeEnvironment;
  production: ModeEnvironment;
}

export const ENV: IEnv = {
  development: {
    SOCKET_HOST: 'http://localhost:5000',
  },
  production: {
    SOCKET_HOST: 'https://boiling-depths-28880.herokuapp.com',
  },
};
