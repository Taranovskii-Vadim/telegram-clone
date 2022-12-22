import { action, makeObservable, observable } from 'mobx';

import { api } from '../../api';
import postLogin from '../../api/postLogin';

// TODO check variant when Login is page not component

class AuthStore {
  isLogged = !!localStorage.getItem('token');

  constructor() {
    makeObservable(this, {
      isLogged: observable,

      changeIsLogged: action,
    });
  }

  changeIsLogged = (value: boolean): void => {
    this.isLogged = value;
  };

  logout = (): void => {
    window.location.href = '/';
    localStorage.clear();
    this.isLogged = false;
  };

  signIn = async (payload: any): Promise<void> => {
    const result = await api(postLogin, payload);

    this.changeIsLogged(!!result);
  };
}

export default new AuthStore();
