export enum UnitType {
  SECOND = 1,
  MINUTE = 2,
  HOUR = 3,
  DAY = 4,
  MONTH = 5,
  TIMES = 6,
}

export enum Gender {
  MALE = 0,
  FEMALE = 1,
}

export function genderText(type: Gender) {
  switch (type) {
    case Gender.MALE:
      return 'Nam';
    case Gender.FEMALE:
      return 'Nữ';
  }
}
