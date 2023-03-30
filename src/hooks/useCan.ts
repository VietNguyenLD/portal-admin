import { useCallback, useState } from 'react';
import { Action, ActionText } from 'constants/permission';
import jwt_decode from 'jwt-decode';
const useCan = () => {
  var token = localStorage.getItem('access_token');
  var decoded: any = jwt_decode(token as string);
  const getPermission: any = useCallback(() => {
    try {
      const permission: any = decoded?.user?.permissions || [];
      let permissionIds: any = permission.map((x: any) => x.featureId) || [];
      return {
        user: decoded?.user || {},
        permissionIds: [...permissionIds, 999],
      };
    } catch (error) {
      console.log(error);
      return {
        user: decoded?.user || {},
        permissionIds: [999],
      };
    }
  }, []);
  const changeActionToString = useCallback((statusAction: number) => {
    try {
      const actions = ['READ', 'CREATE', 'UPDATE', 'SUBMIT', 'IMPORT', 'EXPORT'];
      let result = [];
      for (const action of actions) {
        switch (action) {
          case ActionText.READ:
            Boolean(statusAction & Action.READ) && result.push(action);
            break;
          case ActionText.CREATE:
            Boolean(statusAction & Action.CREATE) && result.push(action);
            break;
          case ActionText.UPDATE:
            Boolean(statusAction & Action.UPDATE) && result.push(action);
            break;
          case ActionText.SUBMIT:
            Boolean(statusAction & Action.SUBMIT) && result.push(action);
            break;
          case ActionText.IMPORT:
            Boolean(statusAction & Action.IMPORT) && result.push(action);
            break;
          case ActionText.EXPORT:
            Boolean(statusAction & Action.EXPORT) && result.push(action);
            break;
        }
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }, []);


  const isCan = useCallback((featureId: number, permission: string) => {    
    try {
      if (featureId === 999 || decoded?.user?.is_super_admin) return true;
      const { user } = getPermission();
      if (!user) return;
      let el = user?.permissions.find((x: any) => x.featureId === featureId);

      if (!el) return false;
      const actionsArr: string[] = changeActionToString(el?.actions) || [];
    
      
      return actionsArr.includes(permission);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return {
    isCan,
    getPermission,
    changeActionToString,
  };
};

export default useCan;
