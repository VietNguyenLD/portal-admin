import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import GroupPermission from './pages/groupPermission';
import GroupPermissionCreate from './pages/groupPermission/Create';
import groupPermissionDetail from './pages/groupPermission/Detail';
import GroupPermissionUser from './pages/groupPermissionUser';
import GroupPermissioUserCreate from './pages/groupPermissionUser/Create';
import GroupPermissioUserDetail from './pages/groupPermissionUser/Detail';

function Permissions() {
  const math = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${math.url}/group-permission/create`} component={GroupPermissionCreate} />
      <Route exact path={`${math.url}/group-permission/:id`} component={groupPermissionDetail} />
      <Route path={`${math.url}/group-permission`} component={GroupPermission} />
      <Route path={`${math.url}/user/create`} component={GroupPermissioUserCreate} />
      <Route path={`${math.url}/user/:id`} component={GroupPermissioUserDetail} />
      <Route path={`${math.url}/user`} component={GroupPermissionUser} />
      <Redirect to='/admin/dashboard' />
    </Switch>
  );  
}

export default Permissions;
