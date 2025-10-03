import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/services/users.service';
import { IGetUserFilterOptions } from '@/users/interfaces/user.service.interfaces';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(UsersService).toBeDefined();
    // expect(UsersService).toBeFalsy();
  });

  describe('getFilter()', () => {
    it.each`
      payload                                                          | expectedResult
      ${{}}                                                            | ${{}}
      ${{ id: '68b807bbd618232b492878db' }}                            | ${{ _id: '68b807bbd618232b492878db' }}
      ${{ email: 'example@mail.com' }}                                 | ${{ email: 'example@mail.com' }}
      ${{ id: '68b807bbd618232b492878db', email: 'example@mail.com' }} | ${{ _id: '68b807bbd618232b492878db', email: 'example@mail.com' }}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = usersService.getFilter(payload as IGetUserFilterOptions);
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
