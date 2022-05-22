import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Action } from '../../common/enums/action';
import { User } from '../../common/models/users.model';
import { Injectable } from '@nestjs/common';
import { RoleName } from '../../common/enums/role-name';
import { Post } from 'src/common/models/posts.model';

type Subjects = InferSubjects<typeof Post | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    const isAdmin = user.roles.some(role => role.name === RoleName.ADMIN);
    if (isAdmin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    can(Action.Delete, Post, { ownerId: user.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
