import { Model } from 'mongoose';
import { IUser } from '../../models/user';

interface PaginatedParams {
  page: number;
  limit: number;
}

export async function getPaginatedUsers(params: PaginatedParams, User: Model<IUser>) {
  const { limit = 10, page = 1 } = params;
  if (page < 1 || limit < 1) throw new Error('Page and limit must be positive integers');

  const users = await User.find<IUser>()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
}
