export type LoginPayload = {
  username: string;
  password: string;
};

export type Store = {
  isLogged: boolean;
  logout: () => void;
  changeIsLogged: (value: boolean) => void;
  signIn: (payload: LoginPayload) => Promise<void>;
};
