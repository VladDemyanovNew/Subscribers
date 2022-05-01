export class Queries {
  public static readonly GetUserSubscriptions: string =
    'SELECT users.* FROM users \n' +
    'INNER JOIN subscriptions \n' +
    'ON subscriptions.ownerId = users.id \n' +
    `WHERE subscriberId = :userId;`;

  public static readonly GetRecommendationsForSubscribe: string =
    'SELECT users.* FROM users WHERE id != :userId \n' +
    'EXCEPT \n' +
    'SELECT users.* \n' +
    'FROM users \n' +
    'INNER JOIN subscriptions \n' +
    'ON subscriptions.ownerId = users.id \n' +
    `WHERE subscriberId = :userId;`;
}