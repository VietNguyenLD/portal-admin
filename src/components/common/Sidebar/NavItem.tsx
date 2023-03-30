import { DownOutlined } from '@ant-design/icons';
import { Fragment, useState } from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { ActionText } from 'constants/permission';
import useCan from 'hooks/useCan';

function NavItem({ item }: { [key: string]: any }) {
  const [open, setOpen] = useState(false);
  const { isCan, getPermission } = useCan();
  const { permissionIds, user } = getPermission();

  return (
    <Fragment>
      {item.children && item.children.length > 0 ? (
        <li
          className={open ? 'open' : ''}
          style={{
            display:
              permissionIds?.some(
                (r: number) => item?.featureId?.includes(r) && isCan(r, ActionText.READ),
              ) || user?.is_super_admin
                ? 'block'
                : 'none',
          }}>
          <div className='flex justify-between'>
            <div
              className='inline-flex align-center'
              style={{ minWidth: '260px' }}
              onClick={() => setOpen((prevState) => !prevState)}>
              <span className='item_icon'>{item.icon}</span>
              <span className='item_name text--overflow'>{item.title}</span>
            </div>
            <DownOutlined
              className='item_icon icon--arrow'
              onClick={() => setOpen((prevState) => !prevState)}
            />
          </div>
          <ul className='sub-item'>
            {item.children.map((item: { [key: string]: any }, index: number) => {
              if (
                (permissionIds.includes(item?.featureId) || user?.is_super_admin) &&
                isCan(item?.featureId, ActionText.READ)
              ) {
                return (
                  <li key={index}>
                    <NavLink to={item.path} className={`sub-item_name ${!item.longText && 'text--overflow'}`}>
                      {item.title}
                    </NavLink>
                  </li>
                );
              }
            })}
          </ul>
        </li>
      ) : (
        (permissionIds.includes(item?.featureId) || user?.is_super_admin) &&
        isCan(item?.featureId, ActionText.READ) && (
          <li>
            <div className='flex justify-between'>
              <NavLink to={item.path} className='flex align-center'>
                <span className='item_icon'>{item.icon}</span>
                <span className='item_name text--overflow'>{item.title}</span>
              </NavLink>
            </div>
          </li>
        )
      )}
    </Fragment>
  );
}

export default NavItem;
