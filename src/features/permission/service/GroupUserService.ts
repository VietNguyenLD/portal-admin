import userApi from 'api/userApi';
import { FormCreateUser, FormInFoUser, Groups, TablePermissionUser, User } from 'models/user';
import { toast } from 'react-toastify';
import { checkUserStatus } from 'utils/unit';

class GroupUserService {
  static async listUsers(formSearch: string): Promise<TablePermissionUser[] | []> {
    const res = await userApi.getListUser(formSearch);
    if (res && res.data.message === 'Success') {
      const result: TablePermissionUser[] | [] = res.data.data.data.map((item: User) => {
        return {
          id: item.id,
          name: (item.last_name ?? '') + ' ' + item.first_name ?? '',
          email: item.email,
          groups: item.groups.length > 0 ? item.groups.map((i) => i.name + ' ') ?? [] : [],
          status: item.status ? checkUserStatus(item.status) : '',
        };
      });
      return result;
    } else {
      return [];
    }
  }
  static async createUser(formSearch: FormCreateUser): Promise<void> {
    let data: FormCreateUser = formSearch;
    if (!formSearch.phone) {
      data = { ...formSearch, phone: undefined };
    }
    const res = await userApi.createUser(data);
    if (res && res.data.message === 'Success') {
      toast.success('Tạo user thành công!');
    }
  }
  static async editUser(
    idUser: string,
    formEdit: FormInFoUser,
    group: string[],
    allGroup: Groups[],
  ): Promise<void> {
    const groupsId: string[] = group.map((item) => {
      const findId = allGroup.find((i) => i.name === item);
      if (findId) {
        return findId.id;
      }
      return '';
    });
    let data: FormInFoUser = {
      email: formEdit.email,
      first_name: formEdit.first_name,
      last_name: formEdit.last_name,
      phone: formEdit.phone ? formEdit.phone : undefined,
    };
    const res = await userApi.editUser(idUser, data);
    if (res && res.data.message === 'Success') {
      if (typeof formEdit.status !== 'string') {
        await userApi.updateStatusUser(idUser, { status: formEdit.status as any });
      }
      userApi.addPermissionUser(idUser, { groups: groupsId });
      toast.success('Cập nhật người thành công!');
    }
  }
}
export default GroupUserService;
